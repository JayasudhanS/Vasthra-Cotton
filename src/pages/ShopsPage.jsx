import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { StarRating } from '../components/shared/ProductCard';
import { shops } from '../data';
import { FiCheckCircle, FiMapPin } from 'react-icons/fi';

export default function ShopsPage() {
  const approvedShops = shops.filter(s => s.status === 'approved');
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 sm:py-14">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-2 bg-[#7B1E3A]/5 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 w-fit mx-auto">
          ✦ Silk Mark Certified Sellers
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#7B1E3A] mb-3" style={{ fontFamily: 'Playfair Display' }}>
          Our Trusted Weaving Houses
        </h1>
        <p className="text-sm sm:text-base text-[#6B4A48] font-light leading-relaxed m-0">
          Connect directly with master artisans, regional handloom clusters, and heritage silk emporiums across India.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {approvedShops.map((shop, i) => (
          <motion.div key={shop.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className="card-base p-8 text-center group hover:border-[#D4AF37] hover:shadow-xl transition-all duration-500 bg-white border border-[#D4AF37]/20 flex flex-col justify-between">
            <div>
              <div className="relative w-24 h-24 mx-auto mb-5">
                <img src={shop.logo} alt={shop.name} className="w-full h-full rounded-full object-cover border-3 border-[#D4AF37]/40 group-hover:border-[#D4AF37] group-hover:scale-105 transition-all shadow-md" />
                <span className="absolute bottom-0 right-0 bg-[#2D8F5E] text-white p-1 rounded-full text-xs shadow-xs" title="Silk Mark Verified">
                  <FiCheckCircle />
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#7B1E3A] mb-1 group-hover:text-[#D4AF37] transition-colors" style={{ fontFamily: 'Playfair Display' }}>
                {shop.name}
              </h3>
              <p className="text-xs font-semibold text-[#4A2C2A] mb-1">Master Weaver: {shop.owner}</p>
              <p className="text-xs text-[#6B4A48]/80 mb-4 flex items-center justify-center gap-1">
                <FiMapPin className="text-[#D4AF37]" /> {shop.location}
              </p>
              <div className="flex items-center justify-center gap-1.5 mb-5 bg-[#FFF8F0] py-1.5 px-3 rounded-full border border-[#D4AF37]/20 w-fit mx-auto">
                <StarRating rating={shop.rating} size={14} />
                <span className="text-xs font-bold text-[#7B1E3A] ml-1">{shop.rating}</span>
                <span className="text-[11px] text-[#6B4A48]/70 font-light">({shop.reviews || '120'} reviews)</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D4AF37]/15">
              <div className="flex items-center justify-between mb-4 text-xs font-medium text-[#6B4A48]">
                <span>Catalogue Size</span>
                <span className="font-bold text-[#7B1E3A]">{shop.products} Masterpieces</span>
              </div>
              <Link to={`/products?shop=${shop.id}`} className="btn-golden !py-2.5 !px-6 !text-xs w-full justify-center no-underline shadow-sm block">
                Explore Weaves
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

