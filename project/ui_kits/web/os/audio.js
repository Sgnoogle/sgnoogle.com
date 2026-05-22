/* Tiny WebAudio click engine — game-menu style ticks.
   v3.3: distinct hover / click / confirm / back / boot envelopes,
   all much quieter and crisper than the v3.1 beeps. */

(function() {
  let ctx = null;
  let enabled = false;

  function ensureCtx() {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) { ctx = null; }
    }
    return ctx;
  }

  /* Single-note: shaped envelope (attack → quick decay).
     freq: Hz; dur: total seconds; vol: peak amplitude;
     type: oscillator type; bend: ratio to ramp pitch to over dur. */
  function note(ac, { freq, dur, vol, type = 'sine', bend = 0.7, when = 0 }) {
    const start = ac.currentTime + when;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * bend), start + dur);

    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(vol, start + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

    osc.connect(gain).connect(ac.destination);
    osc.start(start);
    osc.stop(start + dur + 0.01);
  }

  function play(seq) {
    if (!enabled) return;
    const ac = ensureCtx();
    if (!ac) return;
    if (ac.state === 'suspended') ac.resume();
    seq.forEach((n) => note(ac, n));
  }

  /* Game-menu vocabulary:
     hover  — very soft high tick when entering a button (UI feedback)
     tick   — firmer click when activating
     confirm — two-note ascending (entering a module / picking a lang)
     back   — two-note descending (leaving a module)
     boot   — sparse low click during the boot bar fill */
  const presets = {
    hover:   [{ freq: 1400, dur: 0.024, vol: 0.032, type: 'sine'     }],
    tick:    [{ freq: 1800, dur: 0.022, vol: 0.035, type: 'triangle' }],
    confirm: [
      { freq: 1100, dur: 0.040, vol: 0.035, type: 'triangle', when: 0     },
      { freq: 1650, dur: 0.060, vol: 0.040, type: 'triangle', when: 0.045 },
    ],
    back: [
      { freq: 800,  dur: 0.040, vol: 0.030, type: 'triangle', when: 0     },
      { freq: 480,  dur: 0.070, vol: 0.035, type: 'triangle', when: 0.045 },
    ],
    boot: [{ freq: 1400, dur: 0.014, vol: 0.018, type: 'sine'     }],
  };

  window.sgnTick = function(kind = 'tick') {
    play(presets[kind] || presets.tick);
  };

  window.sgnAudio = {
    setEnabled(v) { enabled = !!v; },
    isEnabled()   { return enabled; },
  };
})();
