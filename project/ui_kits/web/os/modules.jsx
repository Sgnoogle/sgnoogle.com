/* Five module bodies. Render inline inside the Console display area.
   Each starts with a ModuleHeader (tag + title), then content.
   No giant background section numbers, no full-screen Section wrapper.
   v3.0: spacious, minimal, mobile-responsive. */

/* ModuleHeader — Japanese-minimal: number + slash + label inline (no §),
   then a hairline rule. Title lives in IBM Plex Mono, not Neue Machina,
   to stop the display font from dominating every screen.
   Number stays in Neue Machina so it carries the gaming-stat feel. */
function ModuleHeader({ id, title, sub }) {
  return (
    <header style={{
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
      alignItems: 'center', gap: 'clamp(16px, 2.5vw, 28px)',
      marginBottom: 'clamp(20px, 3vh, 32px)',
      paddingBottom: 'clamp(14px, 2vh, 18px)',
      borderBottom: `0.5px solid ${C.borderSoft}`,
    }} className="sgn-mod-header">
      {/* Number — Neue Machina (use #3 of 3) */}
      <span style={{
        fontFamily: 'Neue Machina, IBM Plex Mono, monospace', fontWeight: 700,
        fontSize: 'clamp(38px, 5vw, 62px)', letterSpacing: '-0.05em',
        color: C.ink, lineHeight: 0.85,
      }}>
        <span style={{ color: C.yellow }}>{id}</span>
      </span>

      <h2 style={{
        fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700,
        fontSize: 'clamp(16px, 1.5vw, 20px)', lineHeight: 1.1,
        letterSpacing: '0.18em', color: C.ink,
        textTransform: 'uppercase', margin: 0,
      }}>{title}</h2>

      {/* Vertical subtitle (tategaki) — sits to the right, slim */}
      {sub && (
        <span className="sgn-vsub" style={{
          writingMode: 'vertical-rl',
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 'clamp(9px, 0.8vw, 10px)',
          fontWeight: 600,
          letterSpacing: '0.22em',
          color: C.grey, textTransform: 'uppercase',
          lineHeight: 1.4,
          maxHeight: 'clamp(40px, 6vh, 70px)',
          overflow: 'hidden',
          paddingLeft: 6,
          borderLeft: `0.5px solid ${C.border}`,
        }}>{sub}</span>
      )}
    </header>
  );
}

/* SyncBanner — narrow yellow-left-bordered note explaining that the data
   shown is a preview, with the real source to follow. */
function SyncBanner({ kind = 'youtube', note }) {
  const labels = {
    youtube: 'PENDING · YOUTUBE SYNC',
    list:    'PENDING · LIST INCOMING',
  };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 14px',
      borderLeft: `3px solid ${C.yellow}`,
      background: C.white,
      border: `0.5px solid ${C.borderSoft}`,
      borderLeftWidth: 3,
      marginBottom: 'clamp(14px, 2vh, 20px)',
      fontFamily: 'IBM Plex Mono, monospace',
    }}>
      <span style={{
        width: 6, height: 6, background: C.yellow, display: 'inline-block',
        animation: 'sgnpulse 1.6s linear infinite', flexShrink: 0,
      }}/>
      <span style={{
        fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: C.ink,
      }}>{labels[kind] || labels.list}</span>
      <span style={{ color: C.border, fontSize: 10 }}>·</span>
      <span style={{ fontSize: 11, color: C.grey, lineHeight: 1.5, flex: 1 }}>{note}</span>
    </div>
  );
}

/* EmptyModuleState — placeholder shown when a module's data array is empty.
   Terminal log style, no "sorry / coming soon" web-app vocabulary. */
