// Explicit author check, never run by the learner's app or during offline use.
// Check oEmbed metadata AND watch-page playability; do not download video media.
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { TEACHER_VIDEOS } from "../src/curriculum/teacher-videos.ts";

/** Read JSON as data, never evaluate the JavaScript of the watch page. */
export function readPlayerResponse(html) {
  const assignment = /\bytInitialPlayerResponse\s*=\s*(\{)/.exec(html);
  if (!assignment) {
    throw new Error(
      "watch page has no player response (consent or page format changed)",
    );
  }
  const start = assignment.index + assignment[0].length - 1;
  let depth = 0,
    quoted = false,
    escaped = false;
  for (let index = start; index < html.length; index++) {
    const character = html[index];
    if (quoted) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === '"') quoted = false;
      continue;
    }
    if (character === '"') quoted = true;
    else if (character === "{") depth++;
    else if (character === "}" && --depth === 0) {
      return JSON.parse(html.slice(start, index + 1));
    }
  }
  throw new Error("watch page has an incomplete player response");
}

export async function verifyTeacherVideo(video, fetcher = fetch) {
  if (
    !/^https:\/\/www\.youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}$/.test(video.url)
  ) {
    throw new Error(
      "expected a direct YouTube watch link without extra parameters",
    );
  }
  const id = new URL(video.url).searchParams.get("v");
  const get = async (url, label) => {
    const response = await fetcher(url, {
      redirect: "error",
      signal: AbortSignal.timeout(15_000),
      headers: { "Accept-Language": "de-DE,de;q=0.9" },
    });
    if (!response.ok) throw new Error(`${label} HTTP ${response.status}`);
    return response;
  };
  const endpoint = new URL("https://www.youtube.com/oembed");
  endpoint.searchParams.set("url", video.url);
  endpoint.searchParams.set("format", "json");
  const actual = await (await get(endpoint, "oEmbed")).json();
  if (actual.title !== video.title || actual.author_name !== video.author) {
    throw new Error(
      `metadata changed: ${JSON.stringify({ title: actual.title, author: actual.author_name })}`,
    );
  }
  const player = readPlayerResponse(
    await (await get(video.url, "watch page")).text(),
  );
  const status = player.playabilityStatus?.status;
  if (status !== "OK") {
    throw new Error(
      `playabilityStatus ${status ?? "missing"}: ${player.playabilityStatus?.reason ?? "no reason given"}`,
    );
  }
  if (player.videoDetails?.videoId !== id) {
    throw new Error("watch page returned a different video id");
  }
  return { id, title: actual.title, author: actual.author_name, status };
}

async function main() {
  const entries = Object.entries(TEACHER_VIDEOS);
  let cursor = 0,
    failures = 0;
  await Promise.all(
    Array.from({ length: Math.min(4, entries.length) }, async () => {
      while (cursor < entries.length) {
        const [lesson, video] = entries[cursor++];
        try {
          const actual = await verifyTeacherVideo(video);
          console.log(
            `ok   ${lesson} → ${actual.id} → ${actual.title} (${actual.author}); playabilityStatus: ${actual.status}`,
          );
        } catch (error) {
          failures++;
          console.error(`FAIL ${lesson}: ${error.message}`);
        }
      }
    }),
  );
  console.log(
    `${entries.length - failures}/${entries.length} metadata and playability checks passed`,
  );
  if (failures) process.exitCode = 1;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  await main();
}
