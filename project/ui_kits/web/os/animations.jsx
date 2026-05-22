/* Animation primitives — count-up, intersection-based reveal, stagger.
   All durations linear or sharp-bezier per brand rules (no bounce, no spring). */

const { useState, useEffect, useRef } = React;

/* Format helpers for number display. */
function formatStat(raw, fmt) {
  if (fmt === 'short') {
    if (raw >= 1e6) return (raw / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (raw >= 1e3) return Math.round(raw / 1e3) + 'K';
    return String(Math.round(raw));
  }
  if (fmt === 'int') return String(Math.round(raw));
  if (fmt === 'oneDecimal') return raw.toFixed(1);
  if (fmt === 'oneDecimalM') return raw.toFixed(1) + 'M';
  return String(raw);
}

/* useCountUp — animates from 0 → target while `active` is true.
   Returns the current display string. Easing: ease-out for "settle" feel. */
function useCountUp(target, { duration = 1200, fmt = 'int', active = true } = {}) {
  const [value, setValue] = useState(active ? 0 : target);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    setValue(0);
    startRef.current = null;
    const tick = (t) => {
      if (startRef.current == null) startRef.current = t;
      const elapsed = t - startRef.current;
      const p = Math.min(1, elapsed / duration);
      // ease-out cubic for a "ratcheting" settle
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, active]);

  return formatStat(value, fmt);
}

/* useInView — fires `true` once the element scrolls into view.
   Returns [ref, inView]. Sticky: stays true after first trigger. */
function useInView({ threshold = 0.25, once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            if (once) obs.disconnect();
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold, once]);

  return [ref, inView];
}

/* useStagger — returns delays for an indexed array.
   Use as: const delays = useStagger(items.length, 60); */
function useStagger(count, step = 60, base = 0) {
  return Array.from({ length: count }, (_, i) => base + i * step);
}

Object.assign(window, { useCountUp, useInView, useStagger, formatStat });
