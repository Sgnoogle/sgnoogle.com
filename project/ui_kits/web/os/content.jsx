/* All copy + data + game-style stats. Bilingual IT / EN.
   v3.2: terminal-OS home, real channel data (67K subs), manifesto,
   live-sync placeholders for YouTube data, android-only apps,
   STL-style objects. */

const BRAND = {
  os: 'SGN-OS',
  domain: 'SGNOOGLE.COM',
  product: 'SGNOOGLE',
  handle: '@sgnoogle',
  version: 'v3.2',
};

/* Real channel data the user confirmed. Other figures stay "—" until
   we wire a YouTube data fetch, so we never display invented numbers. */
const CHANNEL = {
  subs:    { value: 67000, fmt: 'short',  source: 'manual',     synced: true  },
  videos:  { value: null,                  source: 'youtube-api', synced: false },
  hours:   { value: null,                  source: 'youtube-api', synced: false },
  startYear: 2019,
};

const I18N = {
  it: {
    nav: { back: 'INDIETRO', main: 'INDICE' },
    hero: {
      role: 'TECH CREATOR · IT',
      manifestoLines: [
        'I CREATOR CREANO.',
        'È quello che fanno, è quello che siamo.',
        'Sgnoogle è il canale che spinge te a iniziare.',
      ],
      cta: 'PREMI UN MODULO PER ENTRARE',
      hint: 'Q · QUIT · ESC · BACK · 1-5 · MODULES',
    },
    stats: {
      subs: 'ISCRITTI',
      videos: 'VIDEO',
      hours: 'ORE VIS.',
      years: 'ANNI',
      pending: 'SYNC',
      live: 'LIVE',
    },
    modules: {
      '01': { label: 'VIDEO',   sub: 'YouTube · recensioni · making',  count: 'live' },
      '02': { label: 'OBJECTS', sub: 'Modelli 3D · STL',               count: '—'    },
      '03': { label: 'APPS',    sub: 'Android · mobile',                count: '—'    },
      '04': { label: 'LINK',    sub: 'Sponsor · collaborazioni',        count: '—'    },
      '05': { label: 'SELF',    sub: 'Chi sono · contatti',             count: '01'   },
    },
    video: {
      featured: 'IN PRIMO PIANO',
      sub: 'Feed live da YouTube. Recensioni, opinioni, making.',
      perfLabel: 'VS MEDIA CANALE',
      rating: 'RATING',
      tier: 'TIER',
      syncNote: 'Sincronizzazione automatica con YouTube — in arrivo.',
    },
    objects: {
      sub: 'Stampe 3D e modelli. Schede tipo Bambu — STL · materiale · setup.',
      tier: 'TIER',
      complexity: 'COMPLESSITÀ',
      status: 'STATO',
      pendingNote: 'Lista in arrivo dal team.',
    },
    apps: {
      sub: 'App mobile, principalmente Android. Ogni progetto ha una scheda.',
      stage: 'FASE',
      platform: 'PIATTAFORMA',
      version: 'VER',
      pendingNote: 'Lista in arrivo dal team.',
    },
    link: {
      sub: 'Brand con cui ho lavorato. Solo prodotti che uso davvero.',
      activeTag: 'ATTIVA',
      pastTag:   'CHIUSA',
      cta: 'COLLABORA CON ME',
      pendingNote: 'Elenco completo in aggiornamento.',
      pitchBody: 'Cerco brand che producono cose vere e accettano review oneste. Niente paid reads scriptate, niente integrazioni travestite.',
    },
    self: {
      sub: 'Chi sono, come lavoro, dove trovarmi.',
      classTag: 'CLASSE',
      classVal: 'TECH CREATOR',
      origin: 'BASE',
      originVal: 'ITALIA',
      since: 'DAL',
      sinceVal: String(CHANNEL.startYear),
      skillsLabel: 'SKILL TREE',
      contactLabel: 'CONTATTI',
      bio: 'Recensioni e making in italiano dal 2019. Studio minimal, monitor gialli, telaio metallico. Niente bounce, niente filler. Solo quello che serve, ben fatto.',
      viewToggleAvatar: 'AVATAR',
      viewToggleReal:   'REAL',
      viewHint:         'PREMI PER RUOTARE',
    },
    skills: [
      { k: 'COMUNICAZIONE', v: 9 },
      { k: 'EDITING',       v: 8 },
      { k: 'ON-CAMERA',     v: 8 },
      { k: '3D / CAD',      v: 7 },
      { k: 'CODE',          v: 6 },
    ],
    boot: {
      title: 'BOOTING ' + BRAND.os,
      ready: 'READY',
      hint:  'PREMI PER ENTRARE',
      steps: [
        'init.kernel',
        'mount /sgnoogle',
        'load.fonts · ibm_plex',
        'render.modules · 05',
        'sync.feed · youtube',
        'ready',
      ],
    },
    langMenu: {
      title:   'SELECT LANGUAGE',
      sub:     'Tutto il sito ricarica in {LANG}',
      confirm: 'CONFERMA',
      cancel:  'ANNULLA',
      flagIt:  'ITALIANO',
      flagEn:  'ENGLISH',
    },
    /* terminal-style log lines shown on the idle screen.
       Keep them feeling like a real system log: monospace, timestamps,
       short. The most recent N show; older ones fade. */
    sessionLog: [
      { t: '00:00', k: 'sys',   m: 'sgn-os boot · session opened' },
      { t: '00:01', k: 'ok',    m: 'channel sync · 67k subs · @sgnoogle' },
      { t: '00:02', k: 'info',  m: 'modules ready · 01–05' },
      { t: '00:03', k: 'hint',  m: 'press 1–5 to enter · esc to return' },
    ],
  },
  en: {
    nav: { back: 'BACK', main: 'INDEX' },
    hero: {
      role: 'TECH CREATOR · IT',
      manifestoLines: [
        'CREATORS ARE GOING TO CREATE.',
        'It\'s what they do, it\'s what we are.',
        'Sgnoogle is the channel pushing you to start.',
      ],
      cta: 'TAP A MODULE TO ENTER',
      hint: 'Q · QUIT · ESC · BACK · 1-5 · MODULES',
    },
    stats: {
      subs: 'SUBS',
      videos: 'VIDEOS',
      hours: 'WATCH HRS',
      years: 'YEARS',
      pending: 'SYNC',
      live: 'LIVE',
    },
    modules: {
      '01': { label: 'VIDEO',   sub: 'YouTube · reviews · making',  count: 'live' },
      '02': { label: 'OBJECTS', sub: '3D models · STL',             count: '—'    },
      '03': { label: 'APPS',    sub: 'Android · mobile',             count: '—'    },
      '04': { label: 'LINK',    sub: 'Sponsors · collabs',           count: '—'    },
      '05': { label: 'SELF',    sub: 'About · contact',              count: '01'   },
    },
    video: {
      featured: 'FEATURED',
      sub: 'Live YouTube feed. Reviews, opinions, making.',
      perfLabel: 'VS CHANNEL AVG',
      rating: 'RATING',
      tier: 'TIER',
      syncNote: 'Auto-sync with YouTube — coming.',
    },
    objects: {
      sub: '3D printed and modeled. Bambu-style sheets — STL · material · setup.',
      tier: 'TIER',
      complexity: 'COMPLEXITY',
      status: 'STATUS',
      pendingNote: 'List incoming.',
    },
    apps: {
      sub: 'Mobile apps, mostly Android. Each project gets a sheet.',
      stage: 'STAGE',
      platform: 'PLATFORM',
      version: 'VER',
      pendingNote: 'List incoming.',
    },
    link: {
      sub: 'Brands I work with. Only products I actually use.',
      activeTag: 'ACTIVE',
      pastTag:   'CLOSED',
      cta: 'WORK WITH ME',
      pendingNote: 'Full roster updating.',
      pitchBody: 'I work with brands that make real things and accept honest reviews. No scripted paid reads, no disguised integrations.',
    },
    self: {
      sub: 'Who I am, how I work, where to find me.',
      classTag: 'CLASS',
      classVal: 'TECH CREATOR',
      origin: 'BASED',
      originVal: 'ITALY',
      since: 'SINCE',
      sinceVal: String(CHANNEL.startYear),
      skillsLabel: 'SKILL TREE',
      contactLabel: 'CONTACT',
      bio: 'Italian reviews and making since 2019. Minimal studio, yellow monitors, metal ceiling rig. No bounce, no filler. Only what\'s needed, done well.',
      viewToggleAvatar: 'AVATAR',
      viewToggleReal:   'REAL',
      viewHint:         'PRESS TO ROTATE',
    },
    skills: [
      { k: 'COMMUNICATION', v: 9 },
      { k: 'EDITING',       v: 8 },
      { k: 'ON-CAMERA',     v: 8 },
      { k: '3D / CAD',      v: 7 },
      { k: 'CODE',          v: 6 },
    ],
    boot: {
      title: 'BOOTING ' + BRAND.os,
      ready: 'READY',
      hint:  'PRESS TO ENTER',
      steps: [
        'init.kernel',
        'mount /sgnoogle',
        'load.fonts · ibm_plex',
        'render.modules · 05',
        'sync.feed · youtube',
        'ready',
      ],
    },
    langMenu: {
      title:   'SELECT LANGUAGE',
      sub:     'The whole site reloads in {LANG}',
      confirm: 'CONFIRM',
      cancel:  'CANCEL',
      flagIt:  'ITALIANO',
      flagEn:  'ENGLISH',
    },
    sessionLog: [
      { t: '00:00', k: 'sys',   m: 'sgn-os boot · session opened' },
      { t: '00:01', k: 'ok',    m: 'channel sync · 67k subs · @sgnoogle' },
      { t: '00:02', k: 'info',  m: 'modules ready · 01–05' },
      { t: '00:03', k: 'hint',  m: 'press 1–5 to enter · esc to return' },
    ],
  },
};

