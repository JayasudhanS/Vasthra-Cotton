import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiUser, FiShoppingBag, FiShield, FiArrowRight } from 'react-icons/fi';

const portals = [
  { role: 'user', icon: <FiUser size={36} />, title: 'Saree Connoisseur', subtitle: 'Customer Portal', desc: 'Browse handcrafted regional sarees, save to wishlist, track orders & discover verified artisans across India.', color: 'from-[#7B1E3A] to-[#9B2E4A]', badge: 'Most Popular' },
  { role: 'shopkeeper', icon: <FiShoppingBag size={36} />, title: 'Master Weaver & Shop', subtitle: 'Seller Portal', desc: 'List your authentic silk drapes, manage inventories, receive direct orders & grow your heritage brand.', color: 'from-[#D4AF37] to-[#B8952E]', badge: '0% Commission' },
  { role: 'admin', icon: <FiShield size={36} />, title: 'Platform Overseer', subtitle: 'Admin Portal', desc: 'Monitor marketplace integrity, verify Silk Mark certifications, approve weavers & manage system metrics.', color: 'from-[#4A2C2A] to-[#6B4A48]', badge: 'Secure Access' },
];

export default function PortalPage() {
  return (
    <section className="min-h-[85vh] flex items-center justify-center py-20 px-4 bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF8F0]">
      <div className="max-w-6xl mx-auto text-center w-full">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-block text-xs uppercase font-bold tracking-widest text-[#D4AF37] mb-2 bg-[#7B1E3A]/5 px-4 py-1.5 rounded-full border border-[#D4AF37]/30">
            ✦ Welcome to Vasthra Cotton Ecosystem
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#7B1E3A] mb-4" style={{ fontFamily: 'Playfair Display' }}>
            Select Your Access Portal
          </h1>
          <p className="text-[#6B4A48] mb-14 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Choose your role to access specialized dashboards tailored for saree lovers, master weavers, and platform administrators.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {portals.map((p, i) => (
            <motion.div key={p.role} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} className="h-full">
              <Link to={`/login/${p.role}`}
                className="group block card-base p-8 sm:p-10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 no-underline h-full flex flex-col justify-between border-2 border-[#D4AF37]/20 hover:border-[#D4AF37] relative bg-white">
                
                <span className="absolute top-4 right-4 bg-[#FFF8F0] text-[#7B1E3A] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-[#D4AF37]/30">
                  {p.badge}
                </span>

                <div>
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg`}>
                    {p.icon}
                  </div>
                  
                  <span className="text-xs uppercase tracking-widest font-bold text-[#D4AF37] block mb-1">
                    {p.subtitle}
                  </span>
                  
                  <h3 className="text-2xl font-bold text-[#7B1E3A] mb-3 group-hover:text-[#D4AF37] transition-colors" style={{ fontFamily: 'Playfair Display' }}>
                    {p.title}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-[#6B4A48] mb-8 leading-relaxed font-light">
                    {p.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#D4AF37]/15 mt-auto">
                  <span className="btn-golden !py-3 !px-6 !text-sm w-full justify-center shadow-md">
                    Enter Portal <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