function EmptyModuleState({ icon, title, body, hint }) {
  return (
    <div style={{
      background: C.white, border: `0.5px solid ${C.borderSoft}`,
      padding: 'clamp(28px, 4vw, 56px)',
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16,
      fontFamily: 'IBM Plex Mono, monospace',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        fontSize: 10, letterSpacing: '0.22em', color: C.faint, fontWeight: 600,
      }}>
        <span style={{
          width: 18, height: 18, display: 'inline-flex',
          alignItems: 'center', justifyContent: 'center',
          border: `0.5px solid ${C.border}`, color: C.yellow, fontSize: 11,
        }}>{icon}</span>
        EMPTY · NO RECORDS
      </div>
      <div style={{
        fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700,
        fontSize: 'clamp(20px, 2.4vw, 28px)', letterSpacing: '-0.02em',
        color: C.ink, lineHeight: 1.15, margin: 0,
      }}>{title}</div>
      <p style={{
        fontSize: 'clamp(12px, 1.05vw, 14px)', color: C.grey, lineHeight: 1.7,
        margin: 0, maxWidth: 540,
      }}>{body}</p>
      {hint && (
        <div style={{
          marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 8,
          fontSize: 10, letterSpacing: '0.16em', fontWeight: 600,
          color: C.ink,
        }}>
          <span style={{ color: C.yellow }}>$</span>{hint}
        </div>
      )}
    </div>
  );
}

/* ════════ 01 VIDEO ════════ */
function VideoModule({ lang }) {
  const L = I18N[lang];
  const featured = VIDEOS[0];
  const rest = VIDEOS.slice(1);
  return (
    <div>
      <ModuleHeader id="01" title={L.modules['01'].label} sub={L.video.sub}/>
      <SyncBanner kind="youtube" note={L.video.syncNote}/>
      <FeaturedVideo v={featured} L={L}/>
      <div style={{
        marginTop: 'clamp(20px, 3vh, 32px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 'clamp(10px, 1.2vw, 16px)',
      }}>
        {rest.map((v, i) => <VideoCard key={v.id} v={v} L={L} delay={i * 60}/>)}
      </div>
    </div>
  );
}

function FeaturedVideo({ v, L }) {
  const [ref, inView] = useInView({ threshold: 0.2 });
  return (
    <div ref={ref} style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1.55fr) minmax(220px, 1fr)',
      gap: 'clamp(12px, 1.5vw, 22px)',
      border: `0.5px solid ${C.border}`,
      background: C.white,
    }} className="sgn-featured">
      {/* Auto-playing muted preview — YouTube embed when v.youtubeId,
          otherwise a poster-style fallback. */}
      {v.youtubeId
        ? <VideoPreview youtubeId={v.youtubeId} title={v.title}/>
        : <VideoArt v={v} big/>}
      <div style={{
        padding: 'clamp(16px, 2vw, 26px)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16,
      }}>
        <div>
          <Tag color={C.yellow}>{L.video.featured}</Tag>
          <div style={{
            fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700,
            fontSize: 'clamp(22px, 2.6vw, 36px)', letterSpacing: '-0.025em',
            color: C.ink, lineHeight: 0.98, marginTop: 12, textTransform: 'uppercase',
          }}>{v.title}</div>
          <Caption style={{ display: 'block', marginTop: 8 }}>{v.cat} · {v.date}</Caption>
        </div>
        <div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
            <Pill k={L.video.tier} v={v.tier} gold={v.tier === 'S'}/>
            <Pill k="DUR" v={v.duration}/>
          </div>
          <div style={{ marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
            <Label size={9}>{L.video.perfLabel}</Label>
            <Label color={C.ink} size={9}>{v.perf}%</Label>
          </div>
          <Bar value={Math.min(10, Math.round(v.perf / 20))} max={10} gold active={inView}/>
          <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{
              fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700,
              fontSize: 'clamp(22px, 2.4vw, 30px)', color: C.ink, letterSpacing: '-0.025em',
            }}>{v.views}</div>
            <Label size={9}>VIEWS</Label>
          </div>
        </div>
      </div>
    </div>
  );
}

/* VideoPreview — muted auto-play YouTube embed for the featured card.
   Uses the privacy-enhanced embed (youtube-nocookie) + minimal chrome.
   When SGN-OS gets a YouTube data sync, the youtubeId comes from the API. */
