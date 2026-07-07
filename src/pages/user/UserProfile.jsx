import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiMapPin, FiAward, FiCheckCircle } from 'react-icons/fi';

export default function UserProfile() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#D4AF37]/20 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">✦ Connoisseur Membership</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>My Profile & Wardrobe Settings</h1>
        </div>
        <span className="badge badge-success !text-xs font-bold px-3.5 py-1.5 flex items-center gap-1">
          <FiCheckCircle /> Verified Buyer
        </span>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-base p-8 max-w-2xl bg-white border border-[#D4AF37]/20 shadow-sm space-y-8">
        <div className="flex items-center gap-6 pb-6 border-b border-[#D4AF37]/15">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#7B1E3A] to-[#9B2E4A] flex items-center justify-center text-white text-3xl font-bold shadow-md flex-shrink-0 border-2 border-[#D4AF37]/30" style={{ fontFamily: 'Playfair Display' }}>
            A
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block mb-0.5">✦ Royal Silk Club Member</span>
            <h2 className="text-2xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>Ananya Sharma</h2>
            <p className="text-xs text-[#6B4A48] m-0 mt-1 font-mono">Member ID: #SV-8842 · Joined June 2026</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#7B1E3A] uppercase tracking-wider m-0">Personal Details</h3>
          {[
            { icon: <FiMail />, label: 'Registered Email', value: 'ananya.sharma@example.com' },
            { icon: <FiPhone />, label: 'Primary Contact', value: '+91 98765 43210' },
            { icon: <FiMapPin />, label: 'Default Delivery Address', value: '42, Silk Heritage Villa, Mylapore, Chennai, Tamil Nadu - 600004' },
            { icon: <FiAward />, label: 'Membership Tier', value: 'Gold Connoisseur (Free Express Delivery Active)' }
          ].map((f, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-[#FFF8F0]/60 rounded-xl border border-[#D4AF37]/15">
              <div className="w-10 h-10 rounded-lg bg-[#7B1E3A]/10 text-[#7B1E3A] flex items-center justify-center text-base flex-shrink-0 mt-0.5">
                {f.icon}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-bold m-0 mb-0.5">{f.label}</p>
                <p className="text-sm font-semibold text-[#4A2C2A] m-0 leading-relaxed">{f.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button onClick={() => alert('Profile editing mode enabled.')} className="btn-golden flex-1 justify-center !py-3 !text-xs cursor-pointer shadow-md">
            Edit Profile Specifications
          </button>
          <button onClick={() => alert('Password change link sent to registered email.')} className="btn-outline-maroon flex-1 justify-center !py-3 !text-xs cursor-pointer">
            Change Security Password
          </button>
        </div>
      </motion.div>
    </div>
  );
}

