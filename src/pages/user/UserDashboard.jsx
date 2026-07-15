import { Link } from 'react-router-dom';
import { FiArrowRight, FiHeart, FiShoppingBag, FiAward } from 'react-icons/fi';
import ProductCard from '../../components/shared/ProductCard';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';

export default function UserDashboard() {
  const { user } = useAuth();
  const { approvedProducts } = useProducts();

  const trending = [...approvedProducts].sort((a, b) => ((b.rating || 0) * (b.reviews || 1) + (b.salesCount || 0)) - ((a.rating || 0) * (a.reviews || 1) + (a.salesCount || 0))).slice(0, 4);
  const newArrivals = [...approvedProducts].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 4);
  
  const sortedTrendingIds = new Set(trending.map(p => p.id));
  const sortedNewestIds = new Set(newArrivals.map(p => p.id));
  const uniqueSelection = approvedProducts.filter(p => !sortedTrendingIds.has(p.id) && !sortedNewestIds.has(p.id));
  const recommended = (uniqueSelection.length > 0 ? uniqueSelection : approvedProducts).slice(0, 4);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Quick Perks - Flipkart Style Horizontal Feature Row */}
      <div className="flex items-stretch justify-between gap-3 sm:gap-5 lg:gap-6 overflow-x-auto pb-2 scrollbar-hidden w-full">
        <div className="flex-1 min-w-[120px] sm:min-w-[160px] bg-white border border-[#D4AF37]/30 rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center gap-3 sm:gap-3.5 text-center shadow-xs hover:shadow-md transition-all">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FFF8F0] text-[#7B1E3A] flex items-center justify-center text-xl sm:text-2xl shadow-2xs border border-[#D4AF37]/25 flex-shrink-0">
            <FiShoppingBag className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-[#7B1E3A] tracking-tight m-0">
            Shipping
          </span>
        </div>

        <div className="flex-1 min-w-[120px] sm:min-w-[160px] bg-white border border-[#D4AF37]/30 rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center gap-3 sm:gap-3.5 text-center shadow-xs hover:shadow-md transition-all">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FFF8F0] text-[#D4AF37] flex items-center justify-center text-xl sm:text-2xl shadow-2xs border border-[#D4AF37]/25 flex-shrink-0">
            <FiAward className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-[#7B1E3A] tracking-tight m-0">
            Silk Mark Certified
          </span>
        </div>

        <div className="flex-1 min-w-[120px] sm:min-w-[160px] bg-white border border-[#D4AF37]/30 rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center gap-3 sm:gap-3.5 text-center shadow-xs hover:shadow-md transition-all">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FFF8F0] text-[#7B1E3A] flex items-center justify-center text-xl sm:text-2xl shadow-2xs border border-[#D4AF37]/25 flex-shrink-0">
            <FiHeart className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-[#7B1E3A] tracking-tight m-0">
            Wishlist
          </span>
        </div>
      </div>

      {/* Sections */}
      {[{ title: 'Trending Royal Weaves', subtitle: 'Most loved by saree connoisseurs this week', data: trending }, { title: 'New Artisan Arrivals', subtitle: 'Fresh off the handlooms of Kanchipuram & Banaras', data: newArrivals }, { title: 'Curated For Your Wardrobe', subtitle: 'Handpicked drapes matching your style profile', data: recommended }].map(sec => (
        <section key={sec.title} className="pt-4">
          <div className="flex items-end justify-between mb-8 pb-4 border-b border-[#D4AF37]/15">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">✦ Exclusive Selections</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>{sec.title}</h2>
              <p className="text-xs text-[#6B4A48] m-0 mt-1 font-light">{sec.subtitle}</p>
            </div>
            <Link to="/products" className="text-xs font-bold text-[#7B1E3A] hover:text-[#D4AF37] no-underline flex items-center gap-1 transition-colors">
              View All Catalogue <FiArrowRight size={14} />
            </Link>
          </div>
          {sec.data.length === 0 ? (
            <div className="card-base p-12 text-center bg-[#FFF8F0]/30 border-dashed border border-[#D4AF37]/20">
              <h3 className="text-xl font-bold text-[#7B1E3A] mb-2" style={{ fontFamily: 'Playfair Display' }}>No Products Available</h3>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {sec.data.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

