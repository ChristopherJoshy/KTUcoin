import React, { useEffect, useRef, useState } from 'react';
import { animate, createTimeline } from 'animejs';
import { CoinLogo } from './CoinLogo';
import { fetchHealthCheck } from '../services/api';

interface LoadingScreenProps {
  onFinish?: () => void;
}

// this function is used for splash screen anime.js loading animation and backend MongoDB connection verification for more info refer code-wiki.md line 98
export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinish }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  const [statusText, setStatusText] = useState('Connecting to Backend & MongoDB...');
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Poll backend health check until connected
  useEffect(() => {
    let intervalId: any;
    const checkConnection = async () => {
      try {
        await fetchHealthCheck();
        setStatusText('Connected to Backend Network!');
        setIsBackendConnected(true);
      } catch (err) {
        setStatusText('Waiting for Backend Server (Retry in 1s)...');
      }
    };

    checkConnection();
    intervalId = setInterval(checkConnection, 1200);

    return () => clearInterval(intervalId);
  }, []);

  // Anime.js splash animation
  useEffect(() => {
    if (isBackendConnected && logoWrapperRef.current && textRef.current && containerRef.current) {
      const timeline = createTimeline({
        defaults: { ease: 'outExpo' }
      });

      timeline
        .add(logoWrapperRef.current, {
          scale: [0, 1.2, 1],
          opacity: [0, 1],
          duration: 800
        })
        .add(textRef.current, {
          translateY: [20, 0],
          opacity: [0, 1],
          duration: 600
        }, '-=300')
        .add(containerRef.current, {
          opacity: [1, 0],
          duration: 500,
          delay: 600,
          onComplete: () => {
            if (onFinish) onFinish();
          }
        });
    }
  }, [isBackendConnected, onFinish]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-slate-50 flex flex-col items-center justify-center p-4 text-slate-900 font-sans"
    >
      <div ref={logoWrapperRef} className="mb-6">
        <CoinLogo size={100} animated={true} />
      </div>

      <h1 ref={textRef} className="text-3xl font-black font-display tracking-tight text-slate-900 flex items-center gap-2">
        KTU<span className="text-amber-500">coins</span>
      </h1>

      <div className="mt-8 flex items-center gap-2.5 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
        <div className={`w-2.5 h-2.5 rounded-full ${isBackendConnected ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`} />
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{statusText}</span>
      </div>
    </div>
  );
};
