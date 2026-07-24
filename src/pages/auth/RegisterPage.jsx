import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiUploadCloud, FiCheck } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { register, signInWithGoogle } = useAuth();
  const isShopkeeper = role === 'shopkeeper';

  // Prevent admin registration completely as per requirements
  useEffect(() => {
    if (role === 'admin') {
      navigate('/login/admin', { replace: true });
    }
  }, [role, navigate]);

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [certificateFile, setCertificateFile] = useState(null);
  const fileInputRef = useRef(null);

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

  const upd = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value });
    if (errors[k]) {
      setErrors(prev => ({ ...prev, [k]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCertificateFile({
        file,
        name: file.name,
        dataUrl: reader.result
      });
      if (errors.certificate) {
        setErrors(prev => ({ ...prev, certificate: '' }));
      }
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};

    // Full Name
    const trimmedName = form.name.trim();
    if (!trimmedName) {
      newErrors.name = 'Full Name cannot be empty.';
    } else if (trimmedName.length < 3) {
      newErrors.name = 'Full Name must be at least 3 characters.';
    }

    // Email
    const trimmedEmail = form.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      newErrors.email = 'Email Address is required.';
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address format.';
    }

    // Phone Number
    const trimmedPhone = form.phone.trim();
    if (!trimmedPhone) {
      newErrors.phone = 'Phone Number is required.';
    } else if (!/^\d+$/.test(trimmedPhone)) {
      newErrors.phone = 'Phone Number must contain only numeric values.';
    } else if (trimmedPhone.length !== 10) {
      newErrors.phone = 'Phone Number must be exactly 10 digits.';
    }

    // Password
    if (!form.password) {
      newErrors.password = 'Password is required.';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    // Confirm Password
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required.';
    } else if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = 'Confirm Password must exactly match Password.';
    }

    // Shopkeeper Specific Fields
    if (isShopkeeper) {
      const trimmedShopName = form.shopName.trim();
      if (!trimmedShopName) {
        newErrors.shopName = 'Weave House / Shop Name cannot be empty.';
      }

      const trimmedAddress = form.address.trim();
      if (!trimmedAddress) {
        newErrors.address = 'Shop Location & Address cannot be empty.';
      }

      const trimmedDescription = form.description.trim();
      if (!trimmedDescription) {
        newErrors.description = 'About Shop / Description cannot be empty.';
      } else if (trimmedDescription.length < 20) {
        newErrors.description = 'Description must be at least 20 characters.';
      }

      if (!certificateFile) {
        newErrors.certificate = 'Shop Emblem or Certificate upload is mandatory.';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstInvalidKey = Object.keys(validationErrors)[0];
      const element = document.querySelector(`[data-field="${firstInvalidKey}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (typeof element.focus === 'function') {
          element.focus();
        }
      }
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const submissionData = {
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        ...(isShopkeeper ? {
          shopName: form.shopName.trim(),
          address: form.address.trim(),
          description: form.description.trim(),
          certificateUrl: certificateFile?.dataUrl || '',
        } : {})
      };

      const res = await register(submissionData, role);
      if (res && res.success === false) {
        alert(res.message);
        setLoading(false);
        return;
      }
      if (res?.pending || (isShopkeeper && res?.success)) {
        setLoading(false);
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      setLoading(false);
      navigate('/user/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      alert('An error occurred during registration.');
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (isShopkeeper || role === 'admin') {
      alert('Google Authentication is not enabled for Shop Owner registration. Please register using your Email Address and Password.');
      return;
    }
    setLoading(true);
    try {
      const res = await signInWithGoogle(role);
      if (res && res.success === false) {
        alert(res.message);
        setLoading(false);
        return;
      }
      if (res?.pending) {
        setLoading(false);
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      setLoading(false);
      navigate('/user/dashboard');
    } catch (err) {
      console.error('Google Sign-Up error:', err);
      alert('An unexpected error occurred with Google Sign-Up.');
      setLoading(false);
    }
  };

  if (isShopkeeper && submitted) {
    return (
      <section className="min-h-[88vh] flex items-center justify-center py-16 px-4 bg-[#FFF8F0]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[580px] bg-white rounded-2xl p-8 sm:p-12 shadow-xl border border-[#D4AF37]/35 mx-auto text-center"
        >
          {/* Large Success Icon (✓ inside a green circle) */}
          <div className="w-20 h-20 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center mx-auto mb-6 text-green-600 shadow-sm">
            <FiCheck size={44} strokeWidth={2.5} />
          </div>

          {/* Heading */}
          <h1 className="text-[26px] sm:text-[28px] lg:text-[32px] font-bold text-[#7B1E3A] m-0 mb-4 leading-tight" style={{ fontFamily: 'Playfair Display' }}>
            Application Submitted Successfully!
          </h1>

          {/* Status Badge */}
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-300 text-amber-800 font-semibold text-[15px] shadow-xs">
              <span>⏳</span>
              <span>Pending Admin Verification</span>
            </span>
          </div>

          {/* Message */}
          <div className="text-[16px] sm:text-[17px] text-[#6B4A48] leading-relaxed space-y-3 mb-8">
            <p className="m-0">
              Your Shop Owner application has been received successfully.
            </p>
            <p className="m-0">
              Our Admin team will review your shop details, documents, and certificate.
            </p>
            <p className="m-0">
              Once approved, your store will become publicly visible and you will receive a notification.
            </p>
            <p className="m-0 font-medium text-[#7B1E3A]">
              This verification usually takes a short time.
            </p>
          </div>

          {/* Information Box */}
          <div className="bg-[#FFF8F0] border border-[#D4AF37]/50 rounded-xl p-6 text-left space-y-3 mx-auto max-w-md shadow-sm mb-8">
            <h3 className="text-[#7B1E3A] font-bold text-[17px] m-0 mb-3">Current Status:</h3>
            <ul className="space-y-3 m-0 p-0 list-none text-[15px] sm:text-[16px] text-[#4A2C2A]">
              <li className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                <span className="font-medium">Account Created Successfully</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                <span className="font-medium">Shop Profile Saved</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                <span className="font-medium">Documents Uploaded</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs flex-shrink-0">⏳</span>
                <span className="font-semibold text-amber-800">Waiting for Admin Approval</span>
              </li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/login/shopkeeper', { state: { fromSuccess: true } })}
              style={{ height: '54px' }}
              className="w-full rounded-[12px] bg-gradient-to-r from-[#D4AF37] to-[#E8C94A] hover:from-[#E8C94A] hover:to-[#D4AF37] text-[#4A2C2A] text-[18px] font-bold cursor-pointer shadow-md hover:shadow-lg transition-all flex items-center justify-center"
            >
              Go to Login
            </button>
          </div>
        </motion.div>
      </section>
    );
  }

  if (role === 'admin') return null;

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
            {isShopkeeper ? 'Weaver & Store Registration' : 'Create Account'}
          </h1>
          <p className="text-[18px] text-[#6B4A48] m-0 font-normal leading-relaxed">
            Create your account to continue.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Full Name */}
          <div>
            <div className="relative w-full">
              <div className="absolute left-[18px] top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-[#6B4A48] pointer-events-none flex-shrink-0 z-10">
                <FiUser size={24} />
              </div>
              <input
                type="text"
                data-field="name"
                placeholder="Full Name"
                value={form.name}
                onChange={upd('name')}
                style={{ paddingLeft: '60px', paddingRight: '20px', height: '58px' }}
                className={`w-full rounded-[12px] border bg-white text-[16px] sm:text-[17px] lg:text-[18px] text-[#4A2C2A] placeholder:text-[16px] placeholder:text-gray-400 outline-none transition-all duration-200 shadow-sm ${
                  errors.name
                    ? 'border-red-500 ring-2 ring-red-500/20 focus:border-red-600 focus:ring-red-500/30'
                    : 'border-[#D4AF37]/45 focus:border-[#7B1E3A] focus:ring-2 focus:ring-[#7B1E3A]/15'
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-red-600 text-[13px] font-medium mt-1.5 flex items-center gap-1.5 m-0 leading-tight">
                <span>⚠</span> {errors.name}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <div className="relative w-full">
              <div className="absolute left-[18px] top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-[#6B4A48] pointer-events-none flex-shrink-0 z-10">
                <FiMail size={24} />
              </div>
              <input
                type="email"
                data-field="email"
                placeholder="Email Address"
                value={form.email}
                onChange={upd('email')}
                style={{ paddingLeft: '60px', paddingRight: '20px', height: '58px' }}
                className={`w-full rounded-[12px] border bg-white text-[16px] sm:text-[17px] lg:text-[18px] text-[#4A2C2A] placeholder:text-[16px] placeholder:text-gray-400 outline-none transition-all duration-200 shadow-sm ${
                  errors.email
                    ? 'border-red-500 ring-2 ring-red-500/20 focus:border-red-600 focus:ring-red-500/30'
                    : 'border-[#D4AF37]/45 focus:border-[#7B1E3A] focus:ring-2 focus:ring-[#7B1E3A]/15'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-red-600 text-[13px] font-medium mt-1.5 flex items-center gap-1.5 m-0 leading-tight">
                <span>⚠</span> {errors.email}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <div className="relative w-full">
              <div className="absolute left-[18px] top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-[#6B4A48] pointer-events-none flex-shrink-0 z-10">
                <FiPhone size={24} />
              </div>
              <input
                type="tel"
                data-field="phone"
                placeholder="Phone Number (10 digits)"
                value={form.phone}
                onChange={upd('phone')}
                style={{ paddingLeft: '60px', paddingRight: '20px', height: '58px' }}
                className={`w-full rounded-[12px] border bg-white text-[16px] sm:text-[17px] lg:text-[18px] text-[#4A2C2A] placeholder:text-[16px] placeholder:text-gray-400 outline-none transition-all duration-200 shadow-sm ${
                  errors.phone
                    ? 'border-red-500 ring-2 ring-red-500/20 focus:border-red-600 focus:ring-red-500/30'
                    : 'border-[#D4AF37]/45 focus:border-[#7B1E3A] focus:ring-2 focus:ring-[#7B1E3A]/15'
                }`}
              />
            </div>
            {errors.phone && (
              <p className="text-red-600 text-[13px] font-medium mt-1.5 flex items-center gap-1.5 m-0 leading-tight">
                <span>⚠</span> {errors.phone}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="relative w-full">
              <div className="absolute left-[18px] top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-[#6B4A48] pointer-events-none flex-shrink-0 z-10">
                <FiLock size={24} />
              </div>
              <input
                type={showPass ? 'text' : 'password'}
                data-field="password"
                placeholder="Password (Min. 6 characters)"
                value={form.password}
                onChange={upd('password')}
                style={{ paddingLeft: '60px', paddingRight: '60px', height: '58px' }}
                className={`w-full rounded-[12px] border bg-white text-[16px] sm:text-[17px] lg:text-[18px] text-[#4A2C2A] placeholder:text-[16px] placeholder:text-gray-400 outline-none transition-all duration-200 shadow-sm ${
                  errors.password
                    ? 'border-red-500 ring-2 ring-red-500/20 focus:border-red-600 focus:ring-red-500/30'
                    : 'border-[#D4AF37]/45 focus:border-[#7B1E3A] focus:ring-2 focus:ring-[#7B1E3A]/15'
                }`}
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
            {errors.password && (
              <p className="text-red-600 text-[13px] font-medium mt-1.5 flex items-center gap-1.5 m-0 leading-tight">
                <span>⚠</span> {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <div className="relative w-full">
              <div className="absolute left-[18px] top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-[#6B4A48] pointer-events-none flex-shrink-0 z-10">
                <FiLock size={24} />
              </div>
              <input
                type={showConfirmPass ? 'text' : 'password'}
                data-field="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={upd('confirmPassword')}
                style={{ paddingLeft: '60px', paddingRight: '60px', height: '58px' }}
                className={`w-full rounded-[12px] border bg-white text-[16px] sm:text-[17px] lg:text-[18px] text-[#4A2C2A] placeholder:text-[16px] placeholder:text-gray-400 outline-none transition-all duration-200 shadow-sm ${
                  errors.confirmPassword
                    ? 'border-red-500 ring-2 ring-red-500/20 focus:border-red-600 focus:ring-red-500/30'
                    : 'border-[#D4AF37]/45 focus:border-[#7B1E3A] focus:ring-2 focus:ring-[#7B1E3A]/15'
                }`}
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
            {errors.confirmPassword && (
              <p className="text-red-600 text-[13px] font-medium mt-1.5 flex items-center gap-1.5 m-0 leading-tight">
                <span>⚠</span> {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Shopkeeper Specific Fields */}
          {isShopkeeper && (
            <div className="pt-6 mt-4 border-t border-[#D4AF37]/25 space-y-6">
              <div>
                <input
                  type="text"
                  data-field="shopName"
                  placeholder="Weave House / Shop Name"
                  value={form.shopName}
                  onChange={upd('shopName')}
                  style={{ paddingLeft: '20px', paddingRight: '20px', height: '58px' }}
                  className={`w-full rounded-[12px] border bg-white text-[16px] sm:text-[17px] lg:text-[18px] text-[#4A2C2A] placeholder:text-[16px] placeholder:text-gray-400 outline-none transition-all duration-200 shadow-sm ${
                    errors.shopName
                      ? 'border-red-500 ring-2 ring-red-500/20 focus:border-red-600 focus:ring-red-500/30'
                      : 'border-[#D4AF37]/45 focus:border-[#7B1E3A] focus:ring-2 focus:ring-[#7B1E3A]/15'
                  }`}
                />
                {errors.shopName && (
                  <p className="text-red-600 text-[13px] font-medium mt-1.5 flex items-center gap-1.5 m-0 leading-tight">
                    <span>⚠</span> {errors.shopName}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  data-field="address"
                  placeholder="Shop Location & Address"
                  value={form.address}
                  onChange={upd('address')}
                  style={{ paddingLeft: '20px', paddingRight: '20px', height: '58px' }}
                  className={`w-full rounded-[12px] border bg-white text-[16px] sm:text-[17px] lg:text-[18px] text-[#4A2C2A] placeholder:text-[16px] placeholder:text-gray-400 outline-none transition-all duration-200 shadow-sm ${
                    errors.address
                      ? 'border-red-500 ring-2 ring-red-500/20 focus:border-red-600 focus:ring-red-500/30'
                      : 'border-[#D4AF37]/45 focus:border-[#7B1E3A] focus:ring-2 focus:ring-[#7B1E3A]/15'
                  }`}
                />
                {errors.address && (
                  <p className="text-red-600 text-[13px] font-medium mt-1.5 flex items-center gap-1.5 m-0 leading-tight">
                    <span>⚠</span> {errors.address}
                  </p>
                )}
              </div>

              <div>
                <textarea
                  data-field="description"
                  rows="3"
                  placeholder="Tell customers about your weaving tradition & specialties... (Min. 20 characters)"
                  value={form.description}
                  onChange={upd('description')}
                  style={{ padding: '16px 20px' }}
                  className={`w-full rounded-[12px] border bg-white text-[16px] sm:text-[17px] lg:text-[18px] text-[#4A2C2A] placeholder:text-[16px] placeholder:text-gray-400 outline-none transition-all duration-200 shadow-sm resize-none leading-relaxed ${
                    errors.description
                      ? 'border-red-500 ring-2 ring-red-500/20 focus:border-red-600 focus:ring-red-500/30'
                      : 'border-[#D4AF37]/45 focus:border-[#7B1E3A] focus:ring-2 focus:ring-[#7B1E3A]/15'
                  }`}
                />
                {errors.description && (
                  <p className="text-red-600 text-[13px] font-medium mt-1.5 flex items-center gap-1.5 m-0 leading-tight">
                    <span>⚠</span> {errors.description}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div
                  data-field="certificate"
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex items-center justify-center gap-4 p-5 rounded-[12px] border-2 border-dashed transition-colors cursor-pointer text-center group shadow-sm ${
                    errors.certificate
                      ? 'border-red-500 bg-red-50/40 hover:bg-red-50/70'
                      : certificateFile
                      ? 'border-green-600/60 bg-green-50/40 hover:bg-green-50/70'
                      : 'border-[#D4AF37]/60 bg-[#FFF8F0]/40 hover:bg-[#FFF8F0]/70'
                  }`}
                >
                  <FiUploadCloud size={28} className={`${errors.certificate ? 'text-red-500' : certificateFile ? 'text-green-600' : 'text-[#D4AF37]'} group-hover:scale-110 transition-transform flex-shrink-0`} />
                  <span className={`text-[16px] sm:text-[17px] font-semibold ${errors.certificate ? 'text-red-600' : certificateFile ? 'text-green-700' : 'text-[#7B1E3A]'}`}>
                    {certificateFile ? `Uploaded: ${certificateFile.name}` : 'Upload Shop Emblem or Certificate (Mandatory)'}
                  </span>
                </div>
                {errors.certificate && (
                  <p className="text-red-600 text-[13px] font-medium mt-1.5 flex items-center gap-1.5 m-0 leading-tight">
                    <span>⚠</span> {errors.certificate}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Create Account Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              style={{ height: '58px' }}
              className="w-full rounded-[12px] bg-gradient-to-r from-[#D4AF37] to-[#E8C94A] hover:from-[#E8C94A] hover:to-[#D4AF37] text-[#4A2C2A] text-[18px] font-bold cursor-pointer shadow-md hover:shadow-lg transition-all flex items-center justify-center disabled:opacity-70"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>

          {/* Google Sign-Up */}
          {!isShopkeeper && role !== 'admin' && (
            <div className="pt-2">
              <button
                type="button"
                disabled={loading}
                onClick={handleGoogleSignUp}
                style={{ height: '58px' }}
                className="w-full rounded-[12px] border border-[#D4AF37]/45 bg-white hover:bg-[#FFF8F0] text-[#4A2C2A] text-[16px] font-semibold cursor-pointer shadow-sm transition-all flex items-center justify-center gap-3 disabled:opacity-70"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                Sign Up with Google
              </button>
            </div>
          )}
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
