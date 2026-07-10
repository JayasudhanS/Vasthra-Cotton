import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiMapPin, FiAward, FiCheckCircle, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function UserProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const displayName = user?.name || 'Jayasudhan';

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
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#7B1E3A] to-[#9B2E4A] flex items-center justify-center text-white text-3xl font-bold shadow-md flex-shrink-0 border-2 border-[#D4AF37]/30 min-h-[5rem]" style={{ fontFamily: 'Playfair Display' }}>
            {displayName.charAt(0)}
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block mb-0.5 min-h-[1rem]">{user?.tier || ''}</span>
            <h2 className="text-2xl font-bold text-[#7B1E3A] m-0 min-h-[2rem]" style={{ fontFamily: 'Playfair Display' }}>{displayName}</h2>
            <p className="text-xs text-[#6B4A48] m-0 mt-1 font-mono min-h-[1rem]">{user?.id ? `Member ID: #${user.id}` : ''}{user?.joinedDate ? ` · ${user.joinedDate}` : ''}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#7B1E3A] uppercase tracking-wider m-0">Personal Details</h3>
          {[
            { icon: <FiMail />, label: 'Registered Email', value: user?.email || '' },
            { icon: <FiPhone />, label: 'Primary Contact', value: user?.phone || '' },
            { icon: <FiMapPin />, label: 'Default Delivery Address', value: user?.address || '' },
            { icon: <FiAward />, label: 'Membership Tier', value: user?.tier || '' }
          ].map((f, i) => (
            <div key={i} className="flex items-start gap-4 p-5 sm:p-6 bg-[#FFF8F0]/60 rounded-xl border border-[#D4AF37]/15 min-h-[4.5rem]">
              <div className="w-10 h-10 rounded-lg bg-[#7B1E3A]/10 text-[#7B1E3A] flex items-center justify-center text-base flex-shrink-0 mt-0.5">
                {f.icon}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-bold m-0 mb-1">{f.label}</p>
                <p className="text-sm font-semibold text-[#4A2C2A] m-0 leading-relaxed min-h-[1.25rem]">{f.value}</p>
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
          <button onClick={handleLogout} className="w-full sm:w-auto px-5 py-3 rounded-xl border border-red-300 text-red-600 font-bold bg-red-50/70 hover:bg-red-100/80 flex items-center justify-center gap-2 text-xs cursor-pointer transition-all shadow-sm">
            <FiLogOut size={16} /> Log Out
          </button>
        </div>
      </motion.div>
    </div>
  );
}

