import React, { useEffect, useRef } from 'react';
import { animate, createTimeline } from 'animejs';
import { X, Award, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { CoinLogo } from './CoinLogo';

interface GachaRewardModalProps {
  isOpen: boolean;
  points: number;
  title: string;
  activityGroup: string;
  onClose: () => void;
}

// this function is used for rendering gacha game style anime.js summon animation when KTUcoins are credited for more info refer code-wiki.md line 100
export const GachaRewardModal: React.FC<GachaRewardModalProps> = ({
  isOpen,
  points,
  title,
  activityGroup,
  onClose
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const coinBurstRef = useRef<HTMLDivElement>(null);
  const rayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && cardRef.current && coinBurstRef.current && rayRef.current) {
      const timeline = createTimeline({ defaults: { ease: 'outElastic(1, .5)' } });

      animate(rayRef.current, {
        rotate: '360deg',
        duration: 10000,
        loop: true,
        ease: 'linear'
      });

      timeline
        .add(coinBurstRef.current, {
          scale: [0, 1.4, 1],
          rotate: ['-180deg', '0deg'],
          opacity: [0, 1],
          duration: 900
        }, 0)
        .add(cardRef.current, {
          translateY: [60, 0],
          scale: [0.7, 1],
          opacity: [0, 1],
          duration: 800
        }, '-=400');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      {/* Rotating Gacha Sunburst Rays background */}
      <div
        ref={rayRef}
        className="absolute w-[600px] h-[600px] rounded-full opacity-30 pointer-events-none"
        style={{
          background: 'conic-gradient(from 0deg, #F59E0B 0deg 30deg, transparent 30deg 60deg, #F59E0B 60deg 90deg, transparent 90deg 120deg, #F59E0B 120deg 150deg, transparent 150deg 180deg, #F59E0B 180deg 210deg, transparent 210deg 240deg, #F59E0B 240deg 270deg, transparent 270deg 300deg, #F59E0B 300deg 330deg, transparent 330deg 360deg)'
        }}
      />

      <div
        ref={cardRef}
        className="glass-modal w-full max-w-sm rounded-3xl p-6 shadow-zen-lg relative border border-amber-300 text-slate-900 text-center flex flex-col items-center z-10 bg-white"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100 border border-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gacha Coin Burst Anchor */}
        <div ref={coinBurstRef} className="mb-4 relative">
          <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl animate-pulse" />
          <CoinLogo size={88} animated={true} />
        </div>

        {/* Gacha Rarity Pill */}
        <span className="px-3.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 uppercase tracking-widest shadow-md shadow-amber-500/20 mb-2 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          Points Unlocked
        </span>

        <h2 className="text-4xl font-black font-display text-slate-900 tracking-tight">
          +{points} <span className="text-amber-500">KTUcoins</span>
        </h2>

        <p className="text-xs text-slate-600 font-semibold mt-1 mb-4">
          {activityGroup} Credited
        </p>

        <div className="w-full bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1 text-left text-xs mb-5">
          <p className="text-slate-400 text-[10px]">Event Title</p>
          <p className="font-bold text-slate-900 leading-snug">{title}</p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-black text-sm shadow-md shadow-amber-500/20 hover:brightness-105 transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>Claim KTUcoins</span>
        </button>
      </div>
    </div>
  );
};
