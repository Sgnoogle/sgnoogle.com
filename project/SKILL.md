---
name: sgnaolin-design
description: Use this skill to generate well-branded interfaces and assets for FrancescoSgnaolin (handle "Sgnoogle"), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

This system covers an Italian tech YouTuber's personal brand. The aesthetic is **industrial minimalism + nerd / gaming HUD** — five colors only, two fonts only, zero `border-radius`, zero `box-shadow`. Yellow `#FFC200` is the single accent.

Before designing anything, read at minimum:
- `README.md` for content + visual fundamentals + iconography
- `colors_and_type.css` for the actual tokens
- `assets/FS_BrandGuidelines_v2.4.html` is the canonical source if a rule isn't covered in the README

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out of `assets/` and `fonts/` into your new artifact's directory and create static HTML files for the user to view. Wire up `colors_and_type.css` as the single style source so the system stays consistent.

If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

The `ui_kits/web/` folder contains a working JSX recreation of the personal site — read those components before mocking anything new so you match the visual vocabulary.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

### Hard rules — never break these
- No `border-radius`. Anywhere.
- No `box-shadow`. Anywhere.
- No gradients (the only exception: the dark lower-third overlay on footage video).
- No blue in any form. "Zero Blu" is golden rule #1.
- No pure `#000000` — use `#28282C` (ink/antracite).
- **No dark backgrounds.** Ink is a text and marker color, never a surface. Backgrounds are always Paper `#F0F1F2`, White `#FFFFFF`, or Yellow `#FFC200`.
- **No grain, no noise, no scanlines, no texture.** v2.6+ removed all decorative overlays. Surfaces are flat by principle.
- **No engineering-grid backgrounds.** Removed in v2.6.
- **No underscore terminator** on titles (e.g. `TITOLO_`). Removed in v2.7. Just write `TITOLO`.
- **Corner-marks are optional.** Use them when they add narrative meaning (technical callouts, product specs), not as decoration on every container.
- No emoji other than `⚡`.
- Yellow `#FFC200` only used in big sizes (≥40px) or as accent stroke / single-key glyph — never as body text.
- All borders are hairlines: `0.5px`.
- Type: **Neue Machina Ultrabold** for display only (≥40px); **IBM Plex Mono** for everything else.
- All copy in Italian unless the user explicitly asks for English.

The new golden rule replacing "grain everywhere" is **"zero decorazioni forzate"** — every visual element must earn its place. If it doesn't add meaning, it doesn't exist.
