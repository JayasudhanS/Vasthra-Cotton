import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiImage, FiSave, FiUploadCloud, FiCheckCircle, FiPlus, FiAlertCircle } from 'react-icons/fi';
import { categories } from '../../data';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';

export default function AddProduct() {
  const { addProduct } = useProducts();
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', category: '', price: '', offerPrice: '', stock: '', description: '', fabric: 'Silk', color: 'Gold', zariType: 'Pure Zari' });
  const [submitted, setSubmitted] = useState(false);
  const upd = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    addProduct({
      ...form,
      price: Number(form.price) || 18000,
      offerPrice: Number(form.offerPrice || form.price) || 14500,
      stock: Number(form.stock) || 5,
      shopName: user?.name || user?.shopName || 'Weave House',
      ownerName: user?.ownerName || 'Master Weaver',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-base p-12 text-center max-w-lg mx-auto my-12 bg-white border-2 border-[#2D8F5E]/30 shadow-xl">
        <div className="w-20 h-20 rounded-full bg-[#2D8F5E]/10 text-[#2D8F5E] flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
          <FiCheckCircle />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] mb-2" style={{ fontFamily: 'Playfair Display' }}>
          Masterpiece Submitted!
        </h2>
        <span className="badge badge-warning text-xs font-bold px-4 py-1.5 mt-2">
          ⏳ Pending Quality Check & Silk Mark Verification
        </span>
        <p className="text-sm text-[#6B4A48] mt-4 leading-relaxed font-light">
          Your saree <strong className="text-[#7B1E3A] font-semibold">"{form.name}"</strong> has been queued for admin review. Once verified, it will be live across all regional collections.
        </p>
        <div className="pt-6 mt-6 border-t border-[#D4AF37]/20 flex gap-4 justify-center">
          <button onClick={() => { setSubmitted(false); setForm({ name: '', category: '', price: '', offerPrice: '', stock: '', description: '', fabric: 'Silk', color: 'Gold', zariType: 'Pure Zari' }); }}
            className="btn-golden !py-3 !px-6 !text-xs cursor-pointer shadow-md inline-flex items-center gap-2">
            <FiPlus /> Add Another Weave
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-4">
      <div className="mb-8 pb-4 border-b border-[#D4AF37]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] block mb-1">
            ✦ Weaver Catalogue Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>
            Add New Royal Saree
          </h1>
        </div>
        <span className="text-xs text-[#6B4A48] bg-[#FFF8F0] px-4 py-2 rounded-xl border border-[#D4AF37]/30 flex items-center gap-2 w-fit">
          <FiAlertCircle className="text-[#D4AF37]" /> Silk Mark Certification Required
        </span>
      </div>

      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} onSubmit={handleSubmit}
        className="card-base p-8 sm:p-10 space-y-8 bg-white border border-[#D4AF37]/20 shadow-lg">
        
        {/* Basic Details */}
        <div>
          <h3 className="text-base font-bold text-[#7B1E3A] uppercase tracking-wider mb-4 pb-2 border-b border-[#D4AF37]/15">
            1. Weave Details & Title
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Saree Title / Masterpiece Name *</label>
              <input type="text" required value={form.name} onChange={upd('name')} placeholder="e.g. Traditional Pure Kanjivaram Bridal Silk Saree with Crimson Zari Border" className="input-field !h-12 !text-sm" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Regional Category *</label>
                <select required value={form.category} onChange={upd('category')} className="select-field !h-12 !text-sm">
                  <option value="">Select Weave</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Primary Fabric *</label>
                <select value={form.fabric} onChange={upd('fabric')} className="select-field !h-12 !text-sm">
                  {['Pure Silk', 'Kanjivaram Silk', 'Banarasi Silk', 'Chiffon', 'Georgette', 'Cotton Silk', 'Organza', 'Tussar Silk'].map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Zari Type</label>
                <select value={form.zariType} onChange={upd('zariType')} className="select-field !h-12 !text-sm">
                  {['Pure Zari', 'Half Fine Zari', 'Tested Zari', 'Antique Gold Zari', 'Silver Zari', 'No Zari'].map(z => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div>
          <h3 className="text-base font-bold text-[#7B1E3A] uppercase tracking-wider mb-4 pb-2 border-b border-[#D4AF37]/15">
            2. Pricing & Inventory
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Original MRP (₹) *</label>
              <input type="number" required value={form.price} onChange={upd('price')} placeholder="e.g. 18000" className="input-field !h-12 !text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Offer Price (₹) *</label>
              <input type="number" required value={form.offerPrice || form.price} onChange={upd('offerPrice')} placeholder="e.g. 14500" className="input-field !h-12 !text-sm font-semibold text-[#2D8F5E]" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Available Stock (Weaves) *</label>
              <input type="number" required value={form.stock} onChange={upd('stock')} placeholder="e.g. 5" className="input-field !h-12 !text-sm" />
            </div>
          </div>
        </div>

        {/* Description & Care */}
        <div>
          <h3 className="text-base font-bold text-[#7B1E3A] uppercase tracking-wider mb-4 pb-2 border-b border-[#D4AF37]/15">
            3. Craftsmanship & Description
          </h3>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Detailed Description & Motif Story *</label>
            <textarea
              required
              value={form.description}
              onChange={upd('description')}
              rows={4}
              placeholder="Describe the weaving technique, motif inspiration (e.g. Peacock, Lotus), border style, and blouse piece specifications..."
              className="textarea-field !text-sm"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <h3 className="text-base font-bold text-[#7B1E3A] uppercase tracking-wider mb-4 pb-2 border-b border-[#D4AF37]/15">
            4. High-Resolution Photographs
          </h3>
          <div onClick={() => alert('Demo: Photo upload simulator triggered. In production, this opens the media gallery.')}
            className="flex flex-col items-center justify-center gap-3.5 p-8 sm:p-10 rounded-2xl border-2 border-dashed border-[#D4AF37]/40 bg-[#FFF8F0]/30 hover:bg-[#FFF8F0]/70 hover:border-[#D4AF37] transition-all cursor-pointer text-center group">
            <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-sm">
              <FiUploadCloud size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#7B1E3A] m-0">Click to upload or drag & drop saree photographs</p>
              <p className="text-xs text-[#6B4A48]/80 m-0 mt-1">Please include full drape, pallu detail, zari closeup, and blouse piece (PNG, JPG, WEBP up to 10MB)</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#D4AF37]/20 flex flex-col sm:flex-row gap-4 justify-end">
          <button type="button" onClick={() => window.history.back()} className="btn-outline-maroon !py-3.5 !px-8 !text-sm justify-center">
            Cancel
          </button>
          <button type="submit" className="btn-golden !py-3.5 !px-10 !text-sm cursor-pointer shadow-lg justify-center">
            <FiSave size={18} /> Submit Masterpiece for Review
          </button>
        </div>
      </motion.form>
    </div>
  );
}

