const STORAGE_KEY = 'online-shop-token';

export const getToken = () => localStorage.getItem(STORAGE_KEY);
export const setToken = (token) => localStorage.setItem(STORAGE_KEY, token);
export const logout = () => localStorage.removeItem(STORAGE_KEY);
export const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
