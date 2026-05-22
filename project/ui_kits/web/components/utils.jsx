/* Shared UI Kit helpers — kit-wide style primitives.
   Export to window so each Babel script sees them. */

const C = {
  yellow: '#FFC200',
  paper:  '#F0F1F2',
  grey:   '#787A7C',
  ink:    '#28282C',
  white:  '#FFFFFF',
  borderSoft: 'rgba(120,122,124,0.2)',
  border: 'rgba(120,122,124,0.3)',
  borderHair: 'rgba(120,122,124,0.15)',
  faint: 'rgba(120,122,124,0.5)',
};

const grainBg = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")";

function GrainOverlay({ opacity = 0.04, zIndex = 1 }) {
  return (
    <span aria-hidden style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', zIndex,
      backgroundImage: grainBg, opacity
    }}/>
  );
}

function Tag({ children, color = C.yellow, style }) {
  return (
    <span style={{
      fontFamily: 'IBM Plex Mono, monospace',
      fontSize: 10, fontWeight: 700,
      letterSpacing: '0.18em', textTransform: 'uppercase',
      color, ...style
    }}>{children}</span>
  );
}

function Label({ children, color = C.grey, style }) {
  return (
    <span style={{
      fontFamily: 'IBM Plex Mono, monospace',
      fontSize: 10, fontWeight: 600,
      letterSpacing: '0.14em', textTransform: 'uppercase',
      color, ...style
    }}>{children}</span>
  );
}

function Caption({ children, style }) {
  return (
    <span style={{
      fontFamily: 'IBM Plex Mono, monospace',
      fontSize: 10, fontWeight: 300,
      letterSpacing: '0.06em', color: C.faint, ...style
    }}>{children}</span>
  );
}

function Divider({ vertical, color = C.borderSoft, style }) {
  return (
    <span style={{
      display: 'block',
      [vertical ? 'width' : 'height']: '0.5px',
      [vertical ? 'height' : 'width']: '100%',
      background: color, ...style
    }}/>
  );
}

Object.assign(window, { C, grainBg, GrainOverlay, Tag, Label, Caption, Divider });
