import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { FiEye, FiEdit2, FiTrash2, FiX, FiSave, FiAlertCircle, FiPackage, FiPlus } from 'react-icons/fi';
import { DESCRIPTION_TEMPLATES } from '../../utils/descriptionTemplates';
import NativeSelectField from '../../components/shared/NativeSelectField';

export function ShopkeeperProducts() {
  const { products, deleteProduct, submitProductEdit, firestoreError } = useProducts();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('approved');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState('');
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
    setSelectedTemplate('');
    setEditMessage('');
  };

  const handleTemplateChange = (e) => {
    const templateName = e.target.value;
    if (!templateName) {
      setSelectedTemplate('');
      return;
    }

    const newDescription = DESCRIPTION_TEMPLATES[templateName];
    if (editForm.description && editForm.description.trim() !== '') {
      if (!window.confirm('Changing the template will replace the current description. Continue?')) {
        return; // Keep existing template and description
      }
    }
    setEditForm(prev => ({ ...prev, description: newDescription }));
    setSelectedTemplate(templateName);
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

      {/* Firestore connectivity warning */}
      {firestoreError && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm">
          <FiAlertCircle className="flex-shrink-0 mt-0.5 text-yellow-600" size={18} />
          <div>
            <p className="m-0 font-bold text-yellow-900">Unable to load latest product data</p>
            <p className="m-0 mt-1 text-xs leading-relaxed">Your products are safe in the database. This is a temporary connectivity or permission issue. Please refresh the page or contact admin if this persists.</p>
          </div>
        </div>
      )}

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

      <div className="space-y-4">
        {filteredProducts.length === 0 ? (
          <div className="card-base p-16 text-center max-w-lg mx-auto bg-white border-dashed">
            <div className="w-16 h-16 rounded-full bg-[#7B1E3A]/10 text-[#7B1E3A] flex items-center justify-center mx-auto mb-4 text-2xl"><FiPackage /></div>
            <h3 className="text-xl font-bold text-[#7B1E3A] mb-1" style={{ fontFamily: 'Playfair Display' }}>No Sarees Available</h3>
            <p className="text-sm text-[#6B4A48] m-0 mb-6">Upload your first weave to start selling.</p>
            <Link to="/shopkeeper/add-product" className="btn-golden inline-flex items-center gap-2">
              <FiPlus /> Add New Saree
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
            {filteredProducts.map((p, i) => (
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
                    {p.pendingEdit && (
                      <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 flex items-center gap-1 w-fit mt-1">
                        <FiAlertCircle size={10} /> Edit Pending Review
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Link to={`/product/${p.id}`} className="p-1.5 rounded-lg bg-[#FFF8F0] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-colors border border-[#D4AF37]/30" title="View Preview">
                      <FiEye size={14} />
                    </Link>
                    {p.status === 'approved' && (
                      <button
                        onClick={() => openEditModal(p)}
                        title="Edit (requires admin approval)"
                        disabled={!!p.pendingEdit}
                        className="p-1.5 rounded-lg bg-[#FFF8F0] text-[#2D8F5E] hover:bg-[#2D8F5E] hover:text-white transition-colors border border-[#2D8F5E]/30 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <FiEdit2 size={14} />
                      </button>
                    )}
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg bg-[#FFF8F0] text-red-600 hover:bg-red-600 hover:text-white transition-colors border border-red-300 cursor-pointer" title="Delete in Catalogue">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
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
                    <NativeSelectField
                      label="Fabric"
                      options={['Pure Silk', 'Kanjivaram Silk', 'Banarasi Silk', 'Chiffon', 'Georgette', 'Cotton Silk', 'Organza', 'Tussar Silk', 'Linen', 'Handloom Cotton']}
                      value={editForm.fabric}
                      onChange={e => setEditForm({ ...editForm, fabric: e.target.value })}
                      placeholder="Select Fabric"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Color</label>
                    <input type="text" value={editForm.color} onChange={e => setEditForm({ ...editForm, color: e.target.value })} className="input-field !h-10 !text-sm" />
                  </div>
                  <div>
                    <NativeSelectField
                      label="Zari / Motif"
                      options={['Pure Zari', 'Half Fine Zari', 'Tested Zari', 'Antique Gold Zari', 'Silver Zari', 'No Zari']}
                      value={editForm.zariType}
                      onChange={e => setEditForm({ ...editForm, zariType: e.target.value })}
                      placeholder="Select Zari"
                    />
                  </div>
                </div>
                <div>
                  <NativeSelectField
                    label="Description Template"
                    options={Object.keys(DESCRIPTION_TEMPLATES)}
                    value={selectedTemplate}
                    onChange={handleTemplateChange}
                    placeholder="Select a Template"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Description</label>
                  <textarea value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="input-field !text-sm !min-h-[80px] py-2" rows={4} placeholder="Describe the weaving technique, fabric quality, motifs, craftsmanship, blouse details, care instructions, and styling suggestions..." />
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
