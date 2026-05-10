import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, SlidersHorizontal, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const Store = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    page: 1
  });

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { category, search, page } = filters;
      const response = await axios.get(`http://localhost:4000/api/products?category=${category}&search=${search}&page=${page}`);
      setProducts(response.data.data);
    } catch (error) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 fade-in">
      {/* Store Header */}
      <section className="bg-white border-b border-slate-200 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4">The Store</h1>
              <p className="text-lg text-slate-500 font-medium">Discover our meticulously curated collection of professional goods.</p>
            </div>
            
            <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-200 w-full md:w-auto">
               <div className="relative flex-1 md:w-64">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <input 
                    type="text" 
                    placeholder="Search catalog..." 
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm"
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                 />
               </div>
               <button className="p-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all">
                 <Filter className="w-5 h-5" />
               </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Sidebar Filters */}
          <aside className="lg:w-64 space-y-10">
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Collections</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => setFilters({...filters, category: ''})}
                  className={`w-full text-left px-5 py-3 rounded-xl text-sm font-bold transition-all ${filters.category === '' ? 'bg-blue-600 text-white shadow-xl translate-x-2' : 'text-slate-500 hover:bg-white hover:text-blue-600'}`}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button 
                    key={cat.id}
                    onClick={() => setFilters({...filters, category: cat.id})}
                    className={`w-full text-left px-5 py-3 rounded-xl text-sm font-bold transition-all ${filters.category === cat.id ? 'bg-blue-600 text-white shadow-xl translate-x-2' : 'text-slate-500 hover:bg-white hover:text-blue-600'}`}
                  >
                    {cat.category_name}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 bg-blue-600 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-150 transition-transform"></div>
               <ShoppingBag className="w-10 h-10 mb-6 opacity-40" />
               <h4 className="text-xl font-black mb-2 tracking-tight">Need Help?</h4>
               <p className="text-xs text-blue-100 font-medium leading-relaxed mb-6">Our professional consultants are available 24/7 to assist with your selection.</p>
               <button className="w-full py-3 bg-white text-blue-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition-all">
                 Contact Us
               </button>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-10">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Showing <span className="text-slate-900">{products.length}</span> Results
              </p>
              <div className="flex items-center gap-2 text-slate-400">
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Sort: Newest</span>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-[2rem] h-96 animate-pulse border border-slate-100"></div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-200 shadow-sm">
                <Package className="w-20 h-20 text-slate-200 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-slate-900 mb-2">No items found</h3>
                <p className="text-slate-500 font-medium">Try adjusting your search or category filters.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Store;
