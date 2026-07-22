import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiHeart, FiMenu, FiX, FiUser, FiUsers, FiGrid, FiClock, FiChevronDown, FiShield, FiShoppingBag, FiLogOut, FiShoppingCart, FiPackage, FiHome, FiPhone } from 'react-icons/fi';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Shops', path: '/shops' },
  {
    name: 'Login',
    isDropdown: true,
    children: [
      { name: 'User Login', path: '/login/user', icon: FiUser, desc: 'Saree Connoisseur & Shopper' },
      { name: 'Shop Owner Login', path: '/login/shopkeeper', icon: FiShoppingBag, desc: 'Weaver & Store Partner' },
      { name: 'Admin Login', path: '/login/admin', icon: FiShield, desc: 'Platform Management' },
    ]
  },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [mobileLoginOpen, setMobileLoginOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(-1);
  const { wishlist } = useWishlist();
  const { cartCount } = useCart();
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const trendingTerms = ['Kanjivaram Bridal Silk', 'Banarasi Zari Weave', 'Pure Organza Designer', 'Handloom Cotton Doria', 'Silk Mark Certified'];
  const [recentTerms, setRecentTerms] = useState(['Royal Kanchipuram Wedding Collection', 'Mysore Silk Gold Zari', 'Chanderi Handloom Festive', 'Pure Banarasi Katan Silk']);
  const allSuggestions = [...trendingTerms, ...recentTerms];

  const handleKeyDown = (e) => {
    if (!searchOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(prev => (prev + 1) % allSuggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(prev => (prev <= 0 ? allSuggestions.length - 1 : prev - 1));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      const selected = allSuggestions[activeIdx];
      setSearchQuery(selected);
      setSearchOpen(false);
      setActiveIdx(-1);
      navigate(`/search?q=${encodeURIComponent(selected)}`);
    } else if (e.key === 'Escape') {
      setSearchOpen(false);
      setActiveIdx(-1);
    }
  };

  // ─── Immersive header: ONLY on individual product/shop detail pages for Customers ───
  const shouldAutoHide = (location.pathname.startsWith('/product/') || location.pathname.startsWith('/store/')) && role !== 'admin' && role !== 'shopOwner' && role !== 'shopkeeper';

  // Accumulated overscroll pull distance (tracked via wheel/touch while at scrollY===0)
  const overscrollAccum = useRef(0);
  const touchStartY = useRef(null);
  const OVERSCROLL_THRESHOLD = 150; // px of deliberate pull-down needed at top

  // Step 0: Immediately hide on every navigation to an immersive route
  useEffect(() => {
    if (shouldAutoHide) {
      setNavHidden(true);
      overscrollAccum.current = 0;
    } else {
      setNavHidden(false);
    }
  }, [location.pathname]);

  // Standard scroll listener — only handles scrolled shadow + re-hiding
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);

      if (shouldAutoHide && !mobileOpen && !searchOpen) {
        // Any downward scroll or moving away from top → hide immediately
        if (y > lastY + 2 || y > 5) {
          setNavHidden(true);
          overscrollAccum.current = 0;
        }
      } else {
        setNavHidden(false);
      }
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [shouldAutoHide, mobileOpen, searchOpen]);

  // Two-step overscroll detection via wheel events (desktop)
  useEffect(() => {
    if (!shouldAutoHide) return;
    const onWheel = (e) => {
      if (mobileOpen || searchOpen) return;
      // Only track upward wheel gestures while page is at the very top
      if (window.scrollY === 0 && e.deltaY < 0) {
        overscrollAccum.current += Math.abs(e.deltaY);
        if (overscrollAccum.current >= OVERSCROLL_THRESHOLD) {
          setNavHidden(false);
        }
      } else {
        // Reset accumulator if user scrolls down or page is not at top
        overscrollAccum.current = 0;
      }
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, [shouldAutoHide, mobileOpen, searchOpen]);

  // Two-step overscroll detection via touch events (mobile)
  useEffect(() => {
    if (!shouldAutoHide) return;
    const onTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const onTouchMove = (e) => {
      if (mobileOpen || searchOpen || touchStartY.current === null) return;
      const deltaY = e.touches[0].clientY - touchStartY.current;
      // Pulling down (positive deltaY) while at the very top of page
      if (window.scrollY === 0 && deltaY > 0) {
        overscrollAccum.current += deltaY * 0.3; // dampen for natural feel
        touchStartY.current = e.touches[0].clientY;
        if (overscrollAccum.current >= OVERSCROLL_THRESHOLD) {
          setNavHidden(false);
        }
      } else {
        overscrollAccum.current = 0;
      }
    };
    const onTouchEnd = () => {
      touchStartY.current = null;
      // Don't reset accumulator here — let scroll handler manage hiding
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [shouldAutoHide, mobileOpen, searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const getDashboardPath = () => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'shopkeeper') return '/shopkeeper/dashboard';
    return '/user/dashboard';
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${navHidden ? '-translate-y-full' : 'translate-y-0'} ${scrolled ? 'bg-white/97 backdrop-blur-lg shadow-lg border-b border-[#D4AF37]/10' : 'bg-white/95 backdrop-blur-sm shadow-sm'}`}>
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-14 flex items-center justify-between h-[64px] sm:h-[72px] lg:h-[76px]">
          {/* Logo */}
          <Link to={user ? getDashboardPath() : '/'} className="flex items-center gap-2.5 sm:gap-3 no-underline group flex-shrink-0 min-w-0 mr-3 lg:mr-6 xl:mr-10">
            <img
              src="/images/logo_vas.png"
              alt="Vasthra Cotton Logo"
              className="w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 object-contain flex-shrink-0 group-hover:scale-105 transition-transform"
            />
            <span className="text-lg sm:text-2xl lg:text-[28px] font-bold text-[#7B1E3A] tracking-tight whitespace-nowrap" style={{ fontFamily: 'Playfair Display' }}>
              Vasthra <span className="text-[#D4AF37]">Cotton</span>
            </span>
          </Link>

          {/* Flipkart / Myntra Style Search Box (Desktop) */}
          <div className="hidden lg:flex items-center flex-1 max-w-sm xl:max-w-md mx-5 xl:mx-8 relative self-center">
            <form onSubmit={handleSearch} className="w-full h-[42px] bg-[#FFF8F0] hover:bg-[#FFF2E5] focus-within:bg-white focus-within:border-[#7B1E3A] focus-within:ring-2 focus-within:ring-[#7B1E3A]/12 rounded-full border border-[#D4AF37]/30 flex items-center p-1 shadow-inner transition-all duration-200 relative">
              <div className="flex items-center justify-center text-[#6B4A48]/70 pl-3 pr-2 flex-shrink-0">
                <FiSearch size={18} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); if (!searchOpen) setSearchOpen(true); setActiveIdx(-1); }}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder="Search for Sarees, Silks, Kanjivaram, Weavers..."
                className="w-full bg-transparent text-[#4A2C2A] placeholder-[#6B4A48]/60 text-xs xl:text-sm font-normal focus:outline-none h-full border-none pr-4 min-w-0"
              />
              <button type="submit" className="hidden" aria-hidden="true" />
            </form>

            {/* Instant Search Dropdown (Recent & Trending) */}
            <AnimatePresence>
              {searchOpen && (
                <>
                  <div className="fixed inset-0 z-[990]" onClick={() => { setSearchOpen(false); setActiveIdx(-1); }} />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#D4AF37]/25 p-4 sm:p-5 z-[999] max-h-[75vh] sm:max-h-96 overflow-y-auto overscroll-contain scrollbar-thin space-y-4"
                  >
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block mb-2.5">✦ Popular & Trending Searches</span>
                      <div className="flex flex-wrap gap-2">
                        {trendingTerms.map((term, idx) => {
                          const isSelected = idx === activeIdx;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => { setSearchQuery(term); setSearchOpen(false); setActiveIdx(-1); navigate(`/search?q=${encodeURIComponent(term)}`); }}
                              className={`h-[44px] px-4 rounded-xl text-xs sm:text-sm font-medium border transition-all duration-200 cursor-pointer shadow-2xs leading-normal whitespace-nowrap flex items-center gap-2 flex-shrink-0 ${isSelected
                                  ? 'bg-[#7B1E3A] text-white border-[#7B1E3A] shadow-md scale-[1.02]'
                                  : 'bg-[#FFF8F0] hover:bg-[#E8C94A] hover:text-[#4A2C2A] text-[#7B1E3A] border-[#D4AF37]/30 hover:border-[#D4AF37]'
                                }`}
                            >
                              <FiSearch size={14} className={isSelected ? 'text-[#D4AF37]' : 'opacity-70'} />
                              <span>{term}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="border-t border-[#D4AF37]/15 pt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] flex items-center gap-1.5">
                          <FiClock className="text-[#D4AF37]" size={14} /> Recent Weaves Explored
                        </span>
                        {recentTerms.length > 0 && (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setRecentTerms([]); }}
                            className="text-xs text-[#7B1E3A] hover:underline font-medium bg-transparent border-none cursor-pointer p-0"
                          >
                            Clear History
                          </button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {recentTerms.map((recent, idx) => {
                          const isSelected = (idx + trendingTerms.length) === activeIdx;
                          return (
                            <div
                              key={idx}
                              onClick={() => { setSearchQuery(recent); setSearchOpen(false); setActiveIdx(-1); navigate(`/search?q=${encodeURIComponent(recent)}`); }}
                              className={`h-[46px] sm:h-[48px] px-4 rounded-xl text-xs sm:text-sm cursor-pointer transition-all duration-200 border flex items-center justify-between group/item ${isSelected
                                  ? 'bg-[#FFF8F0] text-[#7B1E3A] font-bold border-[#D4AF37]/40 shadow-xs'
                                  : 'text-[#4A2C2A] hover:bg-[#FFF8F0] hover:text-[#7B1E3A] border-transparent hover:border-[#D4AF37]/20 active:bg-[#F5EDE0]'
                                }`}
                            >
                              <span className="flex items-center gap-3 font-medium min-w-0 truncate pr-2">
                                <span className="w-7 h-7 rounded-lg bg-[#FFF8F0] group-hover/item:bg-white text-[#D4AF37] flex items-center justify-center flex-shrink-0 text-xs shadow-2xs">🕒</span>
                                <span className="truncate">{recent}</span>
                              </span>
                              <span className="text-[10px] text-[#7B1E3A] font-semibold bg-[#FFF8F0] group-hover/item:bg-white px-2.5 py-1 rounded-md border border-[#D4AF37]/20 flex-shrink-0 whitespace-nowrap">
                                in Catalogue
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map(link => {
              if (link.isDropdown) {
                const active = location.pathname.startsWith('/login');
                const activeChild = link.children?.find(c => location.pathname === c.path);
                const displayLabel = user ? (user.name || 'Account') : (activeChild ? activeChild.name : link.name);
                return (
                  <div
                    key={link.name}
                    className="relative py-1"
                    onMouseEnter={() => setLoginDropdownOpen(true)}
                    onMouseLeave={() => setLoginDropdownOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                      className={`text-[13px] xl:text-sm font-medium transition-colors relative group flex items-center gap-1.5 border-none cursor-pointer p-0 font-body ${active ? 'bg-transparent text-[#7B1E3A] font-semibold' : 'bg-transparent text-[#4A2C2A] hover:text-[#7B1E3A]'
                        }`}
                    >
                      <span>{displayLabel}</span>
                      <FiChevronDown
                        size={15}
                        className={`transition-transform duration-300 ${loginDropdownOpen ? 'rotate-180 text-[#D4AF37]' : 'text-[#6B4A48]'}`}
                      />
                      <span
                        className={`absolute -bottom-1 left-0 h-0.5 bg-[#D4AF37] transition-all duration-300 rounded-full ${active ? 'w-full' : 'w-0 group-hover:w-full'
                          }`}
                      />
                    </button>

                    <AnimatePresence>
                      {loginDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.98 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 min-w-[240px] max-w-[280px] w-auto z-50"
                        >
                          <div className="bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#D4AF37]/25 p-4 sm:p-5 space-y-2">
                            {link.children.map((child) => {
                              const Icon = child.icon;
                              const isChildActive = location.pathname === child.path;
                              return (
                                <Link
                                  key={child.name}
                                  to={child.path}
                                  onClick={() => setLoginDropdownOpen(false)}
                                  className={`h-[46px] sm:h-[48px] px-4 sm:px-4.5 rounded-xl flex items-center gap-3 transition-all duration-200 no-underline ${
                                    isChildActive
                                      ? 'bg-[#7B1E3A] text-white font-semibold shadow-sm'
                                      : 'hover:bg-[#FFF8F0] active:bg-[#F5EDE0] text-[#4A2C2A] hover:text-[#7B1E3A]'
                                  }`}
                                >
                                  <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform ${
                                      isChildActive
                                        ? 'bg-white/20 text-[#D4AF37]'
                                        : 'bg-[#7B1E3A]/10 text-[#7B1E3A]'
                                    }`}
                                  >
                                    <Icon size={16} />
                                  </div>
                                  <div className="min-w-0 flex-1 flex flex-col justify-center">
                                    <span className="text-xs sm:text-sm font-bold block truncate leading-snug">{child.name}</span>
                                    <span className={`text-[10px] block truncate ${isChildActive ? 'text-white/80' : 'text-[#6B4A48]'}`}>
                                      {child.desc}
                                    </span>
                                  </div>
                                </Link>
                              );
                            })}
                            {user && (
                              <button
                                type="button"
                                onClick={() => { setLoginDropdownOpen(false); logout(); navigate('/'); }}
                                className="w-full h-[46px] sm:h-[48px] px-4 sm:px-4.5 rounded-xl flex items-center gap-3 transition-all duration-200 border border-red-200 bg-red-50/70 hover:bg-red-50 text-red-600 font-semibold cursor-pointer text-left mt-1"
                              >
                                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                                  <FiLogOut size={16} />
                                </div>
                                <div className="min-w-0 flex-1 flex flex-col justify-center">
                                  <span className="text-xs sm:text-sm font-bold block leading-snug">Log Out</span>
                                  <span className="text-[10px] block truncate text-red-500/80">Sign out of {role} account</span>
                                </div>
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              const active = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path.split('?')[0]) && link.path !== '/');
              const targetPath = (user && link.path === '/') ? getDashboardPath() : link.path;
              return (
                <Link
                  key={link.name}
                  to={targetPath}
                  className={`text-[13px] xl:text-sm font-medium transition-colors relative group no-underline py-1.5 ${active ? 'text-[#7B1E3A] font-semibold' : 'text-[#4A2C2A] hover:text-[#7B1E3A]'}`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-[#D4AF37] transition-all duration-300 rounded-full ${active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 lg:gap-3.5 flex-shrink-0 ml-auto">
            {/* Search toggle (Mobile only) */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Toggle search bar"
              className="lg:hidden w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-[#FFF8F0] transition-colors text-[#4A2C2A] cursor-pointer bg-transparent border-none flex-shrink-0"
            >
              <FiSearch size={18} />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-[#FFF8F0] transition-colors text-[#4A2C2A] no-underline flex-shrink-0"
            >
              <FiHeart size={19} />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#7B1E3A] text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-sm">
                  {wishlist.length > 9 ? '9+' : wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              aria-label="Cart"
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-[#FFF8F0] transition-colors text-[#4A2C2A] no-underline flex-shrink-0"
            >
              <FiShoppingCart size={19} />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#7B1E3A] text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-sm">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-[#FFF8F0] transition-colors text-[#4A2C2A] cursor-pointer bg-transparent border border-transparent hover:border-[#D4AF37]/30 flex-shrink-0"
            >
              {mobileOpen ? <FiX size={22} className="text-[#7B1E3A]" /> : <FiMenu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Search Bar dropdown (Mobile only) */}
        <AnimatePresence>
          {searchOpen && (
            <>
              <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setSearchOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.96 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="fixed top-20 left-4 right-4 sm:left-auto sm:right-6 sm:w-[380px] bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#D4AF37]/25 p-4 sm:p-5 z-50 lg:hidden space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto"
              >
                <form onSubmit={handleSearch} className="w-full flex items-center bg-[#FFF8F0] focus-within:bg-white focus-within:border-[#7B1E3A] focus-within:ring-2 focus-within:ring-[#7B1E3A]/15 rounded-full border border-[#D4AF37]/40 p-1 shadow-inner">
                  <div className="flex items-center justify-center text-[#6B4A48]/70 pl-3 pr-2 flex-shrink-0">
                    <FiSearch size={16} />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search Kanjivaram, Banarasi, Silk..."
                    className="w-full bg-transparent text-[#4A2C2A] placeholder-[#6B4A48]/60 text-xs sm:text-sm font-normal focus:outline-none h-[38px] border-none pr-4 min-w-0"
                    autoFocus
                  />
                  <button type="submit" className="hidden" aria-hidden="true" />
                </form>

                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block mb-2">✦ Popular & Trending Searches</span>
                    <div className="flex flex-wrap gap-2">
                      {trendingTerms.map((term, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => { setSearchQuery(term); setSearchOpen(false); navigate(`/search?q=${encodeURIComponent(term)}`); }}
                          className="h-[44px] px-3.5 rounded-xl bg-[#FFF8F0] hover:bg-[#E8C94A] hover:text-[#4A2C2A] text-[#7B1E3A] text-xs font-medium border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all cursor-pointer shadow-2xs leading-normal whitespace-nowrap flex items-center gap-1.5 flex-shrink-0"
                        >
                          <FiSearch size={13} className="opacity-70" /> <span>{term}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-[#D4AF37]/15 pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#7B1E3A] flex items-center gap-1.5">
                        <FiClock className="text-[#D4AF37]" size={14} /> Recent Weaves Explored
                      </span>
                      {recentTerms.length > 0 && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setRecentTerms([]); }}
                          className="text-xs text-[#7B1E3A] hover:underline font-medium bg-transparent border-none cursor-pointer p-0"
                        >
                          Clear History
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {recentTerms.map((recent, idx) => (
                        <div
                          key={idx}
                          onClick={() => { setSearchQuery(recent); setSearchOpen(false); navigate(`/search?q=${encodeURIComponent(recent)}`); }}
                          className="h-[46px] px-4 rounded-xl hover:bg-[#FFF8F0] active:bg-[#F5EDE0] text-xs text-[#4A2C2A] hover:text-[#7B1E3A] cursor-pointer transition-all border border-transparent hover:border-[#D4AF37]/20 flex items-center justify-between"
                        >
                          <span className="flex items-center gap-2.5 font-medium min-w-0 truncate pr-2">
                            <span className="w-6 h-6 rounded-lg bg-[#FFF8F0] text-[#D4AF37] flex items-center justify-center flex-shrink-0 text-xs">🕒</span>
                            <span className="truncate">{recent}</span>
                          </span>
                          <span className="text-[10px] text-[#7B1E3A] font-semibold bg-[#FFF8F0] px-2.5 py-1 rounded-md border border-[#D4AF37]/20 flex-shrink-0 whitespace-nowrap">
                            in Catalogue
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      {/* Floating Menu Card */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-xs"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed top-20 right-4 sm:right-6 lg:right-12 xl:right-14 w-[calc(100%-32px)] max-w-[310px] bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#D4AF37]/25 z-50 flex flex-col p-4 sm:p-5 max-h-[calc(100vh-100px)] overflow-y-auto space-y-2"
            >
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#D4AF37]/20">
                <span className="text-base sm:text-lg font-bold text-[#7B1E3A]" style={{ fontFamily: 'Playfair Display' }}>
                  Navigation
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#FFF8F0] flex items-center justify-center cursor-pointer border border-[#D4AF37]/20 text-[#4A2C2A] shadow-2xs hover:bg-[#E8C94A] transition-colors"
                >
                  <FiX size={16} />
                </button>
              </div>

              {/* Navigation Links (Mobile only) */}
              <div className="flex flex-col space-y-2 lg:hidden">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] px-4 mb-0.5">Navigation</span>
                {[
                  { name: 'Home', path: user ? getDashboardPath() : '/', icon: FiHome },
                  { name: 'Shops', path: '/shops', icon: FiShoppingBag },
                  { name: 'Login', path: '/portal', icon: FiUser },
                  { name: 'Contact', path: '/contact', icon: FiPhone }
                ].filter(link => link.name !== 'Login' || !user).map(link => {
                  const active = location.pathname === link.path;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={`h-[46px] sm:h-[48px] px-4 rounded-xl font-body transition-all text-sm sm:text-base font-semibold no-underline flex items-center justify-between border border-transparent group ${active
                          ? 'bg-[#7B1E3A] text-white shadow-sm'
                          : 'text-[#4A2C2A] hover:bg-[#FFF8F0] hover:text-[#7B1E3A] active:bg-[#F5EDE0]'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} className={active ? 'text-[#D4AF37]' : 'text-[#7B1E3A]/70 group-hover:text-[#7B1E3A] transition-colors'} />
                        {link.name}
                      </div>
                      {active && <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />}
                    </Link>
                  );
                })}
              </div>

              {/* Divider between sections (Mobile only) */}
              <div className="border-t border-[#D4AF37]/15 my-1 lg:hidden" />

              {/* Quick Access or Admin Shortcuts */}
              <div className="flex flex-col space-y-2">
                {role === 'admin' ? (
                  <>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] px-4 mb-0.5 lg:hidden">Admin Shortcuts</span>
                    {[
                      { name: 'Pending Sarees', path: '/admin/pending-products', icon: FiClock },
                      { name: 'Live Catalogue', path: '/admin/approved-products', icon: FiPackage },
                      { name: 'Pending Shops', path: '/admin/pending-shops', icon: FiShoppingBag },
                      { name: 'Users', path: '/admin/users', icon: FiUsers }
                    ].map(link => {
                      const active = location.pathname === link.path;
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.name}
                          to={link.path}
                          onClick={() => setMobileOpen(false)}
                          className={`h-[46px] sm:h-[48px] px-4 rounded-xl font-body transition-all text-sm sm:text-base font-semibold no-underline flex items-center justify-between border border-transparent group ${active
                              ? 'bg-[#7B1E3A] text-white shadow-sm'
                              : 'text-[#4A2C2A] hover:bg-[#FFF8F0] hover:text-[#7B1E3A] active:bg-[#F5EDE0]'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon size={18} className={active ? 'text-[#D4AF37]' : 'text-[#7B1E3A]/70 group-hover:text-[#7B1E3A] transition-colors'} />
                            {link.name}
                          </div>
                          {active && <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />}
                        </Link>
                      );
                    })}
                  </>
                ) : (
                  <>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] px-4 mb-0.5 lg:hidden">Quick Access</span>
                    {[
                      { name: 'My Profile', path: '/user/dashboard', icon: FiUser },
                      { name: 'Wishlist', path: '/wishlist', icon: FiHeart },
                      { name: 'Cart', path: '/cart', icon: FiShoppingCart },
                      { name: 'Orders', path: '/user/orders', icon: FiPackage }
                    ].map(link => {
                      const active = location.pathname === link.path;
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.name}
                          to={link.path}
                          onClick={() => setMobileOpen(false)}
                          className={`h-[46px] sm:h-[48px] px-4 rounded-xl font-body transition-all text-sm sm:text-base font-semibold no-underline flex items-center justify-between border border-transparent group ${active
                              ? 'bg-[#7B1E3A] text-white shadow-sm'
                              : 'text-[#4A2C2A] hover:bg-[#FFF8F0] hover:text-[#7B1E3A] active:bg-[#F5EDE0]'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon size={18} className={active ? 'text-[#D4AF37]' : 'text-[#7B1E3A]/70 group-hover:text-[#7B1E3A] transition-colors'} />
                            {link.name}
                          </div>
                          {active && <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />}
                        </Link>
                      );
                    })}
                  </>
                )}
              </div>

              <div className="pt-3 border-t border-[#D4AF37]/20 mt-2">
                {user ? (
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="btn-golden w-full h-[46px] sm:h-[48px] px-4 !text-xs sm:!text-sm shadow-sm flex items-center justify-center gap-2 rounded-xl font-bold cursor-pointer border-none"
                  >
                    <FiLogOut size={16} /> Logout
                  </button>
                ) : (
                  <Link
                    to="/portal"
                    onClick={() => setMobileOpen(false)}
                    className="btn-golden w-full h-[46px] sm:h-[48px] px-4 !text-xs sm:!text-sm no-underline shadow-sm flex items-center justify-center gap-2 rounded-xl font-bold"
                  >
                    <FiUser size={16} /> Login / Register
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer — zero height on immersive pages, normal on standard pages */}
      {shouldAutoHide
        ? <div style={{ height: navHidden ? 0 : undefined }} className="transition-[height] duration-300 ease-in-out overflow-hidden">{!navHidden && <div className="h-[64px] sm:h-[72px] lg:h-[76px]" />}</div>
        : <div className="h-[64px] sm:h-[72px] lg:h-[76px]" />
      }
    </>
  );
}

