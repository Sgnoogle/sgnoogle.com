#!/usr/bin/env python3
"""Assemble sgnoogle.html — self-contained single-file SGN-OS v3.3 site."""

import base64, os, re, sys

def read(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def read_b64(path):
    with open(path, 'rb') as f:
        return base64.b64encode(f.read()).decode('ascii')

SRC  = '/tmp/sgnaolin-design-system/project'
OS   = f'{SRC}/ui_kits/web/os'
REPO = '/home/claude/repo'

# ── Assets ──────────────────────────────────────────────────────────────────
print("Encoding arrow.png…")
arrow_b64 = read_b64(f'{OS}/arrow.png')
print(f"  arrow: {len(arrow_b64):,} chars")

print("Encoding font (Neue Machina)…")
font_b64 = read_b64(f'{SRC}/fonts/PPNeueMachina-PlainUltrabold.ttf')
print(f"  font: {len(font_b64):,} chars")

print("Encoding avatar…")
avatar_b64 = read_b64(f'{SRC}/assets/avatar-anime.jpg')
print(f"  avatar: {len(avatar_b64):,} chars")

# ── Source files ─────────────────────────────────────────────────────────────
print("Reading source files…")
audio_js      = read(f'{OS}/audio.js')
touch_js      = read(f'{OS}/touch-select.js')
content_jsx   = read(f'{OS}/content.jsx')
utils_jsx     = read(f'{OS}/utils.jsx')
icons_jsx     = read(f'{OS}/icons.jsx')
arrow_jsx     = read(f'{OS}/MarathonArrow.jsx')
deck_jsx      = read(f'{OS}/PageDeck.jsx')
anim_jsx      = read(f'{OS}/animations.jsx')
hero_jsx      = read(f'{OS}/Hero3DMark.jsx')
stllab_jsx    = read(f'{OS}/STLLab.jsx')
modules_jsx   = read(f'{OS}/modules.jsx')
console_jsx   = read(f'{OS}/Console.jsx')
boot_jsx      = read(f'{OS}/Boot.jsx')
langmenu_jsx  = read(f'{OS}/LangMenu.jsx')
cursor_jsx    = read(f'{OS}/Cursor.jsx')
ripple_jsx    = read(f'{OS}/ClickRipple.jsx')
tweaks_jsx    = read(f'{OS}/tweaks-panel.jsx')

# ── Read the full index.html to extract CSS + App script ──────────────────
print("Reading index.html…")
index_html = read(f'{SRC}/ui_kits/web/index.html')

# Extract <style> block (lines between <style> and </style>)
style_match = re.search(r'<style>(.*?)</style>', index_html, re.DOTALL)
if not style_match:
    print("ERROR: could not find <style> block in index.html")
    sys.exit(1)
page_css = style_match.group(1)
print(f"  CSS: {len(page_css):,} chars")

# Extract the inline <script type="text/babel"> block (the App component)
app_match = re.search(r'<script type="text/babel">\s*\n(const \{ useState.*?ReactDOM\.createRoot.*?</script>)', index_html, re.DOTALL)
if not app_match:
    print("ERROR: could not find App script in index.html")
    sys.exit(1)
app_script = app_match.group(1).rstrip().removesuffix('</script>').rstrip()
print(f"  App script: {len(app_script):,} chars")

# ── Patch MarathonArrow.jsx: replace PNG path with base64 data URL ─────────
arrow_jsx_patched = arrow_jsx.replace(
    "const ARROW_PNG = 'os/arrow.png';",
    f"const ARROW_PNG = 'data:image/png;base64,{arrow_b64}';"
)

# ── Patch modules.jsx: replace avatar src with base64 ────────────────────
modules_jsx_patched = modules_jsx.replace(
    'src="../../assets/avatar-anime.jpg"',
    f'src="data:image/jpeg;base64,{avatar_b64}"'
)

# ── CSS variables + base reset (extracted from colors_and_type.css) ────────
# We inline the :root variables and base styles; IBM Plex Mono comes from CDN.
colors_css = f"""@font-face {{
  font-family: 'Neue Machina';
  src: url('data:font/truetype;base64,{font_b64}') format('truetype');
  font-weight: 700 900;
  font-style: normal;
  font-display: swap;
}}

:root {{
  --yellow:   #FFC200;
  --paper:    #F0F1F2;
  --grey:     #787A7C;
  --ink:      #28282C;
  --white:    #FFFFFF;

  --bg:           var(--paper);
  --bg-elevated:  var(--white);
  --bg-inverse:   var(--ink);
  --fg:           var(--ink);
  --fg-muted:     var(--grey);
  --fg-faint:     rgba(120, 122, 124, 0.72);
  --fg-on-yellow: var(--ink);
  --fg-on-ink:    var(--paper);
  --fg-accent:    var(--yellow);

  --border:       rgba(120, 122, 124, 0.3);
  --border-soft:  rgba(120, 122, 124, 0.2);
  --border-hair:  rgba(120, 122, 124, 0.15);
  --border-dash:  rgba(120, 122, 124, 0.25);

  --accent:       var(--yellow);
  --accent-line:  var(--yellow);

  --font-display: 'Neue Machina', 'IBM Plex Mono', monospace;
  --font-mono:    'IBM Plex Mono', ui-monospace, 'Courier New', monospace;
  --font-body:    var(--font-mono);

  --fw-light:     300;
  --fw-regular:   400;
  --fw-medium:    500;
  --fw-semibold:  600;
  --fw-bold:      700;
  --fw-display:   900;

  --fs-hero:      clamp(56px, 8vw, 160px);
  --fs-cover:     clamp(40px, 5vw, 100px);
  --fs-display:   clamp(32px, 3.5vw, 60px);
  --fs-h1:        clamp(28px, 2.6vw, 48px);
  --fs-h2:        clamp(22px, 2vw, 34px);
  --fs-h3:        clamp(17px, 1.4vw, 22px);
  --fs-body:      14px;
  --fs-small:     11px;
  --fs-label:     10px;
  --fs-micro:     9px;
  --fs-nano:      8px;

  --tracking-tight:  -0.03em;
  --tracking-snug:   -0.01em;
  --tracking-normal: 0;
  --tracking-wide:   0.06em;
  --tracking-wider:  0.12em;
  --tracking-widest: 0.2em;

  --lh-tight:    0.95;
  --lh-snug:     1.15;
  --lh-normal:   1.6;
  --lh-loose:    1.85;

  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-5: 20px; --space-6: 24px; --space-8: 32px; --space-10: 40px;
  --space-12: 48px; --space-16: 64px; --space-20: 80px;

  --stroke-hair:  0.5px;
  --stroke-thin:  1px;
  --stroke-mark:  1.5px;
  --stroke-rail:  2px;
  --stroke-accent: 3px;
  --radius: 0;
  --shadow: none;
  --motion-fast:   120ms;
  --motion-base:   180ms;
  --motion-slow:   240ms;
  --easing:        linear;
  --easing-sharp:  cubic-bezier(0.2, 0, 0, 1);
  --grain-opacity: 0;
}}

html {{ -webkit-text-size-adjust: 100%; }}
body {{
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-mono);
  font-size: var(--fs-body);
  line-height: var(--lh-normal);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}}
::selection {{ background: var(--yellow); color: var(--ink); }}
"""

# ── Assemble ──────────────────────────────────────────────────────────────
print("Assembling HTML…")

html = f"""<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>SGNOOGLE · SGN-OS</title>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap">

<style>
{colors_css}
{page_css}
</style>

<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>

<script>
{audio_js}
</script>
<script>
{touch_js}
</script>
</head>
<body>
<div id="root"></div>

<script type="text/babel">
{content_jsx}
</script>

<script type="text/babel">
{utils_jsx}
</script>

<script type="text/babel">
{icons_jsx}
</script>

<script type="text/babel">
{arrow_jsx_patched}
</script>

<script type="text/babel">
{deck_jsx}
</script>

<script type="text/babel">
{anim_jsx}
</script>

<script type="text/babel">
{hero_jsx}
</script>

<script type="text/babel">
{stllab_jsx}
</script>

<script type="text/babel">
{modules_jsx_patched}
</script>

<script type="text/babel">
{console_jsx}
</script>

<script type="text/babel">
{boot_jsx}
</script>

<script type="text/babel">
{langmenu_jsx}
</script>

<script type="text/babel">
{cursor_jsx}
</script>

<script type="text/babel">
{ripple_jsx}
</script>

<script type="text/babel">
{tweaks_jsx}
</script>

<script type="text/babel">
{app_script}
</script>

</body>
</html>"""

out = f'{REPO}/sgnoogle.html'
with open(out, 'w', encoding='utf-8') as f:
    f.write(html)

size_mb = os.path.getsize(out) / 1_048_576
print(f"\nWritten: {out}")
print(f"Size: {size_mb:.2f} MB ({os.path.getsize(out):,} bytes)")
print("Done.")
