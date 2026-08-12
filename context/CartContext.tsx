'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';


export interface CartItem {
  id: string;
  name: string;
  price: string;
  size: string;
  quantity: number;
  image?: string;
  stock?: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  activeAnimation: { product: ShopProduct; size: string } | null;
  triggerPackagingAnimation: (product: ShopProduct, size: string) => void;
  confirmAddToCart: () => void;
  addToCartDirect: (product: { id: string; name: string; price: string; image?: string }, size: string) => void;
  removeFromCart: (id: string, size: string) => void;
  clearCart: () => void;
  isGiftWrap: boolean;
  setIsGiftWrap: (val: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeAnimation, setActiveAnimation] = useState<{ product: ShopProduct; size: string } | null>(null);
  const [isGiftWrap, setIsGiftWrap] = useState(false);

  // Sync cart count when items change
  useEffect(() => {
    const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(count);
  }, [cartItems]);

  // Direct add to cart (used for quantity controls or bypassing animation)
  const addToCartDirect = (product: { id: string; name: string; price: string; image?: string; stock?: number }, size: string) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id && item.size === size
      );

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        const existingItem = newItems[existingItemIndex];
        const availableStock = product.stock !== undefined ? product.stock : (existingItem.stock !== undefined ? existingItem.stock : Infinity);

        if (existingItem.quantity >= availableStock) {
          alert(`Only ${availableStock} quantity available in stock.`);
          return prevItems;
        }

        existingItem.quantity += 1;
        if (product.stock !== undefined) existingItem.stock = product.stock;
        return newItems;
      }

      const availableStock = product.stock !== undefined ? product.stock : Infinity;
      if (1 > availableStock) {
        alert('Item is out of stock.');
        return prevItems;
      }

      return [
        ...prevItems,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image || `/images/${product.id}.png`,
          size,
          quantity: 1,
          stock: product.stock
        },
      ];
    });
  };

  // Triggers the fullscreen packaging animation
  const triggerPackagingAnimation = (product: ShopProduct, size: string) => {
    setActiveAnimation({ product, size });
  };

  // Confirms and actually adds the item to the cart after the animation finishes
  const confirmAddToCart = () => {
    if (!activeAnimation) return;
    const { product, size } = activeAnimation;
    addToCartDirect({ id: product.id, name: product.name, price: product.price, image: (product as any).image, stock: (product as any).stock }, size);
    setActiveAnimation(null);
  };

  const removeFromCart = (id: string, size: string) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id && item.size === size
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        activeAnimation,
        triggerPackagingAnimation,
        confirmAddToCart,
        addToCartDirect,
        removeFromCart,
        clearCart,
        isGiftWrap,
        setIsGiftWrap
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
