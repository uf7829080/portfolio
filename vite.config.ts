import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Three.js is ~680 kB on its own and loads lazily, so the default warning is noise.
    chunkSizeWarningLimit: 800,
    // Keep the 3D runtime in its own chunk so the first paint stays light.
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei'],
          motion: ['framer-motion', 'gsap'],
        },
      },
    },
  },
});
