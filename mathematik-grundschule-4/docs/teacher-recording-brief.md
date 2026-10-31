# Place-value teacher recording brief

**Status:** Ready for teacher review and recording. Thomas confirmed on
2026-10-31 that no approved recording is available. This is not a transcript
of a finished recording, a teacher endorsement or a completed video asset.

## Owner and deliverables

Thomas/product arranges the primary-school teacher, permission and filming
slot. The teacher reviews the lesson's four goals and German script against
the live activity before recording. No recruitment, purchase, external
contact or recording consent has been performed by the implementing agent.

Deliver a 2–3-minute German MP4, approximately 720p and initially under
15 MiB; clear close-ups of labelled units; German WebVTT captions; a poster;
exact chapter timecodes; and an approved transcript. Publish attribution and
rights metadata, while keeping personal consent documents outside the repo.

The publisher must have permission for online playback and inclusion in the
offline ZIP. Use only cleared music/graphics, with no background children or
unapproved third-party worksheets. No background music is necessary.

## Shot list and German spoken draft

| Target | Picture | Spoken draft |
| --- | --- | --- |
| 0:00–0:15 | Teacher appears beside the workbench; welcoming introduction | „Heute helfen wir Milo, seine Werkstatt zu ordnen. Dabei entdecken wir: Der Platz einer Ziffer verrät uns ihren Wert.“ |
| 0:15–0:45 · A | Hands lay out 3 H, 0 Z, 6 E. Keep the empty column visible. | „Hier liegen drei Hunderter und sechs Einer. Bei den Zehnern liegt nichts. Die Zahl heißt dreihundertsechs. Die Null hält den Platz für die Zehner frei.“ |
| 0:45–1:05 · B | Compare 306 and 360; show a thousands column. | „Wenn die Sechs zu den Zehnern wandert, ist sie sechzig wert. Dann entsteht eine andere Zahl. Jede Spalte hat ihren eigenen Wert.“ |
| 1:05–1:35 · C | Count 10 E, bundle into 1 Z, then reverse the action. | „Zehn Einer sind genauso viel wie ein Zehner. Wir dürfen sie bündeln und auch wieder entbündeln. Die Menge bleibt gleich.“ |
| 1:35–2:05 · D | Start with 142. Exchange 1 H for 10 Z, keeping the existing 4 Z and 2 E. | „Ein Hunderter sind zehn Zehner. Zusammen mit den vier Zehnern haben wir jetzt vierzehn Zehner und zwei Einer. Es bleibt hundertzweiundvierzig.“ |
| 2:05–2:30 | Teacher invites exploration; do not reveal the fresh exit-task answer. | „Jetzt bist du dran. Baue eine Zahl für Milo und probiere einen Tausch aus. Prüfe: Ist die Zahl noch genauso viel wert?“ |

Allow natural pauses for the manipulations. The teacher can revise phrasing;
record revisions and match the final captions/transcript to the actual clip.
Use E/Z/H/T consistently, with columns ordered T/H/Z/E from left to right.
Do not introduce subtraction, time pressure or claims of a Gymnasium place.

## Handoff to engineering

1. Place cleared assets in `public/media/` using the paths recorded below.
2. Update `media-register.json`: `status: "approved"`, teacher attribution,
   `reviewed_at`, permission reference, distribution flags and exact chapter
   times. Set `timings_are_draft: false`.
3. Each asset entry is `{ "path": "media/<name>", "sha256": "<hash>" }`.
   Use `place-value-teacher.mp4`, `place-value-de.vtt`, `poster.webp` and
   `transcript.txt`. Signed paperwork is not an asset.
   Captions and transcript entries also carry `text` with the exact UTF-8
   file content, checked by release verification. The bundled text supports
   accessible transcripts and native captions without file-origin fetches.
4. Review the on-screen illustrated explanation against the delivered video.
   Add the actual transcript to the accessible player panel.
5. Run build, tests, package and release verification. Run the strict
   Phase-1 gate; play the extracted ZIP on actual pilot devices and record
   teacher sign-off in the acceptance record.

Until these steps are done, the app shows a German video-pending message
and the complete illustrated explanation. It makes no request for missing
media and never counts video time as learning or a reward.
