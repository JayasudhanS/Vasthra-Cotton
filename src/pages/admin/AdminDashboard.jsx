import { motion } from 'framer-motion';
import { FiPackage, FiClock, FiShoppingBag, FiUsers, FiTrendingUp, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { products, shops } from '../../data';
import { useAuth } from '../../context/AuthContext';

const stats = [
  { title: 'Pending Saree Weaves', value: products.filter(p => p.status === 'pending').length, icon: <FiClock size={22} />, color: 'from-[#D4AF37] to-[#E8C94A]', badge: 'Action Required' },
  { title: 'Live Saree Catalogue', value: products.filter(p => p.status === 'approved').length, icon: <FiPackage size={22} />, color: 'from-[#2D8F5E] to-[#3AAF6E]', badge: 'Verified Silk' },
  { title: 'Pending Weaver Applications', value: shops.filter(s => s.status === 'pending').length, icon: <FiShoppingBag size={22} />, color: 'from-amber-500 to-amber-400', badge: 'KYC Check' },
  { title: 'Registered Connoisseurs', value: 0, icon: <FiUsers size={22} />, color: 'from-[#7B1E3A] to-[#9B2E4A]', badge: 'Dynamic Users' },
];

const activities = [];

export default function AdminDashboard() {
  const { user } = useAuth();
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D4AF37]/20">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">
            ✦ Welcome back, {user?.name || 'Administrator'}!
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>
            Admin Command Center
          </h1>
        </div>
        <span className="badge badge-success !text-xs font-bold px-3.5 py-1.5 flex items-center gap-1.5 w-fit">
          <FiCheckCircle /> Ecosystem Healthy · 100% Verified Sellers
        </span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="card-base p-6 sm:p-7 flex flex-col justify-between bg-white border border-[#D4AF37]/25 shadow-sm hover:shadow-md transition-all rounded-2xl">
            <div className="flex items-start justify-between mb-5 gap-4">
              <div>
                <p className="text-3xl sm:text-4xl font-bold text-[#7B1E3A] font-mono tracking-tight m-0 mb-1">{s.value}</p>
                <p className="text-xs font-bold text-[#6B4A48] uppercase tracking-wider m-0">{s.title}</p>
              </div>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center shadow-md flex-shrink-0`}>
                {s.icon}
              </div>
            </div>
            <div className="pt-3.5 border-t border-[#D4AF37]/15 flex items-center justify-between text-xs text-[#6B4A48]/90 font-semibold">
              <span>Status</span>
              <span className="text-[#D4AF37] font-bold">{s.badge}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Activities Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#7B1E3A] m-0 flex items-center gap-2" style={{ fontFamily: 'Playfair Display' }}>
            <FiTrendingUp className="text-[#D4AF37]" /> Live Ecosystem Activities
          </h2>
          <span className="text-xs text-[#6B4A48] font-mono">Real-time Feed</span>
        </div>

        {activities.length === 0 ? (
          <div className="card-base p-12 text-center bg-white shadow-sm border border-[#D4AF37]/20 border-dashed">
            <p className="text-sm font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>No recent activities found.</p>
          </div>
        ) : (
          <div className="card-base bg-white shadow-sm border border-[#D4AF37]/20 divide-y divide-[#D4AF37]/15">
            {activities.map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                className="p-5 flex items-center justify-between hover:bg-[#FFF8F0]/50 transition-colors">
                <div className="flex items-center gap-3.5">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-xs ${
                    a.type === 'shop' ? 'bg-[#D4AF37]' :
                    a.type === 'product' ? 'bg-[#7B1E3A]' :
                    a.type === 'review' ? 'bg-[#2D8F5E]' : 'bg-blue-500'
                  }`} />
                  <span className="text-xs sm:text-sm text-[#4A2C2A] font-medium leading-relaxed">{a.text}</span>
                </div>
                <span className="text-xs text-[#6B4A48]/70 flex-shrink-0 ml-4 font-mono">{a.time}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

