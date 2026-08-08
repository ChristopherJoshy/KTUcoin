import React, { useEffect, useRef } from 'react';
import { animate, createTimeline } from 'animejs';
import { CoinLogo } from './CoinLogo';

interface LoadingScreenProps {
  onFinish?: () => void;
}

// this function is used for splash screen anime.js loading animation with KTUcoins branding for more info refer code-wiki.md line 98
export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinish }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (logoWrapperRef.current && textRef.current && containerRef.current) {
      const timeline = createTimeline({
        defaults: { ease: 'outExpo' }
      });

      timeline
        .add(logoWrapperRef.current, {
          scale: [0, 1.2, 1],
          opacity: [0, 1],
          duration: 1000
        })
        .add(textRef.current, {
          translateY: [20, 0],
          opacity: [0, 1],
          duration: 800
        }, '-=400')
        .add(containerRef.current, {
          opacity: [1, 0],
          duration: 600,
          delay: 800,
          onComplete: () => {
            if (onFinish) onFinish();
          }
        });
    }
  }, [onFinish]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-slate-50 flex flex-col items-center justify-center p-4 text-slate-900"
    >
      <div ref={logoWrapperRef} className="mb-6">
        <CoinLogo size={100} animated={true} />
      </div>

      <h1 ref={textRef} className="text-3xl font-black font-display tracking-tight text-slate-900 flex items-center gap-2">
        KTU<span className="text-amber-500">coins</span>
      </h1>

      <div className="mt-8 flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-ping" />
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loading Campus Network...</span>
      </div>
    </div>
  );
};
