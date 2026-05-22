# Fonts

This design system uses two typefaces.

## Neue Machina Plain Ultrabold — display
- **File:** `PPNeueMachina-PlainUltrabold.ttf` (provided by the brand owner, official)
- **Foundry:** Pangram Pangram
- **Role:** Display only — cover titles, hero numbers, single high-impact words
- **Min size:** 40px in 1920×1080
- **Loaded via** `@font-face` in `../colors_and_type.css`

## IBM Plex Mono — system
- **Weights in use:** 300 / 400 / 500 / 600 / 700
- **Foundry:** IBM (SIL Open Font License)
- **Role:** Everything that isn't display — subtitles, body, labels, captions, code
- **Loaded via** Google Fonts CDN in `../colors_and_type.css`

If you need to ship a fully offline build, download IBM Plex Mono from
https://github.com/IBM/plex and drop the .ttf files in this folder, then
replace the Google Fonts `@import` at the top of `colors_and_type.css` with
local `@font-face` declarations.
