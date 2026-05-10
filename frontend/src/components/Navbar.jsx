import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Search, Menu, Package, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-10">
            <Link to="/" className="text-2xl font-black text-blue-600 tracking-tighter flex items-center gap-2">
              <Package className="w-8 h-8" /> SHOPR
            </Link>
            <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest">
              <Link to="/" className={`${isActive('/') ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'} transition-colors`}>Home</Link>
              <Link to="/store" className={`${isActive('/store') ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'} transition-colors`}>Products</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className={`${isActive('/admin') ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'} flex items-center gap-2`}>
                  <LayoutDashboard className="w-4 h-4" /> Admin
                </Link>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 group focus-within:border-blue-400 transition-all">
              <Search className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500" />
              <input 
                type="text" 
                placeholder="Search products..." 
                className="bg-transparent border-none focus:ring-0 text-sm ml-3 w-48 font-medium"
              />
            </div>

            <Link to="/cart" className="relative p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all group">
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-white shadow-md">
                  {cart.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-6">
                <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-black text-slate-900 leading-none">{user.first_name} {user.last_name}</p>
                    <Link to="/orders" className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-wider">My Orders</Link>
                  </div>
                  <button 
                    onClick={() => { logout(); navigate('/login'); }}
                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn-primary py-3 px-8 text-sm uppercase tracking-widest shadow-blue-100 shadow-lg">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
