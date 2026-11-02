import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export type SceneKind = "sculpture" | "decision" | "world";
type Props = {
  kind: SceneKind;
  selection?: number;
  frozen?: boolean;
  turn?: number;
};
const mint = 0x98f5ce;

export default function ConceptScene({
  kind,
  selection = 0,
  frozen = false,
  turn = 0,
}: Props) {
  const host = useRef<HTMLDivElement>(null);
  const current = useRef({ selection, frozen, turn });
  const redraw = useRef<() => void>(() => {});
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    current.current = { selection, frozen, turn };
    redraw.current();
  }, [selection, frozen, turn]);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = kind === "world" ? 0.95 : 1.1;
    element.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    const group = new THREE.Group();
    scene.add(group);
    scene.add(new THREE.HemisphereLight(0xd9fff0, 0x082f27, 2.8));
    const key = new THREE.DirectionalLight(0xe7fff3, 5);
    key.position.set(-4, 6, 5);
    scene.add(key);
    if (kind === "world") {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      Object.assign(key.shadow.camera, {
        left: -6,
        right: 6,
        top: 6,
        bottom: -6,
        near: 0.1,
        far: 25,
      });
      key.shadow.bias = -0.0005;
      key.shadow.normalBias = 0.04;
    }
    const rim = new THREE.DirectionalLight(0x41dba0, 5);
    rim.position.set(5, 1, -3);
    scene.add(rim);
    const fill = new THREE.PointLight(0xaaffd7, 45);
    fill.position.set(0, -1, 4);
    scene.add(fill);
    // An original procedural studio environment, without downloaded art or textures.
    const studio = new THREE.Scene();
    studio.background = new THREE.Color(0x082b23);
    const panelGeo = new THREE.PlaneGeometry(8, 5);
    const panelMaterial = new THREE.MeshBasicMaterial({
      color: 0xd0ffe7,
      side: THREE.DoubleSide,
    });
    for (const position of [
      [-5, 4, 2],
      [4, 2, 1],
      [0, 4, -5],
    ]) {
      const panel = new THREE.Mesh(panelGeo, panelMaterial);
      panel.position.set(...(position as [number, number, number]));
      panel.lookAt(0, 0, 0);
      studio.add(panel);
    }
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(studio, 0.15);
    scene.environment = env.texture;
    pmrem.dispose();
    panelGeo.dispose();
    panelMaterial.dispose();
    const emerald = new THREE.MeshPhysicalMaterial({
      color: 0x218b66,
      metalness: 0.65,
      roughness: 0.22,
      clearcoat: 1,
      clearcoatRoughness: 0.16,
    });
    const pale = new THREE.MeshStandardMaterial({
      color: 0xc5f2d9,
      metalness: 0.25,
      roughness: 0.32,
    });
    const deep = new THREE.MeshStandardMaterial({
      color: 0x135342,
      roughness: 0.5,
    });
    const glow = new THREE.MeshStandardMaterial({
      color: mint,
      emissive: mint,
      emissiveIntensity: 1.2,
      roughness: 0.3,
    });
    const curves: THREE.CatmullRomCurve3[] = [];
    const particles: THREE.Mesh[] = [];
    const buildings: THREE.Group[] = [];
    const links: THREE.Mesh[] = [];
    const points = [
      [-2.7, -0.1],
      [-1.2, -1.65],
      [1.25, -1.5],
      [2.65, 0.4],
      [0.9, 1.9],
      [-1.5, 1.6],
    ];
    const tube = (
      curve: THREE.CatmullRomCurve3,
      radius: number,
      material: THREE.Material,
    ) => {
      const mesh = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 90, radius, 8, false),
        material,
      );
      group.add(mesh);
      return mesh;
    };
    if (kind === "sculpture") {
      // Twisting ribbons join and diverge, the material metaphor for choices.
      for (let j = 0; j < 13; j++) {
        const vertices: number[] = [];
        const indices: number[] = [];
        for (let i = 0; i <= 160; i++) {
          const t = (i / 160) * Math.PI * 2;
          const radius = 1.8 + 0.38 * Math.sin(3 * t + j * 0.09);
          const x = Math.cos(t) * radius;
          const y = Math.sin(t) * 1.65;
          const z = Math.sin(2 * t) * 0.65 + (j - 6) * 0.085;
          const width = 0.055;
          vertices.push(
            x - Math.cos(t) * width,
            y - Math.sin(t) * width,
            z,
            x + Math.cos(t) * width,
            y + Math.sin(t) * width,
            z + 0.035,
          );
          if (i < 160) {
            const n = i * 2;
            indices.push(n, n + 1, n + 2, n + 1, n + 3, n + 2);
          }
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(vertices, 3),
        );
        geometry.setIndex(indices);
        geometry.computeVertexNormals();
        const material = emerald.clone();
        material.side = THREE.DoubleSide;
        material.color.setHSL(0.43, 0.45 + j * 0.02, 0.24 + j * 0.009);
        group.add(new THREE.Mesh(geometry, material));
      }
      group.rotation.z = -0.2;
      camera.position.set(0, 0.25, 6.9);
      camera.lookAt(0, 0, 0);
    } else if (kind === "decision") {
      for (let branch = 0; branch < 2; branch++) {
        for (let i = 0; i < 7; i++) {
          const side = branch === 0 ? -1 : 1;
          const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-5.2, (i - 3) * 0.14, 0),
            new THREE.Vector3(-2, (i - 3) * 0.14, 0.1),
            new THREE.Vector3(0, side * 0.4 + (i - 3) * 0.12, 0),
            new THREE.Vector3(2.2, side * 1.3 + (i - 3) * 0.12, 0.3),
            new THREE.Vector3(5.3, side * 1.3 + (i - 3) * 0.12, 0),
          ]);
          curves.push(curve);
          links.push(tube(curve, 0.018, emerald.clone()));
          const bead = new THREE.Mesh(
            new THREE.SphereGeometry(0.045, 10, 8),
            glow,
          );
          group.add(bead);
          particles.push(bead);
        }
      }
      group.scale.x = 2.3;
      camera.position.set(0, 0, 11.5);
      camera.lookAt(0, 0, 0);
    } else {
      const island = new THREE.Mesh(
        new THREE.CylinderGeometry(4.05, 3.8, 0.18, 72),
        new THREE.MeshStandardMaterial({ color: 0xb9dccc, roughness: 0.75 }),
      );
      island.position.y = -0.12;
      group.add(island);
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(3.95, 0.025, 6, 100),
        deep,
      );
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
      const box = (
        parent: THREE.Group,
        x: number,
        y: number,
        z: number,
        w: number,
        h: number,
        d: number,
        material: THREE.Material,
      ) => {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
        mesh.position.set(x, y + h / 2, z);
        parent.add(mesh);
        return mesh;
      };
      points.forEach(([x, z], index) => {
        const building = new THREE.Group();
        building.position.set(x, 0, z);
        group.add(building);
        buildings.push(building);
        box(building, 0, 0, 0, 1.05, 0.12, 0.85, pale);
        if (index === 0) {
          // Studio tower and luminous inset floors.
          box(building, 0, 0.12, 0, 0.65, 1.6, 0.6, emerald);
          for (let floor = 0; floor < 6; floor++)
            box(
              building,
              0,
              0.25 + floor * 0.22,
              0.305,
              0.5,
              0.035,
              0.015,
              pale,
            );
          box(building, 0, 1.72, 0, 0.75, 0.08, 0.7, pale);
        } else if (index === 1 || index === 5) {
          box(
            building,
            0,
            0.12,
            0,
            0.9,
            0.6,
            0.65,
            index === 1 ? deep : emerald,
          );
          for (let j = 0; j < 3; j++)
            box(building, -0.3 + j * 0.3, 0.73, 0, 0.23, 0.18, 0.66, pale);
          box(building, 0.28, 0.7, -0.18, 0.12, 0.65, 0.12, deep);
        } else if (index === 2) {
          for (let j = 0; j < 3; j++) {
            const panel = box(
              building,
              -0.3 + j * 0.3,
              0.3,
              0,
              0.25,
              0.04,
              0.65,
              emerald,
            );
            panel.rotation.x = -0.35;
            box(building, -0.3 + j * 0.3, 0.12, 0, 0.04, 0.2, 0.04, deep);
          }
          const mast = box(building, 0, 0.12, -0.45, 0.055, 1.4, 0.055, deep);
          for (let j = 0; j < 3; j++) {
            const blade = new THREE.Mesh(
              new THREE.BoxGeometry(0.055, 0.6, 0.045),
              pale,
            );
            blade.position
              .copy(mast.position)
              .add(
                new THREE.Vector3(
                  Math.sin(j * 2.094) * 0.25,
                  0.7 + Math.cos(j * 2.094) * 0.25,
                  0.04,
                ),
              );
            blade.rotation.z = -j * 2.094;
            building.add(blade);
          }
        } else if (index === 3) {
          box(building, 0, 0.12, 0, 0.9, 0.5, 0.6, pale);
          box(building, 0, 0.62, 0, 1, 0.07, 0.7, emerald);
          for (let j = 0; j < 3; j++)
            box(building, -0.29 + j * 0.29, 0.14, 0.31, 0.2, 0.32, 0.02, deep);
        } else {
          box(building, 0, 0.12, 0, 0.8, 0.7, 0.6, emerald);
          box(building, 0, 0.82, 0, 0.95, 0.08, 0.75, pale);
          for (let j = 0; j < 4; j++)
            box(building, -0.33 + j * 0.22, 0.49, 0.37, 0.1, 0.08, 0.25, pale);
        }
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(x, 0.07, z),
          new THREE.Vector3(x * 0.6, 0.1, z * 0.6),
          new THREE.Vector3(0, 0.1, 0),
        ]);
        curves.push(curve);
        links.push(tube(curve, 0.025, deep.clone()));
        const bead = new THREE.Mesh(
          new THREE.SphereGeometry(0.055, 10, 8),
          glow,
        );
        group.add(bead);
        particles.push(bead);
      });
      const center = new THREE.Mesh(
        new THREE.CylinderGeometry(0.38, 0.38, 0.12, 32),
        emerald,
      );
      center.position.y = 0.08;
      group.add(center);
      group.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.castShadow = true;
          object.receiveShadow = true;
        }
      });
      const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(30, 30),
        new THREE.ShadowMaterial({ opacity: 0.16 }),
      );
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = -0.25;
      shadow.receiveShadow = true;
      scene.add(shadow);
      camera.position.set(6.2, 6.5, 7.6);
      camera.lookAt(0, 0.2, 0);
    }
    let width = 1,
      height = 1,
      frame = 0,
      clock = 0,
      last = 0,
      visible = true,
      stopped = false;
    let pointerX = 0,
      pointerY = 0;
    const shell = element.closest(".app-shell");
    const enabled = () =>
      shell?.getAttribute("data-motion") !== "paused" &&
      !document.hidden &&
      visible;
    const render = (now: number) => {
      frame = 0;
      if (stopped) return;
      const moving = enabled();
      if (moving && !current.current.frozen)
        clock += Math.min((now - last) / 1000 || 0, 0.05);
      last = now;
      if (kind === "sculpture") {
        const target =
          Math.sin(clock * 0.18) * 0.45 +
          current.current.turn * 0.65 +
          pointerX * 0.15;
        group.rotation.y = moving
          ? THREE.MathUtils.lerp(group.rotation.y, target, 0.08)
          : target;
        group.rotation.x = Math.sin(clock * 0.13) * 0.13 + pointerY * 0.08;
        group.position.y = Math.sin(clock * 0.4) * 0.06;
      } else if (kind === "world") {
        const target =
          Math.sin(clock * 0.12) * 0.08 + current.current.turn * 0.45;
        group.rotation.y = moving
          ? THREE.MathUtils.lerp(group.rotation.y, target, 0.08)
          : target;
        buildings.forEach((building, index) => {
          const target = index === current.current.selection ? 1.12 : 1;
          building.scale.lerp(
            new THREE.Vector3(target, target, target),
            moving ? 0.09 : 1,
          );
        });
      }
      particles.forEach((particle, index) => {
        const selected =
          kind === "world"
            ? index === current.current.selection
            : Math.floor(index / 7) === current.current.selection;
        particle.visible = selected;
        particle.position.copy(
          curves[index].getPoint((clock * 0.13 + index * 0.137) % 1),
        );
        const material = links[index].material as THREE.MeshStandardMaterial;
        material.color.setHex(selected ? 0x6ddcac : 0x235e4b);
        material.emissive.setHex(selected ? 0x195d43 : 0x000000);
      });
      renderer.render(scene, camera);
      if (moving && !current.current.frozen)
        frame = requestAnimationFrame(render);
    };
    const invalidate = () => {
      if (!frame && !stopped) frame = requestAnimationFrame(render);
    };
    redraw.current = invalidate;
    const resize = new ResizeObserver(() => {
      width = element.clientWidth;
      height = element.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / Math.max(height, 1);
      // Wider field of view on narrow screens keeps the full composition in frame.
      camera.fov =
        width < 600
          ? kind === "world"
            ? 49
            : kind === "decision"
              ? 63
              : 43
          : kind === "world"
            ? 32
            : 35;
      camera.updateProjectionMatrix();
      invalidate();
    });
    resize.observe(element);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      invalidate();
    });
    intersection.observe(element);
    const mutation = new MutationObserver(invalidate);
    if (shell)
      mutation.observe(shell, {
        attributes: true,
        attributeFilter: ["data-motion", "data-page-hidden"],
      });
    const pointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !enabled()) return;
      const rect = element.getBoundingClientRect();
      pointerX = (event.clientX - rect.left) / width - 0.5;
      pointerY = (event.clientY - rect.top) / height - 0.5;
      invalidate();
    };
    element.addEventListener("pointermove", pointer);
    const contextLost = (event: Event) => {
      event.preventDefault();
      stopped = true;
      cancelAnimationFrame(frame);
      setFailed(true);
    };
    renderer.domElement.addEventListener("webglcontextlost", contextLost);
    invalidate();
    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      redraw.current = () => {};
      resize.disconnect();
      intersection.disconnect();
      mutation.disconnect();
      element.removeEventListener("pointermove", pointer);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          for (const material of Array.isArray(object.material)
            ? object.material
            : [object.material])
            material.dispose();
        }
      });
      emerald.dispose();
      pale.dispose();
      deep.dispose();
      glow.dispose();
      env.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [kind]);
  return (
    <div
      className={`concept-scene scene-${kind}`}
      ref={host}
      role="img"
      aria-label={
        kind === "sculpture"
          ? "An original emerald sculpture of interwoven ribbons"
          : kind === "world"
            ? "A miniature fictional world of six connected businesses"
            : "Luminous paths that branch and respond to your choice"
      }
    >
      {failed && (
        <div className="scene-fallback">
          <svg viewBox="0 0 600 300" aria-hidden="true">
            <path
              d="M20 150C150 150 150 30 300 30S450 150 580 150M20 150C150 150 150 270 300 270S450 150 580 150M20 150H580"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <p>Static view · 3D is unavailable in this browser.</p>
        </div>
      )}
    </div>
  );
}
