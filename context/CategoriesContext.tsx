'use client';

import React, { createContext, useContext, useState } from 'react';

export interface Category {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Draft';
  productsCount: number;
  image: string; // Base64 or URL
}

interface CategoriesContextType {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'productsCount'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  isLoaded: boolean;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch from Database
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Failed to fetch categories from DB", error);
    } finally {
      setIsLoaded(true);
    }
  };

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (categoryData: Omit<Category, 'id' | 'productsCount'>) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      });
      const data = await res.json();
      if (data.success) {
        setCategories((prev) => [data.category, ...prev]);
      }
    } catch (error) {
      console.error("Error adding category", error);
    }
  };

  const updateCategory = async (id: string, updatedData: Partial<Category>) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updatedData })
      });
      const data = await res.json();
      if (data.success) {
        setCategories(categories.map(cat => cat.id === id ? { ...cat, ...data.category } : cat));
      }
    } catch (error) {
      console.error("Error updating category", error);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (error) {
      console.error("Error deleting category", error);
    }
  };

  return (
    <CategoriesContext.Provider value={{ categories, addCategory, updateCategory, deleteCategory, isLoaded }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
}