function VideoPreview({ youtubeId, title }) {
  // The embed URL turns off branding/related/keyboard/controls + loops + mutes
  // so the card behaves like a silent looping preview tile, not a player.
  const url = `https://www.youtube-nocookie.com/embed/${youtubeId}`
    + `?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}`
    + `&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3&disablekb=1`;
  return (
    <div style={{
      position: 'relative', aspectRatio: '16/10',
      background: C.ink, overflow: 'hidden',
    }}>
      <iframe
        src={url}
        title={title}
        loading="lazy"
        allow="autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          border: 0, display: 'block',
          // YouTube doesn't let you crop letterboxing — scale up + clip so the
          // 16:9 video fills the 16:10 frame without bars.
          transform: 'scale(1.08)',
          pointerEvents: 'none',
        }}
      />
      {/* PREVIEW · MUTED tag in the corner so it reads as a preview, not a player */}
      <span style={{
        position: 'absolute', top: 10, left: 10, zIndex: 2,
        fontFamily: 'IBM Plex Mono, monospace', fontSize: 9,
        letterSpacing: '0.22em', fontWeight: 700, color: C.ink,
        background: C.yellow, padding: '3px 6px',
      }}>PREVIEW · MUTED</span>
    </div>
  );
}

function VideoCard({ v, L, delay = 0 }) {
  const [ref, inView] = useInView({ threshold: 0.2 });
  return (
    <div ref={ref} style={{
      background: C.white, border: `0.5px solid ${C.borderSoft}`,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(16px)',
      transition: `opacity 400ms linear ${delay}ms, transform 400ms cubic-bezier(0.2,0,0,1) ${delay}ms`,
    }}>
      <VideoArt v={v}/>
      <div style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <Label color={C.grey} size={9}>{v.cat}</Label>
          <Caption>{v.date}</Caption>
        </div>
        <div style={{
          fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700, fontSize: 13,
          color: C.ink, marginBottom: 10, lineHeight: 1.3,
        }}>{v.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <TierBadge tier={v.tier} size={20}/>
          <Label color={C.faint} size={9} style={{ marginLeft: 'auto' }}>{v.duration} · {v.views}</Label>
        </div>
        <Bar value={Math.min(10, Math.round(v.perf / 20))} gold={v.tier === 'S'} active={inView} height={4} delay={delay + 200}/>
      </div>
    </div>
  );
}

function VideoArt({ v, big }) {
  const isB = v.kind === 'B';
  return (
    <div style={{
      position: 'relative', aspectRatio: big ? '16/10' : '16/9',
      background: isB ? C.yellow : C.paper, overflow: 'hidden',
    }}>
      {!isB && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: big ? 5 : 3, background: C.yellow }}/>}
      {isB && <>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1.5, background: C.ink }}/>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1.5, background: C.ink }}/>
      </>}
      <div style={{
        position: 'absolute', top: big ? 22 : 14, left: big ? 22 : 16,
        fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700,
        fontSize: big ? 'clamp(28px, 3.4vw, 48px)' : 'clamp(18px, 2vw, 24px)',
        color: C.ink, letterSpacing: '-0.03em', lineHeight: 1.02,
        textTransform: 'uppercase', maxWidth: '78%',
      }}>{v.title}</div>
      <div style={{
        position: 'absolute', bottom: 10, left: big ? 22 : 16, fontSize: 9,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: isB ? 'rgba(40,40,44,0.55)' : C.faint,
      }}>SGNAOLIN · {v.id}</div>
    </div>
  );
}

/* ════════ 02 OBJECTS ════════ */
function ObjectsModule({ lang }) {
  const L = I18N[lang];
  if (!OBJECTS.length) {
    return (
      <div>
        <ModuleHeader id="02" title={L.modules['02'].label} sub={L.objects.sub}/>
        <EmptyModuleState
          icon="□"
          title={lang === 'it' ? 'STL · in arrivo.' : 'STL · incoming.'}
          body={lang === 'it'
            ? 'Questa sezione ospiterà i modelli 3D stampati e i file STL pubblici, in stile scheda Bambu Lab — STL, materiale, setup, tempo di stampa.'
            : 'This section will host 3D-printed models and public STL files in a Bambu-Lab-style sheet — STL, material, setup, print time.'
          }
          hint={lang === 'it' ? 'pull-from sgnaolin/objects-list' : 'pull-from sgnaolin/objects-list'}
        />
      </div>
    );
  }
  return (
    <div>
      <ModuleHeader id="02" title={L.modules['02'].label} sub={L.objects.sub}/>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 'clamp(10px, 1.2vw, 16px)',
      }}>
        {OBJECTS.map((o, i) => <ObjectCard key={o.id} o={o} L={L} delay={i * 60}/>)}
      </div>
    </div>
  );
}

