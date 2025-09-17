// CartContext.js
import React, { createContext, useContext, useState } from "react";
import {
  addItemToCart,
  removeItemFromCart,
  getTotalAmount,
  getTotalQuantity,
} from "./helpers";

// Create Context
const CartContext = createContext();

// Provider Component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([
    {
      id: 'PRD001',
      cartId: 'cart_001',
      name: 'Shirt Dry Clean',
      price: 50,
      quantity: 2,
      category: 'Dry Clean',
      subCategory: 'Men',
      customizations: {
        color: 'White',
        brand: 'Nike',
        hanger: true,
        starch: 'Light'
      },
      itemNotes: 'Handle with care, remove stains'
    },
    {
      id: 'PRD002', 
      cartId: 'cart_002',
      name: 'Dress Dry Clean',
      price: 150,
      quantity: 1,
      category: 'Dry Clean',
      subCategory: 'Women',
      customizations: {
        color: 'Blue',
        material: 'Silk',
        box: true,
        detergent: 'Sensitive'
      },
      itemNotes: 'Delicate fabric'
    },
    {
      id: 'PRD003',
      cartId: 'cart_003', 
      name: 'Trouser Wash',
      price: 40,
      quantity: 3,
      category: 'Wash and Fold',
      subCategory: 'Men',
      customizations: {
        washTemperature: 'Warm',
        fold: true
      }
    }
  ]);
  const [customer, setCustomer] = useState('9876543210');

  // Add item to cart - enhanced to handle customizations
  const addToCart = (item) => {
    setCart((currentCart) => {
      // Check if item with same customizations already exists
      const existingItemIndex = currentCart.findIndex(cartItem => 
        (cartItem.cartId && cartItem.cartId === item.cartId) ||
        (cartItem.id === item.id && 
         JSON.stringify(cartItem.customizations || {}) === JSON.stringify(item.customizations || {}))
      );

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedCart = [...currentCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1
        };
        return updatedCart;
      } else {
        // Add new item with unique cartId if it has customizations
        const newItem = {
          ...item,
          quantity: item.quantity || 1,
          cartId: item.cartId || `${item.id}_${Date.now()}_${Math.random()}`
        };
        return [...currentCart, newItem];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (item) => {
    setCart((currentCart) => {
      const existingItemIndex = currentCart.findIndex(cartItem => 
        (cartItem.cartId && cartItem.cartId === item.cartId) ||
        (cartItem.id === item.id && 
         JSON.stringify(cartItem.customizations || {}) === JSON.stringify(item.customizations || {}))
      );

      if (existingItemIndex >= 0) {
        const updatedCart = [...currentCart];
        if (updatedCart[existingItemIndex].quantity > 1) {
          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            quantity: updatedCart[existingItemIndex].quantity - 1
          };
          return updatedCart;
        } else {
          return updatedCart.filter((_, index) => index !== existingItemIndex);
        }
      }
      return currentCart;
    });
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    setCustomer('');
  };

  // Add dummy data for testing
  const addDummyData = () => {
    setCart([
      {
        id: 'PRD001',
        cartId: 'cart_001',
        name: 'Shirt Dry Clean',
        price: 50,
        quantity: 2,
        category: 'Dry Clean',
        subCategory: 'Men',
        customizations: {
          color: 'White',
          brand: 'Nike',
          hanger: true,
          starch: 'Light'
        },
        itemNotes: 'Handle with care, remove stains'
      },
      {
        id: 'PRD002', 
        cartId: 'cart_002',
        name: 'Dress Dry Clean',
        price: 150,
        quantity: 1,
        category: 'Dry Clean',
        subCategory: 'Women',
        customizations: {
          color: 'Blue',
          material: 'Silk',
          box: true,
          detergent: 'Sensitive'
        },
        itemNotes: 'Delicate fabric'
      },
      {
        id: 'PRD003',
        cartId: 'cart_003', 
        name: 'Trouser Wash',
        price: 40,
        quantity: 3,
        category: 'Wash and Fold',
        subCategory: 'Men',
        customizations: {
          washTemperature: 'Warm',
          fold: true
        }
      }
    ]);
    setCustomer('9876543210');
  };

  // Update item in cart
  const updateCartItem = (cartId, updates) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        (item.cartId === cartId || item.id === cartId)
          ? { ...item, ...updates }
          : item
      )
    );
  };

  // Remove specific item completely
  const removeCartItem = (cartId) => {
    setCart((currentCart) =>
      currentCart.filter(item => item.cartId !== cartId && item.id !== cartId)
    );
  };

  const toggleHanger = (itemId, isHanger) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        (item.id === itemId || item.cartId === itemId)
          ? {
              ...item,
              hanger: isHanger,
            }
          : item
      )
    );
  };
  
  // Get total amount - enhanced to handle different price fields
  const total = cart.reduce((sum, item) => {
    const price = item.price || item.rate_per_unit || 0;
    return sum + (price * item.quantity);
  }, 0);
  
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartItem,
        removeCartItem,
        toggleHanger,
        clearCart,
        addDummyData,
        customer,
        setCustomerContact: setCustomer,
        total,
        totalQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use Cart Context
export const useCart = () => useContext(CartContext);
