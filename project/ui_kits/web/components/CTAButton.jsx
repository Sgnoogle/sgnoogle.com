/* CTA button — divider-icon pattern (no radius, no shadow). */

function CTAButton({
  variant = 'primary',   // 'primary' | 'secondary' | 'ghost'
  icon = '→',
  children,
  onClick,
  fullWidth,
}) {
  if (variant === 'ghost') {
    return (
      <button onClick={onClick} style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        background: 'transparent', border: 'none', padding: '6px 0',
        cursor: 'pointer', fontFamily: 'IBM Plex Mono, monospace',
      }}>
        <span style={{
          width: 28, height: 28,
          border: `0.5px solid rgba(120,122,124,0.4)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: C.grey, fontSize: 12,
        }}>{icon}</span>
        <span style={{
          fontSize: 10, fontWeight: 600, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: C.grey,
        }}>{children}</span>
      </button>
    );
  }

  const isPrimary = variant === 'primary';
  const height = isPrimary ? 48 : 40;
  const iconWidth = isPrimary ? 52 : 44;
  const iconColor = isPrimary ? C.yellow : C.grey;
  const textColor = isPrimary ? C.white : C.ink;
  const bg = isPrimary ? C.ink : 'transparent';
  const border = isPrimary ? 'none' : `0.5px solid ${C.ink}`;
  const dividerColor = isPrimary ? 'rgba(255,255,255,0.15)' : 'rgba(40,40,44,0.3)';

  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'stretch',
      height, background: bg, border, padding: 0,
      cursor: 'pointer',
      width: fullWidth ? '100%' : 'auto',
      fontFamily: 'IBM Plex Mono, monospace',
      transition: 'background 150ms linear',
    }}
    onMouseEnter={(e) => { if (isPrimary) e.currentTarget.style.background = '#1c1c20'; else e.currentTarget.style.background = C.paper; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = bg; }}
    >
      <span style={{
        width: iconWidth, display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRight: `0.5px solid ${dividerColor}`,
        color: iconColor, fontSize: isPrimary ? 16 : 14, fontWeight: 700,
      }}>{icon}</span>
      <span style={{
        flex: 1, display: 'flex', alignItems: 'center',
        padding: isPrimary ? '0 24px' : '0 18px',
        fontSize: isPrimary ? 11 : 10,
        fontWeight: 700, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: textColor,
      }}>{children}</span>
    </button>
  );
}

Object.assign(window, { CTAButton });
