/* Hero — engineering-grid cover with display title. */

function Hero({ tag, title, accent, sub, ctaPrimary, ctaSecondary, onPrimary, onSecondary }) {
  return (
    <section style={{
      position: 'relative', overflow: 'hidden',
      padding: '96px 64px 80px',
      borderBottom: `0.5px solid ${C.border}`,
      isolation: 'isolate',
    }}>
      {/* engineering grid */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `linear-gradient(rgba(120,122,124,0.13) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(120,122,124,0.13) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }}/>
      <GrainOverlay opacity={0.04} zIndex={1}/>

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 900 }}>
        <Tag>{tag}</Tag>
        <h1 style={{
          fontFamily: 'Neue Machina, monospace',
          fontWeight: 900,
          fontSize: 'clamp(56px, 8vw, 128px)',
          lineHeight: 0.95,
          letterSpacing: '-0.035em',
          color: C.ink,
          margin: '14px 0 4px',
          textTransform: 'uppercase',
        }}>
          {title}<br/><span style={{ color: C.yellow }}>{accent}</span>
        </h1>
        <div style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 16, fontWeight: 300, letterSpacing: '0.04em',
          color: C.grey, margin: '8px 0 0', maxWidth: 540, lineHeight: 1.6,
        }}>{sub}</div>
        <div style={{
          width: 80, height: 3, background: C.yellow, margin: '28px 0 32px',
        }}/>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
          {ctaPrimary && <CTAButton variant="primary" icon="→" onClick={onPrimary}>{ctaPrimary}</CTAButton>}
          {ctaSecondary && <CTAButton variant="secondary" icon="↗" onClick={onSecondary}>{ctaSecondary}</CTAButton>}
        </div>
      </div>

      {/* faint section number */}
      <div style={{
        position: 'absolute', top: 60, right: 64,
        fontFamily: 'Neue Machina, monospace', fontWeight: 900,
        fontSize: 96, color: 'rgba(120,122,124,0.12)',
        letterSpacing: '-0.04em', lineHeight: 1, pointerEvents: 'none', zIndex: 1,
      }}>§ 00</div>
    </section>
  );
}

Object.assign(window, { Hero });
