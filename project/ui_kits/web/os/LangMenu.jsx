/* LangMenu — gaming-style language selection modal.
   Two big tiles (IT / EN), arrow-key + click navigable, confirms on Enter.
   Yellow sweep animates in from right; tiles stagger; selecting plays
   confirm tick and slides out left.
   Mobile-aware: tiles stack vertically below 600px. */

function LangMenu({ open, lang, onPick, onClose, sound }) {
  const [hover, setHover] = React.useState(lang);
  const [leaving, setLeaving] = React.useState(false);

  React.useEffect(() => { if (open) { setHover(lang); setLeaving(false); } }, [open, lang]);

  // keyboard nav
  React.useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { setHover('it'); sound && sound('tick'); }
      else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { setHover('en'); sound && sound('tick'); }
      else if (e.key === 'Enter') { pick(hover); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, hover, sound]);

  const close = () => {
    setLeaving(true);
    sound && sound('back');
    setTimeout(() => onClose?.(), 240);
  };

  const pick = (v) => {
    setHover(v);
    setLeaving(true);
    sound && sound('confirm');
    setTimeout(() => onPick?.(v), 280);
  };

  if (!open) return null;

  const L = I18N[lang].langMenu;

  return (
    <div
      onClick={close}
      style={{
        position: 'fixed', inset: 0, zIndex: 90000,
        background: leaving ? 'rgba(40,40,44,0)' : 'rgba(40,40,44,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(16px, 4vw, 40px)',
        transition: 'background 260ms linear',
        fontFamily: 'IBM Plex Mono, monospace',
      }}>
      {/* yellow side sweep — entry flourish */}
      <span aria-hidden style={{
        position: 'absolute', top: 0, bottom: 0, left: 0,
        width: '100%', background: C.yellow,
        animation: leaving ? 'sgnSweepOut 240ms linear forwards' : 'sgnSweepIn 260ms linear forwards',
        pointerEvents: 'none',
        transformOrigin: 'right',
      }}/>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(720px, 100%)',
          background: C.paper,
          border: `0.5px solid ${C.border}`,
          padding: 'clamp(20px, 3vw, 40px)',
          position: 'relative',
          animation: leaving ? 'sgnPanelOut 240ms cubic-bezier(0.2,0,0,1) forwards' : 'sgnPanelIn 380ms cubic-bezier(0.2,0,0,1) 120ms both',
        }}>
        {/* corner brackets */}{/* header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 'clamp(18px, 3vh, 30px)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 9, letterSpacing: '0.3em', color: C.grey, fontWeight: 600 }}>
              {BRAND.os} · LOCALE
            </span>
            <div style={{
              fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700,
              fontSize: 'clamp(22px, 3vw, 36px)', letterSpacing: '-0.03em',
              color: C.ink, lineHeight: 1,
            }}>{L.title}</div>
          </div>
          <button onClick={close} style={{
            background: 'transparent', border: `0.5px solid ${C.border}`,
            color: C.ink, fontFamily: 'inherit', fontSize: 10,
            letterSpacing: '0.18em', padding: '7px 12px', cursor: 'pointer',
            fontWeight: 700,
          }}>ESC ✕</button>
        </div>

        {/* tiles */}
        <div className="sgn-lang-tiles" style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14,
        }}>
          {[
            { v: 'it', code: 'IT', label: L.flagIt },
            { v: 'en', code: 'EN', label: L.flagEn },
          ].map((opt, i) => {
            const active = hover === opt.v;
            const current = lang === opt.v;
            return (
              <button
                key={opt.v}
                onMouseEnter={() => { if (!active) sound && sound('tick'); setHover(opt.v); }}
                onClick={() => pick(opt.v)}
                style={{
                  position: 'relative',
                  background: active ? C.white : C.paper,
                  border: `0.5px solid ${active ? C.yellow : C.border}`,
                  padding: 'clamp(22px, 3vw, 36px) clamp(18px, 2vw, 26px)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex', flexDirection: 'column', gap: 14,
                  outline: 'none',
                  transition: 'background 160ms linear, border-color 160ms linear',
                  animation: `sgnTileIn 420ms cubic-bezier(0.2,0,0,1) ${260 + i * 80}ms both`,
                }}>
                {/* top yellow rail when active */}
                <span style={{
                  position: 'absolute', top: -0.5, left: 0, right: 0, height: 2,
                  background: C.yellow,
                  transform: active ? 'scaleX(1)' : 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: 'transform 220ms cubic-bezier(0.2,0,0,1)',
                }}/>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{
                    fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700,
                    fontSize: 'clamp(40px, 6vw, 72px)', letterSpacing: '-0.04em',
                    color: C.ink, lineHeight: 0.9,
                  }}>{opt.code}</div>
                  <span style={{
                    fontSize: 9, letterSpacing: '0.18em', fontWeight: 700,
                    color: current ? C.yellow : C.faint,
                    padding: '3px 7px', border: `0.5px solid ${current ? C.yellow : C.border}`,
                  }}>
                    {current ? 'CURRENT' : (active ? '▶ SELECT' : '·')}
                  </span>
                </div>
                <div>
                  <div style={{
                    fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700,
                    fontSize: 13, color: C.ink, letterSpacing: '0.08em',
                  }}>{opt.label}</div>
                  <div style={{
                    fontSize: 9, letterSpacing: '0.18em', color: C.grey, marginTop: 4,
                  }}>LANG.{opt.v.toUpperCase()}</div>
                </div>
                {/* keyboard hint */}
                <div style={{
                  display: 'flex', gap: 6, marginTop: 4,
                  fontSize: 9, letterSpacing: '0.16em', color: C.faint,
                }}>
                  <kbd style={kbdStyle}>{i === 0 ? '←' : '→'}</kbd>
                  <span style={{ alignSelf: 'center' }}>NAV</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* footer hint row */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 'clamp(18px, 3vh, 26px)',
          paddingTop: 14, borderTop: `0.5px solid ${C.borderSoft}`,
          fontSize: 9, letterSpacing: '0.2em', color: C.grey,
        }}>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <span><kbd style={kbdStyle}>↵</kbd> {L.confirm}</span>
            <span><kbd style={kbdStyle}>ESC</kbd> {L.cancel}</span>
          </div>
          <span style={{ color: C.faint }}>{BRAND.domain}</span>
        </div>
      </div>

      <style>{`
        @keyframes sgnSweepIn {
          0%   { transform: scaleX(0); transform-origin: right; }
          50%  { transform: scaleX(1); transform-origin: right; }
          50.01% { transform-origin: left; }
          100% { transform: scaleX(0); transform-origin: left; }
        }
        @keyframes sgnSweepOut {
          0% { transform: scaleX(0); transform-origin: left; }
          100% { transform: scaleX(0); transform-origin: left; }
        }
        @keyframes sgnPanelIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sgnPanelOut {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(-8px) scale(0.985); }
        }
        @keyframes sgnTileIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 600px) {
          .sgn-lang-tiles { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const kbdStyle = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  minWidth: 18, height: 16, padding: '0 4px',
  border: '0.5px solid rgba(120,122,124,0.3)',
  fontFamily: 'IBM Plex Mono, monospace', fontSize: 9, fontWeight: 700,
  letterSpacing: 0, color: '#28282C', background: 'rgba(255,255,255,0.5)',
};

Object.assign(window, { LangMenu });
