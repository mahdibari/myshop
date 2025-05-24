'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  discount_percentage?: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  updateQuantity: (productId: number, quantity: number) => void;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const index = prev.findIndex(item => item.id === product.id);
      if (index !== -1) {
        const newCart = [...prev];
        newCart[index].quantity += 1;
        return newCart;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems((prev) => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => setCartItems([]);

  const updateQuantity = (productId: number, quantity: number) => {
    setCartItems((prev) =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: quantity > 0 ? quantity : 1 } : item
      )
    );
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    const priceAfterDiscount = item.discount_percentage
      ? item.price * (1 - item.discount_percentage / 100)
      : item.price;
    return sum + priceAfterDiscount * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, updateQuantity, totalPrice }}>
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


