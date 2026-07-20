import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { FiEye, FiEdit2, FiTrash2, FiX, FiSave, FiAlertCircle } from 'react-icons/fi';

export function ShopkeeperProducts() {
  const { products, deleteProduct, submitProductEdit } = useProducts();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('approved');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editMessage, setEditMessage] = useState('');

  // Filter products owned by this shopkeeper only
  const myProducts = products.filter(p => {
    const uid = user?.uid || user?.id;
    return String(p.ownerId) === String(uid);
  });

  const filteredProducts = activeTab === 'all' ? myProducts : myProducts.filter(p => p.status === activeTab);

  const openEditModal = (p) => {
    setEditingProduct(p);
    setEditForm({
      name: p.name || '',
      price: p.price || '',
      offerPrice: p.offerPrice || '',
      stock: p.stock || '',
      description: p.description || '',
      fabric: p.fabric || '',
      color: p.color || '',
      zariType: p.zariType || '',
    });
    setEditMessage('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    setEditLoading(true);
    setEditMessage('');

    const changes = {};
    if (editForm.name !== editingProduct.name) changes.name = editForm.name;
    if (Number(editForm.price) !== editingProduct.price) changes.price = Number(editForm.price);
    if (Number(editForm.offerPrice) !== editingProduct.offerPrice) changes.offerPrice = Number(editForm.offerPrice);
    if (Number(editForm.stock) !== editingProduct.stock) changes.stock = Number(editForm.stock);
    if (editForm.description !== editingProduct.description) changes.description = editForm.description;
    if (editForm.fabric !== editingProduct.fabric) changes.fabric = editForm.fabric;
    if (editForm.color !== editingProduct.color) changes.color = editForm.color;
    if (editForm.zariType !== editingProduct.zariType) changes.zariType = editForm.zariType;

    if (Object.keys(changes).length === 0) {
      setEditMessage('No changes detected.');
      setEditLoading(false);
      return;
    }

    const res = await submitProductEdit(editingProduct.id, changes, user?.name || user?.shopName || '');
    setEditMessage(res.message);
    setEditLoading(false);

    if (res.success) {
      setTimeout(() => {
        setEditingProduct(null);
        setEditMessage('');
      }, 2000);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to completely remove this saree from the system?')) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">✦ Weaver Inventory</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>My Sarees</h1>
        </div>
        <span className="badge badge-warning !text-xs font-bold px-3.5 py-1.5">
          {filteredProducts.length} {activeTab === 'approved' ? 'Approved' : activeTab === 'pending' ? 'Pending' : activeTab === 'rejected' ? 'Rejected' : 'Total'}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2.5 pb-2">
        {[
          { key: 'all', label: 'All Sarees', count: myProducts.length },
          { key: 'approved', label: 'Approved Sarees', count: myProducts.filter(p => p.status === 'approved').length },
          { key: 'pending', label: 'Pending Approval', count: myProducts.filter(p => p.status === 'pending').length },
          { key: 'rejected', label: 'Rejected Sarees', count: myProducts.filter(p => p.status === 'rejected').length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all border flex items-center gap-2 ${activeTab === tab.key ? 'bg-[#7B1E3A] text-white border-[#7B1E3A] shadow-md' : 'bg-white text-[#6B4A48] border-[#D4AF37]/30 hover:border-[#7B1E3A]'}`}
          >
            {tab.label}
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-[#FFF8F0] text-[#7B1E3A]'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="table-container bg-white shadow-sm border border-[#D4AF37]/20">
        <table className="table-base w-full">
          <thead>
            <tr>
              <th className="!text-xs uppercase tracking-wider">Product Image & Name</th>
              <th className="!text-xs uppercase tracking-wider">Category</th>
              <th className="!text-xs uppercase tracking-wider">Price</th>
              <th className="!text-xs uppercase tracking-wider">Upload Date</th>
              <th className="!text-xs uppercase tracking-wider">Current Status</th>
              <th className="!text-xs uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[#6B4A48] italic">No products found in this category.</td>
              </tr>
            ) : (
              filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-[#FFF8F0]/50 transition-colors">
                  <td className="font-medium text-[#4A2C2A]">
                    <div className="flex items-center gap-3.5">
                      <img src={p.image} alt="" className="w-12 h-14 rounded-xl object-cover border border-[#D4AF37]/30 shadow-xs flex-shrink-0" />
                      <div>
                        <span className="font-bold text-[#7B1E3A] block text-sm">{p.name}</span>
                        <span className="text-[11px] text-[#6B4A48]/70">ID: #VC-{p.id} · {p.fabric || 'Pure Silk'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="text-[#6B4A48] font-medium text-xs">
                    <span className="bg-[#FFF8F0] px-3.5 py-1.5 rounded-full border border-[#D4AF37]/20 font-medium">
                      {p.category || 'Silk'}
                    </span>
                  </td>
                  <td className="font-bold text-[#7B1E3A] text-sm">₹{(p.offerPrice || p.price || 14500).toLocaleString()}</td>
                  <td className="text-xs text-[#6B4A48] font-mono">{p.date || '09 Jul 2026'}</td>
                  <td>
                    <div className="flex flex-col gap-1">
                      <span className={`badge !text-[11px] font-bold px-3.5 py-1.5 ${p.status === 'approved' ? 'badge-success' : p.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>
                        {p.status === 'approved' ? 'Approved' : p.status === 'rejected' ? 'Rejected' : 'Pending Approval'}
                      </span>
                      {p.pendingEdit && (
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1 w-fit">
                          <FiAlertCircle size={10} /> Edit Pending Review
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/product/${p.id}`}
                        title="View"
                        className="p-2 rounded-lg bg-[#FFF8F0] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-colors border border-[#D4AF37]/30 inline-flex items-center justify-center"
                      >
                        <FiEye size={15} />
                      </Link>
                      {p.status === 'approved' && (
                        <button
                          onClick={() => openEditModal(p)}
                          title="Edit (requires admin approval)"
                          disabled={!!p.pendingEdit}
                          className="p-2 rounded-lg bg-[#FFF8F0] text-[#2D8F5E] hover:bg-[#2D8F5E] hover:text-white transition-colors border border-[#2D8F5E]/30 cursor-pointer inline-flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <FiEdit2 size={15} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(p.id)}
                        title="Delete"
                        className="p-2 rounded-lg bg-[#FFF8F0] text-red-600 hover:bg-red-600 hover:text-white transition-colors border border-red-300 cursor-pointer inline-flex items-center justify-center"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingProduct && (
          <>
            <div className="fixed inset-0 bg-black/50 z-[998] backdrop-blur-sm" onClick={() => setEditingProduct(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-xl bg-white rounded-2xl border-2 border-[#D4AF37]/30 shadow-2xl z-[999] overflow-y-auto max-h-[90vh] p-6 sm:p-8"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#D4AF37]/20">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">✦ Edit Product</span>
                  <h3 className="text-xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>
                    Modify Saree Details
                  </h3>
                  <p className="text-[11px] text-[#6B4A48] m-0 mt-1">Changes require admin approval before going live.</p>
                </div>
                <button onClick={() => setEditingProduct(null)} className="w-8 h-8 rounded-lg bg-[#FFF8F0] flex items-center justify-center cursor-pointer border border-[#D4AF37]/20 text-[#7B1E3A] hover:bg-red-50 hover:text-red-600 transition-colors">
                  <FiX size={16} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Saree Name</label>
                  <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="input-field !h-10 !text-sm" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Original Price (₹)</label>
                    <input type="number" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} className="input-field !h-10 !text-sm" required />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Offer Price (₹)</label>
                    <input type="number" value={editForm.offerPrice} onChange={e => setEditForm({ ...editForm, offerPrice: e.target.value })} className="input-field !h-10 !text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Stock</label>
                    <input type="number" value={editForm.stock} onChange={e => setEditForm({ ...editForm, stock: e.target.value })} className="input-field !h-10 !text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Fabric</label>
                    <input type="text" value={editForm.fabric} onChange={e => setEditForm({ ...editForm, fabric: e.target.value })} className="input-field !h-10 !text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Color</label>
                    <input type="text" value={editForm.color} onChange={e => setEditForm({ ...editForm, color: e.target.value })} className="input-field !h-10 !text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Zari / Motif</label>
                    <input type="text" value={editForm.zariType} onChange={e => setEditForm({ ...editForm, zariType: e.target.value })} className="input-field !h-10 !text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Description</label>
                  <textarea value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="input-field !text-sm !min-h-[80px]" rows={3} />
                </div>

                {editMessage && (
                  <div className={`text-xs font-semibold p-3 rounded-xl border ${editMessage.includes('submitted') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                    {editMessage}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={editLoading} className="btn-golden flex-1 !py-2.5 !text-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60">
                    <FiSave size={14} /> {editLoading ? 'Submitting...' : 'Submit for Review'}
                  </button>
                  <button type="button" onClick={() => setEditingProduct(null)} className="btn-outline-maroon !py-2.5 !px-5 !text-xs cursor-pointer">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
