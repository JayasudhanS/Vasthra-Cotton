import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiPlus, FiSave, FiEdit2, FiTrash2, FiShield, FiSliders, FiBell, FiLock, FiAlertCircle, FiEye, FiMapPin, FiMail, FiPhone, FiSearch } from 'react-icons/fi';
import { products as staticProducts, shops, categories as initialCategories } from '../../data';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { AdminProductDisplayCard, resolveShopInfo } from './AdminProductCardHelper';

export function AdminPendingProducts() {
  const { products, approveProduct, rejectProduct, deleteProduct, adminEditProduct, approvePendingEdit, rejectPendingEdit } = useProducts();
  const { allShops = [], allUsers = [], pendingShops = [] } = useAuth();
  const pendingNew = products.filter(p => (p.status || '').toString().trim().toLowerCase() === 'pending');
  const pendingEdits = products.filter(p => p.pendingEdit && p.pendingEdit.editStatus === 'pending');

  const handleEdit = (p) => {
    const newPrice = prompt('Enter new offer price for ' + p.name + ':', p.offerPrice || p.price);
    if (newPrice !== null && !isNaN(newPrice)) {
      adminEditProduct(p.id, { offerPrice: Number(newPrice) });
    }
  };

  const act = (id, status) => {
    const isConfirm = window.confirm(`Are you sure you want to ${status} this saree?`);
    if (!isConfirm) return;
    if (status === 'approved') approveProduct(id);
    else if (status === 'rejected') rejectProduct(id);
  };

  return (
    <div className="space-y-8">
      {/* New Product Approvals / Verification Queue */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">✦ Verification Queue</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>Pending Saree Approvals</h1>
          </div>
          <span className="badge badge-warning !text-xs font-bold px-3.5 py-1.5">
            {pendingNew.length === 1 ? '1 Pending Review' : `${pendingNew.length} Pending Reviews`}
          </span>
        </div>

        {pendingNew.length === 0 ? (
          <div className="card-base p-12 text-center bg-white shadow-sm border border-[#D4AF37]/20 border-dashed">
            <p className="text-sm font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>No products available in pending approval queue.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingNew.map(p => (
              <AdminProductDisplayCard
                key={p.id}
                product={p}
                allShops={allShops}
                allUsers={allUsers}
                pendingShops={pendingShops}
                onApprove={() => act(p.id, 'approved')}
                onReject={() => act(p.id, 'rejected')}
                onEdit={() => handleEdit(p)}
                onDelete={() => deleteProduct(p.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pending Edit Reviews from Shopkeepers */}
      {pendingEdits.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-amber-300/40">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-amber-600 block mb-1">✦ Shopkeeper Edit Requests</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>Pending Product Edits</h2>
            </div>
            <span className="badge badge-warning !text-xs font-bold px-3.5 py-1.5">
              {pendingEdits.length} Edit{pendingEdits.length !== 1 ? 's' : ''} Pending
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingEdits.map(p => {
              const { shopName, shopLogo, ownerName, phoneNumber } = resolveShopInfo(p, allShops, allUsers, pendingShops);
              return (
                <div key={p.id} className="card-base p-5 bg-white border border-amber-200 shadow-sm flex flex-col justify-between rounded-2xl">
                  <div>
                    <div className="flex items-start gap-3.5 mb-4 pb-4 border-b border-[#D4AF37]/15">
                      <img src={p.thumbnail || p.image || p.imageUrl} alt={p.name} className="w-16 h-20 rounded-xl object-cover border border-[#D4AF37]/30 shadow-xs flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border mb-1.5 bg-blue-600 text-white border-blue-600">
                          Pending Edit Review
                        </span>
                        <h4 className="font-bold text-[#7B1E3A] text-base m-0 leading-snug break-words" style={{ fontFamily: 'Playfair Display' }}>{p.name}</h4>
                        <p className="text-xs font-semibold text-[#6B4A48]/80 m-0 mt-1">ID: #{p.id} · {p.category}</p>
                      </div>
                    </div>

                    <div className="bg-[#FFF8F0]/80 rounded-xl p-3.5 border border-[#D4AF37]/25 mb-4 space-y-2.5">
                      <div className="flex items-center gap-3">
                        <img src={shopLogo} alt={shopName} className="w-10 h-10 rounded-full object-cover border-2 border-[#D4AF37] shadow-xs flex-shrink-0 bg-white" />
                        <div className="min-w-0 flex-1">
                          <span className="text-sm sm:text-base font-bold text-[#7B1E3A] truncate block leading-tight">{shopName}</span>
                          <span className="text-xs text-[#6B4A48] font-medium truncate block mt-0.5">
                            Owner : <strong className="text-[#4A2C2A] font-bold text-xs sm:text-sm">{ownerName}</strong>
                          </span>
                          <span className="text-[11px] text-[#D4AF37] font-mono font-medium block truncate mt-0.5">
                            {phoneNumber}
                          </span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-[#D4AF37]/15 flex items-center justify-between text-xs text-[#6B4A48]">
                        <span className="text-[10px] uppercase font-bold text-[#D4AF37]">Submitted :</span>
                        <span className="font-semibold text-[#4A2C2A]">{p.pendingEdit?.submittedAt ? new Date(p.pendingEdit.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Recently'}</span>
                      </div>
                    </div>

                    <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200/50 mb-4">
                      <span className="text-[10px] uppercase tracking-wider text-amber-700 font-bold block mb-2">Proposed Changes</span>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(p.pendingEdit || {}).filter(([k]) => !['submittedBy', 'submittedAt', 'editStatus'].includes(k)).map(([key, val]) => (
                          <div key={key} className="bg-white rounded-lg p-2.5 border border-amber-200/30">
                            <span className="text-[10px] uppercase text-[#D4AF37] font-bold block">{key}</span>
                            <span className="text-xs text-[#4A2C2A] font-semibold">{typeof val === 'number' ? `₹${val.toLocaleString()}` : String(val)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-[#D4AF37]/15 justify-end">
                    <button
                      onClick={() => { approvePendingEdit(p.id); alert('Edit approved and live product updated.'); }}
                      className="px-4 py-2 rounded-xl bg-[#2D8F5E] text-white font-bold text-xs hover:bg-[#23744b] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <FiCheck size={14} /> Approve Edit
                    </button>
                    <button
                      onClick={() => { rejectPendingEdit(p.id); alert('Edit rejected. Live product unchanged.'); }}
                      className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <FiX size={14} /> Reject Edit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminApprovedProducts() {
  const { products, deleteProduct, adminEditProduct, rejectProduct } = useProducts();
  const { allShops = [], allUsers = [], pendingShops = [] } = useAuth();
  const approved = products.filter(p => p.status === 'approved');

  const handleEdit = (p) => {
    const newPrice = prompt('Enter new offer price for ' + p.name + ':', p.offerPrice || p.price);
    if (newPrice !== null && !isNaN(newPrice)) {
      adminEditProduct(p.id, { offerPrice: Number(newPrice) });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">✦ Live Catalogue</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>Verified & Approved Sarees</h1>
        </div>
        <span className="badge badge-success !text-xs font-bold px-3.5 py-1.5">
          {approved.length} Weaves Live
        </span>
      </div>

      {approved.length === 0 ? (
        <div className="card-base p-12 text-center bg-white shadow-sm border border-[#D4AF37]/20 border-dashed">
          <p className="text-sm font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>No approved weaves available in live catalogue.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approved.map(p => (
            <AdminProductDisplayCard
              key={p.id}
              product={p}
              allShops={allShops}
              allUsers={allUsers}
              pendingShops={pendingShops}
              actions={
                <div className="flex items-center justify-end gap-2 w-full flex-wrap">
                  <button onClick={() => handleEdit(p)} title="Edit Price/Details"
                    className="px-3 py-1.5 rounded-xl bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center cursor-pointer border border-blue-300 hover:bg-blue-600 hover:text-white transition-all shadow-xs">
                    <FiEdit2 size={14} className="mr-1" /> Edit Price
                  </button>
                  <button onClick={() => rejectProduct(p.id)} title="Revoke Certification / Reject"
                    className="px-3 py-1.5 rounded-xl bg-yellow-100 text-yellow-800 text-xs font-bold flex items-center justify-center cursor-pointer border border-yellow-300 hover:bg-yellow-600 hover:text-white transition-all shadow-xs">
                    <FiX size={14} className="mr-1" /> Revoke Live
                  </button>
                  <button onClick={() => { if (window.confirm('Completely delete this saree?')) deleteProduct(p.id); }} title="Delete Saree"
                    className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center cursor-pointer border border-red-300 hover:bg-red-600 hover:text-white transition-all shadow-xs">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function AdminPendingShops() {
  const { pendingShops, approveShop, rejectShop } = useAuth();
  const { products = [] } = useProducts();
  const [filter, setFilter] = useState('pending');
  const [search, setSearch] = useState('');
  const [selectedShop, setSelectedShop] = useState(null);

  const getShopStats = (shopId, shopUid) => {
    const shopProducts = products.filter(p => p.shopId === shopId || p.ownerId === shopId || p.shopId === shopUid || p.ownerId === shopUid);
    return {
      published: shopProducts.filter(p => (p.status || '').toLowerCase() === 'approved' || p.status === 'active').length,
      pending: shopProducts.filter(p => (p.status || '').toLowerCase() === 'pending').length,
      rejected: shopProducts.filter(p => (p.status || '').toLowerCase() === 'rejected').length,
      total: shopProducts.length
    };
  };

  const act = (id, decision) => {
    const isConfirm = window.confirm(`Are you sure you want to ${decision.toLowerCase()} this shop?`);
    if (!isConfirm) return;

    if (decision === 'Approved') approveShop(id);
    else rejectShop(id);
    setSelectedShop(null); // Close modal on action
  };

  const items = pendingShops.filter(s => {
    const sStatus = (s.status || 'pending').toLowerCase();
    const isApproved = sStatus === 'approved' || sStatus === 'active' || sStatus === 'verified' || s.approved === true || s.isApproved === true;
    const isRejected = sStatus === 'rejected' || s.approved === false;
    const isPending = sStatus === 'pending' || (!isApproved && !isRejected);

    let matchesFilter = false;
    if (filter === 'all') matchesFilter = true;
    else if (filter === 'approved' && isApproved) matchesFilter = true;
    else if (filter === 'rejected' && isRejected) matchesFilter = true;
    else if (filter === 'pending' && isPending) matchesFilter = true;

    if (!matchesFilter) return false;

    if (search) {
      const q = search.toLowerCase();
      const nameMatch = (s.shopName || '').toLowerCase().includes(q) || (s.name || '').toLowerCase().includes(q);
      const phoneMatch = (s.phone || s.phoneNumber || '').includes(q);
      if (!nameMatch && !phoneMatch) return false;
    }
    
    // Attach grouped status for UI consistency
    s._computedStatus = isApproved ? 'approved' : isRejected ? 'rejected' : 'pending';
    return true;
  });

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    approved: 'bg-green-100 text-green-800 border-green-300',
    rejected: 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">✦ Artisan Verification</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>Weaver Houses</h1>
        </div>
        <span className="badge badge-warning !text-xs font-bold px-3.5 py-1.5">
          {items.length} {filter === 'pending' ? 'Applications Pending' : 'Shops Found'}
        </span>
      </div>

      {/* Filters and Search */}
      <div className="card-base p-5 sm:p-6 bg-white border border-[#D4AF37]/20 space-y-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {['pending', 'approved', 'rejected', 'all'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer border transition-all capitalize ${filter === f ? 'bg-[#7B1E3A] text-white border-[#7B1E3A]' : 'bg-[#FFF8F0] text-[#6B4A48] border-[#D4AF37]/20 hover:border-[#D4AF37]'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B4A48]/60" size={14} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by Shop Name, Owner, or Phone..." className="input-field !h-10 !text-xs !pl-9" />
        </div>
      </div>

      {/* Grid Layout */}
      {items.length === 0 ? (
        <div className="card-base p-16 text-center max-w-lg mx-auto bg-white border-dashed border-[#D4AF37]/40">
          <div className="w-16 h-16 rounded-full bg-[#7B1E3A]/10 text-[#7B1E3A] flex items-center justify-center mx-auto mb-4 text-2xl">🏪</div>
          <h3 className="text-xl font-bold text-[#7B1E3A] mb-1" style={{ fontFamily: 'Playfair Display' }}>No pending shop approval requests.</h3>
          <p className="text-sm text-[#6B4A48] m-0">There are no shops matching your current filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(s => {
            const logo = s.shopLogo || s.logo || s.profileImage || 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=150';
            const sStatus = s._computedStatus;
            return (
              <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="card-base bg-white border border-[#D4AF37]/20 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden">
                <div className="p-5 sm:p-6">
                  {/* Header: Logo and Title */}
                  <div className="flex items-start gap-4 mb-4 pb-4 border-b border-[#D4AF37]/15">
                    <img src={logo} alt={s.shopName} className="w-16 h-16 rounded-full object-cover border-2 border-[#D4AF37]/30 shadow-xs flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#7B1E3A] text-lg leading-tight m-0 truncate" style={{ fontFamily: 'Playfair Display' }}>{s.shopName || 'Weaver House'}</h3>
                      <p className="text-xs font-semibold text-[#6B4A48] mt-1 m-0 truncate">{s.name || 'Master Artisan'}</p>
                      <span className={`inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusColors[sStatus] || statusColors.pending}`}>
                        {sStatus}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-[#6B4A48]">
                      <FiPhone className="text-[#D4AF37] flex-shrink-0" size={13} />
                      <span className="font-mono font-medium truncate">{s.phone || s.phoneNumber || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#6B4A48]">
                      <FiMail className="text-[#D4AF37] flex-shrink-0" size={13} />
                      <span className="truncate">{s.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-[#6B4A48]">
                      <FiMapPin className="text-[#D4AF37] flex-shrink-0 mt-0.5" size={13} />
                      <span className="line-clamp-2 leading-relaxed">{s.address || s.location || 'Address not provided'}</span>
                    </div>
                    <div className="pt-2 border-t border-[#D4AF37]/15 text-[11px] font-semibold text-[#6B4A48] mt-2">
                      Registered Date: {s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'}) : (s.date || 'July 2026')}
                    </div>
                  </div>

                  {/* Saree Counts */}
                  <div className="flex gap-2 mb-4">
                    <div className="flex-1 bg-[#FFF8F0] p-2 rounded-lg text-center border border-[#D4AF37]/20">
                      <span className="block text-[10px] uppercase font-bold text-[#D4AF37]">Published</span>
                      <span className="block text-sm font-bold text-[#7B1E3A]">{getShopStats(s.id, s.uid).published}</span>
                    </div>
                    <div className="flex-1 bg-yellow-50 p-2 rounded-lg text-center border border-yellow-200">
                      <span className="block text-[10px] uppercase font-bold text-yellow-700">Pending</span>
                      <span className="block text-sm font-bold text-yellow-800">{getShopStats(s.id, s.uid).pending}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 sm:p-5 border-t border-[#D4AF37]/15 bg-[#FFF8F0]/40 flex flex-wrap gap-2 justify-end">
                  <button onClick={() => setSelectedShop(s)}
                    className="flex-1 min-w-[100px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-[#7B1E3A] bg-white border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 transition-colors">
                    <FiEye size={14} /> Details
                  </button>
                  {sStatus === 'pending' && (
                    <>
                      <button onClick={() => act(s.id, 'Approved')}
                        className="flex-1 min-w-[100px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-[#2D8F5E] bg-[#2D8F5E]/10 border border-[#2D8F5E]/20 hover:bg-[#2D8F5E]/20 transition-colors">
                        <FiCheck size={14} /> Approve
                      </button>
                      <button onClick={() => act(s.id, 'Rejected')}
                        className="flex-1 min-w-[100px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-[#C53030] bg-[#C53030]/10 border border-[#C53030]/20 hover:bg-[#C53030]/20 transition-colors">
                        <FiX size={14} /> Reject
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal for View Details */}
      {selectedShop && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto" onClick={() => setSelectedShop(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-[#D4AF37]/30 my-8" onClick={e => e.stopPropagation()}>
            <div className="p-5 sm:p-6 border-b border-[#D4AF37]/20 flex justify-between items-center bg-[#FFF8F0]/50 sticky top-0 z-10">
              <h2 className="text-xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>Complete Shop Details</h2>
              <button onClick={() => setSelectedShop(null)} className="text-[#6B4A48] hover:text-[#7B1E3A] transition-colors bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm border border-[#D4AF37]/20"><FiX size={18}/></button>
            </div>
            
            <div className="p-0 overflow-y-auto max-h-[70vh]">
              {/* Shop Banner */}
              <div className="h-32 bg-gradient-to-r from-[#7B1E3A] via-[#9B2E4A] to-[#7B1E3A] relative">
                {selectedShop.banner || selectedShop.shopBanner ? (
                  <img src={selectedShop.banner || selectedShop.shopBanner} alt="Banner" className="w-full h-full object-cover opacity-80" />
                ) : (
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23D4AF37\' fill-opacity=\'0.3\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
                )}
              </div>

              <div className="px-6 pb-6 -mt-12 relative z-10 space-y-6">
                <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-end">
                  <img src={selectedShop.shopLogo || selectedShop.logo || selectedShop.profileImage || 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=150'} alt="Logo" className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg bg-[#FFF8F0] flex-shrink-0" />
                  <div className="min-w-0 flex-1 pt-2 sm:pt-0">
                    <h3 className="font-bold text-[#7B1E3A] text-2xl m-0 truncate" style={{ fontFamily: 'Playfair Display' }}>{selectedShop.shopName || 'Weaver House'}</h3>
                    <p className="text-sm font-semibold text-[#6B4A48] m-0 mb-2 truncate">Owner: {selectedShop.name || selectedShop.ownerName || 'Master Artisan'}</p>
                    <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusColors[selectedShop._computedStatus || 'pending'] || statusColors.pending}`}>
                      {(selectedShop._computedStatus || 'pending').toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-[#FFF8F0]/40 p-4 rounded-xl border border-[#D4AF37]/15">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] block mb-1.5">Contact</span>
                    <div className="text-[#4A2C2A] font-medium space-y-1.5">
                      <p className="m-0 flex items-center gap-1.5 font-mono"><FiPhone size={12} className="text-[#6B4A48]"/> {selectedShop.phone || selectedShop.phoneNumber || 'N/A'}</p>
                      <p className="m-0 flex items-center gap-1.5 break-all"><FiMail size={12} className="text-[#6B4A48]"/> {selectedShop.email || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] block mb-1.5">Registration Date</span>
                    <p className="text-[#4A2C2A] font-medium m-0">{selectedShop.createdAt ? new Date(selectedShop.createdAt).toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'}) : (selectedShop.date || 'July 2026')}</p>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] block mb-2"><FiMapPin className="inline mr-1" size={12}/> Complete Address</span>
                  <p className="text-[#4A2C2A] text-sm leading-relaxed m-0 bg-white p-3.5 rounded-lg border border-[#D4AF37]/20">
                    {selectedShop.address || selectedShop.location || 'No address provided.'}
                  </p>
                </div>

                {selectedShop.description && (
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] block mb-2">Shop Description</span>
                    <p className="text-[#4A2C2A] text-sm leading-relaxed m-0 bg-white p-3.5 rounded-lg border border-[#D4AF37]/20 whitespace-pre-wrap">
                      {selectedShop.description}
                    </p>
                  </div>
                )}

                {/* Advanced Statistics */}
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] block mb-2">Shop Statistics</span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    <div className="bg-white p-3 rounded-lg border border-[#D4AF37]/20 text-center">
                      <span className="block text-[10px] uppercase font-bold text-[#D4AF37] mb-1">Published</span>
                      <span className="block text-lg font-bold text-[#2D8F5E]">{getShopStats(selectedShop.id, selectedShop.uid).published}</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-[#D4AF37]/20 text-center">
                      <span className="block text-[10px] uppercase font-bold text-[#D4AF37] mb-1">Pending</span>
                      <span className="block text-lg font-bold text-yellow-600">{getShopStats(selectedShop.id, selectedShop.uid).pending}</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-[#D4AF37]/20 text-center">
                      <span className="block text-[10px] uppercase font-bold text-[#D4AF37] mb-1">Approved</span>
                      <span className="block text-lg font-bold text-[#2D8F5E]">{getShopStats(selectedShop.id, selectedShop.uid).published}</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-[#D4AF37]/20 text-center">
                      <span className="block text-[10px] uppercase font-bold text-[#D4AF37] mb-1">Rejected</span>
                      <span className="block text-lg font-bold text-[#C53030]">{getShopStats(selectedShop.id, selectedShop.uid).rejected}</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-[#D4AF37]/20 text-center">
                      <span className="block text-[10px] uppercase font-bold text-[#D4AF37] mb-1">Orders</span>
                      <span className="block text-lg font-bold text-[#7B1E3A]">{selectedShop.totalOrders || 0}</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-[#D4AF37]/20 text-center">
                      <span className="block text-[10px] uppercase font-bold text-[#D4AF37] mb-1">Revenue</span>
                      <span className="block text-sm font-bold text-[#7B1E3A] flex items-center justify-center h-[28px]">
                        ₹{((selectedShop.revenue || 0) / 1000).toFixed(1)}k
                      </span>
                    </div>
                  </div>
                </div>

                {/* Approval History Mockup */}
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] block mb-2">Approval History</span>
                  <div className="bg-white p-3.5 rounded-lg border border-[#D4AF37]/20 text-xs text-[#6B4A48] space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span>Application submitted on {selectedShop.createdAt ? new Date(selectedShop.createdAt).toLocaleDateString('en-IN') : 'July 2026'}</span>
                    </div>
                    {(selectedShop._computedStatus === 'approved') && (
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span>Approved by Admin</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {(selectedShop._computedStatus || 'pending') === 'pending' && (
              <div className="p-5 border-t border-[#D4AF37]/20 bg-[#FFF8F0]/80 flex gap-3 sticky bottom-0">
                <button onClick={() => act(selectedShop.id, 'Approved')}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold text-white bg-[#2D8F5E] hover:bg-[#2D8F5E]/90 transition-colors shadow-sm">
                  <FiCheck size={16} /> Approve
                </button>
                <button onClick={() => act(selectedShop.id, 'Rejected')}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold text-white bg-[#C53030] hover:bg-[#C53030]/90 transition-colors shadow-sm">
                  <FiX size={16} /> Reject
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}

export function AdminUsers() {
  const { allUsers = [] } = useAuth();
  const users = allUsers.filter(u => u.role === 'user' || (!u.role && u.email !== 'admin@vasthracotton.com'));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">✦ Community Roster</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>Registered Connoisseurs</h1>
        </div>
        <span className="badge badge-success !text-xs font-bold px-3.5 py-1.5">
          {users.length} Active Members
        </span>
      </div>

      <div className="table-container bg-white shadow-sm border border-[#D4AF37]/20">
        <table className="table-base w-full">
          <thead>
            <tr>
              <th className="!text-xs uppercase tracking-wider">Member Name</th>
              <th className="!text-xs uppercase tracking-wider">Contact Info</th>
              <th className="!text-xs uppercase tracking-wider">Member Tier</th>
              <th className="!text-xs uppercase tracking-wider">Joined Date</th>
              <th className="!text-xs uppercase tracking-wider text-right">Total Orders</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-[#6B4A48] italic">No users found.</td>
              </tr>
            ) : (
              users.map((u, i) => (
                <tr key={u.id || i} className="hover:bg-[#FFF8F0]/50 transition-colors">
                  <td className="font-bold text-[#4A2C2A] text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#7B1E3A]/10 text-[#7B1E3A] flex items-center justify-center font-bold text-xs">
                        {(u.name || 'U').charAt(0)}
                      </div>
                      {u.name || 'Connoisseur'}
                    </div>
                  </td>
                  <td className="text-[#6B4A48] text-xs">
                    <span className="block font-mono">{u.email || ''}</span>
                    <span className="block font-mono text-[10px] text-[#D4AF37] mt-0.5">{u.phone || u.phoneNumber || 'No phone'}</span>
                  </td>
                  <td>
                    <span className={`badge ${(u.tier || '').includes('Platinum') || (u.tier || '').includes('Gold') || (u.orders || 0) > 5 ? 'badge-warning' : 'badge-success'}`}>
                      ✦ {u.tier || ((u.orders || 0) > 5 ? 'Gold Member' : 'Silver Connoisseur')}
                    </span>
                  </td>
                  <td className="text-[#6B4A48] text-xs font-medium">{u.joined || (u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recently')}</td>
                  <td className="font-bold text-[#7B1E3A] text-sm text-right">{u.orders || u.ordersCount || 0} Orders</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminCategories() {
  const [categories, setCategories] = useState(initialCategories);
  const [newCat, setNewCat] = useState({ name: '', count: '0' });
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (newCat.name.trim()) {
      setCategories([...categories, { id: Date.now(), name: newCat.name, count: +newCat.count, image: 'https://images.pexels.com/photos/2814808/pexels-photo-2814808.jpeg?auto=compress&cs=tinysrgb&w=800' }]);
      setNewCat({ name: '', count: '0' });
      setShowAdd(false);
      alert('New regional weave category added successfully!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D4AF37]/20">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">✦ Taxonomy & Regional Weaves</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>Saree Categories</h1>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-golden !py-2.5 !px-5 !text-xs cursor-pointer shadow-md inline-flex items-center gap-1.5 w-fit">
          <FiPlus size={16} /> Add Regional Category
        </button>
      </div>

      {showAdd && (
        <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleAdd}
          className="card-base p-6 sm:p-8 bg-[#FFF8F0] border border-[#D4AF37]/40 shadow-md space-y-4 max-w-xl">
          <h3 className="text-base font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>Create New Weave Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Category Title *</label>
              <input type="text" required placeholder="e.g. Chanderi Handloom" value={newCat.name} onChange={e => setNewCat({ ...newCat, name: e.target.value })} className="input-field !h-10 !text-xs bg-white" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Est. Weaves Count</label>
              <input type="number" required placeholder="100" value={newCat.count} onChange={e => setNewCat({ ...newCat, count: e.target.value })} className="input-field !h-10 !text-xs bg-white" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="btn-outline-maroon !py-2 !px-4 !text-xs">Cancel</button>
            <button type="submit" className="btn-golden !py-2 !px-6 !text-xs cursor-pointer">Save Category</button>
          </div>
        </motion.form>
      )}

      {categories.length === 0 ? (
        <div className="card-base p-12 text-center bg-white shadow-sm border border-[#D4AF37]/20 border-dashed">
          <p className="text-sm font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>No categories available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(c => (
            <div key={c.id} className="card-base p-6 bg-white border border-[#D4AF37]/20 shadow-sm flex flex-col justify-between group hover:border-[#D4AF37] transition-all">
              <div>
                <div className="h-40 rounded-xl overflow-hidden mb-4 relative bg-[#FFF8F0]">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-3 py-1 rounded-full">
                    {c.count} Weaves
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#7B1E3A] m-0 group-hover:text-[#D4AF37] transition-colors" style={{ fontFamily: 'Playfair Display' }}>
                  {c.name}
                </h3>
                <p className="text-xs text-[#6B4A48] m-0 mt-1 font-light">Authentic Indian Handloom Cluster</p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#D4AF37]/15 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#2D8F5E]">✓ Active Collection</span>
                <button onClick={() => alert(`Edit category: ${c.name}`)} className="text-xs text-[#D4AF37] hover:text-[#7B1E3A] cursor-pointer bg-transparent border-none p-0 flex items-center gap-1 font-semibold">
                  <FiEdit2 size={13} /> Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AdminSettings() {
  const [settings, setSettings] = useState({
    autoApproveSilkMark: true,
    emailNotifications: true,
    maintenanceMode: false,
    commissionRate: '0',
    platformName: 'Vasthra Cotton Luxury Marketplace',
    supportEmail: 'concierge@vasthracotton.com'
  });

  const handleSave = (e) => {
    e.preventDefault();
    alert('Platform ecosystem configuration updated successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-4 border-b border-[#D4AF37]/20">
        <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">✦ System Configuration</span>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>Marketplace Settings</h1>
      </div>

      <motion.form initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        <div className="card-base p-6 sm:p-8 bg-white border border-[#D4AF37]/20 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-[#7B1E3A] uppercase tracking-wider pb-3 border-b border-[#D4AF37]/15 flex items-center gap-2 m-0">
            <FiSliders className="text-[#D4AF37]" /> General Ecosystem Identity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Platform Title</label>
              <input type="text" value={settings.platformName} onChange={e => setSettings({ ...settings, platformName: e.target.value })} className="input-field !h-12 !text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Concierge Support Email</label>
              <input type="email" value={settings.supportEmail} onChange={e => setSettings({ ...settings, supportEmail: e.target.value })} className="input-field !h-12 !text-sm" />
            </div>
          </div>
        </div>

        {/* Weaver & Commission Rules */}
        <div className="card-base p-6 sm:p-8 bg-white border border-[#D4AF37]/20 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-[#7B1E3A] uppercase tracking-wider pb-3 border-b border-[#D4AF37]/15 flex items-center gap-2 m-0">
            <FiShield className="text-[#D4AF37]" /> Weaver Commission & Verification Rules
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Weaver Onboarding Commission (%)</label>
              <select value={settings.commissionRate} onChange={e => setSettings({ ...settings, commissionRate: e.target.value })} className="select-field !h-12 !text-sm font-bold text-[#2D8F5E]">
                <option value="0">0% (Special Handloom Promotion Tier)</option>
                <option value="5">5% Standard Marketplace Fee</option>
                <option value="10">10% Premium Concierge Tier</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-5 bg-[#FFF8F0] rounded-xl border border-[#D4AF37]/30">
              <div>
                <span className="text-sm font-bold text-[#7B1E3A] block">Silk Mark Fast-Track</span>
                <span className="text-xs text-[#6B4A48] font-light">Auto-approve sarees from verified Silk Mark houses</span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoApproveSilkMark}
                onChange={e => setSettings({ ...settings, autoApproveSilkMark: e.target.checked })}
                className="w-5 h-5 accent-[#7B1E3A] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Notifications & System State */}
        <div className="card-base p-6 sm:p-8 bg-white border border-[#D4AF37]/20 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-[#7B1E3A] uppercase tracking-wider pb-3 border-b border-[#D4AF37]/15 flex items-center gap-2 m-0">
            <FiBell className="text-[#D4AF37]" /> Notifications & Maintenance
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-5 bg-[#FFF8F0] rounded-xl border border-[#D4AF37]/30">
              <div>
                <span className="text-sm font-bold text-[#7B1E3A] block">Instant Weaver Alerts</span>
                <span className="text-xs text-[#6B4A48] font-light">Send email & SMS upon new order dispatch</span>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={e => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="w-5 h-5 accent-[#7B1E3A] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-5 bg-red-50/70 rounded-xl border border-red-200">
              <div>
                <span className="text-sm font-bold text-red-800 block">Maintenance Mode</span>
                <span className="text-xs text-red-600 font-light">Temporarily pause checkout during system updates</span>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={e => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="w-5 h-5 accent-red-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" className="btn-golden !py-3.5 !px-10 !text-sm cursor-pointer shadow-lg inline-flex items-center gap-2">
            <FiSave size={18} /> Save Ecosystem Settings
          </button>
        </div>
      </motion.form>
    </div>
  );
}

