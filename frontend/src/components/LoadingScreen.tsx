import React, { useEffect, useRef, useState } from 'react';
import { animate, createTimeline } from 'animejs';
import { Loader2, Wifi } from 'lucide-react';
import { CoinLogo } from './CoinLogo';
import { fetchHealthCheck } from '../services/api';

interface LoadingScreenProps {
  onFinish?: () => void;
}

// this function is used for splash screen that polls the backend every 1 second until connected (Render cold start) for more info refer code-wiki.md line 12
export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinish }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  // Poll the backend every 1 second until the health check succeeds
  useEffect(() => {
    let isMounted = true;

    const pollBackend = async () => {
      if (!isMounted || isConnected) return;
      try {
        await fetchHealthCheck();
        if (isMounted) setIsConnected(true);
      } catch {
        if (isMounted) setAttempts(prev => prev + 1);
      }
    };

    const pollTimer = setInterval(pollBackend, 1000);
    const elapsedTimer = setInterval(() => {
      if (isMounted && !isConnected) setElapsed(prev => prev + 1);
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(pollTimer);
      clearInterval(elapsedTimer);
    };
  }, [isConnected]);

  // Anime.js splash animation
  useEffect(() => {
    if (isConnected && logoWrapperRef.current && textRef.current && containerRef.current) {
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
  }, [isConnected, onFinish]);

  const statusText = isConnected
    ? 'Connected to Backend!'
    : attempts < 2
      ? 'Contacting KTUcoins backend...'
      : 'Backend waking up... (Render cold start)';

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-900 dark:text-slate-50 font-sans transition-colors duration-300"
    >
      <div ref={logoWrapperRef} className="mb-6">
        <CoinLogo size={96} animated={true} />
      </div>

      <h1 ref={textRef} className="text-3xl font-black font-display tracking-tight flex items-center gap-2">
        KTU<span className="text-amber-500">coins</span>
      </h1>

      <div className="mt-8 flex items-center gap-2.5 bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
        {isConnected ? (
          <Wifi className="w-3.5 h-3.5 text-emerald-500" />
        ) : (
          <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin" />
        )}
        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
          {statusText}
        </span>
      </div>

      {/* Connection progress detail while waiting */}
      {!isConnected && (
        <div className="mt-3 flex items-center gap-2 text-[11px] font-mono text-slate-400 dark:text-slate-500">
          <div className={`w-2 h-2 rounded-full ${attempts % 2 === 0 ? 'bg-amber-500' : 'bg-teal-600'} animate-pulse`} />
          <span>Pinging /api/health every 1s</span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span>Attempt #{attempts + 1}</span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span>{elapsed}s elapsed</span>
        </div>
      )}
    </div>
  );
};
