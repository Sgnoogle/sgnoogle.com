/* Console — the SGN-OS shell.
   Layout: TopBar / Display / ModuleStrip.
   v3.2: terminal-OS idle home, IBM Plex Mono only, manifesto + log + changelog.
   No display font, no cornermarks anywhere, no flashing module-number. */

function TopBar({ lang, onOpenLang, onHome, current, mobile, soundOn, onToggleSound }) {
  const L = I18N[lang];
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 30,
      height: 44, background: C.white,
      borderBottom: `0.5px solid ${C.borderSoft}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 clamp(12px, 3vw, 24px)',
      fontFamily: 'IBM Plex Mono, monospace',
      gap: 10,
    }}>
      {/* LEFT — F logo + SGNOOGLE wordmark */}
      <button onClick={onHome} className="sgn-hot" style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        background: 'transparent', border: 'none', padding: 0,
        cursor: 'pointer', fontFamily: 'inherit', color: 'inherit',
      }}>
        {/* Real F monogram SVG — not a text placeholder */}
        <svg viewBox="0 0 206.1 201.44" aria-hidden style={{
          width: 22, height: 22, display: 'block', flexShrink: 0,
        }}>
          <g fill={C.yellow}>
            <polygon points="51.44 100.64 154.75 100.64 0 201.44"/>
            <polygon points="102.79 0 206.1 0 51.35 100.8"/>
            <polygon points="84.44 0 33 100.8 8.4 100.8 59.83 0"/>
          </g>
        </svg>
        <span style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', color: C.ink,
        }}>{BRAND.product}</span>
      </button>

      {/* MIDDLE — terminal-style breadcrumb */}
      {!mobile && (
        <div style={{
          flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6,
          fontSize: 10, letterSpacing: '0.08em', color: C.grey,
          fontFamily: 'IBM Plex Mono, monospace',
        }}>
          <span style={{ color: C.yellow }}>›</span>
          <span style={{ color: C.faint }}>~</span>
          <span style={{ color: C.border }}>/</span>
          <span style={{ color: current ? C.ink : C.faint, fontWeight: 600 }}>
            {current ? `${current.toLowerCase()}.${L.modules[current].label.toLowerCase()}` : 'idle'}
          </span>
        </div>
      )}

      {/* RIGHT — sound + lang */}
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 6 }}>
        <button onClick={onToggleSound} className="sgn-hot" title={soundOn ? 'Sound on' : 'Sound off'} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'transparent', border: `0.5px solid ${C.border}`,
          padding: '4px 7px', cursor: 'pointer', fontFamily: 'inherit',
          color: C.ink,
        }}>
          <svg width="10" height="10" viewBox="0 0 11 11" aria-hidden style={{ display: 'block' }}>
            <path d="M2 4 L4 4 L6.5 2 L6.5 9 L4 7 L2 7 Z" fill={C.ink}/>
            {soundOn ? (
              <>
                <path d="M7.6 3.6 Q9 5.5 7.6 7.4" stroke={C.yellow} strokeWidth="0.8" fill="none"/>
                <path d="M8.6 2.6 Q10.3 5.5 8.6 8.4" stroke={C.yellow} strokeWidth="0.8" fill="none"/>
              </>
            ) : (
              <line x1="7" y1="3" x2="10" y2="8" stroke={C.grey} strokeWidth="1"/>
            )}
          </svg>
        </button>
        <button onClick={onOpenLang} className="sgn-hot" style={{
          display: 'inline-flex', alignItems: 'stretch',
          background: 'transparent', border: `0.5px solid ${C.border}`,
          padding: 0, cursor: 'pointer', fontFamily: 'inherit', color: 'inherit',
        }}>
          <span style={{
            padding: '4px 6px', fontSize: 9, letterSpacing: '0.18em',
            color: C.faint, fontWeight: 600,
          }}>LANG</span>
          <span style={{
            padding: '4px 8px', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.18em', color: C.ink,
            borderLeft: `0.5px solid ${C.border}`,
            background: C.paper,
          }}>{lang.toUpperCase()}</span>
        </button>
      </div>
    </header>
  );
}

/* ───────────── IdleDisplay — Gran Turismo mode select ─────────────
   Two states:
   - DEFAULT: SGNOOGLE wordmark center + LIVE badge + wireframe F bg
   - PREVIEW (when a module is hovered): the wordmark fades, the
     module-specific hero takes over (big number, label, count, status)
   - IDLE screensaver after 30s no input: wordmark fades to 0.4,
     wireframe F grows. Any input resets the timer. */
function IdleDisplay({ lang, mobile, focused }) {
  const L = I18N[lang];
  const [armed, setArmed] = React.useState(false);
  const [idleMode, setIdleMode] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setArmed(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Idle screensaver — kicks in after 30s of no input, dismissed by any input.
  React.useEffect(() => {
    if (focused) return undefined;  // hover-preview disables idle mode
    let t;
    const reset = () => {
      setIdleMode(false);
      clearTimeout(t);
      t = setTimeout(() => setIdleMode(true), 30000);
    };
    reset();
    window.addEventListener('mousemove', reset);
    window.addEventListener('keydown',   reset);
    window.addEventListener('touchstart',reset);
    return () => {
      clearTimeout(t);
      window.removeEventListener('mousemove', reset);
      window.removeEventListener('keydown',   reset);
      window.removeEventListener('touchstart',reset);
    };
  }, [focused]);

  const preview = focused && L.modules[focused];

  return (
    <div style={{
      position: 'relative',
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'IBM Plex Mono, monospace',
    }}>
      {/* 3D wireframe background — grows in idle mode */}
      <div style={{
        position: 'absolute', inset: 0,
        transform: idleMode ? 'scale(1.4)' : 'scale(1)',
        transition: 'transform 1800ms cubic-bezier(0.2,0,0,1)',
      }}>
        <Hero3DMark mobile={mobile}/>
      </div>

      {/* CENTER — wordmark OR module preview */}
      <div style={{
        position: 'relative', zIndex: 2,
        flex: 1,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(20px, 4vw, 56px)',
        gap: 'clamp(18px, 3vh, 28px)',
      }}>
        {/* Default — SGNOOGLE wordmark.
            Note: opacity uses a transition for the armed-on entrance but jumps
            instantly when `preview` activates — a soft fade competes with the
            preview's slide-in and reads as laggy. */}
        <h1 style={{
          fontFamily: 'Neue Machina, IBM Plex Mono, monospace',
          fontWeight: 700,
          fontSize: 'clamp(36px, 12vw, 168px)',
          letterSpacing: '-0.05em', color: C.ink,
          lineHeight: 0.9, margin: 0,
          whiteSpace: 'nowrap',
          display: preview ? 'none' : 'block',
          opacity: idleMode ? 0.35 : (armed ? 1 : 0),
          transform: armed ? 'translateY(0)' : 'translateY(18px)',
          transition: 'opacity 700ms linear 120ms, transform 700ms cubic-bezier(0.2,0,0,1) 120ms',
        }}>
          <span style={{ color: C.yellow }}>SGN</span>OOGLE
        </h1>

        {!preview && <LiveBadge armed={armed} dimmed={idleMode}/>}

        {/* Module preview overlay — visible only while a tab is hovered */}
        {preview && (
          <ModulePreview id={focused} module={preview}/>
        )}
      </div>

      {/* CORNER bottom-right — mini changelog (hidden during preview / idle screensaver) */}
      <CornerChangelog armed={armed} mobile={mobile} dimmed={!!preview || idleMode}/>

      {/* CORNER bottom-left — domain only, version moved to changelog header */}
      <div style={{
        position: 'absolute', left: 'clamp(14px, 2vw, 28px)',
        bottom: 'clamp(14px, 2vh, 24px)', zIndex: 3,
        opacity: armed ? (preview ? 0 : (idleMode ? 0.4 : 0.7)) : 0,
        transition: 'opacity 420ms linear',
        fontSize: 9, letterSpacing: '0.22em', color: C.faint, fontWeight: 600,
      }}>
        {BRAND.domain}
      </div>

      {/* IDLE screensaver tag */}
      {idleMode && !preview && (
        <div aria-hidden style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%) translateY(120px)',
          fontSize: 10, letterSpacing: '0.4em', color: C.faint, fontWeight: 600,
          zIndex: 3, pointerEvents: 'none',
          animation: 'sgnpulse 2.4s linear infinite',
        }}>{lang === 'it' ? '— IN ATTESA —' : '— STAND BY —'}</div>
      )}
    </div>
  );
}

/* ModulePreview — Gran-Turismo-style hero shown when a module tab is hovered.
   Replaces the SGNOOGLE wordmark with: huge number, label,
   one stat / one tagline. No paragraphs.
   Mounts at opacity 0 then transitions in via React state — avoids the
   CSS-animation "stuck-at-zero" pitfall the html-to-image rasterizer hits. */
function ModulePreview({ id, module }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setMounted(true), 20); return () => clearTimeout(t); }, []);

  const stats = {
    '01': { value: CHANNEL.subs.synced ? '67K' : '—', unit: 'subs', tag: 'LIVE' },
    '02': { value: OBJECTS.length || '—', unit: 'STL',  tag: 'SOON' },
    '03': { value: APPS.length || '—',    unit: 'apps', tag: 'SOON' },
    '04': { value: LINKS.length || '—',   unit: 'collabs', tag: 'OPEN' },
    '05': { value: '01', unit: 'profile', tag: 'YOU' },
  }[id] || { value: '—', unit: '—', tag: '' };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
      pointerEvents: 'none',
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.985)',
      transition: 'opacity 320ms linear, transform 380ms cubic-bezier(0.2,0,0,1)',
    }}>
      <span style={{
        fontFamily: 'IBM Plex Mono, monospace', fontSize: 10,
        letterSpacing: '0.32em', color: C.faint, fontWeight: 600,
      }}>SELECT · {id}</span>
      <h2 style={{
        fontFamily: 'Neue Machina, IBM Plex Mono, monospace',
        fontWeight: 700,
        fontSize: 'clamp(72px, 16vw, 220px)',
        letterSpacing: '-0.06em', color: C.ink,
        lineHeight: 0.85, margin: 0, whiteSpace: 'nowrap',
      }}>{module.label}</h2>
      <div style={{
        display: 'inline-flex', alignItems: 'stretch',
        border: `0.5px solid ${C.border}`, background: C.white,
        fontFamily: 'IBM Plex Mono, monospace',
      }}>
        <span style={{
          padding: '8px 12px', background: C.yellow, color: C.ink,
          fontSize: 10, letterSpacing: '0.22em', fontWeight: 700,
        }}>{stats.tag}</span>
        <span style={{
          padding: '8px 14px', fontSize: 13, fontWeight: 700, color: C.ink,
          letterSpacing: '0.04em',
        }}>{stats.value} <span style={{ color: C.grey, fontWeight: 400, marginLeft: 4 }}>{stats.unit}</span></span>
      </div>
      <span style={{
        fontSize: 11, color: C.grey, letterSpacing: '0.08em', lineHeight: 1.6,
        textAlign: 'center', maxWidth: 360,
      }}>{module.sub}</span>
    </div>
  );
}

/* LiveBadge — single status pill, pulse if synced. Replaces the 4-counter grid. */
function LiveBadge({ armed, dimmed }) {
  const display = useCountUp(CHANNEL.subs.value, { duration: 1500, fmt: 'short', active: armed });
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'stretch',
      background: C.white,
      border: `0.5px solid ${C.border}`,
      opacity: armed ? (dimmed ? 0.4 : 1) : 0,
      transform: armed ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 600ms linear 600ms, transform 600ms cubic-bezier(0.2,0,0,1) 600ms',
    }}>
      <span style={{
        padding: '8px 12px',
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: C.yellow, color: C.ink,
        fontSize: 10, letterSpacing: '0.22em', fontWeight: 700,
      }}>
        <span style={{
          width: 6, height: 6, background: C.ink, display: 'inline-block',
          animation: 'sgnpulse 1.6s linear infinite',
        }}/>
        LIVE
      </span>
      <span style={{
        padding: '8px 14px',
        fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700,
        fontSize: 13, letterSpacing: '0.04em', color: C.ink,
      }}>
        {display} <span style={{ color: C.grey, fontWeight: 400, marginLeft: 4 }}>subs</span>
      </span>
    </div>
  );
}

/* CornerChangelog — tiny 4-row changelog in the bottom-right corner.
   Carries the version number so the topbar / idle bottom-left don't repeat it.
   Hidden on small mobile / during preview / during idle screensaver. */
function CornerChangelog({ armed, mobile, dimmed }) {
  if (mobile) return null;
  return (
    <div style={{
      position: 'absolute', right: 'clamp(14px, 2vw, 28px)',
      bottom: 'clamp(14px, 2vh, 24px)', zIndex: 3,
      opacity: armed ? (dimmed ? 0 : 0.75) : 0,
      transition: 'opacity 420ms linear',
      width: 200, pointerEvents: 'none',
    }}>
      <div style={{
        fontSize: 9, letterSpacing: '0.22em', color: C.faint, fontWeight: 600,
        marginBottom: 8, paddingBottom: 6,
        borderBottom: `0.5px dashed ${C.borderSoft}`,
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>CHANGELOG</span>
        <span style={{ color: C.grey, letterSpacing: '0.18em' }}>{BRAND.version}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {CHANGELOG.slice(0, 4).map((row) => (
          <div key={row.d} style={{
            display: 'grid', gridTemplateColumns: 'auto 1fr',
            gap: 8, fontSize: 9, lineHeight: 1.4,
          }}>
            <span style={{ color: C.faint, letterSpacing: '0.04em' }}>{row.d.slice(5)}</span>
            <span style={{ color: C.grey }}>{row.m}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ModuleTab — Gran-Turismo-style lane. Minimal:
   big number + label. No subtitle, no count clutter in the strip.
   Hover/active states use a yellow rail + a single chevron. */
function ModuleTab({ id, label, active, focused, hotkey, onClick, onHover, onLeave }) {
  const hot = active || focused;
  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        position: 'relative',
        background: hot ? C.white : C.paper,
        border: 'none',
        borderTop: `0.5px solid ${active ? C.yellow : C.borderSoft}`,
        borderBottom: 'none',
        padding: 'clamp(14px, 2vh, 22px) clamp(16px, 1.8vw, 24px)',
        textAlign: 'left',
        cursor: 'pointer',
        fontFamily: 'IBM Plex Mono, monospace',
        transition: 'background 200ms linear, border-color 200ms linear',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        gap: 12,
        minHeight: 'clamp(140px, 22vh, 200px)',
        outline: 'none', overflow: 'hidden',
      }}
      className="sgn-tab"
    >
      {/* Yellow rail at top */}
      <span style={{
        position: 'absolute', top: -0.5, left: 0,
        height: 2, background: C.yellow,
        width: active ? '100%' : (focused ? '40%' : '0%'),
        transition: 'width 320ms cubic-bezier(0.2,0,0,1)',
      }}/>

      {/* Top row: hotkey */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <span style={{
          fontSize: 9, color: active ? C.yellow : C.faint, fontWeight: 700,
          letterSpacing: '0.2em',
          padding: '2px 6px',
          border: `0.5px solid ${active ? C.yellow : C.border}`,
        }}>{hotkey}</span>
      </div>

      {/* Bottom: big number + label */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
        <span style={{
          fontFamily: 'Neue Machina, IBM Plex Mono, monospace', fontWeight: 700,
          fontSize: 'clamp(48px, 8vh, 88px)', color: C.ink,
          letterSpacing: '-0.05em', lineHeight: 0.85,
        }}>{id}</span>
        <span style={{
          fontSize: 'clamp(12px, 1.4vh, 14px)', fontWeight: 700, letterSpacing: '0.18em',
          color: C.ink, paddingBottom: 6, flex: 1,
        }}>{label}</span>
        <span style={{
          fontSize: 16, color: hot ? C.yellow : 'transparent',
          transform: hot ? 'translateX(0)' : 'translateX(-6px)',
          transition: 'transform 220ms cubic-bezier(0.2,0,0,1), color 200ms linear',
          alignSelf: 'flex-end', paddingBottom: 8,
        }}>→</span>
      </div>
    </button>
  );
}

/* ModuleStrip — 5 ModuleTabs. */
function ModuleStrip({ current, focused, setFocused, lang, onSelect, mobile, sound }) {
  const L = I18N[lang];
  const ids = ['01','02','03','04','05'];
  return (
    <div
      className="sgn-strip"
      data-mobile={mobile ? 'yes' : 'no'}
      style={{
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr' : 'repeat(5, 1fr)',
        gridAutoFlow: 'row',
        gap: 1,
        background: C.borderSoft,
        borderTop: `0.5px solid ${C.borderSoft}`,
      }}>
      {ids.map((id, i) => (
        <ModuleTab
          key={id}
          id={id}
          label={L.modules[id].label}
          sub={L.modules[id].sub}
          count={L.modules[id].count}
          hotkey={String(i + 1)}
          active={current === id}
          focused={focused === id}
          onClick={() => onSelect(id)}
          onHover={() => { setFocused?.(id); sound && sound('hover'); }}
          onLeave={() => setFocused?.(null)}
        />
      ))}
    </div>
  );
}

/* TransitionOverlay — yellow sweep + small module number at bottom.
   The number is informational ("you entered 03"), not decorative. */
function TransitionOverlay({ keyId }) {
  if (!keyId) return null;
  const [, id] = keyId.split('-');
  return (
    <div key={keyId} aria-hidden style={{
      position: 'absolute', inset: 0,
      pointerEvents: 'none', overflow: 'hidden', zIndex: 50,
    }}>
      {/* full-display yellow sweep, fast */}
      <span style={{
        position: 'absolute', top: 0, bottom: 0, left: 0, width: '100%',
        background: C.yellow,
        animation: 'sgnModuleSweep 460ms cubic-bezier(0.2,0,0,1) forwards',
        willChange: 'transform',
      }}/>
      {/* small number in bottom-right, fades in/out */}
      <span style={{
        position: 'absolute', right: 'clamp(16px, 2vw, 32px)',
        bottom: 'clamp(14px, 2vh, 24px)',
        fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700,
        fontSize: 14, letterSpacing: '0.22em',
        color: C.ink, mixBlendMode: 'multiply',
        animation: 'sgnTransNum 460ms cubic-bezier(0.2,0,0,1) forwards',
      }}>· {id} ·</span>
    </div>
  );
}

Object.assign(window, { TopBar, IdleDisplay, ModuleTab, ModuleStrip, TransitionOverlay,
                         LiveBadge, CornerChangelog, ModulePreview });
