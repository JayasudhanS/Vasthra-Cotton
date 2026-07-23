import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiPackage, FiShoppingBag } from 'react-icons/fi';
import { useOrders } from '../../context/OrderContext';

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'Confirmed': 'bg-blue-100 text-blue-800 border-blue-300',
  'Packed': 'bg-indigo-100 text-indigo-800 border-indigo-300',
  'Delivered': 'bg-green-100 text-green-800 border-green-300',
  'Cancelled': 'bg-red-100 text-red-800 border-red-300',
};

const statusIcons = {
  'Pending': '⏳',
  'Confirmed': '✓',
  'Packed': '📦',
  'Delivered': '✅',
  'Cancelled': '✕',
};

export default function UserOrders() {
  const { myOrders: orders, loading } = useOrders();

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <span className="inline-block w-8 h-8 border-3 border-[#7B1E3A]/20 border-t-[#7B1E3A] rounded-full animate-spin" />
    </div>
  );
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">✦ Order History</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>My Orders</h1>
        </div>
        <span className="text-xs font-bold text-[#6B4A48] bg-[#FFF8F0] px-3 py-1.5 rounded-full border border-[#D4AF37]/20">
          {orders.length} Order{orders.length !== 1 ? 's' : ''}
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="card-base p-16 text-center max-w-lg mx-auto bg-white border-dashed">
          <div className="w-16 h-16 rounded-full bg-[#7B1E3A]/10 text-[#7B1E3A] flex items-center justify-center mx-auto mb-4 text-2xl"><FiPackage /></div>
          <h3 className="text-xl font-bold text-[#7B1E3A] mb-2" style={{ fontFamily: 'Playfair Display' }}>No orders found.</h3>
          <p className="text-sm text-[#6B4A48] mb-6 font-light">Your order history will appear here once you place an order.</p>
          <Link to="/products" className="btn-golden !py-2.5 !px-6 !text-xs no-underline inline-flex items-center gap-2">
            <FiShoppingBag size={16} /> Browse Sarees
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o, i) => (
            <motion.div key={o.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card-base p-6 sm:p-7 md:p-8 bg-white border border-[#D4AF37]/20 shadow-sm hover:shadow-md transition-all">

              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-[#D4AF37]/10">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-[#7B1E3A] bg-[#FFF8F0] px-3.5 py-1.5 rounded-lg border border-[#D4AF37]/20">
                    #{o.id}
                  </span>
                  <span className="text-xs text-[#6B4A48]">{o.date}</span>
                </div>
                <span className={`text-xs font-bold px-3.5 py-1.5 rounded-full border ${statusColors[o.status] || statusColors['Pending']}`}>
                  {statusIcons[o.status]} {o.status}
                </span>
              </div>

              {/* Product Info */}
              <div className="flex gap-4 sm:gap-5 mb-5">
                <img src={o.productImage} alt={o.productName} className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl object-cover border border-[#D4AF37]/30 shadow-xs flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider block mb-0.5">{o.shopName}</span>
                  <h3 className="font-bold text-[#7B1E3A] text-sm sm:text-base m-0 mb-1 truncate" style={{ fontFamily: 'Playfair Display' }}>{o.productName}</h3>
                  <p className="text-xs text-[#6B4A48] m-0">Qty: {o.quantity}</p>
                </div>
              </div>

              {/* Price Details */}
              <div className="bg-[#FFF8F0]/60 rounded-xl p-4 sm:p-5 space-y-2 text-sm border border-[#D4AF37]/15">
                <div className="flex justify-between text-[#6B4A48]">
                  <span>Price</span>
                  <span className="font-medium">₹{(o.price * o.quantity).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#6B4A48]">
                  <span>Delivery</span>
                  <span className="font-medium">₹{o.deliveryCharge}</span>
                </div>
                <div className="flex justify-between font-bold text-[#7B1E3A] pt-1.5 border-t border-[#D4AF37]/15">
                  <span>Total</span>
                  <span>₹{o.total.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
