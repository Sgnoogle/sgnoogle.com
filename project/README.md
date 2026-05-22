# Sgnaolin Design System

**Brand:** FrancescoSgnaolin — Italian tech YouTuber / creator
**Personal handle:** "Sgnoogle" (nickname)
**Version:** Brand v3.0 · Steel · Minimal
**Vibe:** Clean, light, precise. A system that gets out of the way and lets the content speak.

> *"Un sistema ingegneristico abbastanza solido da non dover decidere ogni volta.
> Abbastanza grezzo da sembrare ancora una bozza di qualcosa di più grande."*
> — Brand philosophy

---

## Sources provided

This system was built from three files the user uploaded:

| File | What it is | Now lives at |
|---|---|---|
| `FS_BrandGuidelines_v3.0.html` | Full self-contained brand book — palette, type, covers, in-video, principles. **Current canon.** | `assets/FS_BrandGuidelines_v3.0.html` |
| `anime pp.jpg` | Anime-style profile picture / brand mascot (yellow tank, grey backdrop) | `assets/avatar-anime.jpg` |
| `Risorsa 5f.svg` | Geometric "F" / lightning monogram — 3 chevron polygons | `assets/logo-mark.svg` |

No codebase, Figma, or web product was provided. The "products" represented here are therefore:

1. **YouTube video graphics** — thumbnails, in-video overlays, lower-thirds, stat bars, HUD watermarks (canonical)
2. **Personal website** — same component vocabulary translated to web; the brand book explicitly calls out that components work natively in HTML/CSS (Componente 01–05 in §05)

The UI kit in `ui_kits/web/` is a faithful recreation of the **personal website**, derived directly from the rules in §05 of the brand book (no separate site code exists to reference).

---

## Index — what's in this folder

```
README.md                  ← you are here
SKILL.md                   ← Agent-Skill manifest (Claude Code compatible)
colors_and_type.css        ← All CSS variables (colors, type scale, spacing, motion)

assets/
  FS_BrandGuidelines_v3.0.html   ← original brand book (read this for canon)
  logo-mark.svg                  ← geometric F-monogram (original, unfilled)
  logo-mark-yellow.svg           ← yellow fill on transparent
  logo-mark-white.svg            ← white fill on transparent (for yellow bgs)
  logo-mark-ink.svg              ← ink fill on transparent (rare, text-only contexts)
  avatar-anime.jpg               ← anime brand mascot

fonts/
  PPNeueMachina-PlainUltrabold.ttf  ← official display font
  README.md                          ← font notes

preview/
  _card.css                      ← shared scaffold for review cards
  *.html                         ← 22 cards rendered into the Design System tab

ui_kits/
  web/
    README.md
    index.html                   ← SGN-OS — game-shell personal site (headline)
    index-classic.html           ← earlier classic-portfolio exploration
    os/                          ← OS-shell components (HUDFrame, BootScreen,
                                   ModuleButton, Display, Terminal, modules…)
    components/                  ← classic-version components
```

---

## CONTENT FUNDAMENTALS — how the brand talks

The brand book is written in **Italian** and the public-facing voice is Italian.
Examples below are quoted directly from the source; English glosses are mine.

### Voice + tone
- **Direct, pragmatic, technical.** No marketing fluff, no exclamation chains. Every line in the guidelines is declarative: *"Cinque colori, nessuno di più."* ("Five colors, no more.")
- **Engineering / spec-sheet register.** Copy reads like a manual: "Sfondo: #F0F1F2 + grana 3–5%", "Padding: Minimo 20px su tutti i lati". Even the philosophy paragraph is one sentence, then stop.
- **Authoritative but not aggressive.** Rules are stated as facts ("Il giallo funziona solo sopra i 40px"), never softened with "we recommend" or "consider". When something is forbidden it just says *Mai*.
- **Address:** the brand book uses informal **tu** ("Non toccarlo", "Torna qui prima di decidere") — Francesco talking to himself / future-Francesco. Public-facing video copy uses **voi** plural addressing the audience ("Ciao ragazzi, benvenuti in questo nuovo video").

