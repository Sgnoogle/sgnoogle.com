/* BootScreen — minimal Japanese-gaming cold-boot.
   v3.3: reduced to the essentials — only a short segmented bar and the
   product wordmark. No system log, no ready pill, no corner brackets.
   Total ~1.0s, skippable. */

function BootScreen({ lang = 'it', onDone, sound }) {
  const TOTAL = 3000;
  const [progress, setProgress] = React.useState(0);
  const [phase, setPhase] = React.useState('loading');
  const skipRef = React.useRef(false);
  const soundRef = React.useRef(sound);
  soundRef.current = sound;
  const onDoneRef = React.useRef(onDone);
  onDoneRef.current = onDone;
  const lastTickRef = React.useRef(0);

  React.useEffect(() => {
    let start = performance.now();
    let cancelled = false;

    const STEP_MS = 32;
    const id = setInterval(() => {
      if (cancelled || skipRef.current) return;
      const elapsed = performance.now() - start;
      const p = Math.min(1, elapsed / TOTAL);
      setProgress(p);
      // 8 quartile ticks across the 3 seconds for a subtle rhythm
      const q = Math.floor(p * 8);
      if (q !== lastTickRef.current) {
        lastTickRef.current = q;
        if (soundRef.current && q > 0) soundRef.current('boot');
      }
      if (p >= 1) {
        clearInterval(id);
        if (soundRef.current) soundRef.current('confirm');
        setPhase('leaving');
        setTimeout(() => { if (!cancelled) onDoneRef.current?.(); }, 320);
      }
    }, STEP_MS);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  const skip = React.useCallback(() => {
    if (skipRef.current) return;
    skipRef.current = true;
    setPhase('leaving');
    if (soundRef.current) soundRef.current('confirm');
    setTimeout(() => onDoneRef.current?.(), 220);
  }, []);

  const segments = 24;
  const filled = Math.round(progress * segments);

  return (
    <div
      onClick={skip}
      style={{
        position: 'fixed', inset: 0, zIndex: 100000,
        background: C.paper,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(20px, 5vw, 60px)',
        fontFamily: 'IBM Plex Mono, monospace',
        opacity: phase === 'leaving' ? 0 : 1,
        transition: 'opacity 320ms linear',
        cursor: 'pointer',
      }}>
      <div style={{
        width: 'min(420px, 100%)',
        display: 'flex', flexDirection: 'column', gap: 18,
        alignItems: 'center', textAlign: 'center',
      }}>
        {/* The F mark, alone, in yellow — quietly fades in */}
        <span style={{
          width: 28, height: 28, display: 'block',
          opacity: phase === 'loading' ? Math.min(1, progress * 1.5) : 1,
        }}>
          <svg viewBox="0 0 206.1 201.44" style={{ width: '100%', height: '100%', display: 'block' }}>
            <g fill={C.yellow}>
              <polygon points="51.44 100.64 154.75 100.64 0 201.44"/>
              <polygon points="102.79 0 206.1 0 51.35 100.8"/>
              <polygon points="84.44 0 33 100.8 8.4 100.8 59.83 0"/>
            </g>
          </svg>
        </span>

        {/* product name */}
        <span style={{
          fontSize: 11, letterSpacing: '0.32em', color: C.ink, fontWeight: 700,
        }}>{BRAND.product}</span>

        {/* segmented bar — 24 segments, fills in 3 waves with a small lull
            between each wave so it feels mechanical instead of monotone */}
        <div style={{ display: 'flex', gap: 2, width: '100%' }}>
          {Array.from({ length: segments }, (_, i) => (
            <div key={i} style={{
              flex: 1, height: 6,
              background: i < filled ? C.ink : 'transparent',
              border: `0.5px solid ${i < filled ? C.ink : C.border}`,
              transition: 'background 60ms linear',
            }}/>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { BootScreen });