function ObjectCard({ o, L, delay = 0 }) {
  const [ref, inView] = useInView({ threshold: 0.2 });
  return (
    <article ref={ref} style={{
      background: C.white, border: `0.5px solid ${C.borderSoft}`,
      padding: 'clamp(14px, 1.4vw, 20px)',
      display: 'flex', flexDirection: 'column', gap: 14,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(16px)',
      transition: `opacity 400ms linear ${delay}ms, transform 400ms cubic-bezier(0.2,0,0,1) ${delay}ms`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Label size={9}>{o.id}</Label>
          <div style={{
            fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700,
            fontSize: 20, color: C.ink, letterSpacing: '-0.025em', marginTop: 2,
          }}>{o.name}</div>
        </div>
        <TierBadge tier={o.tier} size={32}/>
      </div>
      <div style={{
        position: 'relative', aspectRatio: '16/10',
        background: C.paper, border: `0.5px solid ${C.borderSoft}`,
      }}>
        <Wireframe/>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <SpecRow k="TYPE" v={o.type}/>
        <SpecRow k="MAT"  v={o.material}/>
        <SpecRow k="SIZE" v={o.size}/>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <Label size={9}>{L.objects.complexity}</Label>
          <Label color={C.ink} size={9}>{o.complexity}/5</Label>
        </div>
        <Bar value={o.complexity * 2} max={10} gold={o.tier === 'S'} active={inView} height={4} delay={delay + 200}/>
      </div>
    </article>
  );
}

function SpecRow({ k, v }) {
  return (
    <div style={{ display: 'flex', gap: 8, fontFamily: 'IBM Plex Mono, monospace', fontSize: 10 }}>
      <span style={{ color: C.faint, width: 44, letterSpacing: '0.14em' }}>{k}</span>
      <span style={{ color: C.ink, fontWeight: 600 }}>{v}</span>
    </div>
  );
}

function Wireframe() {
  return (
    <svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
      <g stroke={C.grey} strokeWidth="0.5" fill="none">
        <rect x="50" y="30" width="100" height="70"/>
        <rect x="70" y="14" width="100" height="70"/>
        <line x1="50" y1="30" x2="70" y2="14"/>
        <line x1="150" y1="30" x2="170" y2="14"/>
        <line x1="50" y1="100" x2="70" y2="84"/>
        <line x1="150" y1="100" x2="170" y2="84"/>
        <line x1="70" y1="14" x2="170" y2="14" strokeDasharray="1.5 1.5"/>
        <line x1="170" y1="14" x2="170" y2="84" strokeDasharray="1.5 1.5"/>
        <line x1="70" y1="84" x2="170" y2="84" strokeDasharray="1.5 1.5"/>
        <line x1="70" y1="14" x2="70" y2="84" strokeDasharray="1.5 1.5"/>
      </g>
      <g stroke={C.yellow} strokeWidth="0.7" fill="none">
        <circle cx="100" cy="65" r="3"/>
        <line x1="100" y1="65" x2="186" y2="65"/>
      </g>
    </svg>
  );
}

/* ════════ 03 APPS ════════ */
function AppsModule({ lang }) {
  const L = I18N[lang];
  if (!APPS.length) {
    return (
      <div>
        <ModuleHeader id="03" title={L.modules['03'].label} sub={L.apps.sub}/>
        <EmptyModuleState
          icon="△"
          title={lang === 'it' ? 'Android apps · in arrivo.' : 'Android apps · incoming.'}
          body={lang === 'it'
            ? 'Piccoli progetti mobile per Android. Ogni app avrà una scheda con stadio (alpha / beta / release), versione e link Play Store quando disponibile.'
            : 'Small Android mobile projects. Each app will get a sheet with stage (alpha / beta / release), version and Play Store link when available.'
          }
          hint="build playstore@sgnoogle"
        />
      </div>
    );
  }
  return (
    <div>
      <ModuleHeader id="03" title={L.modules['03'].label} sub={L.apps.sub}/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: C.borderSoft, border: `0.5px solid ${C.borderSoft}` }}>
        {APPS.map((a, i) => <AppRow key={a.n} a={a} L={L} delay={i * 60}/>)}
      </div>
    </div>
  );
}

