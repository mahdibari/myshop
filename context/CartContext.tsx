'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the Product interface that matches what you use across components
// Make sure this Product interface is consistent across your application (ProductPage, CartContext)
export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description?: string; // Optional: if your product API returns it
  discount_percentage?: number; // Optional
  category?: string; // Optional
  inventory?: number; // Optional
  brand?: string; // Optional
  features?: string[]; // Optional
}

// Represents an item in the cart, which is a Product with an added quantity
interface CartItem extends Product {
  quantity: number;
}

// Defines the shape of the CartContext's value
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void; // <--- UPDATED: now accepts quantity
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateQuantity: (productId: string, quantity: number) => void;
  totalPrice: number;
}

// Create the Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart Provider Component
export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Function to add a product to the cart with a specified quantity
  const addToCart = (product: Product, quantityToAdd: number) => { // <--- UPDATED: now accepts quantityToAdd
    setCartItems((prev) => {
      const existingItemIndex = prev.findIndex(item => item.id === product.id);

      if (existingItemIndex !== -1) {
        // If product already exists, update its quantity
        const newCart = [...prev];
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: newCart[existingItemIndex].quantity + quantityToAdd, // Add specified quantity
        };
        return newCart;
      } else {
        // If product is new, add it with the specified quantity
        return [...prev, { ...product, quantity: quantityToAdd }];
      }
    });
  };

  // Function to remove an item from the cart
  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter(item => item.id !== productId));
  };

  // Function to clear the entire cart
  const clearCart = () => setCartItems([]);

  // Function to update the quantity of a specific item in the cart
  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: quantity > 0 ? quantity : 1 } : item // Ensure quantity is at least 1
      )
    );
  };

  // Calculate the total price of items in the cart
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

// Custom hook to use the CartContext
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    // This error will be thrown if useCart is called outside of a CartProvider
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}


