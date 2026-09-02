import { Suspense, useEffect, useRef, useState, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, Preload } from '@react-three/drei';
import * as THREE from 'three';
import { DataCore } from './DataCore';
import { Particles } from './Particles';
import type { DeviceTier } from '../../hooks/useDeviceTier';
import { SceneFallback } from './SceneFallback';

/** Damped camera parallax driven by the pointer. */
function CameraRig({ intensity = 1 }: { intensity?: number }) {
  const { camera } = useThree();

  useFrame((state, delta) => {
    const step = Math.min(delta, 0.1);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, state.pointer.x * 0.8 * intensity, 2.2, step);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, state.pointer.y * 0.45 * intensity, 2.2, step);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/** Fires once the renderer has drawn its first frame. */
function ReadySignal({ onReady }: { onReady?: () => void }) {
  const fired = useRef(false);
  useFrame(() => {
    if (fired.current) return;
    fired.current = true;
    onReady?.();
  });
  return null;
}

type HeroSceneProps = {
  scroll: MutableRefObject<number>;
  tier: DeviceTier;
  labels?: readonly string[];
  onReady?: () => void;
};

export function HeroScene({ scroll, tier, labels = [], onReady }: HeroSceneProps) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Stop rendering entirely once the hero scrolls out of view.
  useEffect(() => {
    const node = wrapper.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (tier === 'none') onReady?.();
  }, [tier, onReady]);

  if (tier === 'none') return <SceneFallback />;

  const simplified = tier === 'low';

  return (
    <div ref={wrapper} className="absolute inset-0">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        eventSource={document.body}
        eventPrefix="client"
        dpr={[1, simplified ? 1.2 : 1.8]}
        camera={{ position: [0, 0, 7.4], fov: 42 }}
        gl={{
          antialias: !simplified,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[6, 4, 6]} intensity={80} color="#4DA6FF" distance={26} decay={2} />
          <pointLight position={[-6, -3, 4]} intensity={60} color="#22D3EE" distance={24} decay={2} />
          <directionalLight position={[0, 6, 4]} intensity={1} color="#DCE7FF" />

          <DataCore scroll={scroll} simplified={simplified} labels={labels} />
          <Particles count={simplified ? 220 : 800} radius={9} />

          <CameraRig intensity={simplified ? 0.35 : 1} />
          <AdaptiveDpr pixelated />
          <Preload all />
          <ReadySignal onReady={onReady} />
        </Suspense>
      </Canvas>
    </div>
  );
}
