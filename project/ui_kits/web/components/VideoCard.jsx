/* Video card — three cover variants A/B/C from §03 of the brand book. */

function VideoCard({ variant = 'A', title, accent, meta, duration = '08:47', views = '127K', onClick }) {
  // Layout shared by all three
  const shell = {
    border: `0.5px solid ${C.border}`,
    background: C.white,
    cursor: 'pointer',
    transition: 'transform 180ms cubic-bezier(0.2,0,0,1)',
    display: 'flex', flexDirection: 'column',
  };

  let cover;
  if (variant === 'A') {
    cover = (
      <div style={{
        aspectRatio: '16/9', position: 'relative', background: C.paper, overflow: 'hidden',
      }}>
        <GrainOverlay opacity={0.05} zIndex={1}/>
        {/* left yellow strip */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, background: C.yellow, zIndex: 2 }}/>
        {/* corner mark */}
        <span style={{ position: 'absolute', top: 10, right: 12, width: 12, height: 12, border: `1.5px solid ${C.yellow}`, zIndex: 2 }}/>
        <div style={{
          position: 'absolute', top: 18, left: 22, zIndex: 2,
          fontFamily: 'Neue Machina, monospace', fontWeight: 900,
          fontSize: 38, color: C.ink, letterSpacing: '-0.025em', lineHeight: 1.05,
          textTransform: 'uppercase', maxWidth: '60%',
        }}>{title}{accent && <><br/><span style={{ color: C.grey }}>{accent}_</span></>}</div>
        <div style={{
          position: 'absolute', bottom: 14, left: 22,
          fontFamily: 'IBM Plex Mono, monospace', fontSize: 9,
          letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(120,122,124,0.55)',
          zIndex: 2,
        }}>{meta}</div>
        <div style={{ position: 'absolute', bottom: 14, right: 14, color: C.yellow, fontSize: 18, zIndex: 2 }}>⚡</div>
      </div>
    );
  } else if (variant === 'B') {
    cover = (
      <div style={{
        aspectRatio: '16/9', position: 'relative', background: C.yellow, overflow: 'hidden',
      }}>
        <GrainOverlay opacity={0.06} zIndex={1}/>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: C.ink, zIndex: 2 }}/>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: C.ink, zIndex: 2 }}/>
        <div style={{
          position: 'absolute', top: 22, left: 24, zIndex: 2,
          fontFamily: 'Neue Machina, monospace', fontWeight: 900,
          fontSize: 44, color: C.ink, letterSpacing: '-0.03em', lineHeight: 1, textTransform: 'uppercase',
        }}>{title}{accent && <><br/>{accent}</>}</div>
        <div style={{
          position: 'absolute', bottom: 16, left: 24,
          fontFamily: 'IBM Plex Mono, monospace', fontSize: 9,
          letterSpacing: '0.16em', color: 'rgba(40,40,44,0.5)', textTransform: 'uppercase',
          zIndex: 2,
        }}>{meta}</div>
      </div>
    );
  } else {
    cover = (
      <div style={{
        aspectRatio: '16/9', position: 'relative', background: C.ink, overflow: 'hidden',
      }}>
        <GrainOverlay opacity={0.08} zIndex={1}/>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: C.yellow, zIndex: 2 }}/>
        <div style={{
          position: 'absolute', top: 22, left: 24, zIndex: 2,
          fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700,
          fontSize: 28, color: C.paper, lineHeight: 1.1, letterSpacing: '-0.005em',
        }}>{title}{accent && <><br/><span style={{ color: C.yellow, fontFamily: 'Neue Machina, monospace', fontWeight: 900, letterSpacing: '-0.025em', textTransform: 'uppercase' }}>{accent}_</span></>}</div>
        <div style={{
          position: 'absolute', bottom: 14, left: 24,
          fontFamily: 'IBM Plex Mono, monospace', fontSize: 9,
          letterSpacing: '0.14em', textTransform: 'uppercase', color: C.grey,
          zIndex: 2,
        }}>{meta}</div>
        <div style={{
          position: 'absolute', bottom: 16, right: 16, width: 18, height: 18,
          border: `1.5px solid ${C.yellow}`, zIndex: 2,
        }}/>
      </div>
    );
  }

  return (
    <article style={shell} onClick={onClick}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {cover}
      <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Label color={C.grey}>TIPO {variant} · {duration}</Label>
        <Caption>{views} views</Caption>
      </div>
    </article>
  );
}

Object.assign(window, { VideoCard });
