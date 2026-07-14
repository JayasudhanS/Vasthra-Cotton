import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { categories } from '../data';

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 sm:py-14">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-2 bg-[#7B1E3A]/5 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 w-fit mx-auto">
          ✦ Handloom Taxonomy & Clusters
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#7B1E3A] mb-3" style={{ fontFamily: 'Playfair Display' }}>
          Regional Saree Collections
        </h1>
        <p className="text-sm sm:text-base text-[#6B4A48] font-light leading-relaxed m-0">
          Explore authentic weaves crafted by master artisans across India's most celebrated weaving heritage centers.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="card-base p-16 text-center max-w-lg mx-auto my-8 bg-[#FFF8F0]/30 border-dashed">
          <div className="w-16 h-16 rounded-full bg-[#7B1E3A]/10 text-[#7B1E3A] flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            ✦
          </div>
          <h3 className="text-xl font-bold text-[#7B1E3A] mb-2" style={{ fontFamily: 'Playfair Display' }}>
            No categories available.
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="h-full">
              <Link to={`/products?category=${cat.slug || cat.name}`} className="group block relative rounded-2xl overflow-hidden aspect-[4/5] shadow-md hover:shadow-2xl transition-all duration-500 no-underline border border-[#D4AF37]/20 bg-[#F5EDE0] h-full flex flex-col justify-end">
                <img src={cat?.image || ''} alt={cat?.name || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out absolute inset-0" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 p-5 sm:p-6 transform group-hover:-translate-y-1 transition-transform duration-300">
                  <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">
                    ✦ {typeof cat?.count === 'number' ? `${cat.count} Weaves` : ''}
                  </span>
                  <h3 className="text-white text-xl sm:text-2xl font-bold mb-1 group-hover:text-[#D4AF37] transition-colors" style={{ fontFamily: 'Playfair Display' }}>
                    {cat?.name || ''}
                  </h3>
                  <p className="text-white/70 text-xs m-0 font-light line-clamp-1">
                    {cat?.description || ''}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

