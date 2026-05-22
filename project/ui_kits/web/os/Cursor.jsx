/* Crosshair cursor — desktop only.
   Only mounts when (hover: hover) AND (pointer: fine) — never on touch / mobile.
   Renders a yellow + that follows the mouse, expands to a target bracket
   on hover over interactive elements. Plays a discreet "tick" on press
   when audio is enabled. */

function Cursor({ enabled = true, sound }) {
  const [pos, setPos] = React.useState({ x: -100, y: -100 });
  const [hot, setHot] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const [visible, setVisible] = React.useState(true);
  const [supported, setSupported] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    } catch (e) { return false; }
  });

  // re-check support when the input mode changes (e.g. user plugs in mouse)
  React.useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const onChange = () => setSupported(mq.matches);
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  const active = enabled && supported;

  React.useEffect(() => {
    if (!active) {
      // make sure native cursor returns when disabled
      document.body.style.cursor = '';
      const old = document.getElementById('sgn-cursor-hide');
      if (old) old.remove();
      return;
    }

    function onMove(e) {
      setPos({ x: e.clientX, y: e.clientY });
      const t = e.target;
      const interactive = t && t.closest && t.closest('button, a, [role="button"], input, select, textarea, .sgn-tab, .sgn-hot');
      setHot(!!interactive);
    }
    function onDown(e) {
      setPressed(true);
      if (sound) {
        // Only tick on interactive press; tick anywhere else is too noisy.
        const t = e.target;
        if (t && t.closest && t.closest('button, a, [role="button"], .sgn-tab, .sgn-hot')) {
          sound('tick');
        }
      }
    }
    function onUp() { setPressed(false); }
    function onLeave() { setVisible(false); }
    function onEnter() { setVisible(true); }

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup',   onUp);
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    document.body.style.cursor = 'none';
    let styleEl = document.getElementById('sgn-cursor-hide');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'sgn-cursor-hide';
      styleEl.textContent = `
        @media (hover: hover) and (pointer: fine) {
          body, body * { cursor: none !important; }
        }
      `;
      document.head.appendChild(styleEl);
    }

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup',   onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      document.body.style.cursor = '';
      styleEl && styleEl.remove();
    };
  }, [active, sound]);

  if (!active || !visible) return null;

  const size = hot ? 28 : 18;
  const stroke = hot ? 1.5 : 1;
  const opacity = pressed ? 0.55 : 1;

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        top: 0, left: 0,
        transform: `translate(${pos.x - size / 2}px, ${pos.y - size / 2}px) scale(${pressed ? 0.82 : 1})`,
        width: size, height: size,
        pointerEvents: 'none',
        zIndex: 99999,
        transition: 'width 140ms cubic-bezier(0.2,0,0,1), height 140ms cubic-bezier(0.2,0,0,1), opacity 80ms linear',
        opacity,
        willChange: 'transform',
      }}
      className="sgn-cursor"
    >
      {hot ? (
        <svg viewBox="0 0 28 28" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <g stroke="#FFC200" strokeWidth={stroke} fill="none">
            {/* corner brackets — gaming target */}
            <path d="M 1 6 L 1 1 L 6 1"/>
            <path d="M 22 1 L 27 1 L 27 6"/>
            <path d="M 27 22 L 27 27 L 22 27"/>
            <path d="M 6 27 L 1 27 L 1 22"/>
          </g>
          <circle cx="14" cy="14" r="1.6" fill="#FFC200"/>
        </svg>
      ) : (
        <svg viewBox="0 0 18 18" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <g stroke="#FFC200" strokeWidth={stroke} fill="none">
            <line x1="9" y1="1" x2="9" y2="6.5"/>
            <line x1="9" y1="11.5" x2="9" y2="17"/>
            <line x1="1" y1="9" x2="6.5" y2="9"/>
            <line x1="11.5" y1="9" x2="17" y2="9"/>
          </g>
          <circle cx="9" cy="9" r="1" fill="#FFC200"/>
        </svg>
      )}
    </div>
  );
}

Object.assign(window, { Cursor });
