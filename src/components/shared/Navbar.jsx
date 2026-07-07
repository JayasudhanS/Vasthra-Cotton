import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiHeart, FiMenu, FiX, FiUser, FiGrid, FiClock } from 'react-icons/fi';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Categories', path: '/categories' },
  { name: 'Featured', path: '/products?filter=featured' },
  { name: 'Shops', path: '/shops' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(-1);
  const { wishlist } = useWishlist();
  const { user, role } = useAuth();
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-2' : 'bg-white/85 backdrop-blur-sm py-2.5'}`}>
        {/* Top announcement strip */}
        <div className="bg-gradient-to-r from-[#7B1E3A] via-[#5A1028] to-[#7B1E3A] text-white text-center py-1.5 text-xs tracking-wider font-light hidden md:block border-b border-[#D4AF37]/20">
          ✨ Free Shipping on orders above ₹2,999 | Use code <span className="font-semibold text-[#D4AF37] px-1 bg-white/10 rounded">SAREE10</span> for 10% off ✨
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 no-underline group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7B1E3A] to-[#D4AF37] flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform" style={{ fontFamily: 'Playfair Display' }}>
              V
            </div>
            <span className="text-xl lg:text-2xl font-bold text-[#7B1E3A] tracking-tight" style={{ fontFamily: 'Playfair Display' }}>
              Vasthra <span className="text-[#D4AF37]">Cotton</span>
            </span>
          </Link>

          {/* Flipkart / Myntra Style Search Box (Desktop) */}
          <div className="hidden lg:flex items-center flex-1 max-w-md xl:max-w-xl mx-6 relative self-center">
            <form onSubmit={handleSearch} className="w-full h-11 bg-[#FFF8F0] hover:bg-[#FFF2E5] focus-within:bg-white focus-within:border-[#7B1E3A] focus-within:ring-2 focus-within:ring-[#7B1E3A]/15 rounded-full border border-[#D4AF37]/40 flex items-center p-1 shadow-inner transition-all duration-200 relative">
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
                className="w-full bg-transparent text-[#4A2C2A] placeholder-[#6B4A48]/60 text-xs xl:text-sm font-normal focus:outline-none h-full border-none pr-2 min-w-0"
              />
              <button
                type="submit"
                aria-label="Submit search"
                className="bg-gradient-to-r from-[#7B1E3A] to-[#9B2E4A] hover:from-[#5A1028] hover:to-[#7B1E3A] text-white text-xs font-semibold px-5 h-8 rounded-full shadow-sm hover:shadow transition-all cursor-pointer border-none flex items-center justify-center flex-shrink-0"
              >
                Search
              </button>
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
                    className="absolute top-[calc(100%+10px)] left-0 right-0 bg-white rounded-2xl shadow-2xl border border-[#D4AF37]/35 p-5 z-[999] max-h-[75vh] sm:max-h-96 overflow-y-auto overscroll-contain scrollbar-thin"
                  >
                    <div className="mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block mb-2.5">✦ Popular & Trending Searches</span>
                      <div className="flex flex-wrap gap-2">
                        {trendingTerms.map((term, idx) => {
                          const isSelected = idx === activeIdx;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => { setSearchQuery(term); setSearchOpen(false); setActiveIdx(-1); navigate(`/search?q=${encodeURIComponent(term)}`); }}
                              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer shadow-2xs leading-normal whitespace-nowrap flex-shrink-0 ${
                                isSelected
                                  ? 'bg-[#7B1E3A] text-white border-[#7B1E3A] shadow-md scale-[1.02]'
                                  : 'bg-[#FFF8F0] hover:bg-[#E8C94A] hover:text-[#4A2C2A] text-[#7B1E3A] border-[#D4AF37]/30 hover:border-[#D4AF37]'
                              }`}
                            >
                              <FiSearch size={13} className={isSelected ? 'text-[#D4AF37]' : 'opacity-70'} />
                              <span>{term}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="border-t border-[#D4AF37]/20 pt-4 mt-4">
                      <div className="flex items-center justify-between mb-3">
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
                      <div className="space-y-1.5">
                        {recentTerms.map((recent, idx) => {
                          const isSelected = (idx + trendingTerms.length) === activeIdx;
                          return (
                            <div
                              key={idx}
                              onClick={() => { setSearchQuery(recent); setSearchOpen(false); setActiveIdx(-1); navigate(`/search?q=${encodeURIComponent(recent)}`); }}
                              className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs cursor-pointer transition-all border group/item ${
                                isSelected
                                  ? 'bg-[#FFF8F0] text-[#7B1E3A] font-bold border-[#D4AF37]/40 shadow-xs'
                                  : 'text-[#4A2C2A] hover:bg-[#FFF8F0] hover:text-[#7B1E3A] border-transparent hover:border-[#D4AF37]/20'
                              }`}
                            >
                              <span className="flex items-center gap-2.5 font-medium min-w-0 truncate pr-2">
                                <span className="w-6 h-6 rounded-full bg-[#FFF8F0] group-hover/item:bg-white text-[#D4AF37] flex items-center justify-center flex-shrink-0 text-xs shadow-2xs">🕒</span>
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
          <div className="hidden lg:flex items-center gap-5 xl:gap-7">
            {navLinks.map(link => {
              const active = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path.split('?')[0]) && link.path !== '/');
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors relative group no-underline py-1 ${active ? 'text-[#7B1E3A] font-semibold' : 'text-[#4A2C2A] hover:text-[#7B1E3A]'}`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-[#D4AF37] transition-all duration-300 rounded-full ${active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Search toggle (Mobile only) */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Toggle search bar"
              className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#FFF8F0] transition-colors text-[#4A2C2A] cursor-pointer bg-transparent border-none"
            >
              <FiSearch size={19} />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#FFF8F0] transition-colors text-[#4A2C2A] no-underline"
            >
              <FiHeart size={19} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#7B1E3A] text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-sm">
                  {wishlist.length > 9 ? '9+' : wishlist.length}
                </span>
              )}
            </Link>

            {/* Login / Profile */}
            {user ? (
              <Link
                to={getDashboardPath()}
                className="btn-golden !py-2 !px-4 !min-h-[38px] !text-xs hidden sm:inline-flex no-underline shadow-sm"
              >
                <FiGrid size={15} /> <span className="max-w-[100px] truncate">{user.name?.split(' ')[0] || 'Dashboard'}</span>
              </Link>
            ) : (
              <Link
                to="/portal"
                className="btn-golden !py-2 !px-5 !min-h-[38px] !text-xs hidden sm:inline-flex no-underline shadow-sm"
              >
                <FiUser size={15} /> Login
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
              className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#FFF8F0] transition-colors text-[#4A2C2A] cursor-pointer bg-transparent border-none"
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Search Bar dropdown (Mobile only) */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="lg:hidden border-t border-[#D4AF37]/20 overflow-hidden bg-white/95 backdrop-blur-md shadow-2xl px-4 py-5 z-[999]"
            >
              <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex items-center bg-[#FFF8F0] focus-within:bg-white focus-within:border-[#7B1E3A] focus-within:ring-2 focus-within:ring-[#7B1E3A]/15 rounded-full border border-[#D4AF37]/40 p-1 mb-5 shadow-inner">
                <div className="flex items-center justify-center text-[#6B4A48]/70 pl-3 pr-2 flex-shrink-0">
                  <FiSearch size={18} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search Kanjivaram, Banarasi, Silk..."
                  className="w-full bg-transparent text-[#4A2C2A] placeholder-[#6B4A48]/60 text-xs sm:text-sm font-normal focus:outline-none h-8 border-none pr-2 min-w-0"
                  autoFocus
                />
                <button type="submit" className="bg-gradient-to-r from-[#7B1E3A] to-[#9B2E4A] text-white text-xs font-semibold px-5 h-8 rounded-full shadow-sm hover:shadow transition-all cursor-pointer border-none flex items-center justify-center flex-shrink-0">
                  Search
                </button>
              </form>
              <div className="space-y-5 max-w-3xl mx-auto max-h-[65vh] overflow-y-auto pr-1">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block mb-2.5">✦ Popular & Trending Searches</span>
                  <div className="flex flex-wrap gap-2">
                    {trendingTerms.map((term, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => { setSearchQuery(term); setSearchOpen(false); navigate(`/search?q=${encodeURIComponent(term)}`); }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF8F0] hover:bg-[#E8C94A] hover:text-[#4A2C2A] text-[#7B1E3A] text-xs font-medium border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all cursor-pointer shadow-2xs leading-normal whitespace-nowrap flex-shrink-0"
                      >
                        <FiSearch size={13} className="opacity-70" /> <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="border-t border-[#D4AF37]/20 pt-4">
                  <div className="flex items-center justify-between mb-3">
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
                  <div className="space-y-1.5">
                    {recentTerms.map((recent, idx) => (
                      <div
                        key={idx}
                        onClick={() => { setSearchQuery(recent); setSearchOpen(false); navigate(`/search?q=${encodeURIComponent(recent)}`); }}
                        className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[#FFF8F0] text-xs text-[#4A2C2A] cursor-pointer transition-all border border-transparent hover:border-[#D4AF37]/20"
                      >
                        <span className="flex items-center gap-2 font-medium min-w-0 truncate pr-2">
                          <span className="w-6 h-6 rounded-full bg-[#FFF8F0] text-[#D4AF37] flex items-center justify-center flex-shrink-0 text-xs">🕒</span>
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
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
              className="fixed top-0 right-0 w-72 h-full bg-white z-50 shadow-2xl lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-[#D4AF37]/20 bg-[#FFF8F0]">
                <span className="text-lg font-bold text-[#7B1E3A]" style={{ fontFamily: 'Playfair Display' }}>
                  Navigation
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center cursor-pointer border border-[#D4AF37]/20 text-[#4A2C2A]"
                >
                  <FiX size={18} />
                </button>
              </div>

              <div className="flex flex-col p-4 gap-1 overflow-y-auto flex-1">
                {navLinks.map(link => {
                  const active = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={`py-3 px-4 rounded-xl transition-all text-sm font-medium no-underline flex items-center justify-between ${active ? 'bg-[#7B1E3A] text-white font-semibold shadow-sm' : 'text-[#4A2C2A] hover:bg-[#FFF8F0] hover:text-[#7B1E3A]'}`}
                    >
                      {link.name}
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />}
                    </Link>
                  );
                })}
              </div>

              <div className="p-5 border-t border-[#D4AF37]/20 bg-[#FFF8F0]/50 mt-auto">
                {user ? (
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setMobileOpen(false)}
                    className="btn-golden w-full justify-center no-underline shadow-md"
                  >
                    <FiGrid size={16} /> Dashboard ({role})
                  </Link>
                ) : (
                  <Link
                    to="/portal"
                    onClick={() => setMobileOpen(false)}
                    className="btn-golden w-full justify-center no-underline shadow-md"
                  >
                    <FiUser size={16} /> Login / Register
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed nav */}
      <div className="h-16 lg:h-18 md:mt-7" />
    </>
  );
}

