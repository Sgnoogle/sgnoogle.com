# SGNOOGLE.COM · SGN-OS v4

Personal portfolio of Francesco Sgnaolin (@sgnoogle). Single-page "operating
system" themed site. Deployed on **Cloudflare Pages** · every `git push` to
`main` auto-deploys.

## Files & where to edit

- **`index.html`** · THE deployed source of truth. Cloudflare serves it as the
  site root (see `wrangler.toml` → `[assets] directory = "."`). **Edit this
  directly.** It's a single self-contained file (~7000+ lines).
- **`sgnoogle.html`** · a generated mirror of `index.html`. Historically built
  by `build_sgnoogle.py` from `/tmp/sgnaolin-design-system/project`, but that
  source path is **not present** in fresh containers, so the build script can't
  run here. **Keep `sgnoogle.html` in sync by applying the same edits by hand**
  whenever you change `index.html`.
- **`project/ui_kits/web/`** · reference copies of the original component source
  (the "claude design" originals: `os/STLLab.jsx`, `os/Boot.jsx`, etc.). Useful
  to consult when something regresses · check how the original did it. Not
  deployed.
- **`assets/models/`** · real `.stl` files served at `/assets/models/<file>`.

After editing, always: `git add index.html sgnoogle.html && git commit && git push -u origin main`.

## Tech stack

- React 18 + Babel standalone. All app code is JSX inside
  `<script type="text/babel">` blocks. No build step for `index.html`.
- React/ReactDOM/Babel loaded from unpkg (UMD, with SRI hashes) in `<head>`.
- Fonts: IBM Plex Mono (Google Fonts) + Neue Machina (inlined as base64 in the
  built `sgnoogle.html`).

## Design system · FS Brand Guidelines v4 (2026)

La fonte di verità estetica è `project/assets/FS_BrandGuidelines_v4.0.md`
(trascrizione del deck del proprietario, originale in
`project/uploads/FS_BrandGuidelines_v4.0.html`). Sostituisce la v3.2: NON
seguire più le regole v3.x (fondo acciaio, Neue Machina solo nel wordmark,
testo giallo per parole chiave). Palette esposta come CSS vars e come oggetto
JS `C` negli inline styles:

- Cinque colori PIENI, nessuna trasparenza (niente rgba/opacity per colorare):
  `C.white` `#FFFFFF` fondo del sito · `C.paper` `#F0F1F2` acciaio (superfici
  per media/video, binari delle barre, frasi brevi) · `C.yellow` `#FFC200`
  superficie · `C.grey` `#6B6D70` testo · `C.ink` `#28282C` titoli.
- Il bianco è il fondo di tutto (body, shell, display). Nessun `--bg-outer`.
- Giallo = superficie, MAI inchiostro: niente testo giallo. Tre usi soltanto:
  superficie (etichette, tab attiva, divisori, CTA: testo bianco sopra),
  segno (marchio, quadratino 12px della nota), riempimento (barre/progress).
- Antracite solo per titoli e valori, mai sul giallo. Sul giallo solo bianco.
- Mai box dentro box: lo spazio separa. Niente pannelli bianchi su fondo
  acciaio con card dentro; niente hairline, niente barre laterali gialle.
- Tipografia: due font, due pesi (400 · 700), sei taglie. Neue Machina
  Ultrabold per marchio/wordmark e NUMERI DI SEZIONE (01-05 della nav); IBM
  Plex Mono per tutto il resto. Nessun testo sotto 12px. Marcatori (label)
  in Plex Mono 700 maiuscolo, tracking 0.12em, grigio.
