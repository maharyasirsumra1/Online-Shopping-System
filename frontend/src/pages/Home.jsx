import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowRight, Star, ShieldCheck, Truck, RotateCcw, ShoppingBag, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/products?limit=4');
        setFeaturedProducts(response.data.data);
      } catch (error) {
        console.error('Failed to fetch products');
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-white fade-in">
      {/* Hero Section */}
      <section className="bg-slate-50 py-24 md:py-40">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="space-y-10 text-center md:text-left">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest">
              <Zap className="w-4 h-4" /> New Arrivals 2026
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter">
              The Simple <br />
              <span className="text-blue-600">Shopping</span> <br />
              Standard.
            </h1>
            <p className="text-xl text-slate-500 max-w-xl font-medium leading-relaxed">
              Experience a professional, distraction-free shopping environment. High-quality products, verified sellers, and lightning-fast fulfillment.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start">
              <Link to="/store" className="btn-primary py-5 px-12 text-xl flex items-center justify-center gap-3 shadow-blue-100 shadow-2xl active:scale-[0.98]">
                Start Shopping <ArrowRight className="w-6 h-6" />
              </Link>
              <Link to="/store" className="btn-secondary py-5 px-12 text-xl">
                Collections
              </Link>
            </div>
          </div>
          <div className="hidden md:block relative">
            <div className="absolute -inset-4 bg-blue-100 rounded-[3rem] blur-2xl opacity-40 animate-pulse"></div>
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop" 
              alt="Professional Shopping" 
              className="relative rounded-[3rem] shadow-2xl border border-white"
            />
          </div>
        </div>
      </section>

      {/* Features - Prominent Visibility */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: Truck, title: 'Express Delivery', desc: 'Secure doorstep delivery within 48 hours nationwide.' },
            { icon: ShieldCheck, title: 'Verified Security', desc: 'Bank-grade encryption for every transaction you make.' },
            { icon: RotateCcw, title: 'Seamless Returns', desc: 'Automated return processing with no questions asked.' }
          ].map((feature, i) => (
            <div key={i} className="p-10 bg-white border border-slate-200 rounded-[2.5rem] text-center space-y-6 hover:shadow-xl hover:border-blue-200 transition-all group">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <feature.icon className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{feature.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products - High Visibility */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-8 text-center md:text-left">
            <div>
              <p className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] mb-3">Our Selection</p>
              <h2 className="text-5xl font-black text-slate-900 tracking-tight">Featured Collections</h2>
            </div>
            <Link to="/store" className="text-sm font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-[0.2em] flex items-center gap-2 pb-2 border-b-2 border-slate-200 hover:border-blue-600">
              Explore All <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:border-blue-200 transition-all group cursor-pointer">
                <Link to={`/product/${product.id}`} className="block aspect-[4/5] bg-white p-10 overflow-hidden relative">
                  <img 
                    src={product.thumbnail?.startsWith('http') ? product.thumbnail : `http://localhost:4000/images/${product.thumbnail}`} 
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=Premium+Product'; }}
                  />
                  <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity">
                     <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-xl">
                        View Details
                     </span>
                  </div>
                </Link>
                <div className="p-8 pt-0">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">{product.category_name}</p>
                  <Link to={`/product/${product.id}`} className="block text-xl font-black text-slate-800 hover:text-blue-600 transition-colors line-clamp-1 mb-4">
                    {product.name}
                  </Link>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-black text-slate-900 tracking-tighter">${parseFloat(product.price).toLocaleString()}</span>
                    <Link to={`/product/${product.id}`} className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                      <ShoppingBag className="w-6 h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Heroic CTA */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="bg-slate-900 rounded-[3rem] p-16 md:p-32 text-center text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full -mr-48 -mt-48 blur-3xl"></div>
           <div className="relative z-10">
             <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter">Ready for a better experience?</h2>
             <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-16 leading-relaxed font-medium">Join our community of professional shoppers and experience the future of digital retail today.</p>
             <Link to="/register" className="bg-white text-slate-900 px-16 py-6 rounded-2xl font-black text-2xl hover:scale-105 transition-all inline-block shadow-2xl active:scale-95">
               Create Account
             </Link>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
