import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiUploadCloud } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const isShopkeeper = role === 'shopkeeper';

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    shopName: '',
    address: '',
    description: '',
  });

  const upd = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
      alert('Passwords do not match. Please verify your password.');
      return;
    }
    login({ email: form.email || 'newuser@vasthracotton.com', name: form.name || 'New Member' }, role);
    navigate(isShopkeeper ? '/shopkeeper/dashboard' : '/user/dashboard');
  };

  return (
    <section className="min-h-[88vh] flex items-center justify-center py-16 px-4 bg-[#FFF8F0]">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[580px] bg-white rounded-2xl p-8 sm:p-12 shadow-xl border border-[#D4AF37]/35 mx-auto"
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
            Create Account
          </h1>
          <p className="text-[18px] text-[#6B4A48] m-0 font-normal leading-relaxed">
            Create your account to continue.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <div className="relative w-full">
              <div className="absolute left-[18px] top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-[#6B4A48] pointer-events-none flex-shrink-0 z-10">
                <FiUser size={24} />
              </div>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={form.name}
                onChange={upd('name')}
                style={{ paddingLeft: '60px', paddingRight: '20px', height: '58px' }}
                className="w-full rounded-[12px] border border-[#D4AF37]/45 bg-white text-[16px] sm:text-[17px] lg:text-[18px] text-[#4A2C2A] placeholder:text-[16px] placeholder:text-gray-400 focus:border-[#7B1E3A] focus:ring-2 focus:ring-[#7B1E3A]/15 outline-none transition-all duration-200 shadow-sm"
              />
            </div>
          </div>

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
                onChange={upd('email')}
                style={{ paddingLeft: '60px', paddingRight: '20px', height: '58px' }}
                className="w-full rounded-[12px] border border-[#D4AF37]/45 bg-white text-[16px] sm:text-[17px] lg:text-[18px] text-[#4A2C2A] placeholder:text-[16px] placeholder:text-gray-400 focus:border-[#7B1E3A] focus:ring-2 focus:ring-[#7B1E3A]/15 outline-none transition-all duration-200 shadow-sm"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <div className="relative w-full">
              <div className="absolute left-[18px] top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-[#6B4A48] pointer-events-none flex-shrink-0 z-10">
                <FiPhone size={24} />
              </div>
              <input
                type="tel"
                required
                placeholder="Phone Number"
                value={form.phone}
                onChange={upd('phone')}
                style={{ paddingLeft: '60px', paddingRight: '20px', height: '58px' }}
                className="w-full rounded-[12px] border border-[#D4AF37]/45 bg-white text-[16px] sm:text-[17px] lg:text-[18px] text-[#4A2C2A] placeholder:text-[16px] placeholder:text-gray-400 focus:border-[#7B1E3A] focus:ring-2 focus:ring-[#7B1E3A]/15 outline-none transition-all duration-200 shadow-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="relative w-full">
              <div className="absolute left-[18px] top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-[#6B4A48] pointer-events-none flex-shrink-0 z-10">
                <FiLock size={24} />
              </div>
              <input
                type={showPass ? 'text' : 'password'}
                required
                placeholder="Password"
                value={form.password}
                onChange={upd('password')}
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
          </div>

          {/* Confirm Password */}
          <div>
            <div className="relative w-full">
              <div className="absolute left-[18px] top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-[#6B4A48] pointer-events-none flex-shrink-0 z-10">
                <FiLock size={24} />
              </div>
              <input
                type={showConfirmPass ? 'text' : 'password'}
                required
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={upd('confirmPassword')}
                style={{ paddingLeft: '60px', paddingRight: '60px', height: '58px' }}
                className="w-full rounded-[12px] border border-[#D4AF37]/45 bg-white text-[16px] sm:text-[17px] lg:text-[18px] text-[#4A2C2A] placeholder:text-[16px] placeholder:text-gray-400 focus:border-[#7B1E3A] focus:ring-2 focus:ring-[#7B1E3A]/15 outline-none transition-all duration-200 shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-[18px] top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-[#6B4A48] hover:text-[#7B1E3A] cursor-pointer bg-transparent border-none p-0 transition-colors z-10"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPass ? <FiEyeOff size={24} /> : <FiEye size={24} />}
              </button>
            </div>
          </div>

          {/* Shopkeeper Specific Fields */}
          {isShopkeeper && (
            <div className="pt-6 mt-4 border-t border-[#D4AF37]/25 space-y-6">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Weave House / Shop Name"
                  value={form.shopName}
                  onChange={upd('shopName')}
                  style={{ paddingLeft: '20px', paddingRight: '20px', height: '58px' }}
                  className="w-full rounded-[12px] border border-[#D4AF37]/45 bg-white text-[16px] sm:text-[17px] lg:text-[18px] text-[#4A2C2A] placeholder:text-[16px] placeholder:text-gray-400 focus:border-[#7B1E3A] focus:ring-2 focus:ring-[#7B1E3A]/15 outline-none transition-all duration-200 shadow-sm"
                />
              </div>

              <div>
                <input
                  type="text"
                  required
                  placeholder="Shop Location & Address"
                  value={form.address}
                  onChange={upd('address')}
                  style={{ paddingLeft: '20px', paddingRight: '20px', height: '58px' }}
                  className="w-full rounded-[12px] border border-[#D4AF37]/45 bg-white text-[16px] sm:text-[17px] lg:text-[18px] text-[#4A2C2A] placeholder:text-[16px] placeholder:text-gray-400 focus:border-[#7B1E3A] focus:ring-2 focus:ring-[#7B1E3A]/15 outline-none transition-all duration-200 shadow-sm"
                />
              </div>

              <div>
                <textarea
                  required
                  rows="3"
                  placeholder="Tell customers about your weaving tradition & specialties..."
                  value={form.description}
                  onChange={upd('description')}
                  style={{ padding: '16px 20px' }}
                  className="w-full rounded-[12px] border border-[#D4AF37]/45 bg-white text-[16px] sm:text-[17px] lg:text-[18px] text-[#4A2C2A] placeholder:text-[16px] placeholder:text-gray-400 focus:border-[#7B1E3A] focus:ring-2 focus:ring-[#7B1E3A]/15 outline-none transition-all duration-200 shadow-sm resize-none leading-relaxed"
                />
              </div>

              <div
                onClick={() => alert('Demo: File upload simulation ready.')}
                className="flex items-center justify-center gap-4 p-5 rounded-[12px] border-2 border-dashed border-[#D4AF37]/60 bg-[#FFF8F0]/40 hover:bg-[#FFF8F0]/70 transition-colors cursor-pointer text-center group shadow-sm"
              >
                <FiUploadCloud size={28} className="text-[#D4AF37] group-hover:scale-110 transition-transform flex-shrink-0" />
                <span className="text-[16px] sm:text-[17px] font-semibold text-[#7B1E3A]">
                  Upload Shop Emblem or Certificate
                </span>
              </div>
            </div>
          )}

          {/* Create Account Button */}
          <div className="pt-3">
            <button
              type="submit"
              style={{ height: '58px' }}
              className="w-full rounded-[12px] bg-gradient-to-r from-[#D4AF37] to-[#E8C94A] hover:from-[#E8C94A] hover:to-[#D4AF37] text-[#4A2C2A] text-[18px] font-bold cursor-pointer shadow-md hover:shadow-lg transition-all flex items-center justify-center"
            >
              Create Account
            </button>
          </div>
        </form>

        {/* Links */}
        <div className="mt-10 space-y-5 text-center">
          <div className="pt-6 border-t border-[#D4AF37]/25">
            <span className="text-[16px] text-[#6B4A48] mr-2">Already have an account?</span>
            <Link
              to={`/login/${role}`}
              className="text-[16px] font-semibold text-[#7B1E3A] hover:underline no-underline transition-colors"
            >
              Sign In
            </Link>
          </div>

          <div>
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
