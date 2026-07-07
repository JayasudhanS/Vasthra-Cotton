import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiFileText, FiImage, FiUploadCloud } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const isShopkeeper = role === 'shopkeeper';

  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', shopName: '', address: '', description: '' });

  const upd = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email: form.email || 'newuser@vasthracotton.com', name: form.name || 'New Member' }, role);
    navigate(isShopkeeper ? '/shopkeeper/dashboard' : '/user/dashboard');
  };

  const fields = [
    { key: 'name', label: 'Full Name / Owner Name', icon: <FiUser size={18} />, placeholder: 'e.g. Radhika Iyer', type: 'text' },
    { key: 'email', label: 'Email Address', icon: <FiMail size={18} />, placeholder: 'name@example.com', type: 'email' },
    { key: 'phone', label: 'Contact Phone Number', icon: <FiPhone size={18} />, placeholder: '+91 98765 43210', type: 'tel' },
    { key: 'password', label: 'Create Password', icon: <FiLock size={18} />, placeholder: 'At least 8 characters', type: 'password' },
  ];

  const shopFields = [
    { key: 'shopName', label: 'Weave House / Shop Name', icon: <FiFileText size={18} />, placeholder: 'e.g. Kanchipuram Royal Silks', type: 'text' },
    { key: 'address', label: 'Shop Location & Address', icon: <FiMapPin size={18} />, placeholder: 'Weavers Colony, Kanchipuram, Tamil Nadu', type: 'text' },
    { key: 'description', label: 'Heritage & Craftsmanship Description', icon: <FiFileText size={18} />, placeholder: 'Tell customers about your weaving tradition and specialties...', type: 'text' },
  ];

  return (
    <section className="min-h-[85vh] flex items-center justify-center py-16 px-4 bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF8F0]">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-xl card-base p-8 sm:p-10 border-2 border-[#D4AF37]/30 shadow-2xl bg-white">
        
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] block mb-1">
            ✦ Join India's Heritage Network
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>
            {isShopkeeper ? '🏪 Partner as a Weaver / Shop' : '👤 Create Saree Connoisseur Account'}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B4A48] mt-1.5 m-0 leading-relaxed font-light">
            {isShopkeeper ? 'List your authentic sarees to buyers worldwide with 0% onboarding fee.' : 'Unlock exclusive access to silk drops, wishlist tracking & member discounts.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.slice(0, 2).map(f => (
              <div key={f.key}>
                <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">{f.label}</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B4A48]">{f.icon}</span>
                  <input type={f.type} required placeholder={f.placeholder} value={form[f.key]} onChange={upd(f.key)}
                    className="input-field !pl-10 !h-12 !text-sm bg-[#FFF8F0]/40" />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.slice(2, 4).map(f => (
              <div key={f.key}>
                <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">{f.label}</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B4A48]">{f.icon}</span>
                  <input type={f.type} required placeholder={f.placeholder} value={form[f.key]} onChange={upd(f.key)}
                    className="input-field !pl-10 !h-12 !text-sm bg-[#FFF8F0]/40" />
                </div>
              </div>
            ))}
          </div>

          {isShopkeeper && (
            <div className="pt-4 mt-4 border-t border-[#D4AF37]/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#7B1E3A] uppercase tracking-wider">Weave House Information</span>
                <span className="text-[11px] text-[#2D8F5E] font-semibold">✓ Verified Seller Protection</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {shopFields.slice(0, 2).map(f => (
                  <div key={f.key}>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">{f.label}</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B4A48]">{f.icon}</span>
                      <input type={f.type} required placeholder={f.placeholder} value={form[f.key]} onChange={upd(f.key)}
                        className="input-field !pl-10 !h-12 !text-sm bg-[#FFF8F0]/40" />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">{shopFields[2].label}</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-[#6B4A48]">{shopFields[2].icon}</span>
                  <textarea
                    required
                    rows="2"
                    placeholder={shopFields[2].placeholder}
                    value={form.description}
                    onChange={upd('description')}
                    className="textarea-field !pl-10 !text-sm bg-[#FFF8F0]/40"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Shop Emblem / Logo</label>
                <div onClick={() => alert('Demo: File upload simulation ready.')} className="flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 border-dashed border-[#D4AF37]/40 bg-[#FFF8F0]/30 hover:bg-[#FFF8F0]/60 transition-colors cursor-pointer text-center group">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FiUploadCloud size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#7B1E3A] m-0">Click to upload shop logo or Silk Mark certificate</p>
                    <p className="text-[10px] text-[#6B4A48]/70 m-0 mt-0.5">PNG, JPG or WEBP up to 5MB</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button type="submit" className="btn-golden w-full justify-center !py-3.5 !min-h-[48px] !text-sm cursor-pointer shadow-md">
              Complete Registration & Access Portal →
            </button>
          </div>
        </form>

        <div className="border-t border-[#D4AF37]/20 pt-6 mt-6 text-center">
          <p className="text-xs sm:text-sm text-[#6B4A48] m-0">
            Already registered with us?{' '}
            <Link to={`/login/${role}`} className="text-[#7B1E3A] font-bold hover:underline ml-1">
              Sign In Here
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link to="/portal" className="inline-flex items-center gap-1 text-xs text-[#D4AF37] font-semibold hover:underline no-underline">
            ← Switch Access Portal
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

