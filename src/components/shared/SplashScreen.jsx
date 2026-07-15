import { useState, useEffect } from 'react';

export default function SplashScreen({ phase: externalPhase, onStartFade, onFinish }) {
  const [internalAnim, setInternalAnim] = useState('init'); // 'init' | 'in' | 'breathing' | 'out'
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    // Phase 0 -> 1: Smooth fade in from 95% scale with gentle golden shimmer (0 - 1s)
    const initTimer = setTimeout(() => {
      setInternalAnim('in');
    }, 30);

    // Phase 1 -> 2: Subtle breathing animation, glow softens, particles disappear (1 - 2s)
    const breathingTimer = setTimeout(() => {
      setInternalAnim('breathing');
    }, 1000);

    // Phase 2 -> 3: Trigger App cross-fade (at 2s)
    const fadeTriggerTimer = setTimeout(() => {
      setInternalAnim('out');
      if (onStartFade) onStartFade();
    }, 2000);

    // Phase 3 -> Done: Hide completely and hand off to App (at 3s)
    const doneTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 3000);

    return () => {
      clearTimeout(initTimer);
      clearTimeout(breathingTimer);
      clearTimeout(fadeTriggerTimer);
      clearTimeout(doneTimer);
    };
  }, [onStartFade, onFinish]);

  // If external phase is 'fading', ensure opacity transitions smoothly to 0
  const isFadingOut = externalPhase === 'fading' || internalAnim === 'out';

  // Generate lightweight deterministic golden particles around the screen for phase 'in'
  const particles = [
    { top: '15%', left: '20%', size: 3, delay: '0.1s' },
    { top: '22%', left: '78%', size: 4, delay: '0.3s' },
    { top: '35%', left: '12%', size: 2, delay: '0.2s' },
    { top: '28%', left: '88%', size: 3, delay: '0.5s' },
    { top: '65%', left: '18%', size: 3, delay: '0.4s' },
    { top: '75%', left: '82%', size: 4, delay: '0.2s' },
    { top: '82%', left: '28%', size: 2, delay: '0.6s' },
    { top: '68%', left: '72%', size: 3, delay: '0.1s' },
    { top: '12%', left: '50%', size: 3, delay: '0.4s' },
    { top: '86%', left: '55%', size: 2, delay: '0.3s' },
  ];

  return (
    <div
      aria-hidden="true"
      className={`fixed top-0 left-0 w-screen h-screen z-[99999] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#25040D] via-[#420D1B] to-[#1C0208] transition-opacity duration-1000 ease-in-out select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        backgroundColor: '#25040D',
        willChange: 'opacity',
      }}
    >
      {/* Subtle Luxury Dark Silk Radial Background Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000 ease-in-out"
        style={{
          background: 'radial-gradient(circle at 50% 45%, rgba(212, 175, 55, 0.15) 0%, rgba(123, 30, 58, 0.2) 40%, rgba(37, 4, 13, 0.98) 85%)',
          opacity: isFadingOut ? 0 : 1,
        }}
      />

      {/* Floating Golden Particles */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-1000 ease-in-out ${
          internalAnim === 'breathing' || isFadingOut ? 'opacity-0 scale-90' : 'opacity-85 scale-100'
        }`}
      >
        {particles.map((p, index) => (
          <div
            key={index}
            className="absolute rounded-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37] animate-pulse"
            style={{
              top: p.top,
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: '2s',
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Centered Logo & Typography Container */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center px-4 transition-all duration-1000 ease-out ${
          internalAnim === 'init'
            ? 'opacity-0 scale-95 translate-y-2'
            : internalAnim === 'in'
            ? 'opacity-100 scale-100 translate-y-0'
            : internalAnim === 'breathing'
            ? 'opacity-100 scale-[1.018] translate-y-0'
            : 'opacity-0 scale-100 translate-y-0'
        }`}
        style={{
          willChange: 'transform, opacity',
        }}
      >
        {/* Logo Circular Emblem with Soft Luxury Glow */}
        <div
          className={`relative flex items-center justify-center transition-all duration-1000 ease-in-out ${
            internalAnim === 'in'
              ? 'drop-shadow-[0_0_35px_rgba(212,175,55,0.48)]'
              : internalAnim === 'breathing'
              ? 'drop-shadow-[0_0_20px_rgba(212,175,55,0.26)]'
              : 'drop-shadow-none'
          }`}
        >
          <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full flex items-center justify-center relative p-1.5 sm:p-2">
            {!imgError && (
              <img
                src="/images/logo_vas.png"
                alt="Vasthra Cotton"
                className="w-full h-full object-contain select-none"
                draggable={false}
                onError={() => setImgError(true)}
              />
            )}
            {imgError && (
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-[#D4AF37] flex items-center justify-center bg-[#7B1E3A] text-white font-bold text-2xl sm:text-3xl" style={{ fontFamily: 'Playfair Display' }}>
                VC
              </div>
            )}
          </div>
        </div>

        {/* Luxury Brand Name */}
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mt-4 sm:mt-6 text-center drop-shadow-md"
          style={{ fontFamily: 'Playfair Display' }}
        >
          Vasthra <span className="text-[#D4AF37] font-normal">Cotton</span>
        </h1>

        {/* Ornamental Divider & Subtitle Matching Reference */}
        <div className="mt-4 sm:mt-5 flex items-center justify-center gap-3 w-full max-w-xs sm:max-w-md opacity-90">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/70 to-[#D4AF37]" />
          <span className="text-[#D4AF37] text-xs sm:text-sm tracking-widest font-semibold flex items-center gap-1.5 uppercase drop-shadow-sm">
            ✦ Sarees That Celebrate You ✦
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#D4AF37]/70 to-[#D4AF37]" />
        </div>
      </div>
    </div>
  );
}
