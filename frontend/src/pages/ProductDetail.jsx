import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ShoppingCart, 
  Star, 
  Heart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  ArrowLeft, 
  Plus, 
  Minus 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add to cart');
      navigate('/login');
      return;
    }
    try {
      await addToCart(product.id, quantity);
      toast.success('Added to cart');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  if (loading) return <div className="p-20 text-center">Loading product details...</div>;
  if (!product) return <div className="p-20 text-center text-slate-500">Product not found.</div>;

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link to="/store" className="inline-flex items-center gap-1 text-slate-500 hover:text-blue-600 font-medium mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Product Image */}
          <div className="bg-slate-50 rounded-2xl p-12 border border-slate-100 flex items-center justify-center aspect-square">
            <img 
              src={product.thumbnail?.startsWith('http') ? product.thumbnail : `http://localhost:4000/images/${product.thumbnail}`} 
              alt={product.name} 
              className="max-w-full max-h-full object-contain"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/600?text=Product'; }}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">{product.category_name}</p>
              <h1 className="text-4xl font-bold text-slate-900 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <span className="text-sm text-slate-500 font-medium">(4.8 Out of 5.0)</span>
              </div>
            </div>

            <div className="text-3xl font-bold text-slate-900">
              ${parseFloat(product.price).toLocaleString()}
            </div>

            <p className="text-slate-600 leading-relaxed">
              {product.description || 'This high-quality product is designed to provide the best experience for our customers. Made with premium materials and built to last.'}
            </p>

            <div className="pt-8 border-t border-slate-100 space-y-6">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden h-12">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-4 h-full hover:bg-slate-50 text-slate-600 transition-colors"
                  ><Minus className="w-4 h-4" /></button>
                  <span className="w-12 text-center font-bold text-slate-900">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-4 h-full hover:bg-slate-50 text-slate-600 transition-colors"
                  ><Plus className="w-4 h-4" /></button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className="btn-primary h-12 flex-1 max-w-xs flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" /> Add to Cart
                </button>
                
                <button className="p-3 border border-slate-200 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Free Shipping</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">On orders over $500</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <RotateCcw className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Easy Returns</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">30-day guarantee</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-slate-400 pt-4">
                 <ShieldCheck className="w-5 h-5" />
                 <span className="text-xs font-medium">100% Authentic Product Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
