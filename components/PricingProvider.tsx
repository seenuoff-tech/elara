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

  // Load from local storage
  useEffect(() => {
    const savedRates = localStorage.getItem('elara_silver_rates');
    const savedGst = localStorage.getItem('elara_gst');
    if (savedRates) {
      try {
        setSilverRates(JSON.parse(savedRates));
      } catch (e) {
        console.error('Failed to parse saved silver rates');
      }
    }
    if (savedGst) {
      setGstPercentage(parseFloat(savedGst));
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('elara_silver_rates', JSON.stringify(silverRates));
      localStorage.setItem('elara_gst', gstPercentage.toString());
    }
  }, [silverRates, gstPercentage, isLoaded]);

  const updateCategoryRate = React.useCallback((category: string, rate: number) => {
    setSilverRates(prev => ({
      ...prev,
      [category]: rate
    }));
  }, []);

  // Helper to instantly calculate price based on weight and category
  const calculatePrice = React.useCallback((weightInGrams: number, category: string = '') => {
    const rate = silverRates[category] || 85; // Fallback to 85 if category not found
    const basePrice = weightInGrams * rate;
    const finalPrice = basePrice + (basePrice * (gstPercentage / 100));
    return currencyFormatter.format(finalPrice);
  }, [silverRates, gstPercentage]);

  const contextValue = React.useMemo(() => ({
    silverRates,
    updateCategoryRate,
    gstPercentage,
    setGstPercentage,
    calculatePrice
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
