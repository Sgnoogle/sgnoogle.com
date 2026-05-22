/* Hero3DMark — wireframe F monogram rotating slowly in 3D background of home.
   CSS 3D transforms only — no canvas, no WebGL.
   Reacts to mouse on desktop (subtle parallax), self-rotates on mobile.
   Strokes only, monochrome grey/yellow — never the focal point, always
   the *atmosphere* behind the wordmark. */

function Hero3DMark({ mobile, color = C.borderSoft, accent = C.yellow }) {
  const wrapRef = React.useRef(null);
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });

  // Desktop parallax
  React.useEffect(() => {
    if (mobile) return;
    function onMove(e) {
      const w = window.innerWidth, h = window.innerHeight;
      const nx = (e.clientX / w - 0.5) * 2;  // -1..1
      const ny = (e.clientY / h - 0.5) * 2;
      setTilt({ x: nx * 14, y: ny * 10 });
    }
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mobile]);

  return (
    <div aria-hidden style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none', overflow: 'hidden',
      perspective: '900px',
    }}>
      <div style={{
        width: 'min(620px, 70vw)', aspectRatio: '1/1',
        transformStyle: 'preserve-3d',
        transform: `rotateX(${-tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: 'transform 380ms cubic-bezier(0.2,0,0,1)',
        animation: 'sgnMarkSpin 26s linear infinite',
        opacity: 0.55,
      }}>
        <FWireframe color={color} accent={accent}/>
      </div>
    </div>
  );
}

/* FWireframe — stroke-only redraw of the F monogram.
   Built from the same 3 chevrons as assets/logo-mark.svg, redrawn
   with stroke instead of fill so it reads as wireframe. */
function FWireframe({ color, accent }) {
  return (
    <svg viewBox="0 0 206.1 201.44" style={{
      width: '100%', height: '100%', display: 'block',
      overflow: 'visible',
    }}>
      <defs>
        <filter id="sgnGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.4"/>
        </filter>
      </defs>
      {/* faint grid behind */}
      <g stroke={color} strokeWidth="0.3" opacity="0.55">
        <line x1="0"  y1="50"  x2="206" y2="50"/>
        <line x1="0"  y1="100" x2="206" y2="100"/>
        <line x1="0"  y1="150" x2="206" y2="150"/>
        <line x1="50"  y1="0" x2="50"  y2="201"/>
        <line x1="100" y1="0" x2="100" y2="201"/>
        <line x1="150" y1="0" x2="150" y2="201"/>
      </g>
      {/* the three F chevrons as outlines */}
      <g fill="none" stroke={color} strokeWidth="1" filter="url(#sgnGlow)">
        <polygon points="51.44 100.64 154.75 100.64 0 201.44"/>
        <polygon points="102.79 0 206.1 0 51.35 100.8"/>
        <polygon points="84.44 0 33 100.8 8.4 100.8 59.83 0"/>
      </g>
      {/* yellow accent corner-dots at the chevron tips */}
      <g fill={accent}>
        <circle cx="0"     cy="201.44" r="2"/>
        <circle cx="206.1" cy="0"      r="2"/>
        <circle cx="154.75" cy="100.64" r="1.5"/>
        <circle cx="51.44"  cy="100.64" r="1.5"/>
      </g>
    </svg>
  );
}

Object.assign(window, { Hero3DMark, FWireframe });
