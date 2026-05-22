# UI Kits — Web

This folder contains two takes on the personal website. Same brand, two
different design directions. Both are recreations built from the brand book's
component vocabulary (§05) — no external code source existed.

## 🌟 `index.html` — **SGN-OS** (headline)

A game-OS / Teenage-Engineering-inspired shell. The website behaves like a
pocket-device interface — five numbered module buttons at the bottom drive a
central "display", a perimeter HUD shows live system info, and a real
toggleable terminal lets you navigate by typing commands.

Components live in `os/`:
- `content.jsx` — bilingual IT/EN strings + content data (videos, objects, apps, partners)
- `utils.jsx` — palette, Corners, Tag/Label/Caption, GrainOverlay, ScanLines, Screw
- `HUDFrame.jsx` — top bar (brand, clock, lang, terminal), bottom bar (signal, hint), left rail (01–05 index)
- `BootScreen.jsx` — skippable boot sequence (~1.5s) on first load
- `ModuleButton.jsx` — chunky TE-style hardware button (one of five)
- `Display.jsx` — central screen: idle "READY_" state + hover previews per module
- `Terminal.jsx` — slide-up shell with real commands (`help`, `cd`, `ls`, `lang`, `whoami`, `stats`, `classic`, `clear`)
- `modules.jsx` — five full module screens: Video / Objects / Apps / Link / Self
- `tweaks-panel.jsx` — Tweaks toolbar wiring

### Interactions
- **`1`–`5`** — jump to module from menu
- **`~`** — toggle terminal
- **`Esc`** — close terminal or return to menu
- **`L`** — toggle IT / EN
- Hover any module button on the menu to preview it in the central display
- Type `classic` in the terminal to jump to the classic version

### Tweaks (toggle from toolbar)
- Scanlines CRT overlay
- Boot sequence on first load
- Language IT / EN
- Menu layout: pocket-operator strip vs flat 5-up grid

---

## `index-classic.html` — Classic portfolio

Earlier exploration: a traditional hero → video grid → about → footer
flow. Same component vocabulary, conventional layout. Kept as a reference and
as an alternative for users who don't want the game-shell aesthetic.

Components live in `components/`: Nav, Hero, VideoCard, VideoGrid, InfoSlide,
StatBars, Progress, Annotation, HUDWatermark, ContactStrip, CTAButton, Corners,
utils.

---

## Visual contract — must hold across both

- No `border-radius`. Anywhere.
- No `box-shadow`. Anywhere.
- All hairlines are `0.5px solid rgba(120,122,124, 0.x)`.
- Every solid surface has grain (3–6%).
- Corner-marks on every primary container.
- Yellow `#FFC200` reserved for: accents, key words, corner-marks, single CTA per screen.
- All copy bilingual IT/EN; no language baked in outside `os/content.jsx`.
