import { motion } from 'framer-motion';
import { FiPackage, FiClock, FiCheck, FiTruck, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const orders = [
  { id: 'SV-10234', product: 'Royal Kanjivaram Silk Saree', date: '28 June 2026', status: 'Delivered', price: 8500, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80', weaver: 'Kanjivaram Royal Silks', items: 1 },
  { id: 'SV-10221', product: 'Banarasi Brocade Wedding Saree', date: '20 June 2026', status: 'In Transit', price: 14200, image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&q=80', weaver: 'Banaras Heritage House', items: 2 },
  { id: 'SV-10198', product: 'Designer Chanderi Cotton Silk', date: '15 June 2026', status: 'Processing', price: 4800, image: 'https://images.unsplash.com/photo-1604502370834-ba5e4506ac39?w=400&q=80', weaver: 'Chanderi Loom Cluster', items: 1 },
];

export default function UserOrders() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">✦ Order History & Tracking</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>My Saree Orders</h1>
        </div>
        <span className="badge badge-success !text-xs font-bold px-3.5 py-1.5">
          {orders.length} Verified Orders
        </span>
      </div>

      <div className="space-y-4">
        {orders.map((o, i) => (
          <motion.div key={o.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="card-base p-6 bg-white border border-[#D4AF37]/20 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            
            <div className="flex items-center gap-4">
              <img src={o.image} alt={o.product} className="w-20 h-24 rounded-xl object-cover border border-[#D4AF37]/30 shadow-xs flex-shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider block">Sold by {o.weaver}</span>
                <h3 className="font-bold text-[#7B1E3A] text-base m-0 mt-0.5" style={{ fontFamily: 'Playfair Display' }}>{o.product}</h3>
                <p className="text-xs text-[#6B4A48] m-0 mt-1 font-mono">Order #{o.id} · Placed on {o.date}</p>
                <p className="text-xs text-[#2D8F5E] font-semibold m-0 mt-1 flex items-center gap-1">
                  ✓ Silk Mark Authenticity Guaranteed
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-[#D4AF37]/15 gap-3">
              <div className="text-left sm:text-right">
                <span className="text-xs text-[#6B4A48] block font-light">Total Amount</span>
                <span className="text-xl font-bold text-[#7B1E3A]">₹{o.price.toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className={`badge ${
                  o.status === 'Delivered' ? 'badge-success' :
                  o.status === 'In Transit' ? 'badge-warning' : 'badge-warning'
                }`}>
                  {o.status === 'Delivered' ? '✓ Delivered' :
                   o.status === 'In Transit' ? '🚚 In Transit' : '⏳ Processing'}
                </span>

                <Link to={`/products`} className="btn-outline-gold !py-2 !px-4 !text-xs no-underline font-semibold flex items-center gap-1">
                  Track Drape
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

