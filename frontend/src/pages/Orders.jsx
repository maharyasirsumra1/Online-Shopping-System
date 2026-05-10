import React, { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/orders/my-orders`);
        setOrders(response.data);
      } catch (error) {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      case 'Shipped': return 'bg-blue-100 text-blue-700';
      case 'Processing': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Package className="w-16 h-16 text-slate-200 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No orders found</h2>
        <p className="text-slate-500 mb-8">You haven't placed any orders yet.</p>
        <Link to="/store" className="btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-10">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-wrap justify-between items-center gap-4">
              <div className="flex gap-8">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Order Placed</p>
                  <p className="text-sm font-bold text-slate-700">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="text-sm font-bold text-slate-700">${parseFloat(order.total_amount).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Order #</p>
                  <p className="text-sm font-bold text-slate-700">{order.id}</p>
                </div>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusStyle(order.order_status)}`}>
                {order.order_status}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-6 justify-between items-start">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-slate-400 mt-1" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">{order.shipping_address}</p>
                      <p className="text-xs text-slate-500">{order.city}, {order.postal_code}</p>
                    </div>
                  </div>
                </div>
                <button className="text-blue-600 font-bold text-sm hover:underline">
                  View Order Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
