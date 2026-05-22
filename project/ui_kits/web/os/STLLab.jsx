/* STLLab — 3D viewer for OBJECTS module.
   Phase 1 (now): no real STL files yet — shows the F monogram extruded as
   a sample model so the viewer feels alive. Drag to orbit, slow auto-spin.
   Phase 2 (when user provides .stl files): swap the F monogram for a
   THREE.STLLoader fetch and render the same way.

   Uses Three.js via UMD CDN (window.THREE). Falls back gracefully if THREE
   isn't loaded — renders a placeholder rect with a note. */

function STLLab({ lang }) {
  const mountRef = React.useRef(null);
  const stateRef = React.useRef(null);
  const [ready, setReady] = React.useState(typeof window !== 'undefined' && !!window.THREE);

  // Wait for THREE to load if the script hasn't finished yet
  React.useEffect(() => {
    if (ready) return undefined;
    let cancelled = false;
    const t = setInterval(() => {
      if (cancelled) return;
      if (window.THREE) { setReady(true); clearInterval(t); }
    }, 80);
    return () => { cancelled = true; clearInterval(t); };
  }, [ready]);

  React.useEffect(() => {
    if (!ready || !mountRef.current) return undefined;
    const THREE = window.THREE;
    const el = mountRef.current;
    const w = el.clientWidth;
    const h = el.clientHeight;

    // ── Scene ──
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF0F1F2);

    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 2000);
    camera.position.set(0, 0, 360);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(w, h);
    el.appendChild(renderer.domElement);

    // Lighting — soft front + grazing fill to read the wireframe shoulders
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(80, 120, 200);
    scene.add(dir);

    // ── Build the F monogram by extruding the 3 brand-mark polygons.
    // Coordinates lifted from assets/logo-mark.svg verbatim — the source of
    // truth for the brand mark — so the 3D viewer stays in lockstep if the
    // SVG ever updates (y is inverted because SVG y goes down, 3D y goes up).
    function buildFMonogram() {
      const polys = [
        [[51.44, 100.64], [154.75, 100.64], [0, 201.44]],
        [[102.79, 0], [206.1, 0], [51.35, 100.8]],
        [[84.44, 0], [33, 100.8], [8.4, 100.8], [59.83, 0]],
      ];
      const group = new THREE.Group();
      const fillMat = new THREE.MeshLambertMaterial({ color: 0xFFC200 });
      const edgeMat = new THREE.LineBasicMaterial({ color: 0x28282C, linewidth: 1 });

      polys.forEach((pts) => {
        const shape = new THREE.Shape();
        shape.moveTo(pts[0][0], -pts[0][1]);
        pts.slice(1).forEach(p => shape.lineTo(p[0], -p[1]));
        shape.closePath();

        const geom = new THREE.ExtrudeGeometry(shape, {
          depth: 32, bevelEnabled: false,
        });
        // Cap the front/back faces only — sides stay solid, edges drawn separately
        group.add(new THREE.Mesh(geom, fillMat));

        // Ink wireframe edges over the top
        const edges = new THREE.EdgesGeometry(geom, 1);
        group.add(new THREE.LineSegments(edges, edgeMat));
      });

      // Center the group around its bbox
      const box = new THREE.Box3().setFromObject(group);
      const center = box.getCenter(new THREE.Vector3());
      group.position.sub(center);
      // Fit the camera by scaling the model to ~180 units max dim
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const target = 180;
      const k = target / maxDim;
      group.scale.setScalar(k);
      return group;
    }

    const model = buildFMonogram();
    scene.add(model);

    // Subtle grid floor — gives the depth read without a full studio set
    const grid = new THREE.GridHelper(400, 20, 0x787A7C, 0xC7C8C9);
    grid.material.opacity = 0.12;
    grid.material.transparent = true;
    grid.position.y = -110;
    scene.add(grid);

    // ── Interaction: drag-to-orbit (no OrbitControls dep) + auto-rotate
    let rotX = -0.25, rotY = 0.3;
    let autoSpin = true;
    let dragging = false, dragSx = 0, dragSy = 0, dragRx = 0, dragRy = 0;

    const onDown = (e) => {
      dragging = true;
      autoSpin = false;
      const p = e.touches ? e.touches[0] : e;
      dragSx = p.clientX; dragSy = p.clientY;
      dragRx = rotX;      dragRy = rotY;
    };
    const onMove = (e) => {
      if (!dragging) return;
      const p = e.touches ? e.touches[0] : e;
      const dx = p.clientX - dragSx;
      const dy = p.clientY - dragSy;
      rotY = dragRy + dx * 0.01;
      rotX = Math.max(-1.2, Math.min(1.2, dragRx + dy * 0.01));
    };
    const onUp = () => { dragging = false; };

    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup',   onUp);

    // ── Animation loop
    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (autoSpin) rotY += 0.0035;
      model.rotation.x = rotX;
      model.rotation.y = rotY;
      renderer.render(scene, camera);
    };
    tick();

    // ── Resize
    const onResize = () => {
      const W = el.clientWidth, H = el.clientHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(el);

    stateRef.current = { scene, renderer, model };

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup',   onUp);
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, [ready]);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(300px, 1.4fr) minmax(0, 1fr)',
      gap: 'clamp(12px, 1.5vw, 22px)',
      alignItems: 'stretch',
    }} className="sgn-stl-grid">
      {/* Viewer */}
      <div style={{
        position: 'relative',
        background: C.paper,
        border: `0.5px solid ${C.border}`,
        minHeight: 360,
        aspectRatio: '4/3',
      }}>
        <div ref={mountRef} style={{
          position: 'absolute', inset: 0,
          touchAction: 'none', cursor: 'grab',
        }}/>
        {!ready && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, letterSpacing: '0.22em', color: C.faint,
          }}>LOADING · THREE.JS</div>
        )}
        {/* HUD readouts in the corners — like a 3D software viewport */}
        <div style={{
          position: 'absolute', top: 10, left: 10,
          display: 'inline-flex', alignItems: 'stretch',
          fontFamily: 'IBM Plex Mono, monospace',
        }}>
          <span style={{
            padding: '3px 6px', background: C.yellow, color: C.ink,
            fontSize: 9, letterSpacing: '0.22em', fontWeight: 700,
          }}>STL · LAB</span>
          <span style={{
            padding: '3px 8px', background: C.white, color: C.grey,
            fontSize: 9, letterSpacing: '0.18em',
            border: `0.5px solid ${C.borderSoft}`, borderLeft: 'none',
          }}>SAMPLE · F-MARK</span>
        </div>
        <div style={{
          position: 'absolute', bottom: 10, right: 10,
          fontSize: 9, letterSpacing: '0.2em', color: C.faint,
          fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600,
        }}>{lang === 'it' ? 'TRASCINA PER RUOTARE' : 'DRAG TO ROTATE'}</div>
      </div>

      {/* Side panel — STL list / metadata.
          Currently empty (no real files); shows the schema we'll fill. */}
      <div style={{
        background: C.white,
        border: `0.5px solid ${C.borderSoft}`,
        padding: 'clamp(16px, 2vw, 24px)',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        <div>
          <Label size={9} color={C.faint} style={{ display: 'block', marginBottom: 6 }}>
            CURRENT
          </Label>
          <div style={{
            fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700,
            fontSize: 'clamp(18px, 2vw, 22px)', letterSpacing: '-0.02em',
            color: C.ink,
          }}>F-monogram <span style={{ color: C.grey, fontWeight: 400 }}>.stl</span></div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <StlSpec k="VERTS"  v="9" />
          <StlSpec k="FACES"  v="3 polys" />
          <StlSpec k="UNITS"  v="mm (1:1)" />
          <StlSpec k="MAT"    v="PLA · Bambu A1" />
          <StlSpec k="SETUP"  v="0.16mm · 15% infill" />
        </div>

        <div style={{
          marginTop: 'auto',
          padding: '12px 14px',
          background: C.paper, borderLeft: `3px solid ${C.yellow}`,
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 11, color: C.grey, lineHeight: 1.6,
        }}>
          {lang === 'it'
            ? 'Lista STL reali in arrivo. Per ora il viewer mostra il monogramma F come sample.'
            : 'Real STL list incoming. For now the viewer shows the F monogram as a sample.'}
        </div>
      </div>
    </div>
  );
}

function StlSpec({ k, v }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '60px 1fr',
      gap: 10, fontSize: 10,
      fontFamily: 'IBM Plex Mono, monospace',
      paddingBottom: 6,
      borderBottom: `0.5px dashed rgba(120,122,124,0.18)`,
    }}>
      <span style={{ color: C.faint, letterSpacing: '0.18em', fontWeight: 600 }}>{k}</span>
      <span style={{ color: C.ink, fontWeight: 700 }}>{v}</span>
    </div>
  );
}

Object.assign(window, { STLLab, StlSpec });
