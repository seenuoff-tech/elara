'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LuxuryButton from '../../components/luxury/LuxuryButton';
import Link from 'next/link';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isTracking, setIsTracking] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTracking(true);
    setTimeout(() => {
      setIsTracking(false);
      alert("Order tracking system is currently being updated. Please try again later.");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white pt-48 pb-20">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-light tracking-widest text-black mb-8 uppercase"
        >
          Track Your Order
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gray-600 mb-12 font-light"
        >
          Enter your order number and email address to check the current status of your shipment.
        </motion.p>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          onSubmit={handleTrack} 
          className="max-w-md mx-auto space-y-6 text-left"
        >
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-black mb-2">Order Number</label>
            <input 
              type="text" 
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full border-b border-black/20 pb-2 focus:outline-none focus:border-black transition-colors"
              placeholder="e.g. EL-123456"
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-black mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-black/20 pb-2 focus:outline-none focus:border-black transition-colors"
              placeholder="Enter your email"
            />
          </div>

          <div className="pt-6">
            <LuxuryButton isCTA={true} className="w-full">
              <button type="submit" disabled={isTracking} className="w-full py-4 text-sm font-semibold tracking-widest uppercase bg-[#067964] text-white hover:opacity-90 px-8 transition-colors">
                {isTracking ? 'Tracking...' : 'Track Order'}
              </button>
            </LuxuryButton>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

