/* Shared primitives for SGN-OS v2.7+ : palette, tags, bars, pills, tiers. */

const C = {
  yellow: '#FFC200',
  paper:  '#F0F1F2',
  grey:   '#787A7C',
  ink:    '#28282C',
  white:  '#FFFFFF',
  borderSoft: 'rgba(120,122,124,0.2)',
  border: 'rgba(120,122,124,0.3)',
  borderHair: 'rgba(120,122,124,0.15)',
  faint: 'rgba(120,122,124,0.5)',
  yellowSoft: 'rgba(255,194,0,0.12)',
};

/* ───────── Tag / Label / Caption / Pill ───────── */

function Tag({ children, color = C.yellow, size = 10, style }) {
  return (
    <span style={{
      fontFamily: 'IBM Plex Mono, monospace',
      fontSize: size, fontWeight: 700,
      letterSpacing: '0.2em', textTransform: 'uppercase',
      color, ...style,
    }}>{children}</span>
  );
}

function Label({ children, color = C.grey, size = 10, style }) {
  return (
    <span style={{
      fontFamily: 'IBM Plex Mono, monospace',
      fontSize: size, fontWeight: 600,
      letterSpacing: '0.14em', textTransform: 'uppercase',
      color, ...style,
    }}>{children}</span>
  );
}

function Caption({ children, style }) {
  return (
    <span style={{
      fontFamily: 'IBM Plex Mono, monospace',
      fontSize: 9, fontWeight: 300,
      letterSpacing: '0.06em', color: C.faint, ...style,
    }}>{children}</span>
  );
}

/* Square pill — key/value chip used as a tag. No rounding (brand). */
function Pill({ k, v, gold, style }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'stretch',
      border: `0.5px solid ${gold ? C.yellow : C.border}`,
      background: gold ? C.yellowSoft : C.white,
      fontFamily: 'IBM Plex Mono, monospace',
      fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
      ...style,
    }}>
      <span style={{
        padding: '4px 8px',
        color: gold ? C.ink : C.faint,
        borderRight: `0.5px solid ${gold ? C.yellow : C.borderSoft}`,
        background: gold ? C.yellow : 'transparent',
        fontWeight: 700,
      }}>{k}</span>
      <span style={{ padding: '4px 10px', color: C.ink, fontWeight: 700 }}>{v}</span>
    </span>
  );
}

/* ───────── Bar — segmented 10-block stat bar.
   `value` 0-10. `active` controls fill animation timing. */

function Bar({ value, max = 10, gold, active = true, height = 6, gap = 3, delay = 0 }) {
  const [filled, setFilled] = useState(active ? 0 : value);
  useEffect(() => {
    if (!active) return;
    setFilled(0);
    const start = performance.now();
    const dur = 700;
    let raf;
    const tick = (t) => {
      const elapsed = t - start - delay;
      if (elapsed < 0) { raf = requestAnimationFrame(tick); return; }
      const p = Math.min(1, elapsed / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setFilled(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, active, delay]);

  return (
    <div style={{ display: 'flex', gap }}>
      {Array.from({ length: max }, (_, i) => (
        <div key={i} style={{
          flex: 1, height,
          background: i < filled
            ? (gold ? C.yellow : C.ink)
            : 'rgba(120,122,124,0.2)',
          transition: 'background 80ms linear',
        }}/>
      ))}
    </div>
  );
}

/* ───────── Progress — continuous bar (for stage / loading). */
function Progress({ value = 0, gold, active = true, height = 2, delay = 0 }) {
  const [w, setW] = useState(active ? 0 : value);
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setW(value), delay);
    return () => clearTimeout(t);
  }, [value, active, delay]);
  return (
    <div style={{ height, background: 'rgba(120,122,124,0.2)' }}>
      <div style={{
        height: '100%', width: `${w}%`,
        background: gold ? C.yellow : C.ink,
        transition: 'width 600ms cubic-bezier(0.2,0,0,1)',
      }}/>
    </div>
  );
}

/* ───────── TierBadge — S / A / B / C rank tag. S is gold. */
function TierBadge({ tier, size = 28 }) {
  const isS = tier === 'S';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: size, height: size,
      background: isS ? C.yellow : C.white,
      border: `0.5px solid ${isS ? C.yellow : C.border}`,
      fontFamily: 'IBM Plex Mono, monospace',
      fontWeight: 700, fontSize: size * 0.55,
      color: C.ink, letterSpacing: '-0.02em',
    }}>{tier}</span>
  );
}

/* ───────── GhostNumber — huge faint section number background. */
function GhostNumber({ n, top = 0, right = 0, size = '20vw', opacity = 0.06 }) {
  return (
    <span aria-hidden style={{
      position: 'absolute', top, right,
      fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700,
      fontSize: size, lineHeight: 0.85,
      letterSpacing: '-0.05em',
      color: C.ink, opacity,
      pointerEvents: 'none', userSelect: 'none',
    }}>{n}</span>
  );
}

Object.assign(window, { C, Tag, Label, Caption, Pill, Bar, Progress, TierBadge, GhostNumber });
