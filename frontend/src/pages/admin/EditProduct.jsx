import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Package, ArrowLeft, Save, Image as ImageIcon, Edit3, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    stock: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/products/${id}`);
      const product = response.data;
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category_id: product.category_id || '',
        stock: product.stock || '',
      });
      setCurrentImage(product.thumbnail || '');
    } catch (error) {
      toast.error('Failed to fetch product details');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category_id', formData.category_id);
    data.append('stock', formData.stock);
    if (imageFile) {
      data.append('thumbnail', imageFile);
    }

    try {
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/products/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Product updated successfully!');
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <Link 
          to="/admin" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Console
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden"
        >
          <div className="p-8 border-b border-slate-50 bg-slate-50/30">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Edit3 className="w-8 h-8 text-blue-600" /> Edit Product
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Update the details for "{formData.name}".</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-black text-slate-700 uppercase tracking-wider">Product Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-black text-slate-700 uppercase tracking-wider">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 uppercase tracking-wider">Category</label>
                <select 
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                >
                  <option value="1">Electronics</option>
                  <option value="2">Mobiles</option>
                  <option value="3">Laptops</option>
                  <option value="4">Fashion</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 uppercase tracking-wider">Price ($)</label>
                <input 
                  type="number" 
                  name="price"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 uppercase tracking-wider">Stock Quantity</label>
                <input 
                  type="number" 
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-black text-slate-700 uppercase tracking-wider">Product Image</label>
                <div className="flex gap-4">
                  <input 
                    type="file" 
                    onChange={handleFileChange}
                    accept="image/*"
                    className="flex-1 px-5 py-3 bg-slate-50 border-none rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-100 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                    {imagePreview || currentImage ? (
                      <img src={imagePreview || (currentImage.startsWith('http') ? currentImage : `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/images/${currentImage}`)} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 flex gap-4">
              <button 
                type="button"
                onClick={() => navigate('/admin')}
                className="flex-1 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all uppercase tracking-widest text-xs"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={saving}
                className="flex-[2] px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 uppercase tracking-widest text-xs disabled:opacity-50"
              >
                {saving ? 'Saving Changes...' : (
                  <>
                    <Save className="w-4 h-4" /> Update Product
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditProduct;
