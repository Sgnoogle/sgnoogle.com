/* Info / data callout — yellow 3px left border, corner-marks, big number. */

function InfoSlide({ label, value, sub, source, withCorners = true, style }) {
  return (
    <div style={{
      position: 'relative',
      borderLeft: `3px solid ${C.yellow}`,
      borderTop: `0.5px solid ${C.borderSoft}`,
      borderRight: `0.5px solid ${C.borderSoft}`,
      borderBottom: `0.5px solid ${C.borderSoft}`,
      padding: '22px 28px 18px',
      background: C.paper,
      isolation: 'isolate',
      ...style,
    }}>
      <GrainOverlay opacity={0.04} zIndex={0}/>
      {withCorners && <Corners color={C.yellow}/>}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {label && <Label color={C.grey} style={{ display: 'block', marginBottom: 10 }}>{label}</Label>}
        <div style={{
          fontFamily: 'Neue Machina, monospace', fontWeight: 900,
          fontSize: 48, color: C.ink, letterSpacing: '-0.035em', lineHeight: 1,
          marginBottom: 4,
        }}>{value}</div>
        {sub && <div style={{
          fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, color: C.grey,
          marginBottom: 14,
        }}>{sub}</div>}
        {source && <div style={{
          paddingTop: 10, borderTop: `0.5px dashed rgba(120,122,124,0.3)`,
          fontFamily: 'IBM Plex Mono, monospace', fontSize: 9,
          color: 'rgba(120,122,124,0.55)', letterSpacing: '0.06em',
        }}>{source}</div>}
      </div>
    </div>
  );
}

Object.assign(window, { InfoSlide });
