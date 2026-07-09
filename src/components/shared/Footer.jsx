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
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-10 mb-14">
          {/* Brand - Takes 2 Columns on Large Screens */}
          <div className="lg:col-span-2 pr-0 lg:pr-6">
            <Link to={user ? getDashboardPath() : '/'} className="flex items-center gap-3 sm:gap-4 no-underline mb-6 group w-fit">
              <img
                src="/images/logo_vas.png"
                alt="Vasthra Cotton Logo"
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain flex-shrink-0 group-hover:scale-105 transition-transform"
              />
              <span className="text-5xl sm:text-6xl font-bold text-white tracking-tight" style={{ fontFamily: 'Playfair Display' }}>
                Vasthra <span className="text-[#D4AF37]">Cotton</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/70 mb-6 max-w-sm">
              India's premier multi-vendor saree marketplace. Celebrating our rich textile heritage by bringing authentic Kanjivaram, Banarasi, and handloom masterpieces directly from weavers to your doorstep.
            </p>

            <div className="flex gap-3 mt-6">
              {[
                { icon: <FaFacebookF size={15} />, href: '#', label: 'Facebook' },
                { icon: <FiInstagram size={16} />, href: '#', label: 'Instagram' },
                { icon: <FaWhatsapp size={16} />, href: '#', label: 'WhatsApp' },
                { icon: <FaPinterestP size={15} />, href: '#', label: 'Pinterest' }
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-[#D4AF37] hover:text-[#4A2C2A] transition-all duration-300 no-underline shadow-sm"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[#D4AF37] font-semibold text-sm mb-5 tracking-wider uppercase font-mono">Company</h4>
            <ul className="space-y-3 list-none p-0 m-0">
              {['About Us', 'Our Heritage', 'Artisan Community', 'Privacy Policy', 'Terms & Conditions', 'Careers'].map(item => (
                <li key={item}>
                  <Link to="/about" className="text-sm text-white/60 hover:text-[#D4AF37] transition-colors no-underline inline-block">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#D4AF37] font-semibold text-sm mb-5 tracking-wider uppercase font-mono">Quick Links</h4>
            <ul className="space-y-3 list-none p-0 m-0">
              {[
                { name: 'All Sarees', path: '/products' },
                { name: 'Silk Sarees', path: '/categories' },
                { name: 'Verified Shops', path: '/shops' },
                { name: 'My Wishlist', path: '/wishlist' },
                { name: 'Become a Seller', path: '/portal' },
                { name: 'Track Order', path: '/user/orders' }
              ].map(item => (
                <li key={item.name}>
                  <Link to={item.path} className="text-sm text-white/60 hover:text-[#D4AF37] transition-colors no-underline inline-block">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#D4AF37] font-semibold text-sm mb-5 tracking-wider uppercase font-mono">Contact Us</h4>
            <div className="space-y-4">
              {[
                { icon: <FiMapPin size={16} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />, text: 'Silk Weavers Hub, T. Nagar, Chennai - 600017, Tamil Nadu' },
                { icon: <FiPhone size={16} className="text-[#D4AF37] flex-shrink-0" />, text: '+91 98765 43210 (Mon-Sat, 10am-7pm)' },
                { icon: <FiMail size={16} className="text-[#D4AF37] flex-shrink-0" />, text: 'support@vasthracotton.com' },
              ].map((c, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-white/70 leading-snug">
                  {c.icon}
                  <span>{c.text}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-white/10">
              <span className="text-xs text-[#D4AF37] font-semibold block mb-1">100% Authenticity Guaranteed</span>
              <span className="text-[11px] text-white/50">Direct from Silk Mark certified weavers</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-xs text-white/50">
          <p className="m-0">© 2026 Vasthra Cotton Marketplace Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/about" className="text-white/50 hover:text-[#D4AF37] no-underline">Privacy Policy</Link>
            <Link to="/about" className="text-white/50 hover:text-[#D4AF37] no-underline">Terms of Service</Link>
            <Link to="/contact" className="text-white/50 hover:text-[#D4AF37] no-underline">Support</Link>
          </div>
          <p className="m-0 flex items-center gap-1">Crafted with ❤️ for Indian Traditions</p>
        </div>
      </div>
    </footer>
  );
}

