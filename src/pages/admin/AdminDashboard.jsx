import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiClock, FiShoppingBag, FiUsers, FiTrendingUp, FiCheckCircle, FiCheck, FiX, FiFilter, FiLayers } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { AdminProductDisplayCard } from './AdminProductCardHelper';

export default function AdminDashboard() {
  const { user, pendingShops = [], allUsers = [], allShops = [] } = useAuth();
  const { products = [], approvedProducts = [], approveProduct, rejectProduct, approvePendingEdit, rejectPendingEdit } = useProducts();
  const [activeTab, setActiveTab] = useState('pending');

  const pendingWeavesCount = useMemo(() => 
    products.filter(p => (p.status || '').toString().trim().toLowerCase() === 'pending').length, 
  [products]);

  const liveCatalogueCount = approvedProducts.length;

  const pendingWeaversCount = useMemo(() => 
    pendingShops.filter(s => (s.status || '').toString().trim().toLowerCase() === 'pending').length, 
  [pendingShops]);

  const registeredUsersCount = useMemo(() => 
    allUsers.filter(u => u.role === 'user' || (!u.role && u.email !== 'admin@vasthracotton.com')).length, 
  [allUsers]);

  const pendingNewProducts = useMemo(() => 
    products.filter(p => (p.status || '').toString().trim().toLowerCase() === 'pending'),
  [products]);

  const pendingEditProducts = useMemo(() => 
    products.filter(p => p.pendingEdit && p.pendingEdit.editStatus === 'pending'),
  [products]);

  const liveProductsList = useMemo(() => 
    approvedProducts.slice(0, 12),
  [approvedProducts]);

  const recentProductsList = useMemo(() => 
    [...products].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 12),
  [products]);

  const stats = [
    { 
      title: 'Pending Saree Weaves', 
      value: pendingWeavesCount, 
      icon: <FiClock size={24} />, 
      color: 'from-[#D4AF37] to-[#E8C94A]', 
      badge: pendingWeavesCount === 1 ? '1 Pending Review' : `${pendingWeavesCount} Pending Reviews`,
      action: pendingWeavesCount > 0 ? 'Inspect Queue →' : 'Review Queue →',
      path: '/admin/pending-products'
    },
    { 
      title: 'Live Saree Catalogue', 
      value: liveCatalogueCount, 
      icon: <FiPackage size={24} />, 
      color: 'from-[#2D8F5E] to-[#3AAF6E]', 
      badge: liveCatalogueCount > 0 ? `${liveCatalogueCount} Published Online` : 'No Live Weaves',
      action: 'View Catalogue →',
      path: '/admin/approved-products'
    },
    { 
      title: 'Pending Weaver Applications', 
      value: pendingWeaversCount, 
      icon: <FiShoppingBag size={24} />, 
      color: 'from-amber-500 to-amber-400', 
      badge: pendingWeaversCount > 0 ? `${pendingWeaversCount} KYC Pending` : 'All Verified',
      action: 'Verify Applications →',
      path: '/admin/pending-shops'
    },
    { 
      title: 'Registered Connoisseurs', 
      value: registeredUsersCount, 
      icon: <FiUsers size={24} />, 
      color: 'from-[#7B1E3A] to-[#9B2E4A]', 
      badge: registeredUsersCount > 0 ? `${registeredUsersCount} Active Accounts` : 'Directory Ready',
      action: 'Manage Users →',
      path: '/admin/users'
    },
  ];

  const formatRelativeTime = (isoString) => {
    if (!isoString) return 'Recently';
    const date = new Date(isoString);
    if (isNaN(date.getTime()) || date.getTime() === 0) return 'Recently';
    const diffSec = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const dynamicActivities = useMemo(() => {
    const list = [];
    
    products.forEach(p => {
      const timeVal = p.updatedAt || p.createdAt || new Date(0).toISOString();
      const ts = new Date(timeVal).getTime() || 0;
      const s = (p.status || '').toString().trim().toLowerCase();
      
      if (s === 'pending') {
        list.push({
          type: 'product',
          text: `New Product Submitted: "${p.name || 'Saree Weave'}" by ${p.shopName || p.ownerName || 'Weaver Studio'}`,
          time: formatRelativeTime(timeVal),
          timestamp: ts,
          badgeColor: 'bg-[#D4AF37]'
        });
      } else if (s === 'approved') {
        list.push({
          type: 'product',
          text: `Product Approved: "${p.name || 'Saree Weave'}" (${p.shopName || p.ownerName || 'Weaver Studio'})`,
          time: formatRelativeTime(timeVal),
          timestamp: ts,
          badgeColor: 'bg-[#2D8F5E]'
        });
      } else if (s === 'rejected') {
        list.push({
          type: 'product',
          text: `Product Rejected: "${p.name || 'Saree Weave'}"`,
          time: formatRelativeTime(timeVal),
          timestamp: ts,
          badgeColor: 'bg-red-500'
        });
      }
      
      if (p.pendingEdit) {
        const editTime = p.pendingEdit.submittedAt || timeVal;
        list.push({
          type: 'product',
          text: `Product Edited: "${p.name || 'Saree Weave'}" modification submitted for review`,
          time: formatRelativeTime(editTime),
          timestamp: new Date(editTime).getTime() || ts,
          badgeColor: 'bg-blue-500'
        });
      }
    });

    allUsers.forEach(u => {
      const timeVal = u.updatedAt || u.createdAt || new Date(0).toISOString();
      const ts = new Date(timeVal).getTime() || 0;
      const isShop = u.role === 'shopOwner' || u.role === 'shopkeeper';
      const s = (u.status || '').toString().trim().toLowerCase();
      
      if (isShop) {
        if (s === 'pending') {
          list.push({
            type: 'shop',
            text: `New Shop Registered: "${u.shopName || u.name || 'Weaver Partner'}" awaiting verification`,
            time: formatRelativeTime(timeVal),
            timestamp: ts,
            badgeColor: 'bg-amber-500'
          });
        } else if (s === 'active' || s === 'approved') {
          list.push({
            type: 'shop',
            text: `Shop Approved: "${u.shopName || u.name || 'Weaver Partner'}" verified & onboarded`,
            time: formatRelativeTime(timeVal),
            timestamp: ts,
            badgeColor: 'bg-[#2D8F5E]'
          });
        }
      } else if (u.role === 'user' || (!u.role && u.email !== 'admin@vasthracotton.com')) {
        list.push({
          type: 'user',
          text: `New Customer Registered: ${u.name || 'Connoisseur'} (${u.email || ''}${u.phone ? ` | ${u.phone}` : ''})`,
          time: formatRelativeTime(timeVal),
          timestamp: ts,
          badgeColor: 'bg-[#7B1E3A]'
        });
      }
    });

    return list.sort((a, b) => b.timestamp - a.timestamp).slice(0, 15);
  }, [products, allUsers]);

  return (
    <div className="space-y-8 sm:space-y-10 w-full min-w-0 max-w-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D4AF37]/20 w-full min-w-0">
        <div className="min-w-0">
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">
            ✦ Welcome back, {user?.name || 'Administrator'}!
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0 break-words" style={{ fontFamily: 'Playfair Display' }}>
            Admin Command Center
          </h1>
        </div>
        <span className="badge badge-success !text-xs font-bold px-3.5 py-1.5 flex items-center gap-1.5 w-fit flex-shrink-0">
          <FiCheckCircle /> Ecosystem Healthy · Live Sync
        </span>
      </div>

      {/* Stat Cards - Responsive Grid strictly contained inside viewport */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-6 sm:gap-8 mb-4 w-full min-w-0 max-w-full items-stretch">
        {stats.map((s, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.08 }}
            className="h-full w-full min-w-0 max-w-full flex flex-col overflow-hidden"
          >
            <Link
              to={s.path}
              className="card-base group p-6 sm:p-7 flex flex-col justify-between bg-white border border-[#D4AF37]/25 shadow-sm hover:shadow-md hover:border-[#D4AF37] transition-all rounded-2xl no-underline h-full w-full min-w-0 max-w-full relative overflow-hidden block"
            >
              <div className="flex items-start justify-between gap-4 mb-6 min-w-0">
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="text-3xl sm:text-4xl font-bold text-[#7B1E3A] font-mono tracking-tight m-0 mb-1.5 leading-none group-hover:scale-[1.02] transition-transform origin-left truncate">
                    {s.value}
                  </p>
                  <p className="text-xs font-bold text-[#6B4A48] uppercase tracking-wider m-0 leading-snug break-words">
                    {s.title}
                  </p>
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-105 transition-transform`}>
                  {s.icon}
                </div>
              </div>

              <div className="pt-4 border-t border-[#D4AF37]/15 flex items-center justify-between gap-2 text-xs text-[#6B4A48]/90 font-semibold mt-auto w-full min-w-0 overflow-hidden">
                <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
                  <span className="text-[#D4AF37] font-bold truncate block">{s.badge}</span>
                </div>
                <span className="text-[#7B1E3A] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2">
                  {s.action}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Shop Owner & Product Management Cards Section (Realtime resolution) */}
      <div className="space-y-6 w-full min-w-0 max-w-full flex flex-col pt-4 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4AF37]/20 pb-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">✦ Realtime Shop Owner Attribution</span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#7B1E3A] m-0 flex items-center gap-2" style={{ fontFamily: 'Playfair Display' }}>
              <FiLayers className="text-[#D4AF37]" /> Product & Shop Verification Center
            </h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { key: 'pending', label: 'Pending Sarees / Approval Queue', count: pendingNewProducts.length },
              { key: 'live', label: 'Live Catalogue', count: liveCatalogueCount },
              { key: 'recent', label: 'Recently Added Products', count: recentProductsList.length },
              { key: 'review', label: 'Pending Product Review', count: pendingNewProducts.length },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab.key
                    ? 'bg-[#7B1E3A] text-white shadow-md border border-[#D4AF37]'
                    : 'bg-white text-[#6B4A48] hover:bg-[#FFF8F0] border border-[#D4AF37]/30'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-[#D4AF37]/20 text-[#7B1E3A]'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid corresponding to active view */}
        <div className="w-full min-w-0">
          {activeTab === 'pending' && (
            pendingNewProducts.length === 0 ? (
              <div className="card-base p-12 text-center bg-white shadow-sm border border-[#D4AF37]/20 border-dashed">
                <p className="text-sm font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>No pending sarees currently awaiting approval queue inspection.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingNewProducts.map(p => (
                  <AdminProductDisplayCard
                    key={p.id}
                    product={p}
                    allShops={allShops}
                    allUsers={allUsers}
                    pendingShops={pendingShops}
                    onApprove={() => { approveProduct(p.id); alert(`Product #${p.id} approved & live.`); }}
                    onReject={() => { rejectProduct(p.id); alert(`Product #${p.id} rejected.`); }}
                  />
                ))}
              </div>
            )
          )}

          {activeTab === 'live' && (
            liveProductsList.length === 0 ? (
              <div className="card-base p-12 text-center bg-white shadow-sm border border-[#D4AF37]/20 border-dashed">
                <p className="text-sm font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>No approved weaves in live catalogue.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveProductsList.map(p => (
                  <AdminProductDisplayCard
                    key={p.id}
                    product={p}
                    allShops={allShops}
                    allUsers={allUsers}
                    pendingShops={pendingShops}
                    actions={
                      <Link
                        to="/admin/approved-products"
                        className="text-xs font-bold text-[#7B1E3A] hover:text-[#D4AF37] no-underline transition-colors"
                      >
                        Manage in Catalogue →
                      </Link>
                    }
                  />
                ))}
              </div>
            )
          )}

          {activeTab === 'recent' && (
            recentProductsList.length === 0 ? (
              <div className="card-base p-12 text-center bg-white shadow-sm border border-[#D4AF37]/20 border-dashed">
                <p className="text-sm font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>No recently added products available.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentProductsList.map(p => (
                  <AdminProductDisplayCard
                    key={p.id}
                    product={p}
                    allShops={allShops}
                    allUsers={allUsers}
                    pendingShops={pendingShops}
                  />
                ))}
              </div>
            )
          )}

          {activeTab === 'review' && (
            pendingNewProducts.length === 0 ? (
              <div className="card-base p-12 text-center bg-white shadow-sm border border-[#D4AF37]/20 border-dashed">
                <p className="text-sm font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>No products currently pending product review.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingNewProducts.map(p => (
                  <AdminProductDisplayCard
                    key={p.id}
                    product={p}
                    allShops={allShops}
                    allUsers={allUsers}
                    pendingShops={pendingShops}
                    onApprove={() => { approveProduct(p.id); alert(`Product #${p.id} approved & live.`); }}
                    onReject={() => { rejectProduct(p.id); alert(`Product #${p.id} rejected.`); }}
                  />
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* Activities Feed - Strictly Below Cards */}
      <div className="space-y-4 w-full min-w-0 max-w-full flex flex-col pt-4 overflow-hidden">
        <div className="flex items-center justify-between w-full min-w-0 gap-4 flex-wrap">
          <h2 className="text-xl font-bold text-[#7B1E3A] m-0 flex items-center gap-2 break-words" style={{ fontFamily: 'Playfair Display' }}>
            <FiTrendingUp className="text-[#D4AF37] flex-shrink-0" /> Live Ecosystem Activities
          </h2>
          <span className="text-xs text-[#6B4A48] font-mono flex-shrink-0">Real-time Feed</span>
        </div>

        {dynamicActivities.length === 0 ? (
          <div className="card-base p-12 text-center bg-white shadow-sm border border-[#D4AF37]/20 border-dashed w-full min-w-0 block">
            <p className="text-sm font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>No recent activities found.</p>
          </div>
        ) : (
          <div className="card-base bg-white shadow-sm border border-[#D4AF37]/20 divide-y divide-[#D4AF37]/15 w-full min-w-0 max-w-full block overflow-hidden">
            {dynamicActivities.map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                className="p-5 flex items-center justify-between hover:bg-[#FFF8F0]/50 transition-colors w-full min-w-0 gap-4">
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-xs ${a.badgeColor || 'bg-[#D4AF37]'}`} />
                  <span className="text-xs sm:text-sm text-[#4A2C2A] font-medium leading-relaxed break-words min-w-0">{a.text}</span>
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
