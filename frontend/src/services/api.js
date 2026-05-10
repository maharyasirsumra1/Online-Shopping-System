import { getAuthHeaders } from '../utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
    credentials: 'include',
    ...options,
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw body || { error: 'Request failed' };
  }
  return body;
};

export const login = (payload) => request('/auth/login', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const register = (payload) => request('/auth/register', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const fetchProducts = (query) => {
  const queryString = new URLSearchParams(query).toString();
  return request(`/products?${queryString}`);
};

export const fetchProduct = (id) => request(`/products/${id}`);
export const fetchCategories = () => request('/categories');
export const fetchBrands = () => request('/brands');
export const fetchReviews = (productId) => request(`/reviews/product/${productId}`);
export const submitReview = (payload) => request('/reviews', { method: 'POST', body: JSON.stringify(payload) });
export const fetchCart = () => request('/cart');
export const addCartItem = (payload) => request('/cart', { method: 'POST', body: JSON.stringify(payload) });
export const updateCartItem = (productId, payload) => request(`/cart/${productId}`, { method: 'PUT', body: JSON.stringify(payload) });
export const removeCartItem = (productId) => request(`/cart/${productId}`, { method: 'DELETE' });
export const fetchWishlist = () => request('/wishlist');
export const addWishlistItem = (payload) => request('/wishlist', { method: 'POST', body: JSON.stringify(payload) });
export const removeWishlistItem = (productId) => request(`/wishlist/${productId}`, { method: 'DELETE' });
export const checkoutOrder = (payload) => request('/orders', { method: 'POST', body: JSON.stringify(payload) });
export const fetchOrders = () => request('/orders');
export const fetchUser = () => request('/auth/me');