### Casing
- **ALL CAPS** for tags, labels, CTAs, section numbers, navigation items. With `letter-spacing: 0.12em–0.20em`. This is the dominant casing for any text under 14px.
- **Sentence case** for body paragraphs and subtitles.
- **Title Case** is avoided — it's not part of the system.
- **Section numbers** are double-digit with a section sign: `§ 01`, `§ 02`. The §-tag is gold.
- Titles often end with an **underscore**: `NUOVO VIDEO_`, `2 ANNI DOPO_`, `COMPRARLO_` — a terminal-cursor / WIP signal.

### Punctuation + glyphs
- **Middle-dot · separator** is used everywhere as a hard divider: "Apple Store Italia · Novembre 2024", "FS / Brand v2.4". Almost never commas in label strings.
- **Em-dash —** opens definitions and asides: "Cinque colori — nessuno di più."
- **Arrow → ** for CTAs and list-item markers (`li::before { content: '→ '; }`).
- **Yellow ⚡** is the one mascot glyph used for branding flashes (alongside the geometric logo).
- **No emoji** beyond the lightning bolt. The "✓ / ✗" pair shows up in rule lists but they're typeset glyphs, not emoji.
- No filler exclamation marks. No `:)` or text-faces.

### Vibe — what to feel
Reading the brand book should feel like flipping through a **service manual for a piece of pro-audio gear, or a CAD spec sheet, with a small flash of a gamer's HUD overlay**. Quiet, gridded, lots of hairlines and corner-marks, and one yellow accent doing the loud talking when something matters.

---

## VISUAL FOUNDATIONS

### Colors
Five colors. No sixth. Roles are fixed and non-interchangeable.

| Token | Hex | Name | Job |
|---|---|---|---|
| `--yellow` | `#FFC200` | Giallo | Accents, corner-marks, key words. The **only warm color**. |
| `--paper` | `#F0F1F2` | Acciaio Chiaro | Primary background, everywhere. |
| `--grey` | `#787A7C` | Grigio | Secondary text, labels, borders, separators. |
| `--ink` | `#28282C` | Antracite | Primary text, titles, dark surfaces. Replaces black — **never use pure #000**. |
| `--white` | `#FFFFFF` | Bianco | Text on yellow or ink; card surfaces. Not a primary background. |

Default combination is **grey-on-paper for 70% of all graphics**. Ink is heavier hierarchy. Yellow only enters where something must spike attention. The metaphor is **road signage** — grey is neutral everywhere, yellow flags the one thing you must see.

### Typography
Two faces, fixed roles. Never swap them.

- **Neue Machina Plain Ultrabold** — display only. Cover titles, big numbers, single high-impact words. Min size 40px in 1920×1080. The official .ttf is shipped in `/fonts/PPNeueMachina-PlainUltrabold.ttf` and loaded via `@font-face`.
- **IBM Plex Mono** — everything else. Subtitles, body, labels, captions. Weights 300 / 400 / 500 / 600 / 700 are all in use. Weight 300 never on moving elements.

Type scale (1920×1080 reference): Hero 120–160px · Cover 80–100px · Subtitle 32–40px · Tag 20–24px · Caption 16–20px. Web frame uses the lower end of each range.

### Spacing
- The hairline is the brand. **0.5px**, **1px**, **1.5px**, **2px**, **3px** are the only stroke widths used.
  - `0.5px` — every border, divider, separator
  - `1.5px` — corner-marks
  - `2px` — top-rail on dark covers, HUD progress bars
  - `3px` — yellow left-border on info slides (the loudest stroke that exists)
- Spacing scale: 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80 px.
- Padding inside containers: **20px minimum** for screenshot wrappers; section padding 64px desktop.

