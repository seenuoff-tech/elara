'use client';

import React, { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import LuxuryButton from './luxury/LuxuryButton';

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    addToCartDirect,
    removeFromCart,
    clearCart,
    isGiftWrap,
    setIsGiftWrap,
  } = useCart();

  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer on pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
      }
    };
    if (isCartOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  // Compute pricing math totals
  const subtotal = cartItems.reduce((acc, item) => {
    const numericPrice = parseFloat(String(item.price).replace(/[^\d]/g, ''));
    return acc + numericPrice * item.quantity;
  }, 0);

  const formattedSubtotal = `₹${subtotal.toLocaleString('en-IN')}`;
  const grandTotal = subtotal > 0 ? (isGiftWrap ? subtotal + 50 : subtotal) : 0;
  const formattedGrandTotal = `₹${grandTotal.toLocaleString('en-IN')}`;
  
  const router = useRouter();

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Dark blurred backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-[#ffffff]/70 z-40 backdrop-blur-sm"
          />

          {/* Slide-out Cart Panel */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
            className="fixed top-0 right-0 h-full w-full sm:w-[460px] bg-[#ffffff]/95 border-l border-black/10 z-50 backdrop-blur-2xl shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* Ambient luxury particle backdrop drift via CSS */}
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,#ffffff_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

            <div className="flex flex-col h-full justify-between relative z-10">
              {/* Header */}
              <div className="p-6 border-b border-black/10 flex items-center justify-between bg-[#ffffff]/40">
                <div className="flex items-center gap-2">

                  <h3 className="text-sm font-semibold tracking-[0.25em] uppercase text-black">
                    Your Collection
                  </h3>
                </div>
                <LuxuryButton isCTA={false}>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-black/45 hover:text-black text-[10px] tracking-widest uppercase transition-colors duration-300 flex items-center gap-1.5 cursor-pointer"
                  >
                    Close
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </LuxuryButton>
              </div>

              {/* Items List */}
              <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-none">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                    <svg className="w-10 h-10 text-black/20 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <p className="text-xs tracking-widest uppercase text-black/40 font-light">
                      Your bag is currently empty.
                    </p>
                  </div>
                ) : (
                  cartItems.map((item, idx) => (
                    <motion.div
                      key={`${item.id}-${item.size}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="border border-black/5 bg-neutral-50/40 p-4 flex gap-4 items-center justify-between"
                    >
                      {/* Product Image */}
                      <div className="flex items-center gap-4 flex-grow">
                        <div className="w-16 h-16 bg-white border border-black/10 flex items-center justify-center relative shadow-sm shrink-0">
                          <img 
                            src={item.image || `/images/${item.id}.png`} 
                            alt={item.name} 
                            className="w-full h-full object-contain p-1" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/hero1.png';
                            }}
                          />
                        </div>

                        {/* Title, Size & Gifting Badge */}
                        <div className="space-y-1">
                          <h4 className="text-xs font-semibold tracking-wide uppercase text-black truncate max-w-[200px]">
                            {item.name}
                          </h4>
                          <div className="flex gap-2 text-[9px] text-black/40 font-mono">
                            <span>Size: {item.size}</span>
                            <span>|</span>
                            <span>{item.price}</span>
                          </div>
                          

                        </div>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-xs font-bold text-black tracking-wider">
                          {`₹${(parseFloat(String(item.price).replace(/[^\d]/g, '')) * item.quantity).toLocaleString('en-IN')}`}
                        </span>

                        <div className="flex border border-black/10 text-xs select-none">
                          <LuxuryButton isCTA={false} magneticRange={30} magneticStrength={0.2}>
                            <button
                              onClick={() => removeFromCart(item.id, item.size)}
                              className="px-2 py-1 text-black/50 hover:text-black hover:bg-white/5 transition-colors cursor-pointer font-bold"
                            >
                              -
                            </button>
                          </LuxuryButton>
                          <span className="px-3 py-1 text-black font-mono">{item.quantity}</span>
                          <LuxuryButton isCTA={false} magneticRange={30} magneticStrength={0.2}>
                            <button
                              onClick={() => addToCartDirect({ id: item.id, name: item.name, price: item.price, image: item.image }, item.size)}
                              className="px-2 py-1 text-black/50 hover:text-black hover:bg-white/5 transition-colors cursor-pointer font-bold"
                            >
                              +
                            </button>
                          </LuxuryButton>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Gifting & Glimmering Checkout Footer Summary */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-black/10 bg-neutral-50/60 backdrop-blur-sm space-y-6">
                  {/* Detailed pricing summary */}
                  <div className="space-y-2.5 text-[10px] tracking-widest uppercase text-black/55 font-light">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-black font-medium">{formattedSubtotal}</span>
                    </div>
                    {isGiftWrap && (
                      <div className="flex justify-between">
                        <span>Gift Packaging</span>
                        <span className="text-black font-medium">₹50</span>
                      </div>
                    )}
                    
                    <div className="w-full h-[1px] bg-black/10 my-2" />
                    
                    <div className="flex justify-between text-xs font-bold text-black tracking-widest pt-2">
                      <span>Grand Total</span>
                      <span>{formattedGrandTotal}</span>
                    </div>
                  </div>

                  {/* Gift Wrap Toggle */}
                  <div className="flex items-center gap-3 py-1 cursor-pointer group" onClick={() => setIsGiftWrap(!isGiftWrap)}>
                    <div className={`w-4 h-4 border ${isGiftWrap ? 'bg-[#0B5E64] border-[#0B5E64]' : 'border-black/30 group-hover:border-[#0B5E64]'} flex items-center justify-center transition-colors`}>
                      {isGiftWrap && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs text-black/70 tracking-wide transition-colors group-hover:text-black">Is this a Gift? 🎁 Wrap it for just (₹50)</span>
                  </div>

                  {/* Proceed to Checkout CTA */}
                  <div className="space-y-3">
                    <LuxuryButton isCTA={true} className="w-full">
                      <button
                        onClick={handleCheckout}
                        className="w-full py-5 px-6 text-xs font-bold tracking-[0.25em] uppercase bg-[#0B5E64] text-white border border-[#0B5E64] hover:opacity-90 transition-all duration-500 hover:shadow-[0_0_20px_rgba(11,94,100,0.45)] cursor-pointer relative overflow-hidden group rounded-md"
                      >
                        {/* Sweep overlay shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        Proceed To Secure Checkout
                      </button>
                    </LuxuryButton>

                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

