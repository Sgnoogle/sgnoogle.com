/* Responsive grid of VideoCards with a section heading. */

function VideoGrid({ tag, num, title, sub, videos, onPick }) {
  return (
    <section style={{
      position: 'relative', padding: '64px',
      borderBottom: `0.5px solid ${C.border}`,
    }}>
      <Tag>{tag}</Tag>
      <h2 style={{
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: 28, fontWeight: 700, color: C.ink,
        letterSpacing: '-0.02em', margin: '8px 0 6px',
      }}>{title}</h2>
      <p style={{
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: 12, color: C.grey, maxWidth: 540, lineHeight: 1.7,
        margin: '0 0 36px',
      }}>{sub}</p>

      {num && (
        <div style={{
          position: 'absolute', top: 24, right: 64,
          fontFamily: 'Neue Machina, monospace', fontWeight: 900,
          fontSize: 80, color: 'rgba(120,122,124,0.12)',
          letterSpacing: '-0.04em', lineHeight: 1, pointerEvents: 'none',
        }}>{num}</div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 1,
        border: `0.5px solid ${C.borderSoft}`,
        background: C.borderSoft,
      }}>
        {videos.map((v, i) => (
          <div key={i} style={{ background: C.white }}>
            <VideoCard {...v} onClick={() => onPick?.(v, i)}/>
          </div>
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { VideoGrid });
