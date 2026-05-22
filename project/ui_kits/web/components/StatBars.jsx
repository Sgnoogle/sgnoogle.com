/* Segmented stat bars — 10 blocks, ink fill, yellow for the highlighted metric. */

function StatBars({ stats }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {stats.map((s, i) => {
        const isGold = s.highlight;
        return (
          <div key={i}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', marginBottom: 6,
            }}>
              <span style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
                color: isGold ? C.yellow : C.grey, fontWeight: isGold ? 700 : 400,
              }}>{isGold ? '⚡ ' : ''}{s.label}</span>
              <span style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: 10, fontWeight: isGold ? 700 : 600,
                color: isGold ? C.yellow : C.ink,
              }}>{s.score}/10</span>
            </div>
            <div style={{ display: 'flex', gap: 3 }}>
              {Array.from({ length: 10 }, (_, j) => (
                <div key={j} style={{
                  flex: 1, height: 8,
                  background: j < s.score
                    ? (isGold ? C.yellow : C.ink)
                    : 'rgba(120,122,124,0.2)',
                }}/>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { StatBars });
