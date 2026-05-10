import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CreditCard, 
  Truck, 
  MapPin, 
  Phone, 
  User, 
  Mail, 
  ArrowLeft, 
  ShieldCheck, 
  ChevronRight,
  Loader2,
  Lock,
  Package
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cart, cartTotal, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    shipping_address: user?.address || '',
    city: user?.city || '',
    postal_code: user?.zip || '',
    phone: user?.phone || '',
    payment_method: 'Credit Card',
    // Card details (simulated)
    card_name: `${user?.first_name || ''} ${user?.last_name || ''}`,
    card_number: '',
    exp_date: '',
    cvv: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/orders`, {
        shipping_address: formData.shipping_address,
        city: formData.city,
        postal_code: formData.postal_code,
        phone: formData.phone,
        payment_method: formData.payment_method
      });

      if (response.status === 201) {
        toast.success('Order placed successfully!');
        fetchCart(); 
        navigate('/order-success');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center animate-fade-in">
        <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-10 text-slate-300">
           <Package className="w-12 h-12" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Checkout Unavailable</h2>
        <p className="text-slate-500 text-xl mb-12 max-w-lg mx-auto leading-relaxed">Please add items to your cart before proceeding to the checkout portal.</p>
        <Link to="/store" className="btn-primary inline-flex items-center gap-3 py-5 px-12 text-xl shadow-blue-200 shadow-2xl">
          <ArrowLeft className="w-6 h-6" /> Back to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-16 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-blue-600 uppercase tracking-[0.2em] mb-4 group transition-colors">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Bag
            </Link>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">Complete Order</h1>
          </div>
          <div className="flex items-center gap-4 px-6 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
             <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                <Lock className="w-5 h-5" />
             </div>
             <div>
                <p className="text-xs font-black text-slate-900 uppercase tracking-widest leading-none">Secure Transaction</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">SSL Encrypted Portal</p>
             </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Form Side */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Shipping Section */}
            <div className="bg-white p-10 md:p-16 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <Truck className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Delivery Logistics</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="md:col-span-2 space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Street Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      required
                      name="shipping_address"
                      value={formData.shipping_address}
                      onChange={handleChange}
                      placeholder="e.g. 123 Professional Way" 
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">City</label>
                  <input 
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city" 
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Postal Code</label>
                  <input 
                    required
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    placeholder="e.g. 10001" 
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold transition-all"
                  />
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Verified Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000" 
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-white p-10 md:p-16 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Payment Method</h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 mb-12">
                <label className={`flex-1 flex items-center gap-4 p-6 rounded-2xl border-4 cursor-pointer transition-all ${formData.payment_method === 'Credit Card' ? 'border-blue-600 bg-blue-50/20' : 'border-slate-50 hover:border-slate-100'}`}>
                  <input type="radio" name="payment_method" value="Credit Card" checked={formData.payment_method === 'Credit Card'} onChange={handleChange} className="w-5 h-5 text-blue-600" />
                  <span className="text-lg font-black text-slate-900">Credit Card</span>
                </label>
                <label className={`flex-1 flex items-center gap-4 p-6 rounded-2xl border-4 cursor-pointer transition-all ${formData.payment_method === 'COD' ? 'border-blue-600 bg-blue-50/20' : 'border-slate-50 hover:border-slate-100'}`}>
                  <input type="radio" name="payment_method" value="COD" checked={formData.payment_method === 'COD'} onChange={handleChange} className="w-5 h-5 text-blue-600" />
                  <span className="text-lg font-black text-slate-900">Cash on Delivery</span>
                </label>
              </div>

              {formData.payment_method === 'Credit Card' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-fade-in">
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Cardholder Name</label>
                    <div className="relative">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      <input 
                        name="card_name"
                        value={formData.card_name}
                        onChange={handleChange}
                        placeholder="Name as it appears on card" 
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold transition-all"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      <input 
                        name="card_number"
                        value={formData.card_number}
                        onChange={handleChange}
                        placeholder="0000 0000 0000 0000" 
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Expiry Date</label>
                    <input 
                      name="exp_date"
                      value={formData.exp_date}
                      onChange={handleChange}
                      placeholder="MM / YY" 
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Security Code (CVV)</label>
                    <input 
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123" 
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold transition-all"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Summary Side */}
          <div className="lg:col-span-4 sticky top-28">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl">
              <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Order Manifest</h2>
              
              <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto no-scrollbar">
                {cart.map((item) => (
                  <div key={item.product_id} className="flex gap-6 items-center group">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl p-2 border border-slate-100 flex-shrink-0 group-hover:scale-105 transition-transform">
                      <img src={item.product_image?.startsWith('http') ? item.product_image : `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/images/${item.product_image}`} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">{item.product_title}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Qty: {item.qty} × ${item.product_price}</p>
                    </div>
                    <p className="font-black text-slate-900 text-sm">${(item.product_price * item.qty).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-slate-100 mb-10 text-sm font-black uppercase tracking-widest">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-slate-900">${cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between pt-6 border-t border-slate-100 items-center">
                  <span className="text-slate-900">Payable Total</span>
                  <span className="text-4xl font-black text-blue-600 tracking-tighter">${cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-6 text-xl flex items-center justify-center gap-3 shadow-blue-100 shadow-2xl active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-7 h-7 animate-spin" /> : <>Finalize Order <ChevronRight className="w-6 h-6" /></>}
              </button>

              <div className="mt-10 flex flex-col items-center gap-4 text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Authenticity Guaranteed</span>
                </div>
                <p className="text-[10px] text-center normal-case font-medium leading-relaxed px-4 opacity-60">By placing this order, you agree to our professional terms of service and shipping policies.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
