/* Progress bars — loading / chapter / comparison variants. */

function Progress({ variant = 'loading', label, value = 0, timeLabel, leftLabel, rightLabel, leftPct, rightPct }) {
  if (variant === 'loading') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{
            fontFamily: 'IBM Plex Mono, monospace', fontSize: 10,
            letterSpacing: '0.2em', textTransform: 'uppercase', color: C.grey,
          }}>{label || 'CARICAMENTO'}</span>
          <span style={{
            fontFamily: 'IBM Plex Mono, monospace', fontSize: 10,
            letterSpacing: '0.1em', color: C.ink, fontWeight: 600,
          }}>{Math.round(value)}%</span>
        </div>
        <div style={{ height: 1.5, background: 'rgba(120,122,124,0.2)' }}>
          <div style={{ width: `${value}%`, height: '100%', background: C.ink, transition: 'width 240ms linear' }}/>
        </div>
      </div>
    );
  }

  if (variant === 'chapter') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{
            fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase', color: C.yellow,
          }}>⚡ {label}</span>
          <span style={{
            fontFamily: 'IBM Plex Mono, monospace', fontSize: 10,
            letterSpacing: '0.1em', color: C.grey,
          }}>{timeLabel}</span>
        </div>
        <div style={{ height: 2, background: 'rgba(120,122,124,0.2)' }}>
          <div style={{ width: `${value}%`, height: '100%', background: C.yellow, transition: 'width 240ms linear' }}/>
        </div>
      </div>
    );
  }

  // comparison
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{
          fontFamily: 'IBM Plex Mono, monospace', fontSize: 9,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: C.grey,
        }}>{leftLabel}</span>
        <span style={{
          fontFamily: 'IBM Plex Mono, monospace', fontSize: 9,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: C.grey,
        }}>{rightLabel}</span>
      </div>
      <div style={{ height: 3, background: 'rgba(120,122,124,0.15)', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, width: `${leftPct}%`, height: '100%', background: C.ink }}/>
        <div style={{ position: 'absolute', right: 0, width: `${rightPct}%`, height: '100%', background: 'rgba(120,122,124,0.4)' }}/>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, fontWeight: 700, color: C.ink }}>{leftPct}%</span>
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: C.grey }}>{rightPct}%</span>
      </div>
    </div>
  );
}

Object.assign(window, { Progress });