- Kit: Marchio (fulmine giallo, in un angolo) · Etichetta (bianco su giallo)
  · Dato (chiave bianca su giallo + valore grigio su acciaio) · Nota
  (quadratino giallo + testo grigio) · Barra (l'unica che si anima).
- Invariati: zero ombre, zero border-radius, niente grana, niente em dash
  in nessun testo (commenti inclusi): usare `:` `,` `.` o `·`.

**Sound vocabulary** (WebAudio engine, `presets` in index.html):
- Desktop module tabs are a 3-phase gesture, ONE note per phase:
  `hover` (1400Hz announce) → `tick` (1800Hz press, from Cursor) →
  `release`/`releaseBack` (single resolution note on pointerup).
- Mobile has no hover phase: module open/close uses single-note
  `tap`/`tapBack` · never the two-note chords on direct taps.
- The two-note `confirm`/`back` chords are reserved for gestures WITHOUT a
  press-tick phase (lang pick, palette, card flip, links).

## Layout architecture (IMPORTANT pitfalls)

- The outer shell is `#root > .sgn-page` → `.sgn-frame` (grid: TopBar /
  display / bottom nav strip).
- **`.sgn-page` is a SHARED class name**: it's the outer shell AND each inner
  snap-scroll page inside `PageDeck`. So shell-only styling (`background`,
  `max-width`, centering) MUST be scoped to **`#root > .sgn-page`** · never bare
  `.sgn-page`, or you'll paint over `.sgn-display`'s background
  and break module widths. (This caused the "About lost its bg / video card too
  narrow" regression.)
- Desktop layout: **FULL-WIDTH (horizontal), by owner decision** · the old
  1100px "floating panel" cap is intentionally DEAD (the wrapper under #root
  is not `.sgn-page`, so `#root > .sgn-page` does not match; a `.sgn-shell`
  class exists on the wrapper's page div as a future hook). Do NOT re-enable
  the cap. The desktop featured video box must stay 18:9 and fully visible
  (contain, centered) · never fill-crop the column.
- Mobile nav (`GameBoyKey`): the ACTIVE key is a yellow surface that rises
  into the frame gap to touch the display (transparent border-top painted by
  its own background + negative margin-top) · keep this "bridge" animation.
  Multi-page modules show their page BARRA in the mobile topbar center
  (`MobilePageRail`), never as an overlay on the content.
- Replaced assets keep their file name: bump the `?v=` query in index.html
  (e.g. `avatar-real.webp?v=4`, `og-image.jpg?v=4`) · `/assets/*` is cached
  with a long stale-while-revalidate.
- Mobile breakpoint: `@media (max-width: 760px)`. Respect safe areas with
  `env(safe-area-inset-*)`. Use `100dvh` (not `100vh`) so Safari's dynamic
  toolbar is followed.

## Motion system (v4 · "videogioco elegante")

- **Module transition** = yellow band (`.sgn-wipe`, 18% of the display)
  crossing the screen in the nav direction while the new content is revealed
  exactly behind it (`sgnRevealFwd/Back` clip-path). Band and clip share the
  same travel (-18% → 100%) and curve: change them together. The OUTGOING
  section is a DOM clone (`ghostOut` in App, canvas/iframe stripped, scroll
  positions copied) whose clip retreats behind the band's far edge, so the
  old screen is wiped by the band instead of vanishing early.
- **Nav keys**: desktop tabs have two layers (acciaio face + yellow face
  clipped from the bottom): hover = 6px of yellow "charge", active = full
  fill. MOBILE keys are deliberately simple (owner decision): active = flat
  yellow block, instant color switch, NO bridge, NO overlay layers (clip-path
  layers made the whole bar flash on iOS), NO page bar at the bottom. The
  moment comes from the symbol: `.sgn-ico--01..05` micro-animations (play
  nudge, cube spin, grid pop, link twist, about hop), also on desktop tabs.
  Mobile page BARRA lives in the topbar center (`MobilePageRail`).
- **Layout grid**: topbar, PageDeck pages and home have NO horizontal
  padding: every left/right edge sits on the page padding (43px at 1440).
  Keep it that way when adding sections.
- **HeroMark3D** (home yellow block): the monogram extruded in Three.js,
  flat white `MeshBasicMaterial` (no lights: nothing grey on yellow). STILL
  by default (owner request): it only tilts toward the mouse (desktop) or
  with device orientation (phone, iOS permission asked on tap). Click on
  the block = one full spin. Static SVG until ready / reduced motion.
- **Odometer**: rolling digits for every number (home subs, all `Datum`
  values). Starts on IntersectionObserver + 380ms (after the wipe).
- **STL explode**: per-geometry `aOffset` attribute (max 4 big chunks:
  2×2 on the two longest axes, owner asked for fewer pieces) +
  `uExplode` uniform injected via `onBeforeCompile`; enter 1→0, exit 0→0.6.
- **Physical keys**: desktop tabs and mobile keys travel 3px down on press.
- **Gamepad** (App): buttons are translated to the equivalent keydown and
  dispatched to the focused element (d-pad/stick = arrows with repeat,
  A = Enter, B = Esc, Start = `/`, Y = `l`, X = `m`). Never add parallel
  gamepad-only logic: extend the keyboard handlers instead.
- Every animation must degrade under `prefers-reduced-motion`.

## Three.js / STL viewer (OBJECTS module) · READ BEFORE TOUCHING

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
  the UMD core. **Do NOT** use ES module + import map · module load failures are
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
  tradeoff the owner has accepted · do NOT suggest migrating to esbuild /
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
- The user communicates in Italian · respond in Italian.

## Headless verification runner (USE IT before pushing UI changes)

unpkg is blocked in the sandbox but the npm registry is NOT, and Puppeteer's
Chrome downloads fine from storage.googleapis.com. The real site can be run
and screenshot-verified locally:

```bash
# one-time setup
mkdir -p /tmp/pwtest && cd /tmp/pwtest && npm init -y && npm i puppeteer
mkdir -p /tmp/site/vendor && cd /tmp/site && npm init -y \
  && npm i react@18.3.1 react-dom@18.3.1 @babel/standalone@7.29.0 three@0.137.0
cp node_modules/react/umd/react.production.min.js vendor/
cp node_modules/react-dom/umd/react-dom.production.min.js vendor/
cp node_modules/@babel/standalone/babel.min.js vendor/
cp node_modules/three/build/three.min.js vendor/
cp node_modules/three/examples/js/loaders/STLLoader.js vendor/
ln -sfn /home/claude/sgnoogle.com/assets /tmp/site/assets
```

Build step (rerun after each edit): copy repo `index.html` to `/tmp/site/` while
rewriting the five unpkg URLs to `./vendor/...` and stripping the babel SRI
attribute. Serve with `python3 -m http.server 8819` from `/tmp/site` (NB: the
server dies between Bash calls · restart it). In Puppeteer:
- skip boot: `evaluateOnNewDocument(() => sessionStorage.setItem('sgnBooted','1'))`
  (+ `localStorage.sgnOnboardSeen=1` on desktop);
- use `waitUntil: 'domcontentloaded'` + fixed delay (networkidle never settles);
- WebGL needs launch arg `--enable-unsafe-swiftshader`;
- mobile: viewport 412x915, deviceScaleFactor 2.625, isMobile+hasTouch.
Pixel-level checks: screenshot → draw to canvas in-page → getImageData
(luminance scanlines for border alignment, zoomed nearest-neighbor crops for
visual proof). Babel-validate both HTML files with @babel/standalone before
every commit. Always verify, then push.

## Session log conventions

The owner reviews changes live on phone+desktop and reports back with
screenshots; iterate with empirical verification (measure pixels, don't
theorize). Mirror every index.html edit into sgnoogle.html in the same
commit.
