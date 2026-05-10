import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cart, updateQty, removeFromCart, cartTotal, loadingCart } = useCart();
  const { user } = useAuth();

  const getImageUrl = (img) => img ? (img.startsWith('http') ? img : `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/images/${img}`) : 'https://via.placeholder.com/100?text=Product';

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center animate-fade-in">
        <div className="bg-white p-12 md:p-20 rounded-[2.5rem] border border-slate-200 shadow-xl max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-10 text-blue-600">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Your Session Expired</h2>
          <p className="text-slate-500 text-lg mb-12">Please sign in to access your premium shopping cart and proceed to checkout.</p>
          <Link to="/login" className="btn-primary inline-block w-full py-5 text-xl shadow-blue-200 shadow-2xl">
            Sign In to Continue
          </Link>
        </div>
      </div>
    );
  }

  if (loadingCart && cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 flex flex-col justify-center items-center animate-pulse">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium tracking-tight">Loading your selection...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center animate-fade-in">
        <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-10 text-slate-300">
           <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Your Cart is Empty</h2>
        <p className="text-slate-500 text-xl mb-12 max-w-lg mx-auto leading-relaxed">Discover our latest collections and find something you love today.</p>
        <Link to="/store" className="btn-primary inline-flex items-center gap-3 py-5 px-12 text-xl shadow-blue-200 shadow-2xl">
          Browse All Products <ArrowRight className="w-6 h-6" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Shopping Bag</h1>
          <p className="text-slate-500 font-medium mt-2">You have <span className="text-blue-600 font-bold">{cart.length} items</span> in your selection.</p>
        </div>
        <Link to="/store" className="text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
          <ArrowRight className="w-4 h-4 rotate-180" /> Back to Store
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <tr>
                    <th className="px-8 py-6">Product Details</th>
                    <th className="px-8 py-6">Price</th>
                    <th className="px-8 py-6">Quantity</th>
                    <th className="px-8 py-6">Subtotal</th>
                    <th className="px-8 py-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cart.map((item) => (
                    <tr key={item.product_id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-8">
                        <div className="flex items-center gap-6">
                          <div className="w-20 h-20 bg-slate-50 rounded-2xl p-3 flex-shrink-0 border border-slate-100 group-hover:scale-105 transition-transform">
                            <img 
                              src={getImageUrl(item.product_image)} 
                              alt={item.product_title} 
                              className="w-full h-full object-contain"
                              onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Product'; }}
                            />
                          </div>
                          <Link to={`/product/${item.product_id}`} className="font-bold text-slate-900 text-lg hover:text-blue-600 transition-colors line-clamp-2 max-w-[200px]">
                            {item.product_title}
                          </Link>
                        </div>
                      </td>
                      <td className="px-8 py-8 font-medium text-slate-500">
                        ${parseFloat(item.product_price).toLocaleString()}
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex items-center border-2 border-slate-100 rounded-xl w-fit overflow-hidden bg-white">
                          <button 
                            onClick={() => updateQty(item.product_id, Math.max(1, item.qty - 1))}
                            className="px-4 py-2 hover:bg-slate-50 text-slate-400 hover:text-blue-600 transition-all"
                          ><Minus className="w-4 h-4" /></button>
                          <span className="w-10 text-center font-black text-slate-900">{item.qty}</span>
                          <button 
                            onClick={() => updateQty(item.product_id, item.qty + 1)}
                            className="px-4 py-2 hover:bg-slate-50 text-slate-400 hover:text-blue-600 transition-all"
                          ><Plus className="w-4 h-4" /></button>
                        </div>
                      </td>
                      <td className="px-8 py-8 font-black text-slate-900 text-xl">
                        ${(item.product_price * item.qty).toLocaleString()}
                      </td>
                      <td className="px-8 py-8 text-right">
                        <button 
                          onClick={() => removeFromCart(item.product_id)}
                          className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6">
             <div className="flex-1 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                <Truck className="w-6 h-6 text-blue-600" />
                <div>
                   <p className="text-sm font-bold text-slate-900">Complimentary Shipping</p>
                   <p className="text-xs text-slate-500">Your order qualifies for our express global delivery service.</p>
                </div>
             </div>
             <div className="flex-1 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
                <div>
                   <p className="text-sm font-bold text-slate-900">Buyer Protection</p>
                   <p className="text-xs text-slate-500">All transactions are encrypted and monitored for your security.</p>
                </div>
             </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 sticky top-28">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl space-y-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Order Summary</h2>
            
            <div className="space-y-6 text-sm font-bold uppercase tracking-widest">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-slate-900">${cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span className="text-green-600 font-black">Free</span>
              </div>
              <div className="pt-8 border-t border-slate-100 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-900">Total Amount</span>
                  <span className="text-4xl font-black text-blue-600 tracking-tighter">${cartTotal.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-slate-400 tracking-normal normal-case font-medium">Inclusive of all local taxes and duties.</p>
              </div>
            </div>
            
            <Link 
              to="/checkout" 
              className="btn-primary w-full py-6 text-xl flex items-center justify-center gap-3 shadow-blue-100 shadow-2xl active:scale-[0.98]"
            >
              Proceed to Checkout <ArrowRight className="w-6 h-6" />
            </Link>
            
            <div className="flex items-center justify-center gap-3 pt-4 grayscale opacity-40">
               <div className="h-6 w-10 bg-slate-200 rounded"></div>
               <div className="h-6 w-10 bg-slate-200 rounded"></div>
               <div className="h-6 w-10 bg-slate-200 rounded"></div>
               <div className="h-6 w-10 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
