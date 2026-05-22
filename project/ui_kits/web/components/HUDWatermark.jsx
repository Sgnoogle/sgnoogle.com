/* Top-right HUD watermark — fixed, always visible. */

function HUDWatermark({ progress = 0.65, name = 'SGNAOLIN', sub = 'Tech Creator' }) {
  return (
    <div style={{
      position: 'fixed', top: 64, right: 24, zIndex: 50,
      display: 'flex', alignItems: 'center', gap: 10,
      border: `0.5px solid ${C.border}`,
      padding: '8px 12px',
      background: C.white,
    }}>
      <div style={{
        width: 36, height: 36, background: C.ink,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: C.yellow, fontFamily: 'Neue Machina, monospace',
        fontWeight: 900, fontSize: 15, flexShrink: 0,
      }}>FS</div>
      <div style={{ borderLeft: `0.5px solid ${C.border}`, paddingLeft: 10 }}>
        <div style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: C.ink
        }}>{name}</div>
        <div style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: C.grey, margin: '2px 0 5px'
        }}>{sub}</div>
        <div style={{ height: 2, background: 'rgba(120,122,124,0.2)', width: 88, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${progress * 100}%`, background: C.yellow }}/>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HUDWatermark });
