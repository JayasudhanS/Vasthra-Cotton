import { motion } from 'framer-motion';
import { FiHeart, FiShield, FiStar, FiUsers, FiCheckCircle } from 'react-icons/fi';

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-16 space-y-16">
      {/* Hero Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-3 bg-[#7B1E3A]/5 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 w-fit mx-auto">
          ✦ Preserving India's Handloom Heritage
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-[#7B1E3A] mb-6 leading-tight" style={{ fontFamily: 'Playfair Display' }}>
          Weaving Traditions into Modern Luxury
        </h1>
        <p className="text-base sm:text-lg text-[#6B4A48] leading-relaxed font-light m-0">
          Vasthra Cotton is India's premier multi-vendor saree marketplace, bridging the gap between centuries-old weaving clusters in Kanchipuram, Banaras, and Chanderi with discerning saree connoisseurs across the globe.
        </p>
      </motion.div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="card-base p-8 sm:p-10 bg-white border border-[#D4AF37]/20 shadow-md space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#7B1E3A]/10 text-[#7B1E3A] flex items-center justify-center text-2xl mb-2">
            ✦
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>Our Sacred Mission</h2>
          <p className="text-sm sm:text-base text-[#6B4A48] leading-relaxed font-light m-0">
            To empower traditional weavers and artisan cooperatives by giving them direct access to a national luxury platform. We eliminate middlemen, ensuring fair compensation for craftsmen while guaranteeing 100% Silk Mark certified authenticity for our customers.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="card-base p-8 sm:p-10 bg-white border border-[#D4AF37]/20 shadow-md space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center text-2xl mb-2">
            ✨
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>Our Vision for Heritage</h2>
          <p className="text-sm sm:text-base text-[#6B4A48] leading-relaxed font-light m-0">
            To become the world's most trusted digital destination for authentic Indian sarees—where every drape comes with a verifiable story of its weave, motif inspiration, and the hands that tirelessly wove it over weeks of dedication.
          </p>
        </motion.div>
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[{ icon: <FiUsers size={26} />, num: '10,000+', label: 'Connoisseur Members' }, { icon: <FiShield size={26} />, num: '100%', label: 'Silk Mark Certified' },
          { icon: <FiStar size={26} />, num: '500+', label: 'Heirloom Weaves' }, { icon: <FiHeart size={26} />, num: '4.9 ★', label: 'Artisan Rating' }].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="card-base p-6 text-center bg-white border border-[#D4AF37]/20 shadow-sm hover:shadow-md transition-all">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7B1E3A] to-[#9B2E4A] text-white flex items-center justify-center mx-auto mb-4 shadow-md">{s.icon}</div>
            <p className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0 font-mono tracking-tight">{s.num}</p>
            <p className="text-xs font-bold text-[#6B4A48] uppercase tracking-wider mt-1 m-0">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Why Choose Us Banner */}
      <div className="card-base p-8 sm:p-12 bg-gradient-to-r from-[#7B1E3A] to-[#5A1028] text-white rounded-3xl relative overflow-hidden shadow-xl border border-[#D4AF37]/30">
        <div className="relative z-10 grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-[#D4AF37] m-0 flex items-center justify-center md:justify-start gap-2">
              <FiCheckCircle /> Direct from Loom
            </h3>
            <p className="text-xs text-white/80 m-0 font-light leading-relaxed">No middlemen or commercial wholesalers. Every piece comes straight from weaver societies.</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-[#D4AF37] m-0 flex items-center justify-center md:justify-start gap-2">
              <FiCheckCircle /> Silk Mark Assurance
            </h3>
            <p className="text-xs text-white/80 m-0 font-light leading-relaxed">We rigorous lab-test and verify purity of natural silk and gold zari threads before dispatch.</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-[#D4AF37] m-0 flex items-center justify-center md:justify-start gap-2">
              <FiCheckCircle /> Bespoke Concierge
            </h3>
            <p className="text-xs text-white/80 m-0 font-light leading-relaxed">Dedicated bridal stylists and saree draping experts available via WhatsApp & phone support.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

