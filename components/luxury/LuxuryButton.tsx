'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface LuxuryButtonProps {
  children: React.ReactElement;
  isCTA?: boolean;
  magneticRange?: number;
  magneticStrength?: number;
  shimmerColor?: 'gold' | 'silver';
  className?: string;
}

export default function LuxuryButton({
  children,
  isCTA = false,
  magneticRange = 85,
  magneticStrength = 0.38,
  shimmerColor = 'gold',
  className = '',
}: LuxuryButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const particleContainerRef = useRef<HTMLDivElement>(null);
  
  // Refs for the 4 border lines
  const borderTopRef = useRef<HTMLDivElement>(null);
  const borderRightRef = useRef<HTMLDivElement>(null);
  const borderBottomRef = useRef<HTMLDivElement>(null);
  const borderLeftRef = useRef<HTMLDivElement>(null);

  // Sparkle generator interval id
  const sparkleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Removed animations based on user request to remove yellow shade/glow
  }, [magneticRange, magneticStrength, isCTA, shimmerColor]);

  return (
    <div
      ref={containerRef}
      className={`inline-block relative z-20 ${className}`}
    >
      <div
        ref={buttonRef}
        className="relative select-none"
      >
        {/* The original button or clickable element */}
        {children}
      </div>
    </div>
  );
}
