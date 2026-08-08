import React, { useEffect, useRef } from 'react';
import { animate } from 'animejs';

interface CoinLogoProps {
  size?: number;
  animated?: boolean;
}

// this function is used for rendering custom animated KTUcoins gold coin logo without boxes for more info refer code-wiki.md line 96
export const CoinLogo: React.FC<CoinLogoProps> = ({ size = 36, animated = false }) => {
  const coinRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (animated && coinRef.current) {
      animate(coinRef.current, {
        rotateY: '360deg',
        duration: 3000,
        ease: 'easeInOutQuad',
        loop: true
      });
    }
  }, [animated]);

  return (
    <svg
      ref={coinRef}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-md"
    >
      <defs>
        <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="coinInnerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#78350F" />
          <stop offset="100%" stopColor="#451A03" />
        </linearGradient>
      </defs>

      {/* Outer Coin Ring */}
      <circle cx="50" cy="50" r="46" fill="url(#coinGrad)" stroke="#B45309" strokeWidth="3" />
      {/* Inner Rim Circle */}
      <circle cx="50" cy="50" r="38" fill="url(#coinInnerGrad)" stroke="#FBBF24" strokeWidth="2" strokeDasharray="3 3" />
      {/* Central 'K' Emblem */}
      <path
        d="M38 30 V70 M38 50 L58 30 M38 50 L60 70"
        stroke="#FBBF24"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Sparkle highlights */}
      <circle cx="28" cy="28" r="3" fill="#FFFFFF" opacity="0.8" />
    </svg>
  );
};
