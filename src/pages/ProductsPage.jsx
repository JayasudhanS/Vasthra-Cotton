import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX, FiRefreshCw, FiCheckCircle, FiMapPin, FiStar } from 'react-icons/fi';
import ProductCard, { StarRating } from '../components/shared/ProductCard';
import { products, categories, shops } from '../data';
import { useProducts } from '../context/ProductContext';

const colors = ['Red', 'Gold', 'Green', 'Blue', 'Pink', 'Maroon', 'Orange', 'White', 'Black'];
const fabrics = ['Silk', 'Cotton', 'Georgette', 'Chiffon', 'Linen', 'Organza', 'Crepe', 'Tussar'];
const sortOptions = [
  { label: 'Newest Arrivals', value: 'newest' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
];

export default function ProductsPage() {
  const { products: dynamicProducts } = useProducts();
  const [params] = useSearchParams();
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({ category: '', color: '', fabric: '', sort: 'newest', minPrice: '', maxPrice: '' });

  const shopId = params.get('shop') ? +params.get('shop') : null;
  const shop = shopId ? shops.find(s => s.id === shopId) : null;

  const filtered = useMemo(() => {
    let list = [...products.filter(p => p.status === 'approved'), ...dynamicProducts.filter(p => p.status === 'approved')];
    if (shopId) list = list.filter(p => p.shopId === shopId);
    if (params.get('filter') === 'featured') list = list.filter(p => p.featured);
    if (filters.category) list = list.filter(p => p.category === filters.category);
    if (filters.color) list = list.filter(p => p.color === filters.color);
    if (filters.fabric) list = list.filter(p => p.fabric === filters.fabric);
    if (filters.minPrice) list = list.filter(p => p.offerPrice >= +filters.minPrice);
    if (filters.maxPrice) list = list.filter(p => p.offerPrice <= +filters.maxPrice);
    if (filters.sort === 'price-asc') list.sort((a, b) => a.offerPrice - b.offerPrice);
    else if (filters.sort === 'price-desc') list.sort((a, b) => b.offerPrice - a.offerPrice);
    else if (filters.sort === 'popular') list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [filters, params, shopId]);

  const clearFilters = () => {
    setFilters({ category: '', color: '', fabric: '', sort: 'newest', minPrice: '', maxPrice: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 sm:py-12">
      {/* Shop Banner */}
      {shop && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="card-base p-6 sm:p-8 mb-8 bg-white border border-[#D4AF37]/20 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img src={shop.logo} alt={shop.name} className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-3 border-[#D4AF37]/40 shadow-lg flex-shrink-0" />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#2D8F5E] bg-[#2D8F5E]/10 px-2.5 py-1 rounded-full">
                  <FiCheckCircle size={12} /> Verified Seller
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#7B1E3A] m-0 mb-2" style={{ fontFamily: 'Playfair Display' }}>
                {shop.name}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-[#6B4A48] mb-3">
                <span className="flex items-center gap-1.5">
                  <FiMapPin className="text-[#D4AF37]" size={14} /> {shop.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiStar className="text-[#D4AF37]" size={14} /> {shop.rating} Rating
                </span>
                <span className="font-semibold text-[#7B1E3A]">{shop.products} Products</span>
              </div>
              <p className="text-xs text-[#6B4A48] m-0 font-medium">
                Owner: <span className="text-[#7B1E3A] font-semibold">{shop.owner}</span>
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#D4AF37]/20">
        <div>
          {!shop && (
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">
              ✦ Authentic Indian Heritage
            </span>
          )}
          <h2 className="text-2xl lg:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>
            {shop ? `${shop.name} Collection` : params.get('filter') === 'featured' ? 'Featured Masterpieces' : 'All Sarees Collection'}
          </h2>
          <p className="text-sm text-[#6B4A48] mt-1 m-0 font-medium">
            Showing <span className="font-bold text-[#7B1E3A]">{filtered.length}</span> handpicked sarees
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilter(true)}
            className="lg:hidden btn-golden !py-2.5 !px-5 !text-xs cursor-pointer shadow-sm w-full sm:w-auto justify-center"
          >
            <FiFilter size={16} /> Filter & Sort
          </button>
        </div>
      </div>

      <div className="flex gap-8 lg:gap-10 items-start">
        {/* Mobile Filter Drawer Overlay */}
        <AnimatePresence>
          {showFilter && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilter(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs"
            />
          )}
        </AnimatePresence>

        {/* Sidebar Filters */}
        <aside className={`${showFilter ? 'fixed top-20 right-4 sm:right-6 w-[calc(100%-32px)] max-w-[320px] z-50 bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#D4AF37]/25 p-4 sm:p-5 max-h-[calc(100vh-100px)] overflow-y-auto block' : 'hidden'} lg:block lg:static lg:w-64 flex-shrink-0 lg:z-auto lg:bg-transparent lg:p-0 lg:shadow-none lg:border-none lg:max-h-none`}>
          <div className="flex items-center justify-between lg:hidden mb-4 pb-3 border-b border-[#D4AF37]/20">
            <h3 className="text-base sm:text-lg font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>
              Filter Sarees
            </h3>
            <button onClick={() => setShowFilter(false)} className="w-8 h-8 rounded-full bg-[#FFF8F0] flex items-center justify-center cursor-pointer border border-[#D4AF37]/20 text-[#4A2C2A] shadow-2xs hover:bg-[#E8C94A] transition-colors">
              <FiX size={16} />
            </button>
          </div>

          <div className="space-y-4 lg:space-y-5 lg:card-base lg:p-6 lg:sticky lg:top-[110px] lg:shadow-sm lg:bg-white">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/15 pb-2.5">
              <span className="text-xs sm:text-sm font-bold text-[#7B1E3A] uppercase tracking-wider">Filters</span>
              <button
                onClick={clearFilters}
                className="text-xs text-[#D4AF37] hover:text-[#7B1E3A] font-semibold cursor-pointer bg-transparent border-none p-0 flex items-center gap-1 transition-colors"
              >
                <FiRefreshCw size={12} /> Reset
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block">Category / Weave</label>
              <select value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })} className="select-field !h-[44px] sm:!h-[46px] !text-xs sm:!text-sm !px-3.5 !rounded-xl bg-[#FFF8F0]/60">
                <option value="">All Categories</option>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block">Color Palette</label>
              <select value={filters.color} onChange={e => setFilters({ ...filters, color: e.target.value })} className="select-field !h-[44px] sm:!h-[46px] !text-xs sm:!text-sm !px-3.5 !rounded-xl bg-[#FFF8F0]/60">
                <option value="">All Colors</option>
                {colors.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block">Fabric Type</label>
              <select value={filters.fabric} onChange={e => setFilters({ ...filters, fabric: e.target.value })} className="select-field !h-[44px] sm:!h-[46px] !text-xs sm:!text-sm !px-3.5 !rounded-xl bg-[#FFF8F0]/60">
                <option value="">All Fabrics</option>
                {fabrics.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block">Price Range (₹)</label>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={e => setFilters({ ...filters, minPrice: e.target.value })}
                    placeholder="Min ₹"
                    className="input-field !h-[44px] sm:!h-[46px] !text-xs sm:!text-sm !px-3 !rounded-xl bg-[#FFF8F0]/60"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}
                    placeholder="Max ₹"
                    className="input-field !h-[44px] sm:!h-[46px] !text-xs sm:!text-sm !px-3 !rounded-xl bg-[#FFF8F0]/60"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block">Sort Collection By</label>
              <select value={filters.sort} onChange={e => setFilters({ ...filters, sort: e.target.value })} className="select-field !h-[44px] sm:!h-[46px] !text-xs sm:!text-sm !px-3.5 !rounded-xl bg-[#FFF8F0]/60 font-medium text-[#7B1E3A]">
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <button
              onClick={() => { clearFilters(); setShowFilter(false); }}
              className="btn-outline-maroon w-full !text-xs sm:!text-sm !h-[44px] sm:!h-[46px] !rounded-xl justify-center mt-2"
            >
              Clear All Filters
            </button>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1 w-full">
          {products.length === 0 ? (
            <div className="card-base p-16 text-center max-w-lg mx-auto my-8 bg-[#FFF8F0]/30 border-dashed">
              <div className="w-16 h-16 rounded-full bg-[#7B1E3A]/10 text-[#7B1E3A] flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                ✦
              </div>
              <h3 className="text-xl font-bold text-[#7B1E3A] mb-2" style={{ fontFamily: 'Playfair Display' }}>
                No products available.
              </h3>
            </div>
          ) : filtered.length === 0 ? (
            <div className="card-base p-16 text-center max-w-lg mx-auto my-8 bg-[#FFF8F0]/30 border-dashed">
              <div className="w-16 h-16 rounded-full bg-[#7B1E3A]/10 text-[#7B1E3A] flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                ✦
              </div>
              <h3 className="text-xl font-bold text-[#7B1E3A] mb-2" style={{ fontFamily: 'Playfair Display' }}>
                No Sarees Found
              </h3>
              <p className="text-sm text-[#6B4A48] mb-6 leading-relaxed font-light">
                We couldn't find any sarees matching your selected filters. Try broadening your criteria or clearing some filters.
              </p>
              <button onClick={clearFilters} className="btn-golden !py-2.5 !px-6 !text-xs cursor-pointer">
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
