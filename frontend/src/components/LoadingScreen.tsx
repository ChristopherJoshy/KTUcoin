import React, { useEffect, useRef, useState } from 'react';
import { animate, createTimeline } from 'animejs';
import { CoinLogo } from './CoinLogo';
import { fetchHealthCheck } from '../services/api';

interface LoadingScreenProps {
  onFinish?: () => void;
}

// this function is used for splash screen anime.js loading animation and guaranteed fast backend connection transition for more info refer code-wiki.md line 98
export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinish }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  const [statusText, setStatusText] = useState('Connecting to KTUcoins Network...');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Check backend health or trigger smooth fallback after 1.2 seconds max
    const checkConnection = async () => {
      try {
        await fetchHealthCheck();
        if (isMounted) setStatusText('Connected to Backend!');
      } catch (err) {
        if (isMounted) setStatusText('Local Network Mode Active');
      } finally {
        if (isMounted) setIsDone(true);
      }
    };

    const timer = setTimeout(checkConnection, 600);
    const maxFallbackTimer = setTimeout(() => {
      if (isMounted && !isDone) setIsDone(true);
    }, 1400);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      clearTimeout(maxFallbackTimer);
    };
  }, []);

  // Anime.js splash animation
  useEffect(() => {
    if (isDone && logoWrapperRef.current && textRef.current && containerRef.current) {
      const timeline = createTimeline({
        defaults: { ease: 'outExpo' }
      });

      timeline
        .add(logoWrapperRef.current, {
          scale: [0, 1.15, 1],
          opacity: [0, 1],
          duration: 600
        })
        .add(textRef.current, {
          translateY: [15, 0],
          opacity: [0, 1],
          duration: 500
        }, '-=200')
        .add(containerRef.current, {
          opacity: [1, 0],
          duration: 400,
          delay: 400,
          onComplete: () => {
            if (onFinish) onFinish();
          }
        });
    }
  }, [isDone, onFinish]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-slate-50 flex flex-col items-center justify-center p-4 text-slate-900 font-sans"
    >
      <div ref={logoWrapperRef} className="mb-6">
        <CoinLogo size={96} animated={true} />
      </div>

      <h1 ref={textRef} className="text-3xl font-black font-display tracking-tight text-slate-900 flex items-center gap-2">
        KTU<span className="text-amber-500">coins</span>
      </h1>

      <div className="mt-8 flex items-center gap-2.5 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
        <div className={`w-2.5 h-2.5 rounded-full ${isDone ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`} />
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{statusText}</span>
      </div>
    </div>
  );
};
