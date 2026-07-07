import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const roleConfig = {
  user: { title: 'User Portal', color: '#7B1E3A', gradient: 'from-[#7B1E3A] to-[#9B2E4A]', emoji: '👤', desc: 'Sign in to track orders, manage wishlist & shop sarees.' },
  shopkeeper: { title: 'Weaver & Seller Portal', color: '#D4AF37', gradient: 'from-[#D4AF37] to-[#B8952E]', emoji: '🏪', desc: 'Sign in to manage your silk house, catalogue & orders.' },
  admin: { title: 'Admin Command Center', color: '#4A2C2A', gradient: 'from-[#4A2C2A] to-[#6B4A48]', emoji: '🛡️', desc: 'Sign in to oversee marketplace operations & approvals.' },
};

export default function LoginPage() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const config = roleConfig[role] || roleConfig.user;
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email: form.email || 'user@vasthracotton.com', name: role === 'admin' ? 'Master Admin' : role === 'shopkeeper' ? 'Kanjivaram Weaves' : 'Ananya Sharma' }, role);
    if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'shopkeeper') navigate('/shopkeeper/dashboard');
    else navigate('/user/dashboard');
  };

  return (
    <section className="min-h-[82vh] flex items-center justify-center py-16 px-4 bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF8F0]">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md card-base p-8 sm:p-10 border-2 border-[#D4AF37]/30 shadow-2xl bg-white">
        
        <div className="text-center mb-8">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center mx-auto mb-4 text-3xl shadow-md`}>
            {config.emoji}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>
            {config.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B4A48] mt-1.5 m-0 leading-relaxed font-light">
            {config.desc}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B4A48]" size={18} />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="input-field !pl-10 !h-12 !text-sm bg-[#FFF8F0]/40"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A]">Password</label>
              <a href="#forgot" onClick={e => { e.preventDefault(); alert('Demo: Use any password to log in!'); }} className="text-xs text-[#D4AF37] hover:underline font-medium">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B4A48]" size={18} />
              <input
                type={showPass ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="input-field !pl-10 !pr-10 !h-12 !text-sm bg-[#FFF8F0]/40"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B4A48] cursor-pointer bg-transparent border-none p-0 hover:text-[#7B1E3A] transition-colors"
              >
                {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-golden w-full justify-center !py-3.5 !min-h-[48px] !text-sm cursor-pointer shadow-md mt-2">
            Sign In to Portal →
          </button>
        </form>

        {role !== 'admin' && (
          <div className="border-t border-[#D4AF37]/20 pt-6 mt-6 text-center">
            <p className="text-xs sm:text-sm text-[#6B4A48] m-0">
              Don't have an account yet?{' '}
              <Link to={`/register/${role}`} className="text-[#7B1E3A] font-bold hover:underline ml-1">
                Create Account
              </Link>
            </p>
          </div>
        )}

        <div className="mt-4 text-center">
          <Link to="/portal" className="inline-flex items-center gap-1 text-xs text-[#D4AF37] font-semibold hover:underline no-underline">
            ← Switch Access Portal
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

