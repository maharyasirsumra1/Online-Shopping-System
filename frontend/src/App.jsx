import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

import Home from './pages/Home';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import NotFound from './pages/NotFound';

const Footer = () => (
  <footer className="bg-slate-50 border-t border-slate-200 py-12 mt-auto">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-blue-600">SHOPR</h3>
        <p className="text-sm text-slate-500 leading-relaxed">A simple, professional, and reliable online shopping system designed for you.</p>
      </div>
      <div>
        <h4 className="font-bold text-slate-900 mb-4">Quick Links</h4>
        <ul className="space-y-2 text-sm text-slate-600">
          <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
          <li><Link to="/store" className="hover:text-blue-600">Shop Products</Link></li>
          <li><Link to="/cart" className="hover:text-blue-600">My Cart</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-slate-900 mb-4">Customer Care</h4>
        <ul className="space-y-2 text-sm text-slate-600">
          <li><Link to="#" className="hover:text-blue-600">Contact Us</Link></li>
          <li><Link to="#" className="hover:text-blue-600">Shipping Policy</Link></li>
          <li><Link to="#" className="hover:text-blue-600">Returns & Refunds</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-slate-900 mb-4">Newsletter</h4>
        <div className="flex gap-2">
          <input 
            type="email" 
            placeholder="Your email" 
            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none" 
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Join</button>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 pt-12 mt-12 border-t border-slate-200 text-center text-xs text-slate-400">
      &copy; 2026 SHOPR. Simple & Professional E-Commerce.
    </div>
  </footer>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col font-sans">
            <Toaster 
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#fff',
                  color: '#1e293b',
                  fontSize: '14px',
                  fontWeight: '500',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0'
                },
              }} 
            />
            <Navbar />
            <main className="flex-grow">
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/store" element={<Store />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  
                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } />
                  <Route path="/order-success" element={
                    <ProtectedRoute>
                      <OrderSuccess />
                    </ProtectedRoute>
                  } />
                  <Route path="/orders" element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  <Route path="/admin" element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/add-product" element={
                    <ProtectedRoute adminOnly={true}>
                      <AddProduct />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/edit-product/:id" element={
                    <ProtectedRoute adminOnly={true}>
                      <EditProduct />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ErrorBoundary>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