### Backgrounds
- **Always light.** Acciaio Chiaro `#F0F1F2`, Bianco `#FFFFFF`, or Giallo `#FFC200`. **Ink `#28282C` is a text/marker color, never a surface.** The only context where text appears on dark is the **footage lower-third overlay** (`linear-gradient(transparent, rgba(40,40,44, 0.9))`) sitting on top of a video.
- **No grain. No texture. No noise.** v2.6 removed this entirely — the system is clean by principle, not effect.
- **No engineering grid backgrounds.** Removed.
- **No hand-drawn illustrations.** No photo-collages. No gradients (other than the footage lower-third).
- Full-bleed imagery is reserved for **B-roll / footage** in video, never as a website hero.

### Borders
- All borders are **0.5px solid** in `rgba(120,122,124, 0.2)` (soft) or `0.3` (regular) or `0.4` (emphasized).
- Dashed borders appear only for **type-scale rows** and **list separators** inside dense info panels: `0.5px dashed rgba(120,122,124, 0.2)`.
- **Yellow stroke** is reserved: corner-marks (1.5px), left-border on info slides (3px), top-rail on dark covers (2–3px). Never as a generic divider.

### Corner radii
- **Zero everywhere.** `border-radius: 0`. No exceptions for buttons, cards, inputs, tags, avatars. The system is geometrically rigid — softening kills it. (The `.cls-1` polygons in the logo are pointed for the same reason.)

### Shadows
- **None.** No `box-shadow` anywhere in the system. Depth is achieved by:
  1. Hairline borders separating layers (`0.5px`)
  2. Background swapping (paper → white → ink)
  3. Corner-marks framing important surfaces
  4. Z-order with grain overlay
- If you find yourself reaching for `box-shadow`, you're outside the system.

### Cards
- Background: `--white` (elevated) or `--paper` (flush).
- Border: `0.5px solid rgba(120,122,124, 0.2)`.
- No rounding. No shadow. No colored left-border *unless* it is the **3px yellow info-slide bar** — and only for emphasized data callouts, not generic cards.
- Optional **corner-marks** (4× 10px L-shapes in yellow, 1.5px stroke) on the most important containers in any frame.

### Layout rules
- **Fixed elements**: top navigation bar (48px, ink background, 2px yellow bottom border); HUD watermark in **top-right** corner, 16px from edge.
- **Section numbers** are double-duty: huge faint-grey `attr(data-num)` in the top-right of every section, plus the `§ 01` yellow tag inline. Both visible at once — a navigation aid.
- The **3-A / 3-B / 3-C rule** for thumbnails: on any nine-video run, three thumbnails per cover template. The cadence is structural, not a suggestion.

### Animation + motion
- **Hard cuts and linear slides only.** No bounce, no ease-out organic, no spring. `--easing: linear;` is the default.
- A sharp UI snap is permitted: `cubic-bezier(0.2, 0, 0, 1)` for hovers and panel transitions.
- No glow, no parallax, no scroll-jacking.
- Durations: 120 / 180 / 240 ms. Anything longer feels off-brand.

### Hover / press states
- **Hover on dark surfaces** (nav links): text fades from `rgba(255,255,255,0.45)` → `#FFFFFF` and a `rgba(255,194,0, 0.08)` yellow tint fills the background. 150ms.
- **Hover on light surfaces** (buttons): the divider-icon block shifts to `--yellow` background OR the text shifts ink → yellow. Never a scale or shadow change.
- **Press**: no shrink, no scale. The element just inverts to its alternate state instantly (no easing on press).
- **Focus**: 0.5px solid yellow outline, 2px offset.

### Transparency + blur
- **Transparency** is used at fixed alpha steps: `0.5px solid rgba(120,122,124, 0.15 / 0.2 / 0.3 / 0.4)` for hairlines; `rgba(40,40,44, 0.9)` for footage lower-thirds.
- **Blur (`backdrop-filter`) is not part of the system.** It's organic and soft — the brand is mechanical and crisp. Don't introduce it.
- Yellow at low opacity is only used as a **hover tint** (8%), never as a fill.

### Imagery vibe
- When real photos / footage appear, they are **slightly desaturated, neutral-to-warm balance**. No cold-blue grading. No heavy filters.
- Cover Tipo A allows "foto chiara desaturata"; Tipo C allows "foto scura". In both cases the photo is a substrate, never the focal point — the typeset overlay carries the meaning.
- The anime mascot (`avatar-anime.jpg`) is the only stylized-illustration asset and is used as a personal avatar, not as a generic illustration.

