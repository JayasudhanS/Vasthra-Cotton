import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiUser, FiShoppingBag, FiShield, FiArrowRight } from 'react-icons/fi';

const portals = [
  { role: 'user', icon: <FiUser size={38} />, title: 'User Login', desc: 'Browse and order sarees.' },
  { role: 'shopkeeper', icon: <FiShoppingBag size={38} />, title: 'Shop Owner Login', desc: 'Manage your products and orders.' },
  { role: 'admin', icon: <FiShield size={38} />, title: 'Admin Login', desc: 'Manage platform operations.' },
];

export default function PortalPage() {
  return (
    <section className="min-h-[88vh] flex items-center justify-center py-16 px-4 bg-[#FFF8F0]">
      <div className="max-w-5xl mx-auto w-full">
        {/* Website Logo & Name */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-3.5 mb-6">
            <img
              src="/images/logo_vas.png"
              alt="Vasthra Cotton Logo"
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain flex-shrink-0"
            />
            <span className="text-[26px] sm:text-[30px] lg:text-[36px] font-bold text-[#7B1E3A] tracking-tight whitespace-nowrap" style={{ fontFamily: 'Playfair Display' }}>
              Vasthra <span className="text-[#D4AF37]">Cotton</span>
            </span>
          </div>
          <h1 className="text-[28px] sm:text-[32px] lg:text-[36px] font-bold text-[#7B1E3A] mb-3 leading-tight" style={{ fontFamily: 'Playfair Display' }}>
            Choose Access Portal
          </h1>
          <p className="text-[18px] text-[#6B4A48] m-0 font-normal">
            Select your account type below to continue.
          </p>
        </motion.div>

        {/* Three Clean Large Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {portals.map((p, i) => (
            <motion.div
              key={p.role}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="h-full flex"
            >
              <Link
                to={`/login/${p.role}`}
                className="group w-full bg-white rounded-2xl p-8 sm:p-10 flex flex-col items-center text-center border border-[#D4AF37]/45 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 no-underline"
              >
                {/* Large Icon */}
                <div className="w-20 h-20 rounded-2xl bg-[#FFF8F0] group-hover:bg-[#7B1E3A] text-[#7B1E3A] group-hover:text-white flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#D4AF37]/35 transition-colors flex-shrink-0">
                  {p.icon}
                </div>

                {/* Large Title */}
                <h3 className="text-[22px] sm:text-[24px] font-bold text-[#7B1E3A] mb-3 m-0 leading-snug" style={{ fontFamily: 'Playfair Display' }}>
                  {p.title}
                </h3>

                {/* Short Description */}
                <p className="text-[16px] sm:text-[17px] text-[#6B4A48] mb-8 leading-relaxed font-normal flex-1">
                  {p.desc}
                </p>

                {/* Large Arrow Button */}
                <div className="w-full h-[50px] rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E8C94A] group-hover:from-[#E8C94A] group-hover:to-[#D4AF37] text-[#4A2C2A] text-[16px] font-bold flex items-center justify-center gap-2 shadow-sm transition-all mt-auto">
                  Enter Portal <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
