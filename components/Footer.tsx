'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import LuxuryButton from './luxury/LuxuryButton';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsLoading(true);
      setErrorMsg('');
      try {
        const res = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        if (res.ok) {
          setSubscribed(true);
          setEmail('');
        } else {
          setErrorMsg('Failed to subscribe. Please try again.');
        }
      } catch (error) {
        console.error('Subscription failed', error);
        setErrorMsg('Network error. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <footer id="contact" className="bg-[#0B5E64] border-t border-white/10 text-white pt-10 pb-12 px-8 md:px-16 relative z-10 overflow-hidden">
      {/* Decorative subtle gradient background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      
      <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 lg:gap-8">
        {/* Column 1: Brand */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <img 
              src="/images/footerlogo.PNG" 
              alt="Elara Silver Logo" 
              className="w-auto h-16 md:h-20 object-contain drop-shadow-md brightness-0 invert -ml-2" 
            />
          </div>
          <p className="text-white/80 text-sm leading-relaxed font-light">
            Forging timeless aesthetics in solid sterling silver. Experiencing luxury jewelry through high-end craftsmanship and conscious modern design.
          </p>
          <div className="flex gap-4">
            {['Instagram'].map((social) => (
              <a
                key={social}
                href={'https://www.instagram.com/elarasilver_jewellery/'}
                className="text-white/60 hover:text-white text-xs tracking-wider uppercase transition-colors duration-300"
              >
                {social}
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Categories */}
        <div className="space-y-6">
          <h4 className="text-xs font-semibold tracking-[0.25em] uppercase text-white">Categories</h4>
          <div className="flex flex-col space-y-3 text-sm text-white/80 font-light">
            <Link href="/shop?category=rings" className="hover:text-white transition-colors duration-300">Rings</Link>
            <Link href="/shop?category=necklace" className="hover:text-white transition-colors duration-300">Necklace</Link>
            <Link href="/shop?category=minimalist-chains" className="hover:text-white transition-colors duration-300">Minimalist Chains</Link>
            <Link href="/shop?category=bracelet" className="hover:text-white transition-colors duration-300">Bracelet</Link>
            <Link href="/shop?category=earings" className="hover:text-white transition-colors duration-300">Earrings</Link>
          </div>
        </div>

        {/* Column 3: Collections (Rest of categories) */}
        <div className="space-y-6">
          <h4 className="text-xs font-semibold tracking-[0.25em] uppercase text-white">Collections</h4>
          <div className="flex flex-col space-y-3 text-sm text-white/80 font-light">
            <Link href="/shop?category=anklets" className="hover:text-white transition-colors duration-300">Anklets</Link>
            <Link href="/shop?category=chains" className="hover:text-white transition-colors duration-300">Chains</Link>
            <Link href="/shop?category=toe-rings" className="hover:text-white transition-colors duration-300">Toe Rings</Link>
            <Link href="/shop?category=mens-rings" className="hover:text-white transition-colors duration-300 font-medium pt-2">Men's Jewellery</Link>
            <Link href="/shop?category=kids-earings" className="hover:text-white transition-colors duration-300 font-medium">Kids Jewellery</Link>
          </div>
        </div>

        {/* Column 4: Support */}
        <div className="space-y-6">
          <h4 className="text-xs font-semibold tracking-[0.25em] uppercase text-white">Services</h4>
          <ul className="space-y-3 text-sm text-white/80 font-light">
            <li><Link href="/jewellery-care" className="hover:text-white transition-colors duration-300">Jewellery Care Guide</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors duration-300">Contact Us</Link></li>
            <li><Link href="/track-order" className="hover:text-white transition-colors duration-300">Track Your Order</Link></li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div className="space-y-6">
          <h4 className="text-xs font-semibold tracking-[0.25em] uppercase text-white">Newsletter</h4>
          <p className="text-white/80 text-sm leading-relaxed font-light">
            Subscribe to receive private previews, product launches, and brand stories.
          </p>
          {subscribed ? (
            <p className="text-white text-xs tracking-wider uppercase">Thank you for subscribing.</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="relative border-b border-white/40 focus-within:border-white transition-colors duration-300">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border-none text-white placeholder-white/50 text-sm py-2 w-full focus:outline-none"
                  disabled={isLoading}
                />
              </div>
              <LuxuryButton isCTA={true}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 py-2 px-4 text-xs font-medium tracking-[0.2em] uppercase border border-white/40 text-white hover:bg-white hover:text-[#0B5E64] transition-all duration-300 text-center cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </LuxuryButton>
              {errorMsg && <p className="text-red-300 text-xs mt-1">{errorMsg}</p>}
            </form>
          )}
        </div>
      </div>

      <div className="w-full mx-auto mt-20 pt-8 border-t border-white/20 flex flex-col items-center gap-6 text-xs text-white/60 font-light">
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          <Link href="/terms-and-conditions" className="hover:text-white transition-colors duration-300 tracking-wider uppercase">Terms & Conditions</Link>
          <span className="hidden md:inline text-white/20">|</span>
          <Link href="/refund-return-policy" className="hover:text-white transition-colors duration-300 tracking-wider uppercase">Refund & Return Policy</Link>
          <span className="hidden md:inline text-white/20">|</span>
          <Link href="/privacy-policy" className="hover:text-white transition-colors duration-300 tracking-wider uppercase">Privacy Policy</Link>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4 mt-4">
          <p className="text-sm md:text-base font-medium text-white/90 tracking-wide">© {new Date().getFullYear()} ELARA SILVER. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="https://www.skeneticdigital.com" target="_blank" rel="noopener noreferrer" className="text-sm md:text-base font-medium text-white/90 tracking-wide hover:text-white transition-colors duration-300">Developed by skenetic digital</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