function AppRow({ a, L, delay = 0 }) {
  const [ref, inView] = useInView({ threshold: 0.2 });
  const stageColor = a.stage === 'release' ? C.yellow : C.grey;
  return (
    <div ref={ref} style={{
      background: C.white,
      padding: 'clamp(14px, 1.6vw, 22px) clamp(16px, 1.8vw, 26px)',
      display: 'grid',
      gridTemplateColumns: '44px minmax(0, 2fr) minmax(0, 1.4fr) minmax(0, 1fr)',
      gap: 'clamp(12px, 1.6vw, 22px)', alignItems: 'center',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(12px)',
      transition: `opacity 380ms linear ${delay}ms, transform 380ms cubic-bezier(0.2,0,0,1) ${delay}ms`,
    }} className="sgn-app-row">
      <div style={{
        fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700,
        fontSize: 32, color: C.ink, letterSpacing: '-0.035em', lineHeight: 1,
      }}>{a.n}</div>
      <div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 4 }}>
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700, fontSize: 15, color: C.ink }}>{a.name}</span>
          <Caption>v{a.ver}</Caption>
        </div>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: C.grey, lineHeight: 1.6 }}>{a.desc}</div>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <Label size={9}>{L.apps.stage}</Label>
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', color: stageColor }}>
            {a.stage.toUpperCase()}
          </span>
        </div>
        <Progress value={a.pct} gold={a.stage === 'release'} active={inView} delay={delay + 200}/>
      </div>
      <Label color={C.faint} size={9} style={{ textAlign: 'right' }}>{a.platform}</Label>
    </div>
  );
}

/* ════════ 04 LINK ════════ */
function LinkModule({ lang }) {
  const L = I18N[lang];
  const hasLinks = LINKS.length > 0;
  return (
    <div>
      <ModuleHeader id="04" title={L.modules['04'].label} sub={L.link.sub}/>
      {hasLinks ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 1, background: C.borderSoft, border: `0.5px solid ${C.borderSoft}`,
          marginBottom: 'clamp(20px, 3vh, 32px)',
        }}>
          {LINKS.map((l, i) => <LinkCard key={l.name} l={l} L={L} delay={i * 50}/>)}
        </div>
      ) : (
        <div style={{
          background: C.white, border: `0.5px solid ${C.borderSoft}`,
          padding: 'clamp(28px, 4vw, 48px)',
          marginBottom: 'clamp(16px, 2vh, 24px)',
          display: 'flex', flexDirection: 'column', gap: 18,
          alignItems: 'flex-start',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              width: 6, height: 6, background: C.yellow, display: 'inline-block',
              animation: 'sgnpulse 1.6s linear infinite',
            }}/>
            <Tag color={C.ink} size={10}>OPEN · 3 SLOTS</Tag>
          </div>
          <div style={{
            fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700,
            fontSize: 'clamp(24px, 3vw, 36px)', letterSpacing: '-0.02em',
            color: C.ink, lineHeight: 1.1, margin: 0,
          }}>{lang === 'it' ? 'Cerco i prossimi 3 brand giusti.' : 'Looking for the next 3 right brands.'}</div>
        </div>
      )}

      {/* CONTACT CTA — always visible, the real point of this module. */}
      <div style={{
        background: C.paper, padding: 'clamp(18px, 2vw, 28px)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 16,
        borderLeft: `3px solid ${C.yellow}`,
        borderTop: `0.5px solid ${C.borderSoft}`,
        borderRight: `0.5px solid ${C.borderSoft}`,
        borderBottom: `0.5px solid ${C.borderSoft}`,
      }}>
        <div>
          <Tag color={C.yellow}>+ {L.link.cta}</Tag>
          <div style={{
            fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700,
            fontSize: 'clamp(18px, 2vw, 26px)', color: C.ink,
            letterSpacing: '-0.02em', marginTop: 8,
          }}>hello@sgnoogle.com</div>
        </div>
        <a href="mailto:hello@sgnoogle.com" className="sgn-hot" style={{
          display: 'inline-flex', alignItems: 'stretch', height: 44, background: C.yellow,
          textDecoration: 'none',
        }}>
          <span style={{
            width: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: C.ink, borderRight: '0.5px solid rgba(40,40,44,0.25)', fontSize: 16,
            fontWeight: 700,
          }}>→</span>
          <span style={{
            padding: '0 18px', display: 'flex', alignItems: 'center',
            fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.16em', color: C.ink, textTransform: 'uppercase',
          }}>{lang === 'it' ? 'SCRIVIMI' : 'WRITE ME'}</span>
        </a>
      </div>
    </div>
  );
}

