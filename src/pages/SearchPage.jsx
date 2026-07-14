import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/shared/ProductCard';
import { useProducts } from '../context/ProductContext';
import { FiSearch, FiArrowRight } from 'react-icons/fi';

export default function SearchPage() {
  const { approvedProducts } = useProducts();
  const [params] = useSearchParams();
  const query = params.get('q') || '';

  const results = useMemo(() => {
    if (!query || !query.trim()) return [];
    const q = query.trim().toLowerCase();
    return approvedProducts.filter(p => {
      const matchName = p.name?.toLowerCase().includes(q);
      const matchCategory = p.category?.toLowerCase().includes(q);
      const matchFabric = p.fabric?.toLowerCase().includes(q);
      const matchSecFabric = p.secondaryFabric?.toLowerCase().includes(q) || p.secondary_fabric?.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      const matchMotif = p.motif?.toLowerCase().includes(q) || p.zariType?.toLowerCase().includes(q);
      const matchKeywords = Array.isArray(p.keywords)
        ? p.keywords.some(k => k?.toLowerCase().includes(q))
        : typeof p.keywords === 'string' && p.keywords.toLowerCase().includes(q);
      const matchShop = p.shopName?.toLowerCase().includes(q);

      return matchName || matchCategory || matchFabric || matchSecFabric || matchDesc || matchMotif || matchKeywords || matchShop;
    });
  }, [approvedProducts, query]);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D4AF37]/20 mb-8">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">✦ Catalogue Query</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0 flex items-center gap-2.5" style={{ fontFamily: 'Playfair Display' }}>
            <FiSearch className="text-[#D4AF37]" /> Search Results
          </h1>
          <p className="text-xs sm:text-sm text-[#6B4A48] m-0 mt-1 font-light">
            Found <span className="font-bold text-[#7B1E3A]">{results.length}</span> handloom weaves matching "<span className="font-semibold text-[#7B1E3A]">{query}</span>"
          </p>
        </div>
        <Link to="/products" className="btn-outline-maroon !py-2 !px-5 !text-xs no-underline font-semibold flex items-center gap-1.5 w-fit">
          Browse Full Catalogue <FiArrowRight />
        </Link>
      </div>

      {approvedProducts.length === 0 ? (
        <div className="card-base p-16 text-center max-w-lg mx-auto my-8 bg-[#FFF8F0]/30 border-dashed">
          <div className="w-16 h-16 rounded-full bg-[#7B1E3A]/10 text-[#7B1E3A] flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            ✦
          </div>
          <h3 className="text-xl font-bold text-[#7B1E3A] mb-2" style={{ fontFamily: 'Playfair Display' }}>
            No Products Available
          </h3>
          <p className="text-sm text-[#6B4A48] m-0">Check back soon for new artisan uploads and verified weaves.</p>
        </div>
      ) : results.length === 0 ? (
        <div className="card-base text-center py-20 px-6 max-w-lg mx-auto bg-white border-dashed">
          <div className="w-16 h-16 rounded-full bg-[#7B1E3A]/10 text-[#7B1E3A] flex items-center justify-center mx-auto mb-4 text-2xl">
            <FiSearch />
          </div>
          <h3 className="text-2xl text-[#7B1E3A] font-bold mb-2" style={{ fontFamily: 'Playfair Display' }}>No Sarees Found</h3>
          <p className="text-sm text-[#6B4A48] mb-6 font-light leading-relaxed">
            We couldn't find any weaves matching "<span className="font-semibold">{query}</span>". Try searching for regional weaves like "Kanjivaram", "Banarasi", or fabrics like "Silk" and "Organza".
          </p>
          <Link to="/products" className="btn-golden !py-3 !px-8 !text-xs no-underline shadow-md inline-flex items-center gap-2">
            Explore All Collections <FiArrowRight />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      )}
    </div>
  );
}
