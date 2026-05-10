import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to add items to cart');
      return;
    }
    setIsAdding(true);
    try {
      await addToCart(product.id, 1);
      toast.success('Added to selection');
    } catch (error) {
      toast.error('Failed to add item');
    } finally {
      setIsAdding(false);
    }
  };

  const imageUrl = product.thumbnail 
    ? (product.thumbnail.startsWith('http') ? product.thumbnail : `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/images/${product.thumbnail}`)
    : 'https://via.placeholder.com/300?text=Premium+Product';

  return (
    <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:border-blue-200 transition-all group relative">
      <Link to={`/product/${product.id}`} className="block aspect-[4/5] bg-white p-10 overflow-hidden relative">
        <img 
          src={imageUrl} 
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=Premium+Product'; }}
        />
        {/* Quick Add Overlay */}
        <button 
          onClick={handleAddToCart}
          disabled={isAdding}
          className="absolute bottom-6 right-6 p-4 bg-blue-600 text-white rounded-2xl shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-blue-700 active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Plus className="w-6 h-6" />
          )}
        </button>
      </Link>
      
      <div className="p-8 pt-0">
        <div className="flex justify-between items-start mb-2">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">{product.category_name}</p>
          <div className="flex items-center gap-1">
             <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
             <span className="text-[10px] font-black text-slate-400">4.8</span>
          </div>
        </div>
        
        <Link to={`/product/${product.id}`} className="block text-xl font-black text-slate-800 hover:text-blue-600 transition-colors line-clamp-1 mb-4 tracking-tight">
          {product.name}
        </Link>
        
        <div className="flex justify-between items-end">
          <div className="space-y-1">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Price</p>
             <p className="text-3xl font-black text-slate-900 tracking-tighter">${parseFloat(product.price).toLocaleString()}</p>
          </div>
          <Link 
            to={`/product/${product.id}`}
            className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
          >
            Details <Plus className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
