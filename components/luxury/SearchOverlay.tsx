'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useProducts } from '../../context/ProductsContext';
import LuxuryButton from './LuxuryButton';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);
  const searchIconRef = useRef<HTMLDivElement>(null);
  const particlesContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState('');
  const { products } = useProducts();

  // Filter products based on search term
  const filteredProducts = query.trim() === ''
    ? []
    : products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5);

  // Trigger search transitions on open/close
  useEffect(() => {
    const overlay = overlayRef.current;
    const box = boxRef.current;
    if (!overlay || !box) return;

    if (isOpen) {
      overlay.style.pointerEvents = 'auto';
      
      // Animate background overlay
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out',
      });

      // Animate search container box
      gsap.fromTo(box,
        { scale: 0.93, y: 25, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.65, ease: 'power4.out', delay: 0.05 }
      );

      // Underline trace animation
      if (underlineRef.current) {
        gsap.fromTo(underlineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power2.out', delay: 0.25 });
      }

      // Suggestions stagger reveal
      const items = containerRef.current?.querySelectorAll('.suggestion-item-wrapper');
      if (items && items.length > 0) {
        gsap.fromTo(items,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out', stagger: 0.06, delay: 0.2 }
        );
      }

      // Focus input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);

    } else {
      // Reset search text on close
      setQuery('');

      // Animate out
      gsap.to(box, {
        scale: 0.93,
        y: 20,
        opacity: 0,
        duration: 0.4,
        ease: 'power3.in',
      });

      gsap.to(overlay, {
        opacity: 0,
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => {
          overlay.style.pointerEvents = 'none';
        }
      });
    }
  }, [isOpen]);

  // Floating Diamond backdrop particles
  useEffect(() => {
    if (!isOpen) return;
    const pContainer = particlesContainerRef.current;
    if (!pContainer) return;

    const numStars = 12;
    const activeTweens: gsap.core.Tween[] = [];

    for (let i = 0; i < numStars; i++) {
      const star = document.createElement('div');
      star.style.position = 'absolute';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.opacity = '0';
      star.style.pointerEvents = 'none';
      star.innerHTML = `
        <svg viewBox="0 0 100 100" class="w-3 h-3 text-[#D4AF37]/30 fill-current">
          <polygon points="50,15 62,38 88,42 68,58 75,85 50,70 25,85 32,58 12,42 38,38" />
        </svg>
      `;
      pContainer.appendChild(star);

      // Animate drifting
      const tween = gsap.fromTo(star, 
        { opacity: 0, scale: Math.random() * 0.4 + 0.3 },
        {
          opacity: Math.random() * 0.35 + 0.15,
          x: `random(-80, 80)`,
          y: `random(-100, -30)`,
          rotation: `random(-180, 180)`,
          duration: `random(14, 22)`,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: Math.random() * 4
        }
      );
      activeTweens.push(tween);
    }

    return () => {
      activeTweens.forEach(t => t.kill());
      if (pContainer) pContainer.innerHTML = '';
    };
  }, [isOpen]);

  // Product cards transition when search results length changes
  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll('.product-result-card');
    if (cards && cards.length > 0) {
      gsap.fromTo(cards,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', stagger: 0.08 }
      );
    }
  }, [filteredProducts.length]);

  // Keyboard listener to close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Micro-interactions while typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);

    // Pulse search icon scale
    if (searchIconRef.current) {
      gsap.fromTo(searchIconRef.current, 
        { scale: 0.85 }, 
        { scale: 1, duration: 0.3, ease: 'back.out(2)' }
      );
    }

    // Expand glow on underline
    if (underlineRef.current) {
      gsap.fromTo(underlineRef.current,
        { boxShadow: '0 0 0px rgba(212, 175, 55, 0)' },
        { boxShadow: '0 0 10px rgba(212, 175, 55, 0.6)', duration: 0.15, yoyo: true, repeat: 1 }
      );
    }
  };

  const handleSuggestionClick = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#ffffff]/92 backdrop-blur-2xl opacity-0 pointer-events-none"
      style={{ transition: 'opacity 0.4s ease' }}
    >
      {/* Background Diamond Particles */}
      <div ref={particlesContainerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none" />

      {/* Close Button Trigger */}
      <div className="absolute top-6 right-6 md:top-8 md:right-12 z-10">
        <LuxuryButton isCTA={false}>
          <button
            onClick={onClose}
            className="text-black/45 hover:text-black text-xs tracking-widest uppercase flex items-center gap-2 cursor-pointer p-2 border border-transparent hover:border-black/10"
            aria-label="Close search"
          >
            <span>Close</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </LuxuryButton>
      </div>

      {/* Main Glassmorphism container */}
      <div
        ref={boxRef}
        className="relative w-full h-full md:h-auto max-w-2xl bg-neutral-50/90 md:bg-neutral-50/70 md:border md:border-black/10 p-8 md:p-12 shadow-none md:shadow-[0_40px_80px_rgba(0,0,0,0.95)] z-10 mx-0 md:mx-4 overflow-y-auto md:overflow-visible"
      >
        {/* Premium Gold Accents */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-70" />
        <div className="absolute inset-0 bg-radial from-[#D4AF37]/4 via-transparent to-transparent pointer-events-none" />

        <div ref={containerRef} className="space-y-8 relative z-10">
          
          {/* Search Box Header */}
          {/* Search Box Header Removed */}

          {/* Search Input field */}
          <div className="relative">
            <div className="flex items-center gap-3 pb-3">
              <div ref={searchIconRef}>
                <svg className="w-5 h-5 text-black/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="SEARCH SIGNATURE PIECES..."
                className="w-full bg-transparent text-black placeholder-white/20 text-sm md:text-base tracking-widest uppercase focus:outline-none font-light"
              />
            </div>
            
            {/* Input bottom border with gold highlight */}
            <div
              ref={underlineRef}
              className="absolute bottom-0 left-0 w-full h-[1px]"
              style={{
                background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
                transformOrigin: 'center',
              }}
            />
          </div>

          {/* Conditional View: Suggestions vs Results */}
          {query.trim() === '' ? null : (
            /* Results preview view */
            <div className="space-y-4">
              <span className="text-[8px] font-mono tracking-widest text-black/30 uppercase block">
                Matches Found ({filteredProducts.length})
              </span>
              
              <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-none pr-1">
                {filteredProducts.length === 0 ? (
                  <div className="py-6 text-center text-black/40 text-xs tracking-widest uppercase font-light border border-black/5 bg-[#ffffff]/40">
                    No matching creations found.
                  </div>
                ) : (
                  filteredProducts.map((p) => (
                    <Link
                      key={p.id}
                      href={`/shop`}
                      onClick={onClose}
                      className="product-result-card flex items-center justify-between border border-black/5 bg-neutral-900/30 hover:bg-neutral-900/60 hover:border-black/20 p-4 transition-all duration-300 group rounded-none"
                    >
                      <div className="flex items-center gap-4">
                        {/* Ring velvet representation box preview */}
                        <div className="w-10 h-10 bg-[#ffffff] border border-black/10 flex flex-col items-center justify-center relative shadow-inner shrink-0">
                          <svg className="w-4.5 h-4.5 text-[#D4AF37] opacity-80" viewBox="0 0 100 100" fill="none">
                            <path d="M50 5L63 38L96 50L63 62L50 95L37 62L4 50L37 38L50 5Z" stroke="currentColor" strokeWidth="2.5" />
                          </svg>
                        </div>
                        
                        <div className="text-left">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-black group-hover:text-[#D4AF37] transition-colors">
                            {p.name}
                          </h4>
                          <span className="text-[9px] text-black/40 uppercase tracking-widest">
                            {p.collection}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-black tracking-widest">
                          {p.price}
                        </span>
                        <span className="text-[9px] font-semibold text-black/50 tracking-widest uppercase border border-black/10 group-hover:border-[#D4AF37]/50 group-hover:text-black px-2.5 py-1 transition-all">
                          View Creation →
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Footer branding note */}
          {/* Footer branding note removed */}

        </div>
      </div>
    </div>
  );
}
