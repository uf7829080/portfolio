import { useCallback, useState } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Education } from './components/Education';
import { WhatIBring } from './components/WhatIBring';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { useDeviceTier } from './hooks/useDeviceTier';
import { useScrollProgressRef } from './hooks/useSection';

export default function App() {
  const tier = useDeviceTier();
  const scroll = useScrollProgressRef();
  const [sceneReady, setSceneReady] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Stable identity so the 3D scene never re-renders because of this prop.
  const handleSceneReady = useCallback(() => setSceneReady(true), []);
  const handleFinish = useCallback(() => setLoaded(true), []);

  return (
    <div className="grain relative min-h-screen bg-void">
      <LoadingScreen sceneReady={sceneReady} onFinish={handleFinish} />

      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-[13px] focus:text-void"
      >
        Skip to content
      </a>

      <Navbar />

      <main className={loaded ? 'opacity-100 transition-opacity duration-700' : 'opacity-0'}>
        <Hero scroll={scroll} tier={tier} onSceneReady={handleSceneReady} />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Education />
        <WhatIBring />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
