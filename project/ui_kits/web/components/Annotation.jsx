/* Annotation panel — phone placeholder + side callout lines. */

function Annotation({ title, leftSpecs = [], rightSpecs = [] }) {
  return (
    <div style={{
      position: 'relative',
      border: `0.5px solid ${C.borderSoft}`, background: C.paper,
      padding: '40px 24px', isolation: 'isolate',
    }}>
      <GrainOverlay opacity={0.04} zIndex={0}/>
      <Corners color={C.yellow}/>
      {title && (
        <Label color={C.grey} style={{ display: 'block', marginBottom: 28, position: 'relative', zIndex: 1 }}>{title}</Label>
      )}

      <div style={{
        position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 280, zIndex: 1,
      }}>
        {/* phone placeholder */}
        <div style={{
          width: 120, height: 220, background: 'rgba(120,122,124,0.1)',
          border: `0.5px solid rgba(120,122,124,0.35)`, position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: 32, left: '50%', transform: 'translateX(-50%)', width: 48, height: 48, borderRadius: '50%', background: 'rgba(120,122,124,0.2)' }}/>
          <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', width: 56, height: 8, background: 'rgba(120,122,124,0.2)' }}/>
        </div>

        {/* annotation lines — SVG overlay */}
        <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} viewBox="0 0 600 320" preserveAspectRatio="none">
          {leftSpecs.map((_, i) => {
            const y = 100 + i * 60;
            return (
              <g key={`l-${i}`}>
                <circle cx="240" cy={y} r="3" fill="none" stroke={C.grey} strokeWidth="0.5"/>
                <line x1="240" y1={y} x2="150" y2={y} stroke={C.grey} strokeWidth="0.5"/>
                <line x1="150" y1={y} x2="40" y2={y} stroke={C.grey} strokeWidth="0.5"/>
              </g>
            );
          })}
          {rightSpecs.map((s, i) => {
            const y = 120 + i * 60;
            const isKey = s.key;
            return (
              <g key={`r-${i}`}>
                <circle cx="360" cy={y} r="3" fill="none" stroke={isKey ? C.yellow : C.grey} strokeWidth="0.5"/>
                <line x1="360" y1={y} x2="460" y2={y} stroke={C.grey} strokeWidth="0.5"/>
                <line x1="460" y1={y} x2="560" y2={y} stroke={C.grey} strokeWidth="0.5"/>
              </g>
            );
          })}
        </svg>

        {/* labels */}
        {leftSpecs.map((s, i) => (
          <div key={`ll-${i}`} style={{
            position: 'absolute', top: 100 + i * 60 - 5, left: 30,
            fontFamily: 'IBM Plex Mono, monospace', fontSize: 10,
            letterSpacing: '0.08em', color: C.grey,
            transform: 'translateY(50px)', // shift relative to centered viewBox math
          }}>{s}</div>
        ))}
        {rightSpecs.map((s, i) => (
          <div key={`rl-${i}`} style={{
            position: 'absolute', top: 120 + i * 60 - 5, right: 30,
            fontFamily: 'IBM Plex Mono, monospace', fontSize: 10,
            letterSpacing: '0.08em', color: s.key ? C.yellow : C.grey,
            fontWeight: s.key ? 700 : 400,
            transform: 'translateY(50px)',
          }}>{s.key ? '⚡ ' : ''}{s.label}</div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { Annotation });
