import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiPhone, FiEye, FiChevronDown, FiUser, FiHome, FiPackage, FiMapPin } from 'react-icons/fi';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { resolveShopInfo } from './AdminProductCardHelper';

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
  const { allShops = [], allUsers = [], pendingShops = [] } = useAuth();
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
      <div className="card-base p-5 sm:p-6 bg-white border border-[#D4AF37]/20 space-y-4">
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
          {filtered.map((o, i) => {
            const { shopName, shopLogo, ownerName, phoneNumber, address } = resolveShopInfo({ shopName: o.shopName }, allShops, allUsers, pendingShops);
            return (
            <motion.div key={o.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="card-base bg-white border border-[#D4AF37]/20 shadow-sm hover:shadow-md transition-all overflow-hidden">

              {/* Main Row */}
              <div className="p-5 sm:p-6 md:p-8">
                {/* Header: Product Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#D4AF37]/20">
                  <div className="flex items-center gap-4">
                    <img src={o.productImage} alt={o.productName} className="w-16 h-20 rounded-xl object-cover border border-[#D4AF37]/30 shadow-xs flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-[#7B1E3A] text-lg sm:text-xl m-0 leading-tight" style={{ fontFamily: 'Playfair Display' }}>{o.productName}</h4>
                      <span className="text-xs font-semibold text-[#6B4A48] mt-1.5 block">Fabric: {o.fabric || 'Premium Weave'}</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end gap-2.5">
                     <span className={`text-[11px] font-bold tracking-wider px-3.5 py-1.5 rounded-full border w-fit uppercase ${statusColors[o.status] || statusColors['Pending']}`}>
                        {o.status}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D8F5E] bg-[#2D8F5E]/10 px-2.5 py-1 rounded-md border border-[#2D8F5E]/20 text-center">Paid Online</span>
                  </div>
                </div>

                {/* 3-Column Grid for Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
                  
                  {/* Customer Column */}
                  <div className="bg-[#FFF8F0]/40 p-5 rounded-xl border border-[#D4AF37]/20 flex flex-col justify-center">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#7B1E3A] mb-3 flex items-center gap-1.5"><FiUser size={13}/> CUSTOMER</span>
                    <p className="text-sm font-bold text-[#4A2C2A] m-0 mb-1.5">{o.customerName}</p>
                    <p className="text-xs font-mono font-bold text-[#6B4A48] m-0 flex items-center gap-1.5"><FiPhone size={11} className="text-[#D4AF37]"/> {o.customerPhone}</p>
                  </div>

                  {/* Shop Column */}
                  <div className="bg-[#FFF8F0]/40 p-5 rounded-xl border border-[#D4AF37]/20 flex flex-col justify-center">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] mb-3 flex items-center gap-1.5"><FiHome size={13}/> SHOP</span>
                    <div className="flex items-start gap-3.5">
                      {shopLogo && <img src={shopLogo} alt={shopName} className="w-10 h-10 rounded-full object-cover border-2 border-[#D4AF37]/40 shadow-xs bg-white flex-shrink-0" />}
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#7B1E3A] m-0 leading-tight truncate">{shopName}</p>
                        <p className="text-[11px] text-[#6B4A48] mt-1 mb-1.5 truncate">Owner: <strong className="text-[#4A2C2A]">{ownerName}</strong></p>
                        <p className="text-[11px] font-mono font-bold text-[#D4AF37] m-0 mb-1.5 flex items-center gap-1.5"><FiPhone size={10}/> {phoneNumber}</p>
                        <p className="text-[10px] font-medium text-[#6B4A48] m-0 flex items-start gap-1.5 leading-snug"><FiMapPin size={11} className="flex-shrink-0 mt-0.5 text-[#D4AF37]"/> {address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Column */}
                  <div className="bg-[#FFF8F0]/40 p-5 rounded-xl border border-[#D4AF37]/20 flex flex-col justify-center">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#2D8F5E] mb-3 flex items-center gap-1.5"><FiPackage size={13}/> ORDER DETAILS</span>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center"><span className="text-[#6B4A48] font-medium">Order ID:</span><span className="font-mono font-bold text-[#7B1E3A]">#{o.id}</span></div>
                      <div className="flex justify-between items-center"><span className="text-[#6B4A48] font-medium">Ordered On:</span><span className="font-semibold text-[#4A2C2A]">{o.date}</span></div>
                      <div className="flex justify-between items-center"><span className="text-[#6B4A48] font-medium">Time:</span><span className="font-semibold text-[#4A2C2A]">{o.timestamp ? new Date(o.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span></div>
                      <div className="flex justify-between items-center"><span className="text-[#6B4A48] font-medium">Quantity:</span><span className="font-bold text-[#4A2C2A]">{o.quantity} Unit{o.quantity > 1 ? 's' : ''}</span></div>
                      <div className="flex justify-between items-center"><span className="text-[#6B4A48] font-medium">Unit Price:</span><span className="font-bold text-[#4A2C2A]">₹{o.price ? o.price.toLocaleString() : (o.total / (o.quantity || 1)).toLocaleString()}</span></div>
                      <div className="flex justify-between items-center pt-2 border-t border-[#D4AF37]/15 mt-1"><span className="text-[#6B4A48] font-bold text-xs uppercase">Total Price:</span><span className="font-bold text-[15px] text-[#7B1E3A]">₹{o.total.toLocaleString()}</span></div>
                    </div>
                  </div>

                </div>

                {/* Actions below */}
                <div className="flex sm:justify-end gap-3 mt-6 pt-5 border-t border-[#D4AF37]/15 flex-col sm:flex-row">
                   <button onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}
                      className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-bold text-[#7B1E3A] bg-[#FFF8F0] border border-[#D4AF37]/30 cursor-pointer hover:bg-[#D4AF37]/10 transition-colors">
                      <FiEye size={14} /> Update Status & Address <FiChevronDown size={14} className={`transition-transform ${expandedOrder === o.id ? 'rotate-180' : ''}`} />
                   </button>
                   <a href={`tel:${o.customerPhone}`}
                      className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-bold text-[#2D8F5E] bg-[#2D8F5E]/10 border border-[#2D8F5E]/20 no-underline hover:bg-[#2D8F5E]/20 transition-colors">
                      <FiPhone size={14} /> Call Customer
                   </a>
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
            );
          })}
        </div>
      )}
    </div>
  );
}
