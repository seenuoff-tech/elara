'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { newArrivalsData, DetailedProduct } from '../data/newArrivals';

// Extend DetailedProduct to include Admin fields
export interface AppProduct extends DetailedProduct {
  weightInGrams: number;
  stock: number;
  status: string;
  category: string;
  tagline?: string;
  hallmark?: string;
  sizes?: string[];
  specs?: any[];
  details?: string[];
  colorTheme?: string;
  ringGeometry?: any;
  price?: string;
  finishes?: any[];
  pricingType?: 'weight_based' | 'manual';
  customBadge?: string;
  targetAudience?: 'Men' | 'Women' | 'Kids' | 'Unisex';
  mrpPrice?: number;
}

interface ProductsContextType {
  products: AppProduct[];
  isLoaded: boolean;
  setProducts: React.Dispatch<React.SetStateAction<AppProduct[]>>;
  addProduct: (product: Partial<AppProduct>) => Promise<{success: boolean, error?: string, details?: string}>;
  updateProduct: (id: string | number, updates: Partial<AppProduct>) => Promise<{success: boolean, error?: string, details?: string}>;
  deleteProduct: (id: string | number) => void;
  addBulkProducts: (productsList: Partial<AppProduct>[]) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

import { mensProducts } from '../data/mensProducts';

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<AppProduct[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        const data = await res.json();
        if (data.success && data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Failed to fetch products from DB", error);
      } finally {
        setIsLoaded(true);
      }
    };
    
    fetchProducts();
  }, []);

  const updateProduct = async (id: string | number, updates: Partial<AppProduct>) => {
    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
      });
      const data = await res.json();
      if (data.success) {
        const fetchRes = await fetch('/api/products', { cache: 'no-store' });
        const fetchResData = await fetchRes.json();
        if (fetchResData.success) {
          setProducts(fetchResData.products);
        }
        return { success: true };
      }
      return { success: false, error: data.error, details: data.details };
    } catch (error) {
      console.error("Error updating product", error);
      return { success: false, details: String(error) };
    }
  };

  const addProduct = async (product: Partial<AppProduct>) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      const data = await res.json();
      if (data.success) {
        const fetchRes = await fetch('/api/products', { cache: 'no-store' });
        const fetchResData = await fetchRes.json();
        if (fetchResData.success) {
          setProducts(fetchResData.products);
        }
        return { success: true };
      }
      return { success: false, error: data.error, details: data.details };
    } catch (error) {
      console.error("Error adding product", error);
      return { success: false, details: String(error) };
    }
  };

  const deleteProduct = async (id: string | number) => {
    try {
      await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => String(p.id) !== String(id)));
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  const addBulkProducts = async (productsList: Partial<AppProduct>[]) => {
    try {
      const res = await fetch('/api/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: productsList })
      });
      const data = await res.json();
      if (data.success) {
        // Refresh all products to get DB generated ones
        const fetchRes = await fetch('/api/products', { cache: 'no-store' });
        const fetchResData = await fetchRes.json();
        if (fetchResData.success) {
          setProducts(fetchResData.products);
        }
      }
    } catch (error) {
      console.error("Error bulk adding products", error);
    }
  };

  return (
    <ProductsContext.Provider value={{ products, isLoaded, setProducts, addProduct, updateProduct, deleteProduct, addBulkProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
