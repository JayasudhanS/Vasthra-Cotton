import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { FiCheckCircle, FiMapPin, FiPackage, FiCalendar, FiArrowRight } from 'react-icons/fi';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, COLLECTIONS } from '../firebase/config';
import { useProducts } from '../context/ProductContext';

export default function ShopsPage() {
  const [liveShops, setLiveShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const { approvedProducts = [] } = useProducts();
  const navigate = useNavigate();

  useEffect(() => {
    let usersList = [];
    let shopsList = [];

    const updateCombined = (uList, sList) => {
      const shopMap = new Map();

      // Add shops from SHOPS collection
      sList.forEach(s => {
        if (s.id || s.uid) {
          shopMap.set(s.id || s.uid, { ...s, id: s.id || s.uid });
        }
      });

      // Add or merge shopkeepers from USERS collection
      uList.forEach(u => {
        if (u.id || u.uid) {
          const existing = shopMap.get(u.id || u.uid) || {};
          shopMap.set(u.id || u.uid, { ...existing, ...u, id: u.id || u.uid });
        }
      });

      // Filter strictly for approved shops
      const approvedOnly = Array.from(shopMap.values()).filter(shop => {
        const statusStr = (shop.status || '').toString().trim().toLowerCase();
        const isApproved = shop.approved === true || shop.approved === 'true' || statusStr === 'approved' || statusStr === 'active';
        if (!isApproved) return false;
        if (statusStr === 'pending' || statusStr === 'rejected' || statusStr === 'deleted' || shop.deleted === true) return false;
        // Must be a shop entity
        return shop.role === 'shopOwner' || shop.role === 'shopkeeper' || shop.shopName || shop.fromShopsCol === true || typeof shop.products === 'number';
      });

      setLiveShops(approvedOnly);
      setLoading(false);
    };

    const unsubUsers = onSnapshot(collection(db, COLLECTIONS.USERS), (snapshot) => {
      usersList = snapshot.docs
        .map(docSnap => ({ ...docSnap.data(), id: docSnap.id, uid: docSnap.data().uid || docSnap.id }))
        .filter(u => u.role === 'shopOwner' || u.role === 'shopkeeper');
      updateCombined(usersList, shopsList);
    }, () => {
      // If USERS collection requires authentication or permission is denied, fall back to public SHOPS collection cleanly
      updateCombined(usersList, shopsList);
    });

    const unsubShops = onSnapshot(collection(db, COLLECTIONS.SHOPS), (snapshot) => {
      shopsList = snapshot.docs.map(docSnap => ({ ...docSnap.data(), id: docSnap.id, uid: docSnap.data().uid || docSnap.id, fromShopsCol: true }));
      updateCombined(usersList, shopsList);
    }, (err) => {
      console.error('Error fetching shops collection for shops page:', err);
      updateCombined(usersList, shopsList);
    });

    return () => {
      unsubUsers();
      unsubShops();
    };
  }, []);

  const getPublishedSareesCount = (shop) => {
    if (typeof shop.products === 'number' && shop.products > 0) return shop.products;
    const count = approvedProducts.filter(p => 
      String(p.shopId) === String(shop.id) || 
      String(p.ownerId) === String(shop.id) || 
      String(p.shopId) === String(shop.uid) || 
      String(p.ownerId) === String(shop.uid) ||
      (p.shopName && shop.shopName && p.shopName.toString().trim().toLowerCase() === shop.shopName.toString().trim().toLowerCase())
    ).length;
    return count;
  };

  const getEstablishedDate = (shop) => {
    if (shop.establishedDate) return shop.establishedDate;
    if (shop.registeredDate) return shop.registeredDate;
    if (shop.createdAt) {
      const date = new Date(shop.createdAt);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      }
    }
    return '12 Jul 2026';
  };

  const getDefaultLogo = () => 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=300';

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 sm:py-14 w-full min-w-0">
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 min-w-0">
        <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-2 bg-[#7B1E3A]/5 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 w-fit mx-auto">
          ✦ Silk Mark Certified Sellers
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#7B1E3A] mb-3 break-words" style={{ fontFamily: 'Playfair Display' }}>
          Our Trusted Weaving Houses
        </h1>
        <p className="text-sm sm:text-base text-[#6B4A48] font-light leading-relaxed m-0 break-words">
          Explore all verified master artisans and heritage silk emporiums across India. Browse storefronts directly to view exclusive weaves.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <span className="inline-block w-8 h-8 border-3 border-[#7B1E3A]/20 border-t-[#7B1E3A] rounded-full animate-spin" />
        </div>
      ) : liveShops.length === 0 ? (
        <div className="card-base p-16 text-center max-w-lg mx-auto my-8 bg-[#FFF8F0]/30 border border-[#D4AF37]/20 border-dashed">
          <div className="w-16 h-16 rounded-full bg-[#7B1E3A]/10 text-[#7B1E3A] flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            ✦
          </div>
          <h3 className="text-xl font-bold text-[#7B1E3A] mb-2" style={{ fontFamily: 'Playfair Display' }}>
            No approved shops available right now.
          </h3>
          <p className="text-xs sm:text-sm text-[#6B4A48] m-0">
            Our master weaving houses are currently being verified by the Silk Mark inspection team. Check back soon.
          </p>
        </div>
      ) : (
        /* Responsive Grid: Mobile: 2 per row | Tablet: 3 per row | Desktop: 4 per row */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 w-full min-w-0 items-stretch">
          {liveShops.map((shop, i) => {
            const logoUrl = shop.logo || shop.shopLogo || shop.profileImage || getDefaultLogo();
            const shopName = shop.shopName || shop.name || 'Weaver Studio';
            const ownerName = shop.ownerName || shop.owner || shop.name || 'Master Artisan';
            const publishedCount = getPublishedSareesCount(shop);
            const registeredDate = getEstablishedDate(shop);
            const location = shop.location || shop.address || shop.city || '';
            const targetUrl = `/store/${shop.id || shop.uid}`;

            return (
              <motion.div
                key={shop.id || i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(targetUrl)}
                className="card-base p-4 sm:p-6 text-center group hover:border-[#D4AF37] hover:shadow-xl transition-all duration-300 bg-white border border-[#D4AF37]/25 flex flex-col justify-between cursor-pointer w-full min-w-0 overflow-hidden"
              >
                <div>
                  {/* Large Center Shop Logo with Verified Icon */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4">
                    <img
                      src={logoUrl}
                      alt={shopName}
                      className="w-full h-full rounded-full object-cover border-2 sm:border-3 border-[#D4AF37]/50 group-hover:border-[#D4AF37] group-hover:scale-105 transition-all shadow-md bg-[#FFF8F0]"
                    />
                    <span className="absolute bottom-0 right-0 bg-[#2D8F5E] text-white p-1 sm:p-1.5 rounded-full text-xs shadow-md border-2 border-white" title="Silk Mark Verified">
                      <FiCheckCircle size={14} />
                    </span>
                  </div>

                  {/* Shop Name & Owner Name */}
                  <h3 className="text-sm sm:text-lg font-bold text-[#7B1E3A] mb-1 group-hover:text-[#D4AF37] transition-colors truncate px-1" style={{ fontFamily: 'Playfair Display' }}>
                    {shopName}
                  </h3>
                  <p className="text-[11px] sm:text-xs font-semibold text-[#4A2C2A] mb-2 truncate px-1">
                    Owner: <span className="font-bold text-[#6B4A48]">{ownerName}</span>
                  </p>

                  {/* Verified Seller Badge */}
                  <div className="flex justify-center mb-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#2D8F5E]/10 text-[#2D8F5E] text-[10px] sm:text-xs font-bold border border-[#2D8F5E]/20">
                      <FiCheckCircle size={11} /> Verified Seller
                    </span>
                  </div>

                  {/* Information Details Box */}
                  <div className="bg-[#FFF8F0]/80 rounded-xl p-3 border border-[#D4AF37]/20 text-left space-y-1.5 mb-4 text-[11px] sm:text-xs text-[#6B4A48]">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-[#6B4A48]/80">Registered:</span>
                      <span className="font-bold text-[#4A2C2A] text-right truncate">{registeredDate}</span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-[#6B4A48]/80">Published Sarees:</span>
                      <span className="font-bold text-[#7B1E3A] text-right">{publishedCount}</span>
                    </div>
                    {location && (
                      <div className="flex items-center justify-between gap-1 pt-1 border-t border-[#D4AF37]/15">
                        <span className="font-semibold text-[#6B4A48]/80">Location:</span>
                        <span className="font-bold text-[#4A2C2A] text-right truncate max-w-[58%]" title={location}>
                          📍 {location}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Visit Store Button */}
                <div className="pt-2 mt-auto">
                  <Link
                    to={targetUrl}
                    onClick={(e) => e.stopPropagation()}
                    className="btn-golden !py-2.5 !px-4 !text-xs w-full justify-center no-underline shadow-sm flex items-center gap-1.5 font-bold group-hover:scale-[1.01] transition-transform rounded-xl"
                  >
                    Visit Store <FiArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
