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
}

interface ProductsContextType {
  products: AppProduct[];
  setProducts: React.Dispatch<React.SetStateAction<AppProduct[]>>;
  addProduct: (product: Partial<AppProduct>) => void;
  updateProduct: (id: string | number, updates: Partial<AppProduct>) => void;
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
        const res = await fetch('/api/products');
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
        setProducts(prev => prev.map(p => String(p.id) === String(id) ? { ...p, ...updates } : p));
      }
    } catch (error) {
      console.error("Error updating product", error);
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
        setProducts(prev => [data.product, ...prev]);
      }
    } catch (error) {
      console.error("Error adding product", error);
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
        const fetchRes = await fetch('/api/products');
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
    <ProductsContext.Provider value={{ products, setProducts, addProduct, updateProduct, deleteProduct, addBulkProducts }}>
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
