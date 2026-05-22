/* ClickRipple — global yellow sonar ring on every click.
   Mounts a single layer over the whole viewport; spawns a short-lived
   ring at the cursor position on every primary click, animates outward,
   then removes itself. No state per ripple — DOM elements are the source
   of truth, garbage-collected by their own animationend listener. */

function ClickRipple({ enabled = true }) {
  const layerRef = React.useRef(null);

  React.useEffect(() => {
    if (!enabled) return undefined;

    function onDown(e) {
      // Only primary-button clicks — secondary/middle aren't a "select".
      if (e.button !== 0) return;
      // Suppress on form inputs so the ripple doesn't fight focus rings.
      const t = e.target;
      if (t && t.closest && t.closest('input, textarea, select')) return;

      const layer = layerRef.current;
      if (!layer) return;

      const ring = document.createElement('span');
      ring.className = 'sgn-ripple-ring';
      // Position at click point; the ring is centred via translate(-50%, -50%).
      ring.style.left = e.clientX + 'px';
      ring.style.top  = e.clientY + 'px';
      layer.appendChild(ring);
      ring.addEventListener('animationend', () => ring.remove(), { once: true });
    }

    window.addEventListener('pointerdown', onDown);
    return () => window.removeEventListener('pointerdown', onDown);
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={layerRef} aria-hidden style={{
      position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99998,
      overflow: 'hidden',
    }}/>
  );
}

Object.assign(window, { ClickRipple });
