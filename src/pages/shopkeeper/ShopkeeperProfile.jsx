import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FiCheckCircle, FiShield, FiMail, FiPhone, FiMapPin, FiPackage, 
  FiStar, FiLogOut, FiEdit2, FiX, FiSave, FiCamera, FiImage, FiUploadCloud
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db, COLLECTIONS } from '../../firebase/config';
import { uploadToCloudinary, validateImageFile } from '../../utils/cloudinaryUpload';
import { logActivity } from '../../utils/activityLogger';
import { useShopBranding } from '../../context/ShopBrandingContext';

export default function ShopkeeperProfile() {
  const { user, logout, updateLocalUser } = useAuth();
  const { setShopBranding } = useShopBranding();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const [form, setForm] = useState({
    shopName: user?.shopName || '',
    ownerName: user?.ownerName || user?.name || '',
    phone: user?.phone || '',
    description: user?.description || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
    businessCategory: user?.businessCategory || '',
    gstNumber: user?.gstNumber || '',
    socialMedia: user?.socialMedia || '',
    workingHours: user?.workingHours || '',
    logo: user?.logo || '',
    banner: user?.banner || ''
  });

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    try {
      if (type === 'logo') setUploadingLogo(true);
      else setUploadingBanner(true);

      const result = await uploadToCloudinary(file);
      setForm(prev => ({ ...prev, [type]: result.secure_url }));
    } catch (err) {
      console.error(`Error uploading ${type}:`, err);
      setError(`Failed to upload ${type}.`);
    } finally {
      if (type === 'logo') setUploadingLogo(false);
      else setUploadingBanner(false);
    }
  };

  const handleSave = async () => {
    if (!form.shopName || !form.ownerName || !form.phone) {
      setError('Shop Name, Owner Name, and Phone are required.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const shopRef = doc(db, COLLECTIONS.SHOPS, user.uid);
      
      const updateData = {
        shopName: form.shopName,
        ownerName: form.ownerName,
        phone: form.phone,
        description: form.description,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        businessCategory: form.businessCategory,
        gstNumber: form.gstNumber,
        socialMedia: form.socialMedia,
        workingHours: form.workingHours,
        logo: form.logo,
        banner: form.banner
      };

      await updateDoc(shopRef, updateData);
      
      // Determine what was updated for the activity log
      if (form.logo && form.logo !== user.logo && form.logo !== '/images/placeholder.png') {
        await logActivity('shop', `Shop Logo Changed: "${form.shopName}" updated their logo`, 'bg-blue-500');
      } else if (form.banner && form.banner !== user.banner && form.banner !== '/images/placeholder.png') {
        await logActivity('shop', `Shop Banner Changed: "${form.shopName}" updated their banner`, 'bg-blue-500');
      } else {
        await logActivity('shop', `Shop Updated: "${form.shopName}" details updated`, 'bg-blue-500');
      }

      // Update local AuthContext user state
      updateLocalUser(updateData);
      
      // Immediately update branding context if this shop is active
      setShopBranding(
        updateData.shopName,
        updateData.logo,
        updateData.address,
        user.email,
        updateData.phone,
        updateData.description
      );

      setIsEditing(false);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile updates.');
    } finally {
      setSaving(false);
    }
  };

  const displayName = user?.ownerName || user?.name || '';
  const displayShopName = user?.shopName || '';
  const displayLogo = (user?.logo && user?.logo !== '/images/placeholder.png') 
    ? user.logo 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=7B1E3A&color=fff&size=128`;
  const displayBanner = user?.banner || 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=1200';

  if (isEditing) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-10">
        <div className="pb-4 border-b border-[#D4AF37]/20 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">✦ Edit Profile</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>Update Weaving House</h1>
          </div>
          <button 
            onClick={() => setIsEditing(false)} 
            className="flex items-center gap-2 px-4 py-2 text-[#7B1E3A] hover:bg-[#7B1E3A]/10 rounded-lg transition-colors text-sm font-bold cursor-pointer"
          >
            <FiX size={18} /> Cancel
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="card-base p-6 sm:p-8 bg-white border border-[#D4AF37]/20 shadow-sm space-y-8">
          
          {/* Banner Upload */}
          <div>
            <label className="block text-sm font-bold text-[#7B1E3A] mb-3">Shop Banner</label>
            <div className="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden border-2 border-dashed border-[#D4AF37]/40 bg-[#FFF8F0] group flex items-center justify-center">
              {form.banner ? (
                <img src={form.banner} alt="Banner" className="w-full h-full object-cover opacity-80 group-hover:opacity-50 transition-opacity" />
              ) : (
                <div className="text-center text-[#D4AF37] p-4">
                  <FiImage size={40} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">No banner uploaded</p>
                </div>
              )}
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => bannerInputRef.current?.click()} 
                  disabled={uploadingBanner}
                  className="bg-white/90 text-[#7B1E3A] px-5 py-2.5 rounded-full font-bold shadow-lg flex items-center gap-2 cursor-pointer hover:bg-white transition-colors backdrop-blur-sm"
                >
                  {uploadingBanner ? 'Uploading...' : <><FiUploadCloud size={18} /> Upload Banner</>}
                </button>
                <input 
                  type="file" 
                  ref={bannerInputRef} 
                  onChange={(e) => handleImageUpload(e, 'banner')} 
                  accept="image/jpeg, image/png, image/webp" 
                  className="hidden" 
                />
              </div>
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-bold text-[#7B1E3A] mb-3">Shop Logo</label>
            <div className="flex items-end gap-6">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-dashed border-[#D4AF37]/40 bg-[#FFF8F0] group flex-shrink-0">
                {form.logo ? (
                  <img src={form.logo} alt="Logo" className="w-full h-full object-cover opacity-80 group-hover:opacity-50 transition-opacity" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#D4AF37]">
                    <FiCamera size={32} className="opacity-50" />
                  </div>
                )}
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => logoInputRef.current?.click()} 
                    disabled={uploadingLogo}
                    className="bg-white/90 text-[#7B1E3A] p-2.5 rounded-full font-bold shadow-lg flex items-center justify-center cursor-pointer hover:bg-white transition-colors"
                  >
                    {uploadingLogo ? '...' : <FiCamera size={20} />}
                  </button>
                  <input 
                    type="file" 
                    ref={logoInputRef} 
                    onChange={(e) => handleImageUpload(e, 'logo')} 
                    accept="image/jpeg, image/png, image/webp" 
                    className="hidden" 
                  />
                </div>
              </div>
              <div className="pb-2">
                <p className="text-xs text-[#6B4A48] max-w-[200px] leading-relaxed">
                  Recommended size: 500x500px.<br/>Formats: JPG, PNG, WEBP.
                </p>
              </div>
            </div>
          </div>

          <hr className="border-[#D4AF37]/15" />

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#7B1E3A]">Shop Name *</label>
              <input type="text" name="shopName" value={form.shopName} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-[#D4AF37]/30 bg-[#FFF8F0]/50 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-[#4A2C2A] transition-all" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#7B1E3A]">Owner Name *</label>
              <input type="text" name="ownerName" value={form.ownerName} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-[#D4AF37]/30 bg-[#FFF8F0]/50 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-[#4A2C2A] transition-all" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#7B1E3A]">Phone Number *</label>
              <input type="text" name="phone" value={form.phone} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-[#D4AF37]/30 bg-[#FFF8F0]/50 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-[#4A2C2A] transition-all" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#7B1E3A]">Email (Read Only)</label>
              <input type="text" value={user?.email || ''} readOnly className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 outline-none cursor-not-allowed" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#7B1E3A]">Shop Description</label>
            <textarea name="description" value={form.description} onChange={handleInputChange} rows="3" className="w-full p-3 rounded-xl border border-[#D4AF37]/30 bg-[#FFF8F0]/50 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-[#4A2C2A] transition-all resize-none"></textarea>
          </div>

          <hr className="border-[#D4AF37]/15" />

          {/* Location Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-sm font-bold text-[#7B1E3A]">Street Address</label>
              <input type="text" name="address" value={form.address} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-[#D4AF37]/30 bg-[#FFF8F0]/50 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-[#4A2C2A] transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#7B1E3A]">City</label>
              <input type="text" name="city" value={form.city} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-[#D4AF37]/30 bg-[#FFF8F0]/50 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-[#4A2C2A] transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#7B1E3A]">State</label>
                <input type="text" name="state" value={form.state} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-[#D4AF37]/30 bg-[#FFF8F0]/50 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-[#4A2C2A] transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#7B1E3A]">Pincode</label>
                <input type="text" name="pincode" value={form.pincode} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-[#D4AF37]/30 bg-[#FFF8F0]/50 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-[#4A2C2A] transition-all" />
              </div>
            </div>
          </div>

          <hr className="border-[#D4AF37]/15" />

          {/* Business Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#7B1E3A]">Business Category</label>
              <input type="text" name="businessCategory" value={form.businessCategory} onChange={handleInputChange} placeholder="e.g. Master Weaver, Retailer" className="w-full p-3 rounded-xl border border-[#D4AF37]/30 bg-[#FFF8F0]/50 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-[#4A2C2A] transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#7B1E3A]">GST Number (Optional)</label>
              <input type="text" name="gstNumber" value={form.gstNumber} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-[#D4AF37]/30 bg-[#FFF8F0]/50 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-[#4A2C2A] transition-all uppercase" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#7B1E3A]">Working Hours</label>
              <input type="text" name="workingHours" value={form.workingHours} onChange={handleInputChange} placeholder="e.g. Mon-Sat, 9AM-8PM" className="w-full p-3 rounded-xl border border-[#D4AF37]/30 bg-[#FFF8F0]/50 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-[#4A2C2A] transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#7B1E3A]">Social Media Link (Optional)</label>
              <input type="text" name="socialMedia" value={form.socialMedia} onChange={handleInputChange} placeholder="Instagram or Facebook URL" className="w-full p-3 rounded-xl border border-[#D4AF37]/30 bg-[#FFF8F0]/50 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-[#4A2C2A] transition-all" />
            </div>
          </div>

          <div className="pt-6 border-t border-[#D4AF37]/20 flex flex-col sm:flex-row gap-4 justify-end">
            <button 
              onClick={() => setIsEditing(false)} 
              disabled={saving}
              className="px-6 py-3 rounded-xl border border-[#D4AF37] text-[#7B1E3A] font-bold hover:bg-[#FFF8F0] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={saving || uploadingLogo || uploadingBanner}
              className="btn-golden px-8 !py-3 flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving Changes...' : <><FiSave size={18} /> Save Profile</>}
            </button>
          </div>

        </div>
      </div>
    );
  }

  // --- VIEW MODE ---
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="pb-4 border-b border-[#D4AF37]/20 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">✦ Weaver House Registration</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>Weaving House Profile</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="badge badge-success !text-xs font-bold px-3.5 py-1.5 flex items-center gap-1.5 shadow-sm">
            <FiCheckCircle /> Silk Mark Certified Seller
          </span>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-base bg-white border border-[#D4AF37]/20 shadow-sm overflow-hidden">
        
        {/* Banner Section */}
        <div className="w-full h-48 sm:h-64 relative bg-[#FFF8F0]">
          <img src={displayBanner} alt="Shop Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 flex items-end gap-5">
            <img 
              src={displayLogo} 
              alt="Shop Logo" 
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-xl flex-shrink-0 bg-white" 
            />
            <div className="text-white pb-2">
              <span className="badge !bg-[#D4AF37] !text-white !border-none !text-[10px] uppercase tracking-widest font-bold mb-2 inline-block shadow-sm">Verified Shop</span>
              <h2 className="text-2xl sm:text-3xl font-bold m-0 leading-tight drop-shadow-md" style={{ fontFamily: 'Playfair Display' }}>{displayShopName}</h2>
              <p className="text-sm text-white/90 m-0 mt-1 drop-shadow-md flex items-center gap-1.5">
                <FiMapPin size={14} /> {user?.city || user?.location || 'Kanchipuram, Tamil Nadu'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          
          {/* About Section */}
          {user?.description && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[#7B1E3A] uppercase tracking-wider m-0">About The Weaver House</h3>
              <p className="text-[#6B4A48] text-sm leading-relaxed m-0 bg-[#FFF8F0]/50 p-4 rounded-xl border border-[#D4AF37]/15">
                {user.description}
              </p>
            </div>
          )}

          {/* Details Grid */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#7B1E3A] uppercase tracking-wider m-0">Weaver House Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: <FiShield />, label: 'Master Weaver & Owner', value: displayName },
                { icon: <FiMail />, label: 'Official Business Email', value: user?.email || 'N/A' },
                { icon: <FiPhone />, label: 'Artisan Helpline', value: user?.phone || 'N/A' },
                { icon: <FiMapPin />, label: 'Loom Cluster Location', value: [user?.address, user?.city, user?.state, user?.pincode].filter(Boolean).join(', ') || 'N/A' },
                { icon: <FiPackage />, label: 'Business Category', value: user?.businessCategory || 'Weaver' },
                { icon: <FiStar />, label: 'Connoisseur Rating', value: '0.0 ★ (0 Verified Orders)' }
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-[#FFF8F0]/60 rounded-xl border border-[#D4AF37]/15 hover:border-[#D4AF37]/40 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center text-base flex-shrink-0 mt-0.5">
                    {f.icon}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold m-0 mb-0.5">{f.label}</p>
                    <p className="text-sm font-semibold text-[#4A2C2A] m-0 leading-relaxed">{f.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-[#D4AF37]/15 flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => setIsEditing(true)}
              className="btn-golden flex-1 justify-center !py-3 !text-sm font-bold cursor-pointer transition-all hover:shadow-sm flex items-center gap-2"
            >
              <FiEdit2 size={16} /> Edit Shop Profile
            </button>
            <button onClick={() => alert('Silk Mark certification documents downloaded.')} className="btn-outline-maroon flex-1 justify-center !py-3 !text-sm font-bold cursor-pointer transition-all hover:shadow-sm">
              Download Certificate
            </button>
            <button onClick={handleLogout} className="w-full sm:w-auto px-6 py-3 rounded-xl border border-red-300 text-red-600 font-bold bg-red-50/70 hover:bg-red-100 flex items-center justify-center gap-2 text-sm cursor-pointer transition-all shadow-sm">
              <FiLogOut size={16} /> Log Out
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
