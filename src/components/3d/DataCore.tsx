import { useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { NetworkNodes } from './NetworkNodes';

type DataCoreProps = {
  /** Page scroll progress (0–1) read from a ref, so scrolling never re-renders React. */
  scroll: MutableRefObject<number>;
  simplified?: boolean;
  /** Short words that orbit the core — DATA, AI, SQL, ANALYTICS, OPERATIONS. */
  labels?: readonly string[];
};

/** Fixed anchor points for the floating labels, in the core's local space. */
const LABEL_POSITIONS: [number, number, number][] = [
  [2.7, 1.15, 0.4],
  [-2.85, 0.75, -0.3],
  [2.4, -1.3, -0.6],
  [-2.35, -1.35, 0.5],
  [0.15, 2.5, -0.4],
];

/**
 * The signature object: a lit core wrapped in rotating rings and a live
 * network of data nodes. It reacts to the pointer with inertia and recedes
 * as the page scrolls, so the hero hands the screen over to the content.
 */
export function DataCore({ scroll, simplified = false, labels = [] }: DataCoreProps) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const step = Math.min(delta, 0.1);
    const progress = scroll.current;

    if (group.current) {
      const targetY = state.pointer.x * 0.5 + t * 0.1;
      const targetX = -state.pointer.y * 0.3;
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 2.5, step);
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 2.5, step);

      // Scroll pushes the core back and lifts it slightly out of the way.
      group.current.position.z = THREE.MathUtils.damp(group.current.position.z, -progress * 7, 3.5, step);
      group.current.position.y = THREE.MathUtils.damp(group.current.position.y, progress * 1.4, 3.5, step);
      const target = 1 - progress * 0.2;
      group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, target, 3.5, step));
    }

    if (core.current) core.current.rotation.y += step * 0.12;
    if (shell.current) shell.current.rotation.y -= step * 0.2;
    if (ringA.current) {
      ringA.current.rotation.z += step * 0.3;
      ringA.current.rotation.x = 1.25 + Math.sin(t * 0.3) * 0.18;
    }
    if (ringB.current) {
      ringB.current.rotation.z -= step * 0.2;
      ringB.current.rotation.y = Math.cos(t * 0.24) * 0.35;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.16} floatIntensity={0.7} floatingRange={[-0.1, 0.1]}>
      <group ref={group} dispose={null}>
        {/* Solid core */}
        <mesh ref={core}>
          <icosahedronGeometry args={[0.92, 3]} />
          <meshStandardMaterial
            color="#0D1220"
            emissive="#1B3B7A"
            emissiveIntensity={0.7}
            roughness={0.22}
            metalness={0.9}
            flatShading
          />
        </mesh>

        {/* Glowing wire shell around the core */}
        <mesh ref={shell} scale={1.22}>
          <icosahedronGeometry args={[0.92, 1]} />
          <meshBasicMaterial
            color="#4DA6FF"
            wireframe
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Soft inner light */}
        <mesh scale={1.05}>
          <sphereGeometry args={[0.92, 24, 24]} />
          <meshBasicMaterial
            color="#22D3EE"
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* The data network */}
        <NetworkNodes count={simplified ? 12 : 24} radius={2.05} simplified={simplified} />

        {/* Orbit rings */}
        <mesh ref={ringA} rotation={[1.25, 0, 0]}>
          <torusGeometry args={[2.55, 0.006, 8, simplified ? 64 : 140]} />
          <meshBasicMaterial color="#22D3EE" transparent opacity={0.5} />
        </mesh>
        {!simplified && (
          <mesh ref={ringB} rotation={[0.35, 0.5, 0]}>
            <torusGeometry args={[3.05, 0.004, 8, 140]} />
            <meshBasicMaterial color="#7C6CFF" transparent opacity={0.38} />
          </mesh>
        )}

        {/* Floating labels — real 3D children, so they move with the scene */}
        {labels.slice(0, LABEL_POSITIONS.length).map((label, i) => (
          <Html
            key={label}
            position={LABEL_POSITIONS[i]}
            center
            distanceFactor={9}
            zIndexRange={[10, 0]}
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            <span className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-soft backdrop-blur-sm">
              {label}
            </span>
          </Html>
        ))}
      </group>
    </Float>
  );
}
