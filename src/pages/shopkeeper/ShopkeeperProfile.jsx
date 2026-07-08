import { motion } from 'framer-motion';
import { FiCheckCircle, FiShield, FiMail, FiPhone, FiMapPin, FiPackage, FiStar, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ShopkeeperProfile() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#D4AF37]/20 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">✦ Weaver House Registration</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>Weaving House Profile</h1>
        </div>
        <span className="badge badge-success !text-xs font-bold px-3.5 py-1.5 flex items-center gap-1.5">
          <FiCheckCircle /> Silk Mark Certified Seller
        </span>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-base p-8 max-w-2xl bg-white border border-[#D4AF37]/20 shadow-sm space-y-8">
        <div className="flex items-center gap-6 pb-6 border-b border-[#D4AF37]/15">
          <img src="https://ui-avatars.com/api/?name=Lakshmi+Silks&background=7B1E3A&color=fff&size=128" alt="Shop" className="w-20 h-20 rounded-2xl object-cover border-2 border-[#D4AF37]/40 shadow-md flex-shrink-0" />
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block mb-0.5">✦ Heritage Loom Cooperative</span>
            <h2 className="text-2xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>Lakshmi Silks & Handlooms</h2>
            <p className="text-xs text-[#6B4A48] m-0 mt-1 font-mono">Weaver ID: #WH-1049 · Kanchipuram Cluster</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#7B1E3A] uppercase tracking-wider m-0">Weaver House Specifications</h3>
          {[
            { icon: <FiShield />, label: 'Master Weaver & Owner', value: 'Smt. Lakshmi Devi' },
            { icon: <FiMail />, label: 'Official Business Email', value: 'contact@lakshmisilks.com' },
            { icon: <FiPhone />, label: 'Artisan Helpline', value: '+91 98765 43210' },
            { icon: <FiMapPin />, label: 'Loom Cluster Location', value: 'North Mada Street, Kanchipuram, Tamil Nadu - 631501' },
            { icon: <FiPackage />, label: 'Live Masterpieces in Vasthra Cotton', value: '45 Handwoven Sarees Active' },
            { icon: <FiStar />, label: 'Connoisseur Rating', value: '4.8 ★ (Based on 142 Verified Orders)' }
          ].map((f, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-[#FFF8F0]/60 rounded-xl border border-[#D4AF37]/15">
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center text-base flex-shrink-0 mt-0.5">
                {f.icon}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold m-0 mb-0.5">{f.label}</p>
                <p className="text-sm font-semibold text-[#4A2C2A] m-0 leading-relaxed">{f.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button onClick={() => alert('Shop details editing enabled.')} className="btn-golden flex-1 justify-center !py-3 !text-xs cursor-pointer shadow-md">
            Edit Weaver House Profile
          </button>
          <button onClick={() => alert('Silk Mark certification documents downloaded.')} className="btn-outline-maroon flex-1 justify-center !py-3 !text-xs cursor-pointer">
            Download Silk Mark Certificate
          </button>
          <button onClick={handleLogout} className="w-full sm:w-auto px-5 py-3 rounded-xl border border-red-300 text-red-600 font-bold bg-red-50/70 hover:bg-red-100/80 flex items-center justify-center gap-2 text-xs cursor-pointer transition-all shadow-sm">
            <FiLogOut size={16} /> Log Out
          </button>
        </div>
      </motion.div>
    </div>
  );
}

