import { useParams, Link } from 'react-router-dom';
import { useMemo, useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiMapPin, FiStar, FiPackage, FiArrowLeft, FiShield, FiMail, FiPhone, FiCalendar, FiShare2 } from 'react-icons/fi';
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
  const [showToast, setShowToast] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareMenuRef = useRef(null);

  const isAdminOrOwner = role === 'admin' || (user && String(user.uid) === String(ownerId));

  // Close share menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShowShareMenu(false);
      }
    };
    if (showShareMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareMenu]);

  // Listen to live shop information from Firestore collections (SHOPS and USERS)
  useEffect(() => {
    if (!ownerId) {
      setLoadingShop(false);
      return;
    }

    let unsubShops = () => {};
    let unsubAllShops = () => {};

    // First try subscribing to exact doc id in SHOPS collection
    const shopRef = doc(db, COLLECTIONS.SHOPS, ownerId);
    unsubShops = onSnapshot(shopRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Only show approved shops (schema uses status field, not boolean flags)
        if (data.status === 'approved') {
          setShopDoc(prev => ({ ...(prev || {}), ...data, id: docSnap.id }));
        }
      }
    }, (err) => console.error('Error fetching shop doc:', err));

    // Fallback: query if ownerId is a string matching shopName or uid
    // Fallback query: find by uid or shopName match within approved shops
    const shopsQuery = query(
      collection(db, COLLECTIONS.SHOPS),
      where('status', '==', 'approved')
    );
    
    unsubAllShops = onSnapshot(shopsQuery, (snap) => {
      const match = snap.docs.find(d => 
        String(d.id) === String(ownerId) || 
        String(d.data().uid) === String(ownerId) || 
        (d.data().shopName && d.data().shopName.toString().trim().toLowerCase() === String(ownerId).trim().toLowerCase())
      );
      if (match) {
        setShopDoc(prev => ({ ...(prev || {}), ...match.data(), id: match.id }));
      }
      setLoadingShop(false);
    }, (err) => {
      console.error('Error fetching shop via query:', err);
      setLoadingShop(false);
    });

    return () => {
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
    name: shopDoc?.shopName || 'Master Weaving House',
    owner: shopDoc?.ownerName || 'Master Artisan',
    location: shopDoc?.address || 'India',
    logo: (!shopDoc?.logo || shopDoc?.logo === '/images/placeholder.png') ? 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=300' : shopDoc.logo,
    rating: shopDoc?.rating || 4.9,
    email: shopDoc?.email || '',
    phone: shopDoc?.phone || '',
    registeredDate: shopDoc?.createdAt ? new Date(shopDoc.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'July 2026',
    description: shopDoc?.description || 'Welcome to our official Silk Mark certified online weaving house. We craft authentic heritage handloom silk sarees with purity, precision, and dedication to traditional craftsmanship.',
  };

  // Set navbar branding to this shop while the page is mounted
  useEffect(() => {
    if (shopInfo.name && shopInfo.name !== 'Master Weaving House') {
      setShopBranding(
        shopInfo.name, 
        shopInfo.logo,
        shopInfo.location,
        shopInfo.email,
        shopInfo.phone,
        shopInfo.description
      );
    }
    return () => clearShopBranding();
  }, [
    shopInfo.name, 
    shopInfo.logo, 
    shopInfo.location, 
    shopInfo.email, 
    shopInfo.phone, 
    shopInfo.description, 
    setShopBranding, 
    clearShopBranding
  ]);

  // Extract unique categories from this shop's products
  const shopCategories = useMemo(() => {
    const cats = new Set(shopProducts.map(p => p.category).filter(Boolean));
    return Array.from(cats);
  }, [shopProducts]);

  const handleShareShop = (e) => {
    if (e) e.stopPropagation();
    const url = window.location.href;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;

    if (isMobile && navigator.share) {
      const shareData = {
        title: shopInfo.name,
        text: `Explore authentic Silk Mark Certified sarees from ${shopInfo.name} on Vasthra Cotton.`,
        url: url,
      };
      navigator.share(shareData).catch(err => console.log('Error sharing:', err));
    } else {
      setShowShareMenu(prev => !prev);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowToast(true);
    setShowShareMenu(false);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-16 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-[#2D8F5E] text-white px-6 py-3 rounded-full shadow-xl font-bold text-sm z-50 flex items-center gap-2">
          <FiCheckCircle size={16} /> Shop link copied successfully.
        </div>
      )}
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
                    <img src={shopInfo.logo} alt={shopInfo.name} onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=150'; }} className="w-full h-full object-cover" />
                  </div>
                  <span className="absolute -bottom-2 -right-2 bg-[#2D8F5E] text-white p-2 rounded-full shadow-lg border-2 border-white" title="Silk Mark Verified Weaver">
                    <FiCheckCircle size={18} />
                  </span>
                </div>

                {/* Large Shop Name & Owner Name */}
                <div className="flex-1 min-w-0 pt-2">
                  <div className="flex items-center justify-between mb-2 gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#2D8F5E] text-white text-xs font-bold shadow-xs">
                        <FiCheckCircle size={13} /> Verified Seller
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8F0] text-[#7B1E3A] text-xs font-bold border border-[#D4AF37]/30">
                        <FiStar className="text-[#D4AF37]" size={13} /> {shopInfo.rating} Rating
                      </span>
                    </div>
                    
                    {/* Share Button & Popup Menu */}
                    <div className="relative" ref={shareMenuRef}>
                      <button
                        onClick={handleShareShop}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-[#7B1E3A] text-xs font-bold shadow-xs hover:bg-[#FFF8F0] border border-[#D4AF37]/30 transition-colors flex-shrink-0 cursor-pointer"
                      >
                        <FiShare2 size={14} /> <span className="hidden sm:inline">Share</span>
                      </button>

                      {/* Desktop Share Menu */}
                      {showShareMenu && (
                        <div className="absolute top-full right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-[#D4AF37]/30 z-50 py-1.5 flex flex-col">
                          <button
                            onClick={handleCopyLink}
                            className="w-full text-left px-4 py-2.5 text-xs text-[#4A2C2A] hover:bg-[#FFF8F0] hover:text-[#7B1E3A] transition-colors font-medium flex items-center gap-2 border-none bg-transparent cursor-pointer"
                          >
                            <FiCheckCircle size={14} /> Copy Link
                          </button>
                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(`Explore authentic Silk Mark Certified sarees from ${shopInfo.name} on Vasthra Cotton: ${window.location.href}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full text-left px-4 py-2.5 text-xs text-[#4A2C2A] hover:bg-[#FFF8F0] hover:text-[#7B1E3A] transition-colors font-medium flex items-center gap-2 no-underline"
                            onClick={() => setShowShareMenu(false)}
                          >
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 0C5.385 0 0 5.386 0 12.031c0 2.124.551 4.195 1.6 6.02L.055 24l6.104-1.603c1.764.954 3.757 1.458 5.872 1.458 6.646 0 12.03-5.386 12.03-12.03S18.677 0 12.031 0zm0 21.84c-1.802 0-3.567-.485-5.114-1.404l-.366-.217-3.799.997 1.015-3.705-.238-.378a9.98 9.98 0 0 1-1.528-5.263c0-5.523 4.494-10.017 10.03-10.017 2.678 0 5.195 1.042 7.086 2.935 1.892 1.893 2.936 4.41 2.936 7.082 0 5.522-4.494 10.016-10.03 10.016zm5.503-7.514c-.302-.15-1.791-.885-2.068-.986-.277-.101-.479-.151-.681.151-.202.302-.781.986-.958 1.188-.177.201-.353.226-.656.075-1.921-.96-3.32-1.922-4.63-4.148-.202-.34-.055-.494.095-.644.135-.135.302-.353.454-.529.151-.177.202-.302.302-.504.101-.202.05-.378-.025-.529-.076-.151-.681-1.641-.933-2.247-.246-.591-.497-.512-.681-.52-.177-.008-.378-.01-.579-.01-.202 0-.529.076-.806.378-.277.302-1.058 1.034-1.058 2.52s1.084 2.923 1.235 3.125c.151.202 2.13 3.253 5.161 4.56.721.311 1.284.496 1.724.634.723.23 1.382.197 1.9.12.583-.087 1.791-.73 2.043-1.436.252-.705.252-1.311.177-1.437-.076-.126-.278-.201-.58-.352z"/></svg> WhatsApp
                          </a>
                          <a
                            href={`mailto:?subject=${encodeURIComponent(shopInfo.name)}&body=${encodeURIComponent(`Explore authentic Silk Mark Certified sarees from ${shopInfo.name} on Vasthra Cotton: ${window.location.href}`)}`}
                            className="w-full text-left px-4 py-2.5 text-xs text-[#4A2C2A] hover:bg-[#FFF8F0] hover:text-[#7B1E3A] transition-colors font-medium flex items-center gap-2 no-underline"
                            onClick={() => setShowShareMenu(false)}
                          >
                            <FiMail size={14} /> Email
                          </a>
                        </div>
                      )}
                    </div>
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
