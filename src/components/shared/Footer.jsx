import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle } from 'react-icons/fi';
import { FaFacebookF, FaWhatsapp, FaPinterestP } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { user, role } = useAuth();

  const getDashboardPath = () => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'shopkeeper') return '/shopkeeper/dashboard';
    return '/user/dashboard';
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-gradient-to-b from-[#4A2C2A] to-[#2A1716] text-white/80 border-t-4 border-[#D4AF37] w-full overflow-hidden">
      {/* Newsletter Strip */}
      <div className="bg-gradient-to-r from-[#5A1028] via-[#7B1E3A] to-[#5A1028] py-8 sm:py-10 px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5" style={{ fontFamily: 'Playfair Display' }}>
            Stay Connected with Vasthra Cotton
          </h3>
          <p className="text-xs sm:text-sm text-white/70 mb-5 font-light">
            Get exclusive access to new arrivals, festive collections & artisan stories
          </p>
          <form onSubmit={handleSubscribe} className="flex items-center gap-2 sm:gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <FiMail className="absolute top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" style={{ left: '18px' }} size={18} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={{ paddingLeft: '58px' }}
                className="w-full h-11 sm:h-12 pr-4 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#D4AF37]/60 focus:ring-2 focus:ring-[#D4AF37]/15 transition-all"
              />
            </div>
            <button type="submit" className="h-11 sm:h-12 px-5 sm:px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E8C94A] text-[#4A2C2A] font-bold text-xs sm:text-sm flex items-center gap-1.5 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer border-none flex-shrink-0">
              {subscribed ? <><FiCheckCircle size={16} /> Subscribed!</> : <><FiSend size={14} /> Subscribe</>}
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-12 sm:pt-14 pb-8 sm:pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2 pr-0 lg:pr-6">
            <Link to={user ? getDashboardPath() : '/'} className="flex items-center gap-3 no-underline mb-5 group w-fit">
              <img
                src="/images/logo_vas.png"
                alt="Vasthra Cotton Logo"
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain flex-shrink-0 group-hover:scale-105 transition-transform"
              />
              <span className="text-xl sm:text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'Playfair Display' }}>
                Vasthra <span className="text-[#D4AF37]">Cotton</span>
              </span>
            </Link>
            <p className="text-[13px] sm:text-sm leading-relaxed text-white/60 mb-5 max-w-sm">
              India's premier multi-vendor saree marketplace. Celebrating our rich textile heritage by bringing authentic Kanjivaram, Banarasi, and handloom weaves directly from weavers to your doorstep.
            </p>

            <div className="flex gap-2.5">
              {[
                { icon: <FaFacebookF size={14} />, href: '#', label: 'Facebook' },
                { icon: <FiInstagram size={15} />, href: '#', label: 'Instagram' },
                { icon: <FaWhatsapp size={15} />, href: '#', label: 'WhatsApp' },
                { icon: <FaPinterestP size={14} />, href: '#', label: 'Pinterest' }
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center text-white/70 hover:bg-[#D4AF37] hover:text-[#4A2C2A] transition-all duration-300 no-underline border border-white/10 hover:border-[#D4AF37]"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[#D4AF37] font-semibold text-[13px] mb-4 sm:mb-5 tracking-wider uppercase">Company</h4>
            <ul className="space-y-2.5 list-none p-0 m-0">
              {['About Us', 'Our Heritage', 'Artisan Community', 'Privacy Policy', 'Terms & Conditions', 'Careers'].map(item => (
                <li key={item}>
                  <Link to="/about" className="text-[13px] sm:text-sm text-white/55 hover:text-[#D4AF37] transition-colors no-underline inline-block hover:translate-x-0.5 transition-transform">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#D4AF37] font-semibold text-[13px] mb-4 sm:mb-5 tracking-wider uppercase">Quick Links</h4>
            <ul className="space-y-2.5 list-none p-0 m-0">
              {[
                { name: 'All Sarees', path: '/products' },
                { name: 'Silk Sarees', path: '/categories' },
                { name: 'Verified Shops', path: '/shops' },
                { name: 'My Wishlist', path: '/wishlist' },
                { name: 'Become a Seller', path: '/portal' },
                { name: 'Track Order', path: '/user/orders' }
              ].map(item => (
                <li key={item.name}>
                  <Link to={item.path} className="text-[13px] sm:text-sm text-white/55 hover:text-[#D4AF37] transition-colors no-underline inline-block hover:translate-x-0.5 transition-transform">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#D4AF37] font-semibold text-[13px] mb-4 sm:mb-5 tracking-wider uppercase">Contact Us</h4>
            <div className="space-y-3.5">
              {[
                { icon: <FiMapPin size={15} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />, text: '2nd Street, Kamaraj Nagar, Aundipatty - 625512, Tamil Nadu' },
                { icon: <FiPhone size={15} className="text-[#D4AF37] flex-shrink-0" />, text: '+91 63821 34040 (Mon-Sat, 10am-7pm)' },
                { icon: <FiMail size={15} className="text-[#D4AF37] flex-shrink-0" />, text: 'support@vasthracotton.com' },
              ].map((c, i) => (
                <div key={i} className="flex items-start gap-2.5 text-[13px] sm:text-sm text-white/60 leading-snug">
                  {c.icon}
                  <span>{c.text}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-white/10">
              <span className="text-[11px] sm:text-xs text-[#D4AF37] font-semibold block mb-1">100% Authenticity Guaranteed</span>
              <span className="text-[10px] sm:text-[11px] text-white/45">Direct from Silk Mark certified weavers</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] sm:text-xs text-white/45">
          <p className="m-0">© 2026 Vasthra Cotton Marketplace Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-5 sm:gap-6">
            <Link to="/about" className="text-white/45 hover:text-[#D4AF37] no-underline transition-colors">Privacy Policy</Link>
            <Link to="/about" className="text-white/45 hover:text-[#D4AF37] no-underline transition-colors">Terms of Service</Link>
            <Link to="/contact" className="text-white/45 hover:text-[#D4AF37] no-underline transition-colors">Support</Link>
          </div>
          <p className="m-0 flex items-center gap-1">Crafted with ❤️ for Indian Traditions</p>
        </div>
      </div>
    </footer>
  );
}

