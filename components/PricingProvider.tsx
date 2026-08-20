'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const defaultRates: Record<string, number> = {
  'Rings': 85,
  'Necklace': 85,
  'Bracelet': 85,
  'Earings': 85,
  'Anklets': 85,
  'Chains': 85,
  'Toe rings': 85,
  'Mens-Rings': 85,
  'Mens-Chains': 85,
  'Mens-Bracelet': 85,
  'Kids-Earings': 85,
};

interface PricingContextType {
  silverRates: Record<string, number>;
  updateCategoryRate: (category: string, rate: number) => void;
  gstPercentage: number;
  setGstPercentage: (gst: number) => void;
  calculatePrice: (weightInGrams: number, category?: string) => string;
  saveSettings: (rates: Record<string, number>, gst: number) => Promise<any>;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

// Currency formatter created once outside to prevent slow re-instantiation in loops
const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function PricingProvider({ children }: { children: ReactNode }) {
  const [silverRates, setSilverRates] = useState<Record<string, number>>(defaultRates);
  const [gstPercentage, setGstPercentage] = useState<number>(3); // Default to 3% GST
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from database API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`/api/settings/pricing?t=${Date.now()}`, { cache: 'no-store' });
        const { success, data } = await res.json();
        if (success && data) {
          if (data.silverRates) setSilverRates(data.silverRates);
          if (data.gstPercentage !== undefined) setGstPercentage(data.gstPercentage);
        }
      } catch (error) {
        console.error('Failed to load pricing settings:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchSettings();
  }, []);

  // Sync state and Save to Database (we debounce or trigger manually to avoid too many requests)
  // Instead of auto-saving, we will modify the context so `updateCategoryRate` and `setGstPercentage` 
  // just update local state, and we add a `saveSettings` method to persist to the DB.
  
  const saveSettings = async (newRates: Record<string, number>, newGst: number) => {
    try {
      const response = await fetch('/api/settings/pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ silverRates: newRates, gstPercentage: newGst })
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to save pricing settings:', error);
      return { success: false };
    }
  };

  const updateCategoryRate = React.useCallback((category: string, rate: number) => {
    setSilverRates(prev => ({
      ...prev,
      [category]: rate
    }));
  }, []);

  // Helper to instantly calculate price based on weight and category
  const calculatePrice = React.useCallback((weightInGrams: number, category: string = '') => {
    // Normalize category spelling differences (e.g. Earrings vs Earings)
    let normCategory = category;
    if (category === 'Earrings') normCategory = 'Earings';
    if (category === 'Kids-Earrings' || category === 'Kids Earrings') normCategory = 'Kids-Earings';
    if (category === 'Mens-Rings' || category === "Men's Rings") normCategory = 'Mens-Rings';
    if (category === 'Mens-Chains' || category === "Men's Chains") normCategory = 'Mens-Chains';
    if (category === 'Mens-Bracelet' || category === "Men's Bracelets") normCategory = 'Mens-Bracelet';

    const rate = silverRates[normCategory] || silverRates[category] || 85; // Fallback to 85 if category not found
    
    // Calculate rounded price per gram with GST first to ensure mathematical consistency (e.g. 2g is always 2 * 1g price)
    const pricePerGramWithGst = Math.round(rate * (1 + gstPercentage / 100));
    const finalPrice = weightInGrams * pricePerGramWithGst;
    
    return currencyFormatter.format(finalPrice);
  }, [silverRates, gstPercentage]);

  const contextValue = React.useMemo(() => ({
    silverRates,
    updateCategoryRate,
    gstPercentage,
    setGstPercentage,
    calculatePrice,
    saveSettings
  }), [silverRates, updateCategoryRate, gstPercentage, calculatePrice]);

  return (
    <PricingContext.Provider value={contextValue}>
      {children}
    </PricingContext.Provider>
  );
}

export function usePricing() {
  const context = useContext(PricingContext);
  if (context === undefined) {
    throw new Error('usePricing must be used within a PricingProvider');
  }
  return context;
}
