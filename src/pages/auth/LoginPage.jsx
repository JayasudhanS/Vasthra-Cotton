import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { login, forgotPassword, signInWithGoogle } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form.email, form.password, role);
      if (res && res.success === false) {
        alert(res.message);
        setLoading(false);
        return;
      }
      if (res?.role === 'admin' || role === 'admin') navigate('/admin/dashboard');
      else if (res?.role === 'shopkeeper' || role === 'shopkeeper') navigate('/shopkeeper/dashboard');
      else navigate('/user/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      alert('An unexpected error occurred during login.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const res = await signInWithGoogle(role);
      if (res && res.success === false) {
        alert(res.message);
        setLoading(false);
        return;
      }
      if (res?.role === 'admin' || role === 'admin') navigate('/admin/dashboard');
      else if (res?.role === 'shopkeeper' || role === 'shopkeeper') navigate('/shopkeeper/dashboard');
      else navigate('/user/dashboard');
    } catch (err) {
      console.error('Google Sign-In error:', err);
      alert('An unexpected error occurred with Google Sign-In.');
      setLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!form.email) {
      alert('Please enter your Email Address first above to receive a password reset link.');
      return;
    }
    const res = await forgotPassword(form.email);
    alert(res.message || 'Password reset link processed.');
  };

  return (
    <section className="min-h-[88vh] flex items-center justify-center py-16 px-4 bg-[#FFF8F0]">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[520px] bg-white rounded-2xl p-8 sm:p-12 shadow-xl border border-[#D4AF37]/35 mx-auto"
      >
        {/* Website Logo & Name */}
        <div className="flex items-center justify-center gap-3.5 mb-10">
          <img
            src="/images/logo_vas.png"
            alt="Vasthra Cotton Logo"
            className="w-12 h-12 sm:w-14 sm:h-14 object-contain flex-shrink-0"
          />
          <span className="text-[24px] sm:text-[26px] lg:text-[30px] font-bold text-[#7B1E3A] tracking-tight whitespace-nowrap" style={{ fontFamily: 'Playfair Display' }}>
            Vasthra <span className="text-[#D4AF37]">Cotton</span>
          </span>
        </div>

        {/* Heading & Subtitle */}
        <div className="text-center mb-10 space-y-3">
          <h1 className="text-[26px] sm:text-[28px] lg:text-[32px] font-bold text-[#7B1E3A] m-0 leading-tight" style={{ fontFamily: 'Playfair Display' }}>
            {role === 'admin' ? 'Admin Log In' : role === 'shopkeeper' ? 'Shop Owner Log In' : 'Log In'}
          </h1>
          <p className="text-[18px] text-[#6B4A48] m-0 font-normal leading-relaxed">
            Welcome back. Please sign in to continue.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Address */}
          <div>
            <div className="relative w-full">
              <div className="absolute left-[18px] top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-[#6B4A48] pointer-events-none flex-shrink-0 z-10">
                <FiMail size={24} />
              </div>
              <input
                type="email"
                required
                placeholder="Email Address"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={{ paddingLeft: '60px', paddingRight: '20px', height: '58px' }}
                className="w-full rounded-[12px] border border-[#D4AF37]/45 bg-white text-[16px] sm:text-[17px] lg:text-[18px] text-[#4A2C2A] placeholder:text-[16px] placeholder:text-gray-400 focus:border-[#7B1E3A] focus:ring-2 focus:ring-[#7B1E3A]/15 outline-none transition-all duration-200 shadow-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2.5">
            <div className="relative w-full">
              <div className="absolute left-[18px] top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-[#6B4A48] pointer-events-none flex-shrink-0 z-10">
                <FiLock size={24} />
              </div>
              <input
                type={showPass ? 'text' : 'password'}
                required
                placeholder="Password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={{ paddingLeft: '60px', paddingRight: '60px', height: '58px' }}
                className="w-full rounded-[12px] border border-[#D4AF37]/45 bg-white text-[16px] sm:text-[17px] lg:text-[18px] text-[#4A2C2A] placeholder:text-[16px] placeholder:text-gray-400 focus:border-[#7B1E3A] focus:ring-2 focus:ring-[#7B1E3A]/15 outline-none transition-all duration-200 shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-[18px] top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-[#6B4A48] hover:text-[#7B1E3A] cursor-pointer bg-transparent border-none p-0 transition-colors z-10"
                aria-label="Toggle password visibility"
              >
                {showPass ? <FiEyeOff size={24} /> : <FiEye size={24} />}
              </button>
            </div>
            <div className="flex justify-end pt-1">
              <a
                href="#forgot"
                onClick={handleForgot}
                className="text-[16px] font-semibold text-[#7B1E3A] hover:underline no-underline transition-colors cursor-pointer"
              >
                Forgot Password?
              </a>
            </div>
          </div>

          {/* Login Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              style={{ height: '58px' }}
              className="w-full rounded-[12px] bg-gradient-to-r from-[#D4AF37] to-[#E8C94A] hover:from-[#E8C94A] hover:to-[#D4AF37] text-[#4A2C2A] text-[18px] font-bold cursor-pointer shadow-md hover:shadow-lg transition-all flex items-center justify-center disabled:opacity-70"
            >
              {loading ? 'Logging In...' : 'Log In'}
            </button>
          </div>

          {/* Google Sign-In */}
          {role !== 'admin' && (
            <div className="pt-2">
              <button
                type="button"
                disabled={loading}
                onClick={handleGoogleSignIn}
                style={{ height: '58px' }}
                className="w-full rounded-[12px] border border-[#D4AF37]/45 bg-white hover:bg-[#FFF8F0] text-[#4A2C2A] text-[16px] font-semibold cursor-pointer shadow-sm transition-all flex items-center justify-center gap-3 disabled:opacity-70"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                Continue with Google
              </button>
            </div>
          )}
        </form>

        {/* Links */}
        <div className="mt-10 space-y-5 text-center">
          {role !== 'admin' && (
            <div className="pt-6 border-t border-[#D4AF37]/25">
              <Link
                to={`/register/${role}`}
                className="text-[16px] font-semibold text-[#7B1E3A] hover:underline no-underline transition-colors block"
              >
                Create Account
              </Link>
            </div>
          )}

          <div className={role === 'admin' ? 'pt-6 border-t border-[#D4AF37]/25' : ''}>
            <Link
              to="/portal"
              className="text-[16px] font-semibold text-[#6B4A48] hover:text-[#7B1E3A] hover:underline no-underline transition-colors block"
            >
              Switch Portal
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
