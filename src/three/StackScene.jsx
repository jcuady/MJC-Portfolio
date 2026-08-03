import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { processLayers } from "../data/profile.jsx";

/**
 * 5-layer process stack — left column, always fully framed (no clip).
 * progressRef.current.p ∈ [0,1] from Hero GSAP scrub.
 */

const N = processLayers.length;

function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}
function smooth(v) {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
}
function range(p, a, b) {
  return smooth((p - a) / Math.max(0.0001, b - a));
}

function accentAt(p, i) {
  const starts = [0.22, 0.36, 0.5, 0.64, 0.78];
  const a = starts[i];
  const peak = a + 0.055;
  const b = a + 0.13;
  if (p < a || p > b) return 0;
  return p < peak ? range(p, a, peak) : 1 - range(p, peak, b);
}

function FrameCamera() {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    const short = size.height < 420 || size.width / Math.max(1, size.height) > 1.55;
    camera.position.set(0, short ? 0.02 : 0.06, short ? 8.6 : 7.5);
    camera.fov = short ? 36 : 32;
    camera.near = 0.1;
    camera.far = 40;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.height, size.width]);
  return null;
}

function Slab({ color, index, progressRef, geo }) {
  const mesh = useRef();
  const mat = useRef();
  const emissive = useMemo(() => new THREE.Color(color), [color]);
  const yBase = index - (N - 1) / 2;
  const side = index % 2 === 0 ? -1 : 1;

  useFrame(({ clock }) => {
    const p = progressRef.current?.p ?? 0;
    const t = clock.getElapsedTime();
    if (!mesh.current) return;

    const unstack = range(p, 0.1, 0.24);
    const spread = 0.2 + unstack * 0.62;
    const accent = accentAt(p, index);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    mesh.current.position.x = accent * side * 0.32;
    mesh.current.position.y =
      yBase * spread +
      accent * 0.08 +
      (reduce ? 0 : Math.sin(t * 0.45 + index) * 0.008 * (1 - accent));
    mesh.current.position.z = accent * 0.18;

    mesh.current.rotation.x = (0.38 - unstack * 0.18) * 0.55;
    mesh.current.rotation.y =
      (reduce ? 0 : t * (0.14 - unstack * 0.08)) + p * Math.PI * 0.18;
    mesh.current.rotation.z = accent * side * -0.045;

    const s = 1 + accent * 0.045;
    mesh.current.scale.set(s, 1 + accent * 0.03, s);

    if (mat.current) {
      mat.current.emissiveIntensity = 0.04 + accent * 0.45;
      mat.current.roughness = 0.52 - accent * 0.16;
    }
  });

  return (
    <mesh ref={mesh} geometry={geo}>
      <meshStandardMaterial
        ref={mat}
        color={color}
        emissive={emissive}
        emissiveIntensity={0.04}
        roughness={0.52}
        metalness={0.08}
      />
    </mesh>
  );
}

function Rig({ progressRef }) {
  const group = useRef();
  // Compact discs — stay inside the left column frame at all orientations
  const geo = useMemo(() => new THREE.CylinderGeometry(0.98, 0.98, 0.2, 40), []);

  useFrame(() => {
    const p = progressRef.current?.p ?? 0;
    if (!group.current) return;
    const unstack = range(p, 0.1, 0.24);
    group.current.rotation.x = 0.28 - unstack * 0.08;
    group.current.rotation.z = Math.sin(p * Math.PI) * -0.03;
    group.current.scale.setScalar(0.88 + unstack * 0.06);
  });

  return (
    <group ref={group}>
      {processLayers.map((l, i) => (
        <Slab key={l.id} color={l.color} index={i} progressRef={progressRef} geo={geo} />
      ))}
    </group>
  );
}

export default function StackScene({ progressRef }) {
  return (
    <Canvas
      dpr={[1, 1.25]}
      camera={{ position: [0, 0.06, 7.5], fov: 32, near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none", width: "100%", height: "100%" }}
      aria-hidden="true"
      resize={{ scroll: false, debounce: { resize: 80, scroll: 0 } }}
    >
      <FrameCamera />
      <ambientLight intensity={0.82} />
      <directionalLight position={[4, 6, 5]} intensity={1.3} />
      <directionalLight position={[-3, -1, -2]} intensity={0.26} color="#c0e3c9" />
      <Rig progressRef={progressRef} />
    </Canvas>
  );
}
