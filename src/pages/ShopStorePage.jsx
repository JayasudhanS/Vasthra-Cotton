import { useParams, Link } from 'react-router-dom';
import { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiMapPin, FiStar, FiPackage, FiArrowLeft, FiShield, FiMail, FiPhone, FiCalendar } from 'react-icons/fi';
import { doc, getDoc, collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, COLLECTIONS } from '../firebase/config';
import ProductCard from '../components/shared/ProductCard';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useShopBranding } from '../context/ShopBrandingContext';

export default function ShopStorePage() {
  const { ownerId } = useParams();
  const { approvedProducts = [] } = useProducts();
  const { user, role } = useAuth();
  const { setShopBranding, clearShopBranding } = useShopBranding();
  const [shopDoc, setShopDoc] = useState(null);
  const [loadingShop, setLoadingShop] = useState(true);

  const isAdminOrOwner = role === 'admin' || (user && String(user.uid) === String(ownerId));

  // Listen to live shop information from Firestore collections (SHOPS and USERS)
  useEffect(() => {
    if (!ownerId) {
      setLoadingShop(false);
      return;
    }

    let unsubUsers = () => {};
    let unsubShops = () => {};

    // First try subscribing to exact doc id in USERS collection
    const userRef = doc(db, COLLECTIONS.USERS, ownerId);
    unsubUsers = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists() && (docSnap.data().role === 'shopOwner' || docSnap.data().role === 'shopkeeper' || docSnap.data().shopName)) {
        setShopDoc({ ...docSnap.data(), id: docSnap.id });
      }
    }, (err) => console.error('Error fetching user shop doc:', err));

    // Also try subscribing to exact doc id in SHOPS collection
    const shopRef = doc(db, COLLECTIONS.SHOPS, ownerId);
    unsubShops = onSnapshot(shopRef, (docSnap) => {
      if (docSnap.exists()) {
        setShopDoc(prev => ({ ...(prev || {}), ...docSnap.data(), id: docSnap.id }));
      }
    }, (err) => console.error('Error fetching shop doc:', err));

    // Fallback: query if ownerId is a string matching shopName or uid
    const shopsQuery = query(collection(db, COLLECTIONS.SHOPS));
    const unsubAllShops = onSnapshot(shopsQuery, (snap) => {
      const match = snap.docs.find(d => 
        String(d.id) === String(ownerId) || 
        String(d.data().uid) === String(ownerId) || 
        (d.data().shopName && d.data().shopName.toString().trim().toLowerCase() === String(ownerId).trim().toLowerCase())
      );
      if (match) {
        setShopDoc(prev => ({ ...(prev || {}), ...match.data(), id: match.id }));
      }
      setLoadingShop(false);
    }, () => setLoadingShop(false));

    return () => {
      unsubUsers();
      unsubShops();
      unsubAllShops();
    };
  }, [ownerId]);

  // Get strictly approved products by this shop owner / shop
  const shopProducts = useMemo(() => {
    return approvedProducts.filter(p => {
      const pShopId = String(p.shopId || '');
      const pOwnerId = String(p.ownerId || '');
      const targetId = String(ownerId || '');
      const sId = String(shopDoc?.id || '');
      const sUid = String(shopDoc?.uid || '');

      if (pShopId && pShopId === targetId) return true;
      if (pOwnerId && pOwnerId === targetId) return true;
      if (sId && (pShopId === sId || pOwnerId === sId)) return true;
      if (sUid && (pShopId === sUid || pOwnerId === sUid)) return true;
      if (shopDoc?.shopName && p.shopName && shopDoc.shopName.toString().trim().toLowerCase() === p.shopName.toString().trim().toLowerCase()) return true;
      return false;
    }).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [approvedProducts, ownerId, shopDoc]);

  // Derive unified shop info
  const firstProduct = shopProducts[0] || {};
  const shopInfo = {
    name: shopDoc?.shopName || shopDoc?.name || firstProduct?.shopName || 'Master Weaving House',
    owner: shopDoc?.ownerName || shopDoc?.owner || firstProduct?.ownerName || shopDoc?.name || 'Master Artisan',
    location: shopDoc?.location || shopDoc?.address || shopDoc?.city || firstProduct?.shopLocation || 'India',
    logo: shopDoc?.logo || shopDoc?.shopLogo || shopDoc?.profileImage || firstProduct?.shopLogo || firstProduct?.image || firstProduct?.imageUrl || 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=300',
    rating: shopDoc?.rating || firstProduct?.shopRating || firstProduct?.rating || 4.9,
    email: shopDoc?.email || firstProduct?.shopEmail || '',
    phone: shopDoc?.phone || firstProduct?.shopPhone || '',
    registeredDate: shopDoc?.establishedDate || shopDoc?.registeredDate || (shopDoc?.createdAt ? new Date(shopDoc.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'July 2026'),
    description: shopDoc?.description || firstProduct?.shopDescription || 'Welcome to our official Silk Mark certified online weaving house. We craft authentic heritage handloom silk sarees with purity, precision, and dedication to traditional craftsmanship.',
  };

  // Set navbar branding to this shop while the page is mounted
  useEffect(() => {
    if (shopInfo.name && shopInfo.name !== 'Master Weaving House') {
      setShopBranding(shopInfo.name, shopInfo.logo);
    }
    return () => clearShopBranding();
  }, [shopInfo.name, shopInfo.logo, setShopBranding, clearShopBranding]);

  // Extract unique categories from this shop's products
  const shopCategories = useMemo(() => {
    const cats = new Set(shopProducts.map(p => p.category).filter(Boolean));
    return Array.from(cats);
  }, [shopProducts]);

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-16">
      {/* Back navigation */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6">
        <Link to="/shops" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#7B1E3A] hover:text-[#D4AF37] no-underline transition-colors py-1">
          <FiArrowLeft size={16} /> Back to Shop Directory
        </Link>
      </div>

      {/* ═══════ Large Shop Banner & Storefront Header ═══════ */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-base p-0 overflow-hidden bg-white border border-[#D4AF37]/30 shadow-md rounded-3xl"
        >
          {/* Large Shop Banner Gradient */}
          <div className="h-44 sm:h-56 lg:h-64 bg-gradient-to-r from-[#7B1E3A] via-[#5D162B] to-[#7B1E3A] relative overflow-hidden">
            <div className="absolute inset-0 opacity-25" style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23D4AF37\' fill-opacity=\'0.35\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }} />
            <div className="absolute bottom-4 right-6 hidden sm:flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs border border-white/20">
              <FiShield className="text-[#D4AF37]" size={14} /> Official Silk Mark Certified Storefront
            </div>
          </div>

          {/* Shop info overlay */}
          <div className="px-6 sm:px-12 pb-8 -mt-16 sm:-mt-20 relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-8 justify-between border-b border-[#D4AF37]/20 pb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 sm:gap-7 min-w-0 flex-1">
                {/* Large Shop Logo */}
                <div className="relative flex-shrink-0">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-[#FFF8F0] flex items-center justify-center">
                    <img src={shopInfo.logo} alt={shopInfo.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="absolute -bottom-2 -right-2 bg-[#2D8F5E] text-white p-2 rounded-full shadow-lg border-2 border-white" title="Silk Mark Verified Weaver">
                    <FiCheckCircle size={18} />
                  </span>
                </div>

                {/* Large Shop Name & Owner Name */}
                <div className="flex-1 min-w-0 pt-2">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#2D8F5E] text-white text-xs font-bold shadow-xs">
                      <FiCheckCircle size={13} /> Verified Seller
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8F0] text-[#7B1E3A] text-xs font-bold border border-[#D4AF37]/30">
                      <FiStar className="text-[#D4AF37]" size={13} /> {shopInfo.rating} Rating
                    </span>
                  </div>
                  
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#7B1E3A] m-0 mb-1 leading-tight break-words" style={{ fontFamily: 'Playfair Display' }}>
                    {shopInfo.name}
                  </h1>
                  
                  <p className="text-sm sm:text-base text-[#6B4A48] m-0 font-medium">
                    Master Artisan: <strong className="text-[#4A2C2A]">{shopInfo.owner}</strong>
                  </p>
                </div>
              </div>

              {/* Stats & Quick Badge */}
              <div className="flex sm:flex-col justify-start items-start sm:items-end gap-3 w-full md:w-auto pt-2 md:pt-0">
                <div className="bg-[#FFF8F0] px-5 py-3 rounded-2xl border border-[#D4AF37]/30 shadow-xs text-center sm:text-right w-full sm:w-auto">
                  <span className="text-[10px] uppercase font-bold text-[#D4AF37] block">Published Sarees</span>
                  <span className="text-xl sm:text-2xl font-bold text-[#7B1E3A] block">{shopProducts.length}</span>
                </div>
              </div>
            </div>

            {/* Shop Description */}
            <div className="pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-2">
                <h4 className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] mb-2 m-0">✦ Store Overview</h4>
                <p className="text-sm sm:text-base text-[#6B4A48] font-light leading-relaxed m-0 break-words">
                  {shopInfo.description}
                </p>
              </div>

              {/* Location & Store Info */}
              {isAdminOrOwner ? (
                <div className="bg-[#FFF8F0]/80 rounded-2xl p-5 border border-[#D4AF37]/25 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-2 mb-3">
                    <h4 className="text-xs uppercase font-bold tracking-widest text-[#7B1E3A] m-0">
                      Store Details & Contact
                    </h4>
                    <span className="text-[10px] bg-[#2D8F5E]/10 text-[#2D8F5E] px-2 py-0.5 rounded font-bold">Admin/Owner View</span>
                  </div>
                  
                  <div className="flex items-start gap-2.5 text-xs text-[#4A2C2A]">
                    <FiMapPin size={16} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-[#7B1E3A]">Location</span>
                      <span className="text-[#6B4A48]">{shopInfo.location}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs text-[#4A2C2A] pt-1">
                    <FiCalendar size={16} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-[#7B1E3A]">Registered Date</span>
                      <span className="text-[#6B4A48]">{shopInfo.registeredDate}</span>
                    </div>
                  </div>

                  {shopInfo.email && (
                    <div className="flex items-start gap-2.5 text-xs text-[#4A2C2A] pt-1">
                      <FiMail size={16} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <span className="font-bold block text-[#7B1E3A]">Email Contact</span>
                        <span className="text-[#6B4A48] truncate block">{shopInfo.email}</span>
                      </div>
                    </div>
                  )}

                  {shopInfo.phone && (
                    <div className="flex items-start gap-2.5 text-xs text-[#4A2C2A] pt-1">
                      <FiPhone size={16} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-[#7B1E3A]">Phone Support</span>
                        <span className="text-[#6B4A48] font-mono">{shopInfo.phone}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-[#FFF8F0]/80 rounded-2xl p-5 border border-[#D4AF37]/25 space-y-3">
                  <h4 className="text-xs uppercase font-bold tracking-widest text-[#7B1E3A] mb-3 m-0 pb-2 border-b border-[#D4AF37]/20">
                    Store Information
                  </h4>
                  
                  <div className="flex items-start gap-2.5 text-xs text-[#4A2C2A]">
                    <FiMapPin size={16} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-[#7B1E3A]">Location</span>
                      <span className="text-[#6B4A48]">{shopInfo.location}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs text-[#4A2C2A] pt-1">
                    <FiCheckCircle size={16} className="text-[#2D8F5E] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-[#7B1E3A]">Verified Seller</span>
                      <span className="text-[#6B4A48]">Silk Mark Certified Weaver</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs text-[#4A2C2A] pt-1">
                    <FiStar size={16} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-[#7B1E3A]">Seller Rating</span>
                      <span className="text-[#6B4A48]">{shopInfo.rating} / 5.0</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#D4AF37]/15">
                    <div className="flex items-start gap-2.5 text-xs text-[#6B4A48]">
                      <FiShield size={15} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <p className="m-0 leading-relaxed font-medium" style={{ fontSize: '11px' }}>
                        Shop contact details will be shared after your order is successfully confirmed.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ═══════ Categories Pill Filter ═══════ */}
      {shopCategories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase text-[#D4AF37] tracking-wider mr-2">Collections :</span>
            {shopCategories.map(cat => (
              <span key={cat} className="text-xs font-semibold text-[#7B1E3A] bg-white px-4 py-2 rounded-full border border-[#D4AF37]/25 shadow-xs">
                {cat}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ═══════ All Approved Products of that Shop ═══════ */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#D4AF37]/20">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">✦ Exclusive Weaves</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>
              {shopProducts.length > 0 ? 'Store Catalogue' : 'No Published Sarees Yet'}
            </h2>
          </div>
          <span className="text-xs font-bold text-[#7B1E3A] bg-[#FFF8F0] px-4 py-2 rounded-xl border border-[#D4AF37]/30">
            {shopProducts.length} {shopProducts.length === 1 ? 'Saree' : 'Sarees'} Available
          </span>
        </div>

        {shopProducts.length === 0 ? (
          <div className="card-base p-16 text-center max-w-lg mx-auto bg-white border border-[#D4AF37]/20 border-dashed rounded-3xl">
            <div className="w-16 h-16 rounded-full bg-[#7B1E3A]/10 text-[#7B1E3A] flex items-center justify-center mx-auto mb-4 text-2xl font-bold">✦</div>
            <h3 className="text-xl font-bold text-[#7B1E3A] mb-2" style={{ fontFamily: 'Playfair Display' }}>
              No Sarees Currently Published
            </h3>
            <p className="text-sm text-[#6B4A48] m-0">This verified weaving house hasn't listed any active products in our catalogue right now. Please check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {shopProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
