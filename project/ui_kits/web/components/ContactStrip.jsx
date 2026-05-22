/* Sign-off footer v2.7 — paper background, yellow left rail.
   No more ink surface. No more "⚡ FILOSOFIA DEL BRAND" framing copy.
   Just contacts + a small philosophy line. */

function ContactStrip() {
  return (
    <footer style={{
      position: 'relative', background: C.paper,
      borderTop: `0.5px solid ${C.borderSoft}`,
      borderLeft: `3px solid ${C.yellow}`,
      borderRight: `0.5px solid ${C.borderSoft}`,
      borderBottom: `0.5px solid ${C.borderSoft}`,
      padding: '48px 56px 32px', margin: '0 64px 64px',
    }}>
      <Tag color={C.yellow} style={{ letterSpacing: '0.18em' }}>FILOSOFIA</Tag>
      <div style={{
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: 16, fontWeight: 400, color: C.ink,
        lineHeight: 1.75, maxWidth: 600,
        margin: '14px 0 32px',
      }}>
        Un sistema ingegneristico abbastanza solido da non dover decidere ogni volta.
        Abbastanza grezzo da sembrare ancora una bozza di qualcosa di più grande.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, marginBottom: 32 }}>
        {[
          { k: 'EMAIL',     v: 'ciao@sgnaolin.it' },
          { k: 'YOUTUBE',   v: '@FrancescoSgnaolin' },
          { k: 'INSTAGRAM', v: '@sgnaolin' },
          { k: 'SEDE',      v: 'Padova · Italia' },
        ].map(c => (
          <div key={c.k}>
            <div style={{
              fontFamily: 'IBM Plex Mono, monospace', fontSize: 8,
              letterSpacing: '0.18em', color: C.grey, marginBottom: 6, fontWeight: 700,
            }}>{c.k}</div>
            <div style={{
              fontFamily: 'IBM Plex Mono, monospace', fontSize: 13,
              fontWeight: 600, color: C.ink,
            }}>{c.v}</div>
          </div>
        ))}
      </div>

      <div style={{
        paddingTop: 16, borderTop: `0.5px dashed ${C.borderSoft}`,
        display: 'flex', justifyContent: 'space-between',
        fontFamily: 'IBM Plex Mono, monospace', fontSize: 9,
        letterSpacing: '0.14em', color: C.faint, textTransform: 'uppercase',
      }}>
        <span>FRANCESCOSGNAOLIN · BRAND v2.7 · 2026</span>
        <span>STEEL · MINIMAL EDITION</span>
      </div>
    </footer>
  );
}

Object.assign(window, { ContactStrip });
