import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * "3D Wireframe Core" — slowly rotating icosahedron in signal orange lines
 * with orbiting glow nodes connected to the core by thin lines.
 *  - idle rotation 0.15 rad/s
 *  - tilts toward the mouse (±12°, lerped — heavy/industrial)
 *  - scales up + fades out as you scroll past the hero (scrub)
 *  - render loop pauses when the hero is off-screen
 */
export default function HeroCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const mount = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 7;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return; // WebGL unavailable — degrade silently
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const ACCENT = 0x7c5cff;
    const ACCENT_SOFT = 0xa78bfa;

    // ── core: wireframe icosahedron ──
    const group = new THREE.Group();
    const coreGeo = new THREE.IcosahedronGeometry(isMobile ? 1.5 : 2.1, 1);
    const wire = new THREE.LineSegments(
      new THREE.WireframeGeometry(coreGeo),
      new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.55 })
    );
    group.add(wire);

    // faint inner core
    const inner = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(isMobile ? 0.75 : 1.05, 0)),
      new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.25 })
    );
    group.add(inner);

    // ── orbiting nodes + connector lines ──
    const nodes = [];
    const nodeMat = new THREE.MeshBasicMaterial({ color: ACCENT });
    const dimMat = new THREE.MeshBasicMaterial({ color: ACCENT_SOFT, transparent: true, opacity: 0.85 });
    const orbits = [
      { r: isMobile ? 2.2 : 3.0, speed: 0.35, phase: 0,   tilt: 0.4,  mat: nodeMat },
      { r: isMobile ? 2.5 : 3.4, speed: -0.25, phase: 2.1, tilt: -0.6, mat: dimMat },
      { r: isMobile ? 2.0 : 2.7, speed: 0.45, phase: 4.2, tilt: 1.1,  mat: nodeMat },
      { r: isMobile ? 2.7 : 3.7, speed: -0.18, phase: 5.5, tilt: 0.2,  mat: dimMat },
    ];
    orbits.forEach((o) => {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), o.mat);
      const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
      const line = new THREE.Line(
        lineGeo,
        new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.22 })
      );
      group.add(mesh);
      group.add(line);
      nodes.push({ ...o, mesh, line });
    });

    scene.add(group);

    // ── bloom-style glow sprite behind the core ──
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = glowCanvas.height = 256;
    const gctx = glowCanvas.getContext('2d');
    const grad = gctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, 'rgba(124,92,255,0.55)');
    grad.addColorStop(0.4, 'rgba(124,92,255,0.18)');
    grad.addColorStop(1, 'rgba(124,92,255,0)');
    gctx.fillStyle = grad;
    gctx.fillRect(0, 0, 256, 256);
    const glowTex = new THREE.CanvasTexture(glowCanvas);
    const glowSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: glowTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    glowSprite.scale.set(isMobile ? 6 : 9, isMobile ? 6 : 9, 1);
    scene.add(glowSprite);

    // ── state ──
    const mouse = { x: 0, y: 0 };
    const tilt = { x: 0, y: 0 };
    const MAX_TILT = (12 * Math.PI) / 180;
    let visible = true;
    let raf = 0;
    let t = 0;
    const clock = new THREE.Clock();

    function frame() {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const dt = clock.getDelta();
      t += dt;

      // idle rotation 0.15 rad/s
      group.rotation.y += 0.15 * dt;
      group.rotation.x += 0.05 * dt;

      // heavy lerped mouse tilt (desktop only)
      if (!isMobile) {
        tilt.x += (mouse.y * MAX_TILT - tilt.x) * 0.04;
        tilt.y += (mouse.x * MAX_TILT - tilt.y) * 0.04;
        group.rotation.x += tilt.x * 0.02;
        group.rotation.y += tilt.y * 0.02;
      }

      // orbit nodes + update connector lines
      nodes.forEach((n) => {
        const a = t * n.speed + n.phase;
        const x = Math.cos(a) * n.r;
        const z = Math.sin(a) * n.r;
        const y = Math.sin(a + n.tilt) * n.r * 0.35;
        n.mesh.position.set(x, y, z);
        const pos = n.line.geometry.attributes.position.array;
        pos[0] = 0; pos[1] = 0; pos[2] = 0;
        pos[3] = x; pos[4] = y; pos[5] = z;
        n.line.geometry.attributes.position.needsUpdate = true;
      });

      renderer.render(scene, camera);
    }

    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    // pause when hero is off-screen
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(mount);

    // scroll-out: scale up + fade — "flying through it"
    let st;
    if (!reduce) {
      st = gsap.to(group.scale, {
        x: 2.6, y: 2.6, z: 2.6,
        ease: 'none',
        scrollTrigger: {
          trigger: mount,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            mount.style.opacity = String(1 - self.progress * 0.95);
          },
        },
      });
    }

    if (reduce) {
      renderer.render(scene, camera);
    } else {
      frame();
      window.addEventListener('mousemove', onMove);
    }
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      if (st && st.scrollTrigger) st.scrollTrigger.kill();
      if (st) st.kill();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      coreGeo.dispose();
      // forceContextLoss releases the GPU context immediately so the next
      // mount (HMR or React re-render) can acquire a fresh one without
      // hitting the browser's "context loss blocked" guard.
      renderer.forceContextLoss();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="hero-canvas-root absolute inset-0">
      {/* 3D core sits right / background */}
      <div
        ref={mountRef}
        className="absolute inset-y-0 right-0 w-full md:w-[58%] opacity-90"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(110% 75% at 72% 32%, rgba(124,92,255,0.09), transparent 52%), linear-gradient(to bottom, rgba(11,12,16,0.25), rgba(11,12,16,0.88))',
        }}
      />
    </div>
  );
}
