import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';

const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-12 h-12" />
        </div>
        
        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Order Placed Successfully!</h1>
        <p className="text-slate-500 text-lg mb-10">Thank you for your purchase. We are processing your order and will notify you soon.</p>

        <div className="space-y-4">
          <Link 
            to="/orders" 
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            View My Orders <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            to="/store" 
            className="btn-secondary w-full flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" /> Continue Shopping
          </Link>
        </div>
        
        <p className="mt-12 text-sm text-slate-400">A confirmation email has been sent to your registered address.</p>
      </div>
    </div>
  );
};

export default OrderSuccess;
