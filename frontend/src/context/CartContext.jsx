/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoadingCart(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/cart`);
      setCart(response.data);
    } catch (error) {
      console.error('Failed to fetch cart', error);
    } finally {
      setLoadingCart(false);
    }
  };

  const addToCart = async (productId, qty = 1) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/cart`, { productId, qty });
      fetchCart();
    } catch (error) {
      console.error('Failed to add to cart', error);
      throw error;
    }
  };

  const updateQty = async (productId, qty) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/cart`, { productId, qty });
      fetchCart();
    } catch (error) {
      console.error('Failed to update qty', error);
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/cart/${productId}`);
      fetchCart();
    } catch (error) {
      console.error('Failed to remove from cart', error);
      throw error;
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product_price * item.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeFromCart, cartTotal, loadingCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

export default CartContext;
