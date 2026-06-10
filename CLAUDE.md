# SGNOOGLE.COM — SGN-OS v3.3

Personal portfolio of Francesco Sgnaolin (@sgnoogle). Single-page "operating
system" themed site. Deployed on **Cloudflare Pages** — every `git push` to
`main` auto-deploys.

## Files & where to edit

- **`index.html`** — THE deployed source of truth. Cloudflare serves it as the
  site root (see `wrangler.toml` → `[assets] directory = "."`). **Edit this
  directly.** It's a single self-contained file (~7000+ lines).
- **`sgnoogle.html`** — a generated mirror of `index.html`. Historically built
  by `build_sgnoogle.py` from `/tmp/sgnaolin-design-system/project`, but that
  source path is **not present** in fresh containers, so the build script can't
  run here. **Keep `sgnoogle.html` in sync by applying the same edits by hand**
  whenever you change `index.html`.
- **`project/ui_kits/web/`** — reference copies of the original component source
  (the "claude design" originals: `os/STLLab.jsx`, `os/Boot.jsx`, etc.). Useful
  to consult when something regresses — check how the original did it. Not
  deployed.
- **`assets/models/`** — real `.stl` files served at `/assets/models/<file>`.

After editing, always: `git add index.html sgnoogle.html && git commit && git push -u origin main`.

## Tech stack

- React 18 + Babel standalone. All app code is JSX inside
  `<script type="text/babel">` blocks. No build step for `index.html`.
- React/ReactDOM/Babel loaded from unpkg (UMD, with SRI hashes) in `<head>`.
- Fonts: IBM Plex Mono (Google Fonts) + Neue Machina (inlined as base64 in the
  built `sgnoogle.html`).

## Design system

Palette is exposed both as CSS vars (`--paper`, `--ink`, etc.) and a JS object
`C` used in inline styles:

- `C.paper` `#F0F1F2` · `C.ink` `#28282C` · `C.yellow` `#FFC200`
- `C.white` `#FFFFFF` · `C.grey` `#787A7C`
- `C.border` / `C.borderSoft` / `C.faint` — translucent greys
- `--bg-outer` `#E8E9EA` — desktop background *behind* the floating panel

Type: IBM Plex Mono everywhere; Neue Machina for big display headings. Sizes use
`clamp()` heavily — **every element must scale with viewport** (phone ↔ desktop).
Tracking is wide/uppercase for labels. Stroke hairlines are `0.5px`.

## Layout architecture (IMPORTANT pitfalls)

- The outer shell is `#root > .sgn-page` → `.sgn-frame` (grid: TopBar /
  display / bottom nav strip).
- **`.sgn-page` is a SHARED class name**: it's the outer shell AND each inner
  snap-scroll page inside `PageDeck`. So shell-only styling (`background`,
  `max-width`, centering) MUST be scoped to **`#root > .sgn-page`** — never bare
  `.sgn-page`, or you'll paint over `.sgn-display`'s white background and break
  module widths. (This caused the "About lost its white bg / video card too
  narrow" regression.)
- Desktop layout: **FULL-WIDTH (horizontal), by owner decision** — the old
  1100px "floating panel" cap is intentionally DEAD (the wrapper under #root
  is not `.sgn-page`, so `#root > .sgn-page` does not match; a `.sgn-shell`
  class exists on the wrapper's page div as a future hook). Do NOT re-enable
  the cap. The desktop featured video box must stay 18:9 and fully visible
  (contain, centered) — never fill-crop the column.
- Mobile breakpoint: `@media (max-width: 760px)`. Respect safe areas with
  `env(safe-area-inset-*)`. Use `100dvh` (not `100vh`) so Safari's dynamic
  toolbar is followed.

## Three.js / STL viewer (OBJECTS module) — READ BEFORE TOUCHING

The viewer (`STLLab` component) uses the **UMD global `window.THREE`**, polled
until ready. Loading rules learned the hard way:

- **Use UMD script tags pinned to r137**, loaded as plain `<script>` (no
  `defer`, no `module`) in `<head>`:
  ```
  https://unpkg.com/three@0.137.0/build/three.min.js
  https://unpkg.com/three@0.137.0/examples/js/loaders/STLLoader.js
  ```
  r137 is the last family shipping BOTH the UMD core (`build/three.min.js`) AND
  the UMD `examples/js` loaders (which register `THREE.STLLoader`).
- **Do NOT** use `@0.149` or newer: r148 removed `examples/js/`, r150 removed
  the UMD core. **Do NOT** use ES module + import map — module load failures are
  silent and leave the viewer stuck on "LOADING · THREE.JS" forever.
- r137 also predates the r155 physically-correct lighting change, so existing
  light intensities render correctly.
- Real models: add to the `OBJECTS` array with `real: true` + `file: 'x.stl'`,
  drop the file in `assets/models/`. `STLLab` loads it via `new THREE.STLLoader()`
  and falls back to a procedural geometry on error. Each `OBJECTS` id should also
  have a procedural case in `buildProceduralModel`.
- Guard the canvas against a 0×0 container at first paint (fallback dims +
  ResizeObserver), or the model renders invisibly.

## Settled decisions (don't re-propose)

- **No build step.** The single-file, hand-edited `index.html` workflow stays.
  Loading React dev + Babel-standalone (in-browser JSX transpile) is a known
  tradeoff the owner has accepted — do NOT suggest migrating to esbuild /
  precompiled JSX / React production builds. The big perf win (the 2.4MB inline
  avatar) is already done.
- **YouTube API key / Video module: keep the browser-side key flow.** The key is
  restricted by HTTP referrer in Google Cloud Console to `sgnoogle.com`, so it
  must stay in the client where the browser sends the allowed referrer. Do not
  move video sync back to `/api/youtube`, RSS, username/handle search, or any
  loose channel resolver. The Video module must call YouTube Data API v3
  directly with the hardcoded `YT_API_KEY`, `CHANNEL_ID =
  UCO_SA_eFRJbVyfqWV8BKzCQ`, and `UPLOADS_PID =
  UUO_SA_eFRJbVyfqWV8BKzCQ`, and must reject items from other channel IDs.
- Avatar is an external lazy WebP at `/assets/avatar-real.webp` (no longer
  inlined as base64). Favicon/OG art live in `/assets/` (favicon.svg/png,
  apple-touch-icon.png, og-image.jpg) and are generated from the F-monogram.

## Conventions

- Bilingual: Italian (default) + English, switched via `lang` prop. Every
  user-facing string needs both (`lang === 'it' ? '…' : '…'`).
- Commit messages end with the session URL footer.
- Don't create PRs unless asked. Commit + push to `main` to deploy.
- The user communicates in Italian — respond in Italian.
