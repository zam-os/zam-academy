// Explicit author check, never run by the learner's app or during offline use.
// Title and channel must match YouTube's live response exactly.
import { readFile } from "node:fs/promises";

const videos = JSON.parse(
  await readFile(
    new URL("../src/curriculum/teacher-videos.json", import.meta.url),
    "utf8",
  ),
);
const entries = Object.entries(videos);
let cursor = 0;
let failures = 0;
await Promise.all(
  Array.from({ length: Math.min(4, entries.length) }, async () => {
    while (cursor < entries.length) {
      const [lesson, video] = entries[cursor++];
      try {
        if (
          !/^https:\/\/www\.youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}$/.test(
            video.url,
          )
        ) {
          throw new Error(
            "expected a direct YouTube watch link without extra parameters",
          );
        }
        const endpoint = new URL("https://www.youtube.com/oembed");
        endpoint.searchParams.set("url", video.url);
        endpoint.searchParams.set("format", "json");
        const response = await fetch(endpoint, {
          redirect: "error",
          signal: AbortSignal.timeout(15_000),
        });
        if (!response.ok) throw new Error(`oEmbed HTTP ${response.status}`);
        const actual = await response.json();
        if (
          actual.title !== video.title ||
          actual.author_name !== video.author
        ) {
          throw new Error(
            `metadata changed: ${JSON.stringify({ title: actual.title, author: actual.author_name })}`,
          );
        }
        console.log(
          `ok   ${lesson} → ${new URL(video.url).searchParams.get("v")} → ${actual.title} (${actual.author_name})`,
        );
      } catch (error) {
        failures++;
        console.error(`FAIL ${lesson}: ${error.message}`);
      }
    }
  }),
);
console.log(
  `${entries.length - failures}/${entries.length} video metadata checks passed`,
);
if (failures) process.exitCode = 1;
