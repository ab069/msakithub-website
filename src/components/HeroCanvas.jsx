import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Lightweight "3D Wireframe Core" — a slowly rotating icosahedron.
 * Simplified from an earlier version that also drove orbiting nodes with
 * per-frame BufferGeometry updates and a scroll-scrub scale — both were
 * significant contributors to scroll jank on lower-end devices.
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
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const ACCENT = 0xe63946;

    const group = new THREE.Group();
    const coreGeo = new THREE.IcosahedronGeometry(isMobile ? 1.5 : 2.1, 1);
    const wire = new THREE.LineSegments(
      new THREE.WireframeGeometry(coreGeo),
      new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.55 })
    );
    group.add(wire);

    const inner = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(isMobile ? 0.75 : 1.05, 0)),
      new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.25 })
    );
    group.add(inner);

    scene.add(group);

    let visible = true;
    let raf = 0;
    const clock = new THREE.Clock();

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const dt = clock.getDelta();
      group.rotation.y += 0.15 * dt;
      group.rotation.x += 0.05 * dt;
      renderer.render(scene, camera);
    };

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(mount);

    if (reduce) {
      renderer.render(scene, camera);
    } else {
      frame();
    }
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', onResize);
      coreGeo.dispose();
      renderer.forceContextLoss();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="hero-canvas-root absolute inset-0">
      <div
        ref={mountRef}
        className="absolute inset-y-0 right-0 w-full md:w-[58%] opacity-90"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(110% 75% at 72% 32%, rgba(230,57,70,0.09), transparent 52%), linear-gradient(to bottom, rgba(11,12,16,0.25), rgba(11,12,16,0.88))',
        }}
      />
    </div>
  );
}
