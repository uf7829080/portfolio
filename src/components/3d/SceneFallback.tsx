/**
 * Pure-CSS stand-in shown while the 3D chunk loads, and permanently on
 * browsers where WebGL is unavailable. Kept in its own module so importing it
 * does not pull the Three.js runtime into the initial bundle.
 */
export function SceneFallback() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 animate-drift rounded-full bg-[radial-gradient(circle_at_38%_32%,rgba(77,166,255,0.5),rgba(34,211,238,0.16)_46%,transparent_70%)] blur-2xl" />
      <div className="absolute left-1/2 top-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
      <div className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" />
      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" />
    </div>
  );
}
