import { describe, expect, it } from "vitest";
import {
  readPlayerResponse,
  verifyTeacherVideo,
} from "../scripts/verify-teacher-videos.mjs";

const video = {
  url: "https://www.youtube.com/watch?v=yC_Z_m6o_Bk",
  title: "Verified original title",
  author: "Verified channel",
};
const player = (extra = {}) => ({
  playabilityStatus: { status: "OK" },
  videoDetails: { videoId: "yC_Z_m6o_Bk" },
  ...extra,
});
const page = (response) =>
  `<script>var ytInitialPlayerResponse = ${JSON.stringify(response)}; var next = {};</script>`;
function replies({
  response = player(),
  title = video.title,
  author = video.author,
  watchStatus = 200,
} = {}) {
  const requested = [];
  const fetcher = async (url, options) => {
    requested.push({ url: String(url), options });
    if (new URL(url).pathname === "/oembed")
      return new Response(JSON.stringify({ title, author_name: author }));
    return new Response(page(response), { status: watchStatus });
  };
  return { requested, fetcher };
}

describe("Manual teacher-video verification", () => {
  it("reads nested player JSON with quoted braces and escapes, without executing page scripts", () => {
    const response = player({ text: 'contains }; and { and "quoted" \\ text' });
    expect(
      readPlayerResponse(
        `${page(response)}<script>throw new Error("do not run");</script>`,
      ),
    ).toEqual(response);
    expect(() => readPlayerResponse("consent page")).toThrow(
      "no player response",
    );
    expect(() =>
      readPlayerResponse('var ytInitialPlayerResponse = {"incomplete":{'),
    ).toThrow("incomplete player response");
  });

  it("accepts matching metadata only with the matching playable watch page", async () => {
    const { fetcher, requested } = replies();
    await expect(verifyTeacherVideo(video, fetcher)).resolves.toEqual({
      id: "yC_Z_m6o_Bk",
      title: video.title,
      author: video.author,
      status: "OK",
    });
    expect(requested.map((r) => new URL(r.url).pathname)).toEqual([
      "/oembed",
      "/watch",
    ]);
    expect(
      requested.every(
        (r) => r.options.redirect === "error" && r.options.signal,
      ),
    ).toBe(true);
  });

  it("rejects a changed title or channel even if the URL still exists", async () => {
    for (const changed of [
      { title: "Rewritten title" },
      { author: "Another channel" },
    ]) {
      const { fetcher, requested } = replies(changed);
      await expect(verifyTeacherVideo(video, fetcher)).rejects.toThrow(
        "metadata changed",
      );
      expect(requested).toHaveLength(1);
    }
  });

  it("rejects deleted, private, login-required and unknown playability results", async () => {
    for (const status of ["ERROR", "UNPLAYABLE", "LOGIN_REQUIRED", undefined]) {
      const { fetcher } = replies({
        response: player({
          playabilityStatus: { status, reason: "unavailable" },
        }),
      });
      await expect(verifyTeacherVideo(video, fetcher)).rejects.toThrow(
        "playabilityStatus",
      );
    }
  });

  it("rejects watch-page HTTP errors and mismatched video identity", async () => {
    await expect(
      verifyTeacherVideo(video, replies({ watchStatus: 429 }).fetcher),
    ).rejects.toThrow("watch page HTTP 429");
    await expect(
      verifyTeacherVideo(
        video,
        replies({ response: player({ videoDetails: { videoId: "wrong-id" } }) })
          .fetcher,
      ),
    ).rejects.toThrow("different video id");
  });

  it("refuses non-watch links before making any request", async () => {
    const { fetcher, requested } = replies();
    for (const url of [
      "https://example.org/watch?v=yC_Z_m6o_Bk",
      `${video.url}&tracking=1`,
      "https://www.youtube.com/embed/yC_Z_m6o_Bk",
    ]) {
      await expect(
        verifyTeacherVideo({ ...video, url }, fetcher),
      ).rejects.toThrow("direct YouTube watch link");
    }
    expect(requested).toHaveLength(0);
  });
});