/* CHANGELOG — visible on the idle home. Real changes to the SITE, not videos.
   Show 5 most recent. ISO date · scope · summary. */
const CHANGELOG = [
  { d: '2026-05-21', s: 'home',  m: 'redesign · terminal layout' },
  { d: '2026-05-20', s: 'feel',  m: 'sound · crosshair · boot sequence' },
  { d: '2026-05-19', s: 'i18n',  m: 'language menu · IT/EN' },
  { d: '2026-05-18', s: 'self',  m: 'profile · avatar / real toggle' },
  { d: '2026-05-17', s: 'core',  m: 'sgn-os shell · 5 modules' },
];

/* VIDEOS — placeholder feed; will be replaced by YouTube API later.
   Shown with a "pending sync" banner so it's clear these are samples. */
const VIDEOS = [
  // Placeholder YouTube ID for the featured slot — a public Creative-Commons
  // looping video. Swap with the real "latest video" from the channel sync.
  { id: '01', title: '2 ANNI DOPO',         cat: 'RETROSPECTIVE', tier: 'S', rating: 4.9, perf: 154, duration: '08:47', views: '127K', date: '12.05.26', kind: 'A',
    youtubeId: 'aqz-KE-bpKQ' /* Big Buck Bunny — CC, safe placeholder */ },
  { id: '02', title: '€ 1.299 TROPPO?',     cat: 'REVIEW',        tier: 'A', rating: 4.6, perf: 108, duration: '12:04', views: '84K',  date: '03.05.26', kind: 'B' },
  { id: '03', title: 'ASPETTA A COMPRARLO', cat: 'OPINION',       tier: 'S', rating: 4.8, perf: 198, duration: '14:32', views: '212K', date: '24.04.26', kind: 'A' },
  { id: '04', title: 'iPHONE O ANDROID',    cat: 'COMPARISON',    tier: 'A', rating: 4.5, perf: 96,  duration: '09:18', views: '68K',  date: '17.04.26', kind: 'A' },
];

/* OBJECTS — placeholder STL sheets. Real list incoming. */
const OBJECTS = [];

/* APPS — placeholder Android apps. Real list incoming. */
const APPS = [];

/* LINKS — placeholder sponsors. Real list incoming. */
const LINKS = [];

const HERO_STATS = [
  { id: 'subs',   raw: CHANNEL.subs.value, fmt: 'short' },
];

Object.assign(window, { BRAND, CHANNEL, I18N, VIDEOS, OBJECTS, APPS, LINKS, HERO_STATS, CHANGELOG });
