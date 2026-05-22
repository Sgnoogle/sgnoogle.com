/* Top nav v2.7 — white background, yellow 2px bottom border. No symbol. */

function Nav({ current, onNav, items }) {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
      height: 48, background: C.white,
      borderBottom: `2px solid ${C.yellow}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px',
    }}>
      <a onClick={(e) => { e.preventDefault(); onNav?.('home'); }}
         href="#" style={{
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: 11, fontWeight: 700, letterSpacing: '0.2em',
        color: C.ink, textDecoration: 'none',
      }}>SGNAOLIN</a>
      <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
        {items.map(it => {
          const active = current === it.id;
          return (
            <li key={it.id}>
              <a onClick={(e) => { e.preventDefault(); onNav?.(it.id); }}
                 href="#" style={{
                display: 'block', padding: '0 18px', height: 48, lineHeight: '48px',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
                color: active ? C.ink : C.grey,
                background: active ? 'rgba(255,194,0,0.10)' : 'transparent',
                borderLeft: '0.5px solid rgba(120,122,124,0.15)',
                textDecoration: 'none', fontWeight: active ? 700 : 400,
                transition: 'color 150ms linear, background 150ms linear',
              }}
              onMouseEnter={(e) => { if (!active) { e.currentTarget.style.color = C.ink; e.currentTarget.style.background = 'rgba(255,194,0,0.08)'; } }}
              onMouseLeave={(e) => { if (!active) { e.currentTarget.style.color = C.grey; e.currentTarget.style.background = 'transparent'; } }}
              >{it.label}</a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

Object.assign(window, { Nav });
