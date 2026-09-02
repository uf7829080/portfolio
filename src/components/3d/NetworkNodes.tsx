import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type NetworkNodesProps = {
  count?: number;
  radius?: number;
  /** Fewer connections and no pulse on low-tier devices. */
  simplified?: boolean;
};

/**
 * A shell of data nodes wired to each other and to the centre — the network
 * half of the data core. Geometry and materials are created once and shared
 * across every node, so this is a handful of draw calls, not one per point.
 */
export function NetworkNodes({ count = 22, radius = 2.15, simplified = false }: NetworkNodesProps) {
  const group = useRef<THREE.Group>(null);
  const nodeRefs = useRef<(THREE.Mesh | null)[]>([]);

  // Fibonacci sphere: even coverage without clustering at the poles.
  const points = useMemo(() => {
    const golden = Math.PI * (3 - Math.sqrt(5));
    return Array.from({ length: count }, (_, i) => {
      const y = 1 - (i / (count - 1)) * 2;
      const ring = Math.sqrt(1 - y * y);
      const theta = golden * i;
      return new THREE.Vector3(Math.cos(theta) * ring, y, Math.sin(theta) * ring).multiplyScalar(radius);
    });
  }, [count, radius]);

  // One geometry holding every connection line.
  const lineGeometry = useMemo(() => {
    const vertices: number[] = [];
    const threshold = radius * (simplified ? 1.0 : 1.25);

    points.forEach((a, i) => {
      // Spoke to the core.
      if (i % 3 === 0) vertices.push(0, 0, 0, a.x, a.y, a.z);

      // Links to nearby nodes only, so the mesh reads as a network not a blob.
      for (let j = i + 1; j < points.length; j += 1) {
        const b = points[j];
        if (a.distanceTo(b) < threshold) {
          vertices.push(a.x, a.y, a.z, b.x, b.y, b.z);
        }
      }
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    return geometry;
  }, [points, radius, simplified]);

  const nodeGeometry = useMemo(() => new THREE.SphereGeometry(0.038, 12, 12), []);
  const nodeMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#7FE7F5', transparent: true, opacity: 0.9 }),
    [],
  );
  const lineMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: '#4DA6FF',
        transparent: true,
        opacity: simplified ? 0.16 : 0.22,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [simplified],
  );

  // Dispose everything created here when the component unmounts.
  useEffect(() => {
    return () => {
      lineGeometry.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      lineMaterial.dispose();
    };
  }, [lineGeometry, nodeGeometry, nodeMaterial, lineMaterial]);

  useFrame((state, delta) => {
    const step = Math.min(delta, 0.1);
    if (group.current) group.current.rotation.y += step * 0.075;
    if (simplified) return;

    // Nodes breathe out of phase, like traffic on the network.
    const t = state.clock.elapsedTime;
    nodeRefs.current.forEach((node, i) => {
      if (!node) return;
      const scale = 1 + Math.sin(t * 1.6 + i * 0.7) * 0.45;
      node.scale.setScalar(scale);
    });
  });

  return (
    <group ref={group} dispose={null}>
      <lineSegments geometry={lineGeometry} material={lineMaterial} frustumCulled={false} />
      {points.map((point, i) => (
        <mesh
          key={i}
          ref={(node) => {
            nodeRefs.current[i] = node;
          }}
          position={point}
          geometry={nodeGeometry}
          material={nodeMaterial}
        />
      ))}
    </group>
  );
}
