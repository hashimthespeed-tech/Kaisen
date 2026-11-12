import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/** A genuine textured GLB with a hinged, keyframed cover. */
export default function ResearchFolio() {
  const stage = useRef<HTMLDivElement>(null);
  const replay = useRef<(() => void) | null>(null);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [finished, setFinished] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '250px 0px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    if (!visible) { setReady(false); setFinished(false); return; }
    if (failed || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let cancelled = false;
    let frame = 0;
    let playing = false;
    let playbackStarted = 0;
    let elapsed = 0;
    let dispose = () => {};

    void (async () => {
      try {
        if (cancelled) return;
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.45;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.domElement.setAttribute('aria-hidden', 'true');
        element.appendChild(renderer.domElement);
        dispose = () => { renderer.dispose(); renderer.domElement.remove(); };

        const scene = new THREE.Scene();
        scene.add(new THREE.HemisphereLight(0xeaf3ff, 0x8e9db0, 2.7));
        const key = new THREE.DirectionalLight(0xfff7ec, 3.2);
        key.position.set(-3, 8, 5);
        key.castShadow = true;
        key.shadow.mapSize.set(512, 512);
        key.shadow.camera.left = -6; key.shadow.camera.right = 6;
        key.shadow.camera.top = 6; key.shadow.camera.bottom = -6;
        key.shadow.bias = -0.0004;
        scene.add(key);
        const rim = new THREE.DirectionalLight(0x9ac5ff, 1.1);
        rim.position.set(4, 5, -3);
        scene.add(rim);
        const shadow = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.ShadowMaterial({ color: 0x1b3257, opacity: 0.28 }));
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.y = 0.01;
        shadow.receiveShadow = true;
        scene.add(shadow);
        const camera = new THREE.OrthographicCamera(-4.9, 4.9, 3.1, -3.1, 0.1, 100);
        camera.position.set(1.4, 6.1, 7.1);
        camera.lookAt(0, 0.2, 0);

        const gltf = await new GLTFLoader().loadAsync('/moment-research-folio.glb');
        if (cancelled) { renderer.dispose(); renderer.domElement.remove(); return; }
        gltf.scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.castShadow = true;
            object.receiveShadow = true;
          }
        });
        scene.add(gltf.scene);
        const mixer = new THREE.AnimationMixer(gltf.scene);
        const clip = gltf.animations[0];
        if (clip) {
          const action = mixer.clipAction(clip);
          action.setLoop(THREE.LoopOnce, 1);
          action.clampWhenFinished = true;
          action.play();
          mixer.setTime(0);
        }
        const frameView = () => {
          const width = element.clientWidth;
          const height = element.clientHeight;
          if (!width || !height) return;
          const aspect = width / height;
          const narrow = width < 600;
          const turn = Math.min(elapsed / (80 / 24), 1);
          const lift = Math.sin(Math.PI * turn);
          const halfHeight = narrow ? (4 + lift * 1.5) / aspect : 2.7 + lift * 1.8;
          camera.left = -halfHeight * aspect;
          camera.right = halfHeight * aspect;
          camera.top = halfHeight;
          camera.bottom = -halfHeight;
          camera.position.set(narrow ? 0.5 : 1.4, 6.1 + lift * 0.5, 7.1 + lift * 0.5);
          camera.lookAt(0, 0.2 + lift * 0.7, 0);
          camera.updateProjectionMatrix();
        };
        const resize = () => {
          renderer.setSize(element.clientWidth, element.clientHeight, false);
          frameView();
          renderer.render(scene, camera);
        };
        const observer = new ResizeObserver(resize);
        observer.observe(element);
        resize();
        setReady(true);
        playing = true;
        playbackStarted = performance.now();
        const tick = (time: number) => {
          if (cancelled || !playing) return;
          elapsed = Math.min(clip?.duration ?? 0, Math.max(0, (time - playbackStarted) / 1000));
          mixer.setTime(elapsed);
          frameView();
          renderer.render(scene, camera);
          if (clip && elapsed >= clip.duration) {
            playing = false;
            setFinished(true);
          } else frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        replay.current = () => {
          cancelAnimationFrame(frame);
          elapsed = 0;
          playbackStarted = performance.now();
          playing = true;
          setFinished(false);
          mixer.setTime(0);
          renderer.render(scene, camera);
          frame = requestAnimationFrame(tick);
        };
        dispose = () => {
          cancelAnimationFrame(frame);
          observer.disconnect();
          renderer.dispose();
          renderer.domElement.remove();
          replay.current = null;
        };
      } catch (error) {
        console.warn('Research folio 3D preview unavailable', error);
        dispose();
        setReady(false);
        setFailed(true);
      }
    })();
    return () => { cancelled = true; dispose(); };
  }, [visible, failed]);

  return <section className="moment-research" aria-labelledby="moment-research-title">
    <div className="moment-research-heading"><h2 id="moment-research-title">A Company Is More Than a Price.</h2><p>Open a wider view of its earnings, products, and industry before a virtual decision.</p></div>
    <div className="moment-folio-shell">
      <div className="moment-folio-stage" ref={stage} role="img" aria-label="A three-dimensional MOMENT research folio opens to reveal a company overview and earnings research">
        {(!ready || failed) && <picture><source media="(prefers-reduced-motion: reduce)" srcSet="/moment-research-open.webp"/><img src={failed ? '/moment-research-open.webp' : '/moment-research-poster.webp'} alt="" aria-hidden="true" width="1600" height="1050" loading="lazy"/></picture>}
      </div>
      <div className="moment-folio-caption"><span>Explore the evidence</span><span>Illustrative company view</span>{finished && <button type="button" onClick={() => replay.current?.()}>Replay opening</button>}</div>
    </div>
  </section>;
}
