import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

type ParticlesProps = {
  count?: number;
  /** Radius of the sphere the points are scattered inside. */
  radius?: number;
  color?: string;
  size?: number;
  opacity?: number;
};

/**
 * A single draw call of drifting points. The whole cloud rotates rather than
 * each point being updated on the CPU, which keeps this effectively free.
 */
export function Particles({
  count = 900,
  radius = 9,
  color = '#8FA6D8',
  size = 0.028,
  opacity = 0.75,
}: ParticlesProps) {
  const group = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      // Even-ish distribution in a shell, biased outward so the centre stays clear.
      const r = radius * (0.45 + Math.random() * 0.55);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      array[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      array[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      array[i * 3 + 2] = r * Math.cos(phi);
    }
    return array;
  }, [count, radius]);

  useFrame((state, delta) => {
    if (!group.current) return;
    const step = Math.min(delta, 0.1);
    group.current.rotation.y += step * 0.018;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.06;
  });

  return (
    <Points ref={group} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={size}
        sizeAttenuation
        depthWrite={false}
        opacity={opacity}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}
