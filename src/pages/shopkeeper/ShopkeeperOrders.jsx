import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPackage } from 'react-icons/fi';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'Confirmed': 'bg-blue-100 text-blue-800 border-blue-300',
  'Packed': 'bg-indigo-100 text-indigo-800 border-indigo-300',
  'Delivered': 'bg-green-100 text-green-800 border-green-300',
  'Cancelled': 'bg-red-100 text-red-800 border-red-300',
};

export default function ShopkeeperOrders() {
  const { orders, updateOrderStatus } = useOrders();
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState('Confirmed');

  // Filter orders for current shopkeeper's shop only
  const shopName = user?.shopName || user?.name || '';
  const myOrders = orders.filter(o => {
    if (shopName && o.shopName && o.shopName !== shopName) return false;
    if (statusFilter !== 'All' && o.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">✦ Shop Orders</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>My Shop Orders</h1>
        </div>
        <span className="text-xs font-bold text-[#7B1E3A] bg-[#FFF8F0] px-3 py-1.5 rounded-full border border-[#D4AF37]/20">
          {myOrders.length} Order{myOrders.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        {['All', 'Pending', 'Confirmed', 'Packed', 'Delivered', 'Cancelled'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer border transition-all ${statusFilter === s ? 'bg-[#7B1E3A] text-white border-[#7B1E3A]' : 'bg-[#FFF8F0] text-[#6B4A48] border-[#D4AF37]/20 hover:border-[#D4AF37]'}`}>
            {s}
          </button>
        ))}
      </div>

      {myOrders.length === 0 ? (
        <div className="card-base p-16 text-center max-w-lg mx-auto bg-white border-dashed">
          <div className="w-16 h-16 rounded-full bg-[#7B1E3A]/10 text-[#7B1E3A] flex items-center justify-center mx-auto mb-4 text-2xl"><FiPackage /></div>
          <h3 className="text-xl font-bold text-[#7B1E3A] mb-1" style={{ fontFamily: 'Playfair Display' }}>No orders found.</h3>
          <p className="text-sm text-[#6B4A48] m-0">Orders placed for your shop will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myOrders.map((o, i) => (
            <motion.div key={o.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="card-base p-5 sm:p-6 bg-white border border-[#D4AF37]/20 shadow-sm">

              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#D4AF37]/10">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-[#7B1E3A]">#{o.id}</span>
                  <span className="text-xs text-[#6B4A48]">{o.date}</span>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusColors[o.status] || statusColors['Pending']}`}>
                  {o.status}
                </span>
              </div>

              <div className="flex gap-4 mb-4">
                <img src={o.productImage} alt={o.productName} className="w-14 h-18 rounded-xl object-cover border border-[#D4AF37]/30 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#7B1E3A] text-sm m-0 mb-1 truncate">{o.productName}</h4>
                  <p className="text-xs text-[#6B4A48] m-0 mb-1">Qty: {o.quantity} · ₹{o.total.toLocaleString()}</p>
                  <div className="text-xs text-[#4A2C2A]">
                    <span className="font-semibold">{o.customerName}</span> · <span className="text-[#6B4A48]">{o.customerPhone}</span>
                  </div>
                  <p className="text-xs text-[#6B4A48] m-0 mt-1 leading-relaxed">{o.customerAddress}</p>
                </div>
              </div>

              {/* Update Status */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-[#D4AF37]/10">
                {['Confirmed', 'Packed', 'Delivered', 'Cancelled'].map(s => (
                  <button key={s} onClick={() => updateOrderStatus(o.id, s)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold cursor-pointer border transition-all ${o.status === s ? 'bg-[#7B1E3A] text-white border-[#7B1E3A]' : 'bg-white text-[#6B4A48] border-[#D4AF37]/20 hover:border-[#7B1E3A]'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
