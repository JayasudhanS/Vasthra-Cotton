import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiUser, FiShoppingBag, FiShield, FiArrowRight } from 'react-icons/fi';

const portals = [
  { role: 'user', icon: <FiUser size={28} />, title: 'User Login', desc: 'Access your shopping account.', color: 'from-[#7B1E3A] to-[#9B2E4A]' },
  { role: 'shopkeeper', icon: <FiShoppingBag size={28} />, title: 'Shop Owner Login', desc: 'Manage your store and products.', color: 'from-[#D4AF37] to-[#B8952E]' },
  { role: 'admin', icon: <FiShield size={28} />, title: 'Admin Login', desc: 'Platform management access.', color: 'from-[#4A2C2A] to-[#6B4A48]' },
];

export default function PortalPage() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center py-16 px-4 bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF8F0]">
      <div className="max-w-3xl mx-auto text-center w-full">
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-12">
          <div className="flex items-center justify-center gap-3.5 mb-6">
            <img
              src="/images/logo_vas.png"
              alt="Vasthra Cotton Logo"
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain flex-shrink-0"
            />
            <span className="text-5xl sm:text-6xl font-bold text-[#7B1E3A] tracking-tight whitespace-nowrap" style={{ fontFamily: 'Playfair Display' }}>
              Vasthra <span className="text-[#D4AF37]">Cotton</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#7B1E3A] mb-3" style={{ fontFamily: 'Playfair Display' }}>
            Choose Access Portal
          </h1>
          <p className="text-sm sm:text-base text-[#6B4A48] font-light leading-relaxed">
            Select your account type below to continue to your dashboard.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {portals.map((p, i) => (
            <motion.div key={p.role} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="h-full">
              <Link to={`/login/${p.role}`}
                className="group block card-base p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-400 no-underline h-full flex flex-col items-center text-center border border-[#D4AF37]/20 hover:border-[#D4AF37] bg-white">

                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center mx-auto mb-5 text-white group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                  {p.icon}
                </div>

                <h3 className="text-lg font-bold text-[#7B1E3A] mb-2 group-hover:text-[#D4AF37] transition-colors" style={{ fontFamily: 'Playfair Display' }}>
                  {p.title}
                </h3>

                <p className="text-xs text-[#6B4A48] mb-6 leading-relaxed font-light flex-1">
                  {p.desc}
                </p>

                <span className="btn-golden !py-2.5 !px-6 !text-xs w-full justify-center shadow-sm">
                  Enter Portal <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
