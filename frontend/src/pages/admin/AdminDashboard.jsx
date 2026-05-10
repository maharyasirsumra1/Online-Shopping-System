import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Plus, 
  Edit, 
  Trash2, 
  TrendingUp, 
  DollarSign,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
        <Icon className="w-6 h-6" />
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          <TrendingUp className="w-3 h-3" /> {trend}
        </span>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
  </motion.div>
);

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    revenue: '$0.00'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch products
      const prodRes = await axios.get('http://localhost:4000/api/products');
      setProducts(prodRes.data.products || prodRes.data);
      
      // Simulated stats for demo - in production fetch from /api/admin/stats
      setStats({
        totalProducts: (prodRes.data.products || prodRes.data).length,
        totalOrders: 124,
        totalUsers: 48,
        revenue: '$12,450.00'
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:4000/api/products/${id}`);
        toast.success('Product deleted successfully');
        fetchDashboardData();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-blue-600" /> Admin Console
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Manage your store products and overview performance.</p>
          </div>
          <Link 
            to="/admin/add-product" 
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200"
          >
            <Plus className="w-5 h-5" /> Add New Product
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Revenue" 
            value={stats.revenue} 
            icon={DollarSign} 
            color="bg-blue-600 text-blue-600" 
            trend="+12%"
          />
          <StatCard 
            title="Total Products" 
            value={stats.totalProducts} 
            icon={Package} 
            color="bg-purple-600 text-purple-600" 
          />
          <StatCard 
            title="Total Orders" 
            value={stats.totalOrders} 
            icon={ShoppingCart} 
            color="bg-orange-600 text-orange-600" 
            trend="+5%"
          />
          <StatCard 
            title="Active Users" 
            value={stats.totalUsers} 
            icon={Users} 
            color="bg-indigo-600 text-indigo-600" 
          />
        </div>

        {/* Product Table Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-slate-900">Inventory Management</h2>
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm w-full md:w-64 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
              <button className="p-2 bg-slate-50 text-slate-500 rounded-lg hover:bg-slate-100">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-xs font-black uppercase tracking-widest">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  [1,2,3].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="5" className="px-6 py-8 h-12 bg-slate-50/20"></td>
                    </tr>
                  ))
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center text-slate-400 font-medium">
                      No products found. Add your first product to get started.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id || product._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                            {product.thumbnail ? (
                              <img src={product.thumbnail?.startsWith('http') ? product.thumbnail : `http://localhost:4000/images/${product.thumbnail}`} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <Package className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 line-clamp-1">{product.name}</p>
                            <p className="text-xs text-slate-400 font-medium">SKU: {product.sku || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-md">
                          {product.category_name || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-700">
                        ${product.price}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
                          <span className="text-sm font-medium text-slate-600">{product.stock} in stock</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link 
                            to={`/admin/edit-product/${product.id || product._id}`}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(product.id || product._id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