### Mandatory motifs (the "tells")
1. **Yellow left-border** — 3px on info / data slides (the loudest stroke in the system).
2. **§ NN section tags** — yellow, ALL CAPS, with a section sign.
3. **Hairline borders** — 0.5px everywhere; depth comes from layered light backgrounds, never shadow.

### Optional motifs (use only when they add meaning)
- **Corner-marks** (4× yellow L-shapes) — only on product-review graphics or technical callouts. Not on every container.
- **Underscore terminator** (`TITOLO_`) — **removed in v2.7.** Don't add it.
- **Lightning ⚡** — use sparingly, only as a brand sigil before the wordmark in casual contexts, not as a decoration.

### Anti-motifs (instant red flags)
- **Bluish-purple gradients** — explicitly banned ("Zero Blu" is golden rule #1)
- **Dark / ink backgrounds** — v2.6 removed these. Ink is text, not surface.
- **Grain, scanlines, noise, texture** — v2.6 removed these. The system is clean.
- **Engineering grid background** — removed in v2.6.
- **Corner-marks on every container** — they're a tool, not a stamp.
- Rounded corners
- Drop shadows
- Backdrop-blur glassmorphism
- Pure black `#000000`
- Yellow used as body text or below 40px (illegible)
- Emoji other than ⚡
- Multiple accent colors competing with the yellow

---

## ICONOGRAPHY

The brand has **no proprietary icon set**. The system is so spare that almost everything that would normally be an icon is instead a **typographic glyph or a 0.5–1.5px geometric line**.

### What's actually used
- **Unicode arrows**: `→` (right), `↗` (external), `⚡` (lightning bolt — the closest thing to a mascot glyph), `+`, `✓`, `✗`. Set in IBM Plex Mono so they match the typographic rhythm.
- **CSS-drawn corner-marks**: four L-shapes built from `border-width` on a 10×10px element, yellow 1.5px stroke. Not an SVG — a CSS primitive. See `.cm` rule in the brand book.
- **CSS-drawn dots**: 3px-radius open circles (`stroke 0.5px`, `fill: none`) for annotation-line endpoints — grey by default, yellow for the "key" call-out.
- **Brand mark** (`assets/logo-mark.svg`): three sharp chevron polygons forming a stylized **F** / lightning slash. Used as a corner stamp.
- **Wordmark**: `FRANCESCOSGNAOLIN` set live in Neue Machina Ultrabold, ALL CAPS, tracking `-0.03em`. No frozen SVG version yet — rendered as text so it always picks up font changes.

### When you need an "actual" icon
The brand book doesn't authorize a third-party icon library, but if a real product UI requires a glyph that isn't an arrow / check / plus / lightning, use **[Lucide](https://lucide.dev)** at:
- stroke-width: **1.25px**
- size: **16px** (UI) / **20px** (display)
- color: `var(--grey)` by default; `var(--ink)` for emphasis; `var(--yellow)` only for the single most-important glyph in any frame
- **never filled**, always outline — to match the hairline visual grammar

Load via CDN — substitute flagged. If the user provides a real icon set later, swap.

### Emoji policy
Effectively no. The ⚡ lightning is the one allowance, used sparingly. Standard emoji (📱, 🎥, 🔥, etc.) break the brand on contact — they introduce color and a soft cartoon vocabulary the system explicitly rejects.

### Logo usage
- **Lockup**: mark + wordmark, mark at 32×32px on the left, 0.5px divider, wordmark right. Used in HUD watermarks.
- **Solo mark**: 24–48px, yellow on dark or ink on light. Never multicolor.
- **Wordmark alone**: in body copy / sign-offs; always ALL CAPS.
- **Clear space**: 1× the mark's height on all sides.
- **Never**: rotate, skew, color the mark anything but `--yellow`, `--ink`, or `--white`; never place on a busy photo without darkening underneath.

---
