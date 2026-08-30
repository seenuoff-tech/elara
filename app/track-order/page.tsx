'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LuxuryButton from '../../components/luxury/LuxuryButton';
import Link from 'next/link';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTracking(true);
    setError('');
    setOrderData(null);
    
    try {
      const response = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber: orderNumber.trim(), email: email.trim() })
      });
      const data = await response.json();
      
      if (data.success) {
        setOrderData(data.order);
      } else {
        setError(data.error || 'Failed to track order');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsTracking(false);
    }
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
          
          {error && (
            <div className="mt-4 p-4 text-sm text-red-600 bg-red-50 rounded text-center">
              {error}
            </div>
          )}
        </motion.form>

        {orderData && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 max-w-2xl mx-auto bg-gray-50 border border-gray-200 rounded-xl p-8 text-left"
          >
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-medium text-gray-900">Order #{orderData.orderNumber}</h3>
                <p className="text-gray-500 text-sm mt-1">{new Date(orderData.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  orderData.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                  orderData.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-[#067964]/10 text-[#067964]'
                }`}>
                  {orderData.orderStatus}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Items</h4>
                <div className="space-y-4">
                  {orderData.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="text-gray-900 font-medium">{item.name}</p>
                        <p className="text-gray-500 text-sm">Qty: {item.quantity} {item.size ? `| Size: ${item.size}` : ''}</p>
                      </div>
                      <p className="font-medium text-gray-900">₹{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center font-medium text-lg">
                  <span className="text-gray-900">Total Amount</span>
                  <span className="text-[#067964]">₹{orderData.totalAmount}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

