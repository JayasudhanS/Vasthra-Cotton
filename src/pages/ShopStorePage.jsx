import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiMapPin, FiStar, FiPackage, FiMail, FiPhone, FiArrowLeft } from 'react-icons/fi';
import ProductCard, { StarRating } from '../components/shared/ProductCard';
import { useProducts } from '../context/ProductContext';

export default function ShopStorePage() {
  const { ownerId } = useParams();
  const { approvedProducts } = useProducts();

  // Get all approved products by this shop owner
  const shopProducts = useMemo(() => {
    return approvedProducts.filter(p =>
      String(p.ownerId) === String(ownerId) ||
      String(p.shopId) === String(ownerId)
    ).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [approvedProducts, ownerId]);

  // Derive shop info from the first product
  const firstProduct = shopProducts[0];
  const shopInfo = {
    name: firstProduct?.shopName || 'Artisan Weave House',
    owner: firstProduct?.ownerName || '',
    location: firstProduct?.shopLocation || 'India',
    logo: firstProduct?.shopLogo || firstProduct?.image || firstProduct?.imageUrl || '',
    rating: firstProduct?.shopRating || firstProduct?.rating || 4.9,
    email: firstProduct?.shopEmail || '',
    phone: firstProduct?.shopPhone || '',
    description: firstProduct?.shopDescription || '',
  };

  // Extract unique categories from this shop's products
  const shopCategories = useMemo(() => {
    const cats = new Set(shopProducts.map(p => p.category).filter(Boolean));
    return Array.from(cats);
  }, [shopProducts]);

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* Back navigation */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-[#7B1E3A] hover:text-[#D4AF37] no-underline font-medium transition-colors">
          <FiArrowLeft size={16} /> Back to Catalogue
        </Link>
      </div>

      {/* ═══════ Shop Banner ═══════ */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-base p-0 overflow-hidden bg-white border border-[#D4AF37]/20"
        >
          {/* Banner gradient */}
          <div className="h-36 sm:h-48 bg-gradient-to-r from-[#7B1E3A] via-[#9B2E4A] to-[#7B1E3A] relative">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23D4AF37\' fill-opacity=\'0.3\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }} />
          </div>

          {/* Shop info overlay */}
          <div className="px-6 sm:px-10 pb-8 -mt-14 sm:-mt-16 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 sm:gap-8">
              {/* Shop Logo */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-[#F5EDE0]">
                  <img src={shopInfo.logo} alt={shopInfo.name} className="w-full h-full object-cover" />
                </div>
                <span className="absolute -bottom-1 -right-1 bg-[#2D8F5E] text-white p-1.5 rounded-full shadow-md" title="Verified Weaver">
                  <FiCheckCircle size={16} />
                </span>
              </div>

              {/* Shop Details */}
              <div className="flex-1 min-w-0 pt-2">
                <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest block mb-1">✦ Verified Weave House</span>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#7B1E3A] m-0 mb-2 truncate" style={{ fontFamily: 'Playfair Display' }}>
                  {shopInfo.name}
                </h1>
                {shopInfo.owner && (
                  <p className="text-sm text-[#6B4A48] m-0 mb-3 font-medium">by {shopInfo.owner}</p>
                )}
                <div className="flex flex-wrap items-center gap-4 text-sm text-[#6B4A48]">
                  <span className="flex items-center gap-1.5 font-semibold bg-[#FFF8F0] px-3 py-1 rounded-lg border border-[#D4AF37]/20">
                    <FiStar className="text-[#D4AF37]" size={14} /> {shopInfo.rating}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiMapPin size={14} className="text-[#D4AF37]" /> {shopInfo.location}
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold">
                    <FiPackage size={14} className="text-[#D4AF37]" /> {shopProducts.length} Products
                  </span>
                </div>
              </div>
            </div>

            {/* Shop description */}
            {shopInfo.description && (
              <p className="text-sm text-[#6B4A48] font-light leading-relaxed mt-6 max-w-3xl m-0">
                {shopInfo.description}
              </p>
            )}

            {/* Contact info */}
            {(shopInfo.email || shopInfo.phone) && (
              <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-[#6B4A48]">
                {shopInfo.email && (
                  <span className="flex items-center gap-1.5">
                    <FiMail size={13} className="text-[#D4AF37]" /> {shopInfo.email}
                  </span>
                )}
                {shopInfo.phone && (
                  <span className="flex items-center gap-1.5">
                    <FiPhone size={13} className="text-[#D4AF37]" /> {shopInfo.phone}
                  </span>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ═══════ Categories ═══════ */}
      {shopCategories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 mb-8">
          <div className="flex flex-wrap gap-2">
            {shopCategories.map(cat => (
              <span key={cat} className="text-xs font-semibold text-[#7B1E3A] bg-white px-4 py-2 rounded-full border border-[#D4AF37]/20 shadow-xs">
                {cat}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ═══════ Products Grid ═══════ */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">✦ Store Collection</span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>
              {shopProducts.length > 0 ? 'Newest Products' : 'No Products Yet'}
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#6B4A48] bg-[#FFF8F0] px-3 py-1.5 rounded-lg border border-[#D4AF37]/20">
            {shopProducts.length} Sarees
          </span>
        </div>

        {shopProducts.length === 0 ? (
          <div className="card-base p-16 text-center max-w-lg mx-auto bg-white border-dashed">
            <div className="w-16 h-16 rounded-full bg-[#7B1E3A]/10 text-[#7B1E3A] flex items-center justify-center mx-auto mb-4 text-2xl font-bold">✦</div>
            <h3 className="text-xl font-bold text-[#7B1E3A] mb-2" style={{ fontFamily: 'Playfair Display' }}>
              No Products Available
            </h3>
            <p className="text-sm text-[#6B4A48] m-0">This weave house hasn't uploaded any products yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
            {shopProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
