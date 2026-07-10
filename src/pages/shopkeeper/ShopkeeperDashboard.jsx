import { motion } from 'framer-motion';
import { FiPackage, FiClock, FiCheck, FiXCircle, FiTrendingUp, FiPlus, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { products } from '../../data';
import { useAuth } from '../../context/AuthContext';

const cards = [
  { title: 'Total Masterpieces', value: products.length || 0, icon: <FiPackage size={22} />, color: 'from-[#7B1E3A] to-[#9B2E4A]', change: 'Active Catalogue' },
  { title: 'Weave Categories', value: 0, icon: <FiTrendingUp size={22} />, color: 'from-[#D4AF37] to-[#E8C94A]', change: 'Dynamic Categories' },
  { title: 'Total Drape Views', value: 0, icon: <FiTrendingUp size={22} />, color: 'from-[#2D8F5E] to-[#3AAF6E]', change: 'Live Analytics' },
  { title: 'Verified Weavers', value: '0%', icon: <FiPackage size={22} />, color: 'from-[#5A1028] to-[#7B1E3A]', change: 'Silk Mark Certified' },
];

export default function ShopkeeperDashboard() {
  const { user } = useAuth();
  const displayName = user?.name || 'Ramesh';
  const recent = products.slice(-6).reverse();
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D4AF37]/20">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">
            ✦ Welcome back, {displayName}!
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>
            Shopkeeper Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/shopkeeper/add-product" className="btn-golden !py-2.5 !px-5 !text-xs no-underline shadow-md inline-flex items-center gap-1.5">
            <FiPlus size={16} /> Add New Saree
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12">
        {cards.map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="card-base p-6 sm:p-7 flex flex-col justify-between bg-white border border-[#D4AF37]/25 shadow-sm hover:shadow-md transition-all rounded-2xl">
            <div className="flex items-start justify-between mb-5 gap-4">
              <div>
                <p className="text-3xl sm:text-4xl font-bold text-[#7B1E3A] font-mono tracking-tight m-0 mb-1">{c.value}</p>
                <p className="text-xs font-bold text-[#6B4A48] uppercase tracking-wider m-0">{c.title}</p>
              </div>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.color} text-white flex items-center justify-center shadow-md flex-shrink-0`}>
                {c.icon}
              </div>
            </div>
            <div className="pt-3.5 border-t border-[#D4AF37]/15 flex items-center gap-2 text-xs text-[#6B4A48]/90 font-medium">
              <FiTrendingUp className="text-[#2D8F5E] flex-shrink-0" /> <span>{c.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Uploads Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>
              Recent Saree Uploads
            </h2>
            <p className="text-xs text-[#6B4A48] m-0 mt-0.5">Manage your catalogue and track Silk Mark verification status</p>
          </div>
          <Link to="/shopkeeper/products" className="text-xs font-bold text-[#7B1E3A] hover:text-[#D4AF37] no-underline flex items-center gap-1 transition-colors">
            View All Catalogue <FiArrowRight />
          </Link>
        </div>

        <div className="table-container bg-white shadow-sm border border-[#D4AF37]/20">
          <table className="table-base w-full">
            <thead>
              <tr>
                <th className="!text-xs uppercase tracking-wider">Saree Masterpiece</th>
                <th className="!text-xs uppercase tracking-wider">Weave Category</th>
                <th className="!text-xs uppercase tracking-wider">Offer Price</th>
                <th className="!text-xs uppercase tracking-wider">Stock Status</th>
                <th className="!text-xs uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#6B4A48] italic">No products available.</td>
                </tr>
              ) : (
                recent.map(p => (
                  <tr key={p.id} className="hover:bg-[#FFF8F0]/50 transition-colors">
                    <td className="font-medium text-[#4A2C2A]">
                      <div className="flex items-center gap-3.5">
                        <img src={p.image} alt="" className="w-12 h-14 rounded-xl object-cover border border-[#D4AF37]/30 shadow-xs flex-shrink-0" />
                        <div>
                          <span className="font-bold text-[#7B1E3A] block text-sm">{p.name}</span>
                          <span className="text-[11px] text-[#6B4A48]/70">ID: #SV-{p.id}08 · {p.fabric || 'Pure Silk'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="text-[#6B4A48] font-medium text-xs">
                      <span className="bg-[#FFF8F0] px-3.5 py-1.5 rounded-full border border-[#D4AF37]/20 font-medium">
                        {p.category}
                      </span>
                    </td>
                    <td className="font-bold text-[#7B1E3A] text-sm">₹{p.offerPrice.toLocaleString()}</td>
                    <td>
                      <span className="badge badge-success font-mono text-xs">
                        {p.stock || 12} Units Available
                      </span>
                    </td>
                    <td className="text-right">
                      <Link to={`/product/${p.id}`} className="text-xs font-semibold text-[#D4AF37] hover:text-[#7B1E3A] no-underline bg-[#FFF8F0] px-3 py-1.5 rounded-lg border border-[#D4AF37]/30 transition-colors">
                        View Drape
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

