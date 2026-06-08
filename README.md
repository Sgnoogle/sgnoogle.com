# CODING AGENTS: READ THIS FIRST

This is a **handoff bundle** from Claude Design (claude.ai/design).

A user mocked up designs in HTML/CSS/JS using an AI design tool, then exported this bundle so a coding agent can implement the designs for real.

## What you should do — IMPORTANT

**Read the chat transcripts first.** There are 3 chat transcript(s) in `chats/`. The transcripts show the full back-and-forth between the user and the design assistant — they tell you **what the user actually wants** and **where they landed** after iterating. Don't skip them. The final HTML files are the output, but the chat is where the intent lives.

**Find the primary design file under `project/` and read it top to bottom.** The chat transcripts will tell you which file the user was last iterating on. Then **follow its imports**: open every file it pulls in (shared components, CSS, scripts) so you understand how the pieces fit together before you start implementing.

**If anything is ambiguous, ask the user to confirm before you start implementing.** It's much cheaper to clarify scope up front than to build the wrong thing.

## About the design files

The design medium is **HTML/CSS/JS** — these are prototypes, not production code. Your job is to **recreate them pixel-perfectly** in whatever technology makes sense for the target codebase (React, Vue, native, whatever fits). Match the visual output; don't copy the prototype's internal structure unless it happens to fit.

**Don't render these files in a browser or take screenshots unless the user asks you to.** Everything you need — dimensions, colors, layout rules — is spelled out in the source. Read the HTML and CSS directly; a screenshot won't tell you anything they don't.

## Bundle contents

- `README.md` — this file
- `chats/` — conversation transcripts (read these!)
- `project/` — the `Sgnaolin Design System` project files (HTML prototypes, assets, components)

## SGNOOGLE production rules for future agents

- The live site is deployed from `index.html`; keep `sgnoogle.html` byte-for-byte in sync whenever `index.html` changes.
- Every code/content change must be committed and pushed to `main`, because Cloudflare Pages deploys from `main`.
- **YouTube video sync must keep using the browser-side YouTube Data API key that is restricted in Google Cloud to `sgnoogle.com`.** Do not move the Video module back to a Cloudflare/server proxy, RSS fallback, handle search, username search, or any other loose resolver. The key is intended to be present in the client for HTTP-referrer restrictions to work.
- The Video module must read the fixed Francesco Sgnaolin channel/upload IDs only: `CHANNEL_ID = UCO_SA_eFRJbVyfqWV8BKzCQ` and `UPLOADS_PID = UUO_SA_eFRJbVyfqWV8BKzCQ`. Reject data from any other channel ID.
- If the YouTube feed breaks, restore/repair the direct browser calls to `https://www.googleapis.com/youtube/v3/playlistItems` and `https://www.googleapis.com/youtube/v3/videos` before trying architectural changes.