function LinkCard({ l, L, delay = 0 }) {
  const [ref, inView] = useInView({ threshold: 0.2 });
  const isActive = l.status === 'active';
  return (
    <div ref={ref} style={{
      background: C.white, padding: 'clamp(16px, 1.8vw, 24px)',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      minHeight: 140, position: 'relative',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(12px)',
      transition: `opacity 340ms linear ${delay}ms, transform 340ms cubic-bezier(0.2,0,0,1) ${delay}ms`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{
          fontFamily: 'IBM Plex Mono, monospace', fontSize: 9, fontWeight: 700,
          letterSpacing: '0.18em', color: isActive ? C.yellow : C.faint,
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{
            width: 6, height: 6, background: isActive ? C.yellow : 'transparent',
            border: `1px solid ${isActive ? C.yellow : C.grey}`,
          }}/>
          {isActive ? L.link.activeTag : L.link.pastTag}
        </span>
        <Caption>{l.year}</Caption>
      </div>
      <div>
        <div style={{
          fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700,
          fontSize: 'clamp(18px, 1.8vw, 24px)', color: C.ink,
          letterSpacing: '-0.025em', marginBottom: 4, lineHeight: 1.05,
        }}>{l.name}</div>
        <Label color={C.grey} size={9}>{l.cat}</Label>
      </div>
    </div>
  );
}

/* ════════ 05 SELF ════════ */
function SelfModule({ lang }) {
  const L = I18N[lang];
  const [ref, inView] = useInView({ threshold: 0.2 });
  return (
    <div>
      <ModuleHeader id="05" title={L.modules['05'].label} sub={L.self.sub}/>
      <div ref={ref} style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(200px, 280px) minmax(0, 1fr)',
        gap: 'clamp(16px, 2.5vw, 36px)', alignItems: 'start',
      }} className="sgn-self-grid">
        <div style={{
          background: C.white, border: `0.5px solid ${C.borderSoft}`,
          padding: 'clamp(14px, 1.4vw, 20px)',
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          <ProfileCard L={L}/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <Pill k={L.self.classTag} v={L.self.classVal} gold/>
            <Pill k={L.self.origin}    v={L.self.originVal}/>
            <Pill k={L.self.since}     v={L.self.sinceVal}/>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(18px, 3vh, 28px)' }}>
          {/* Compact bio — 2 lines max, not a paragraph */}
          <div style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: 'clamp(16px, 1.6vw, 20px)',
            color: C.ink, lineHeight: 1.45, margin: 0, maxWidth: 580,
            fontWeight: 600, letterSpacing: '-0.005em',
          }}>{L.self.bio}</div>

          <div>
            <Label size={10} style={{ marginBottom: 14, display: 'block' }}>{L.self.skillsLabel}</Label>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'clamp(10px, 1.4vw, 18px)',
            }}>
              {L.skills.map((s, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Label color={C.ink} size={9} style={{ fontWeight: 700 }}>{s.k}</Label>
                    <Label color={s.v >= 9 ? C.yellow : C.ink} size={9} style={{ fontWeight: 700 }}>{s.v}/10</Label>
                  </div>
                  <Bar value={s.v} gold={s.v >= 9} active={inView} delay={i * 60}/>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label size={10} style={{ marginBottom: 12, display: 'block' }}>{L.self.contactLabel}</Label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <Pill k="EMAIL"     v="hello@sgnoogle.com"/>
              <Pill k="YOUTUBE"   v="@sgnoogle"/>
              <Pill k="INSTAGRAM" v="@sgnoogle"/>
              <Pill k="X"         v="@sgnoogle"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ProfileCard — flippable avatar.
   Face A: anime PP (avatar-anime.jpg).
   Face B: real-photo slot, drop-zone placeholder until a real file is wired in.
   Toggle button bottom-right, gamepad-style "Y / SWITCH VIEW". */
function ProfileCard({ L }) {
  const [view, setView] = React.useState('avatar'); // 'avatar' | 'real'
  const flip = () => {
    if (window.sgnTick) window.sgnTick('confirm');
    setView(v => v === 'avatar' ? 'real' : 'avatar');
  };
  const isReal = view === 'real';
  return (
    <div style={{
      position: 'relative', aspectRatio: '1/1',
      perspective: '1200px',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        transformStyle: 'preserve-3d',
        transition: 'transform 540ms cubic-bezier(0.2,0,0,1)',
        transform: isReal ? 'rotateY(180deg)' : 'rotateY(0)',
      }}>
        {/* FACE A — anime */}
        <div style={{
          position: 'absolute', inset: 0, overflow: 'hidden',
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
        }}>
          <img src="../../assets/avatar-anime.jpg" alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
          <ViewBadge label={L.self.viewToggleAvatar} view="A"/>
        </div>
        {/* FACE B — real-photo placeholder slot */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          background: C.paper,
          backgroundImage: `repeating-linear-gradient(45deg,
            ${C.borderSoft} 0 1px, transparent 1px 16px)`,
          border: `0.5px solid ${C.border}`,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 10, padding: 16, textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'IBM Plex Mono, monospace', fontSize: 9,
            letterSpacing: '0.22em', color: C.grey,
          }}>[ REAL · PHOTO ]</div>
          <div style={{
            fontFamily: 'IBM Plex Mono, monospace', fontSize: 9,
            letterSpacing: '0.16em', color: C.faint, lineHeight: 1.6,
          }}>swap-in placeholder<br/>file → assets/avatar-real.jpg</div>
          <ViewBadge label={L.self.viewToggleReal} view="B"/>
        </div>
      </div>
      {/* TOGGLE BUTTON — bottom-right, gamepad-style */}
      <button
        onClick={flip}
        className="sgn-hot"
        title={L.self.viewHint}
        style={{
          position: 'absolute', right: 10, bottom: 10, zIndex: 4,
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: C.ink, color: C.white,
          padding: '7px 9px 7px 7px',
          border: 'none', cursor: 'pointer',
          fontFamily: 'IBM Plex Mono, monospace',
        }}>
        <span style={{
          width: 18, height: 18, display: 'inline-flex',
          alignItems: 'center', justifyContent: 'center',
          background: C.yellow, color: C.ink,
          fontWeight: 700, fontSize: 11, lineHeight: 1,
          fontFamily: 'IBM Plex Mono, monospace',
        }}>Y</span>
        <span style={{ fontSize: 9, letterSpacing: '0.2em', fontWeight: 700 }}>
          {isReal ? L.self.viewToggleAvatar : L.self.viewToggleReal}
        </span>
        {/* tiny arrows */}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, marginLeft: 2 }}>
          <span style={{
            width: 0, height: 0, borderTop: '4px solid transparent',
            borderBottom: '4px solid transparent', borderRight: `5px solid ${C.yellow}`,
          }}/>
          <span style={{
            width: 0, height: 0, borderTop: '4px solid transparent',
            borderBottom: '4px solid transparent', borderLeft: `5px solid ${C.yellow}`,
          }}/>
        </span>
      </button>
    </div>
  );
}

function ViewBadge({ label, view }) {
  return (
    <div style={{
      position: 'absolute', top: 10, left: 10,
      display: 'inline-flex', alignItems: 'stretch', gap: 0,
      background: 'rgba(40,40,44,0.78)', color: '#fff',
      fontFamily: 'IBM Plex Mono, monospace',
    }}>
      <span style={{
        padding: '4px 6px', fontSize: 9, fontWeight: 700,
        letterSpacing: '0.18em', background: C.yellow, color: C.ink,
      }}>{view}</span>
      <span style={{
        padding: '4px 8px', fontSize: 9, fontWeight: 700,
        letterSpacing: '0.22em',
      }}>{label}</span>
    </div>
  );
}

Object.assign(window, { VideoModule, ObjectsModule, AppsModule, LinkModule, SelfModule, ProfileCard });
