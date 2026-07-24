import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiClock, FiCheck, FiXCircle, FiTrendingUp, FiPlus, FiArrowRight, FiEye, FiEdit2, FiTrash2, FiLayers } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';

export default function ShopkeeperDashboard() {
  const { user } = useAuth();
  const { products, loading } = useProducts();
  const displayName = user?.name || '';

  // Filter products belonging to this shop owner only
  const myProducts = useMemo(() => {
    const uid = user?.uid || user?.id;
    if (!uid) return [];
    return products.filter(p => String(p.ownerId) === String(uid));
  }, [products, user]);

  // Compute dashboard statistics dynamically
  const totalWeaves = myProducts.length;
  const uniqueCategories = useMemo(() => {
    const cats = new Set(myProducts.map(p => p.category).filter(Boolean));
    return cats.size;
  }, [myProducts]);
  const approvedCount = myProducts.filter(p => (p.status || '').toLowerCase() === 'approved').length;
  const pendingCount = myProducts.filter(p => (p.status || '').toLowerCase() === 'pending').length;

  // Recent 6 uploads (already sorted newest-first from ProductContext)
  const recent = myProducts.slice(0, 6);

  const cards = [
    { title: 'Total Weaves', value: totalWeaves, icon: <FiPackage size={22} />, color: 'from-[#7B1E3A] to-[#9B2E4A]', change: 'Active Catalogue' },
    { title: 'Weave Categories', value: uniqueCategories, icon: <FiLayers size={22} />, color: 'from-[#D4AF37] to-[#E8C94A]', change: 'Dynamic Categories' },
    { title: 'Approved Weaves', value: approvedCount, icon: <FiCheck size={22} />, color: 'from-[#2D8F5E] to-[#3AAF6E]', change: 'Live on Store' },
    { title: 'Pending Review', value: pendingCount, icon: <FiClock size={22} />, color: 'from-[#5A1028] to-[#7B1E3A]', change: 'Awaiting Approval' },
  ];

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

      {/* Recent Uploads */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>
              Recent Saree Uploads
            </h2>
            <p className="text-xs text-[#6B4A48] m-0 mt-0.5">Manage your catalogue and track approval status</p>
          </div>
          <Link to="/shopkeeper/products" className="text-xs font-bold text-[#7B1E3A] hover:text-[#D4AF37] no-underline flex items-center gap-1 transition-colors">
            View All Catalogue <FiArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="inline-block w-8 h-8 border-3 border-[#7B1E3A]/20 border-t-[#7B1E3A] rounded-full animate-spin" />
          </div>
        ) : recent.length === 0 ? (
          <div className="card-base p-16 text-center max-w-lg mx-auto bg-white border-dashed">
            <div className="w-16 h-16 rounded-full bg-[#7B1E3A]/10 text-[#7B1E3A] flex items-center justify-center mx-auto mb-4 text-2xl"><FiPackage /></div>
            <h3 className="text-xl font-bold text-[#7B1E3A] mb-1" style={{ fontFamily: 'Playfair Display' }}>No Sarees Uploaded Yet</h3>
            <p className="text-sm text-[#6B4A48] m-0 mb-6">Upload your first weave to start selling.</p>
            <Link to="/shopkeeper/add-product" className="btn-golden inline-flex items-center gap-2">
              <FiPlus /> Add Your First Saree
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
            {recent.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-base flex flex-col bg-white border border-[#D4AF37]/20 shadow-sm hover:shadow-md transition-all p-0 overflow-hidden rounded-2xl">
                <div className="flex gap-4 p-4 sm:p-5 border-b border-[#D4AF37]/10">
                  <div className="relative flex-shrink-0">
                    <img src={p.image || p.imageUrl || p.images?.[0] || ''} alt={p.name} className="w-20 h-28 object-cover rounded-xl border border-[#D4AF37]/30 shadow-xs" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <h4 className="font-bold text-[#7B1E3A] text-sm sm:text-base m-0 leading-tight truncate">{p.name}</h4>
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block mt-1.5 mb-1">{p.category || 'Silk'}</span>
                      <p className="text-[11px] text-[#6B4A48] m-0 line-clamp-1">{p.fabric || 'Pure Silk'} · ID: #VC-{p.id?.slice(0, 6)}</p>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                      <span className="text-base font-bold text-[#7B1E3A]">₹{(p.offerPrice || p.price || 0).toLocaleString()}</span>
                      {p.price && p.offerPrice && p.offerPrice < p.price && (
                        <span className="text-[10px] line-through text-[#6B4A48]">₹{p.price.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 bg-[#FFF8F0]/30 grid grid-cols-2 gap-3 border-b border-[#D4AF37]/10 text-[11px]">
                  <div>
                    <span className="text-[#6B4A48] block mb-0.5 font-medium uppercase tracking-wider text-[9px]">Stock Status</span>
                    <span className={`font-bold ${p.stock && p.stock > 0 ? 'text-[#2D8F5E]' : 'text-red-500'}`}>
                      {p.stock && p.stock > 0 ? `${p.stock} Units In Stock` : 'Out of Stock'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#6B4A48] block mb-0.5 font-medium uppercase tracking-wider text-[9px]">Upload Date</span>
                    <span className="font-bold text-[#4A2C2A]">{p.date || (p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—')}</span>
                  </div>
                </div>

                <div className="px-4 py-3 sm:px-5 bg-white flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <span className={`badge !text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider ${(p.status || '').toLowerCase() === 'approved' ? 'badge-success' : (p.status || '').toLowerCase() === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>
                      {(p.status || '').toLowerCase() === 'approved' ? 'Approved' : (p.status || '').toLowerCase() === 'rejected' ? 'Rejected' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Link to={`/product/${p.id}`} className="p-1.5 rounded-lg bg-[#FFF8F0] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-colors border border-[#D4AF37]/30" title="View Preview">
                      <FiEye size={14} />
                    </Link>
                    <Link to="/shopkeeper/products" className="p-1.5 rounded-lg bg-[#FFF8F0] text-[#2D8F5E] hover:bg-[#2D8F5E] hover:text-white transition-colors border border-[#2D8F5E]/30" title="Edit in Catalogue">
                      <FiEdit2 size={14} />
                    </Link>
                    <Link to="/shopkeeper/products" className="p-1.5 rounded-lg bg-[#FFF8F0] text-red-600 hover:bg-red-600 hover:text-white transition-colors border border-red-300" title="Delete in Catalogue">
                      <FiTrash2 size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
