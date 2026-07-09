import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiPhone, FiEye, FiChevronDown } from 'react-icons/fi';
import { useOrders } from '../../context/OrderContext';
import { shops } from '../../data';

const statuses = ['All', 'Pending', 'Confirmed', 'Packed', 'Delivered', 'Cancelled'];
const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'Confirmed': 'bg-blue-100 text-blue-800 border-blue-300',
  'Packed': 'bg-indigo-100 text-indigo-800 border-indigo-300',
  'Delivered': 'bg-green-100 text-green-800 border-green-300',
  'Cancelled': 'bg-red-100 text-red-800 border-red-300',
};

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useOrders();
  const [statusFilter, setStatusFilter] = useState('All');
  const [shopFilter, setShopFilter] = useState('');
  const [searchCustomer, setSearchCustomer] = useState('');
  const [searchOrderId, setSearchOrderId] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  const filtered = orders.filter(o => {
    if (statusFilter !== 'All' && o.status !== statusFilter) return false;
    if (shopFilter && o.shopName !== shopFilter) return false;
    if (searchCustomer && !o.customerName.toLowerCase().includes(searchCustomer.toLowerCase())) return false;
    if (searchOrderId && !o.id.toLowerCase().includes(searchOrderId.toLowerCase())) return false;
    return true;
  });

  const uniqueShops = [...new Set(orders.map(o => o.shopName))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">✦ Orders Management</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>All Orders</h1>
        </div>
        <span className="text-xs font-bold text-[#7B1E3A] bg-[#FFF8F0] px-3 py-1.5 rounded-full border border-[#D4AF37]/20">
          {filtered.length} Order{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Filters */}
      <div className="card-base p-4 sm:p-5 bg-white border border-[#D4AF37]/20 space-y-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer border transition-all ${statusFilter === s ? 'bg-[#7B1E3A] text-white border-[#7B1E3A]' : 'bg-[#FFF8F0] text-[#6B4A48] border-[#D4AF37]/20 hover:border-[#D4AF37]'}`}>
              {s}
            </button>
          ))}
        </div>

        {/* Search & Shop Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B4A48]/60" size={14} />
            <input type="text" value={searchCustomer} onChange={e => setSearchCustomer(e.target.value)}
              placeholder="Search by Customer" className="input-field !h-10 !text-xs !pl-9" />
          </div>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B4A48]/60" size={14} />
            <input type="text" value={searchOrderId} onChange={e => setSearchOrderId(e.target.value)}
              placeholder="Search by Order ID" className="input-field !h-10 !text-xs !pl-9" />
          </div>
          <select value={shopFilter} onChange={e => setShopFilter(e.target.value)} className="select-field !h-10 !text-xs">
            <option value="">All Shops</option>
            {uniqueShops.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <div className="card-base p-16 text-center max-w-lg mx-auto bg-white border-dashed">
          <div className="w-16 h-16 rounded-full bg-[#7B1E3A]/10 text-[#7B1E3A] flex items-center justify-center mx-auto mb-4 text-2xl">📦</div>
          <h3 className="text-xl font-bold text-[#7B1E3A] mb-1" style={{ fontFamily: 'Playfair Display' }}>No orders found.</h3>
          <p className="text-sm text-[#6B4A48] m-0">No orders match your current filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((o, i) => (
            <motion.div key={o.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="card-base bg-white border border-[#D4AF37]/20 shadow-sm hover:shadow-md transition-all overflow-hidden">

              {/* Main Row */}
              <div className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <img src={o.productImage} alt={o.productName} className="w-16 h-20 rounded-xl object-cover border border-[#D4AF37]/30 shadow-xs flex-shrink-0" />

                  {/* Order Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-xs font-mono font-bold text-[#7B1E3A]">#{o.id}</span>
                        <span className="text-xs text-[#6B4A48] ml-2">{o.date}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusColors[o.status] || statusColors['Pending']}`}>
                        {o.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-[#7B1E3A] text-sm m-0 mb-1 truncate">{o.productName}</h4>

                    {/* Shop info */}
                    <div className="flex items-center gap-2 mb-2">
                      {o.shopLogo && <img src={o.shopLogo} alt="" className="w-5 h-5 rounded-full object-cover border border-[#D4AF37]/30" />}
                      <span className="text-xs text-[#6B4A48] font-medium">{o.shopName}</span>
                    </div>

                    {/* Customer */}
                    <div className="text-xs text-[#4A2C2A]">
                      <span className="font-semibold">{o.customerName}</span>
                      <span className="text-[#6B4A48] ml-2">{o.customerPhone}</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-4 mt-2 text-xs">
                      <span className="text-[#6B4A48]">Qty: {o.quantity}</span>
                      <span className="font-bold text-[#7B1E3A]">₹{o.total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-center gap-2 flex-shrink-0">
                    <button onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#7B1E3A] bg-[#FFF8F0] border border-[#D4AF37]/20 cursor-pointer hover:bg-[#D4AF37]/10 transition-colors">
                      <FiEye size={13} /> Details <FiChevronDown size={12} className={`transition-transform ${expandedOrder === o.id ? 'rotate-180' : ''}`} />
                    </button>
                    <a href={`tel:${o.customerPhone}`}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#2D8F5E] bg-[#2D8F5E]/10 border border-[#2D8F5E]/20 no-underline hover:bg-[#2D8F5E]/20 transition-colors">
                      <FiPhone size={13} /> Call
                    </a>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrder === o.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="border-t border-[#D4AF37]/15 p-5 sm:p-6 bg-[#FFF8F0]/40 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] block mb-1">Delivery Address</span>
                      <p className="text-[#4A2C2A] m-0 text-xs leading-relaxed">{o.customerAddress}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] block mb-1">Price Breakdown</span>
                      <div className="space-y-1 text-xs text-[#6B4A48]">
                        <div className="flex justify-between"><span>Product</span><span>₹{(o.price * o.quantity).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Delivery</span><span>₹{o.deliveryCharge}</span></div>
                        <div className="flex justify-between font-bold text-[#7B1E3A] pt-1 border-t border-[#D4AF37]/15"><span>Total</span><span>₹{o.total.toLocaleString()}</span></div>
                      </div>
                    </div>
                  </div>

                  {/* Update Status */}
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-2">Update Status</span>
                    <div className="flex flex-wrap gap-2">
                      {['Pending', 'Confirmed', 'Packed', 'Delivered', 'Cancelled'].map(s => (
                        <button key={s} onClick={() => updateOrderStatus(o.id, s)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer border transition-all ${o.status === s ? 'bg-[#7B1E3A] text-white border-[#7B1E3A]' : 'bg-white text-[#6B4A48] border-[#D4AF37]/20 hover:border-[#7B1E3A] hover:text-[#7B1E3A]'}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
