import { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiHeart, FiPackage, FiUser, FiLogOut, FiCheckCircle, FiShoppingBag } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const links = [
  { name: 'Home', path: '/', icon: <FiHome className="w-6 h-6 sm:w-8 sm:h-8" /> },
  { name: 'Shops', path: '/shops', icon: <FiShoppingBag className="w-6 h-6 sm:w-8 sm:h-8" /> },
  { name: 'Wishlist', path: '/wishlist', icon: <FiHeart className="w-6 h-6 sm:w-8 sm:h-8" /> },
  { name: 'Orders', path: '/user/orders', icon: <FiPackage className="w-6 h-6 sm:w-8 sm:h-8" /> },
  { name: 'Profile', path: '/user/profile', icon: <FiUser className="w-6 h-6 sm:w-8 sm:h-8" /> },
];

export default function UserLayout() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [confirmingLogout, setConfirmingLogout] = useState(false);

  const welcomeCardRef = useRef(null);
  const navRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current.offsetHeight);
    }
  }, [isSticky]);

  useEffect(() => {
    const el = welcomeCardRef.current;
    if (!el) return;

    const getOffset = () => {
      if (window.innerWidth >= 1024) return 76;
      if (window.innerWidth >= 640) return 72;
      return 64;
    };

    let observer = null;
    const setupObserver = () => {
      if (observer) observer.disconnect();
      const offset = getOffset();
      observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (!entry.isIntersecting && entry.boundingClientRect.bottom <= offset) {
            setIsSticky(true);
          } else {
            setIsSticky(false);
          }
        },
        {
          root: null,
          rootMargin: `-${offset}px 0px 0px 0px`,
          threshold: 0,
        }
      );
      observer.observe(el);
    };

    setupObserver();
    window.addEventListener('resize', setupObserver);

    const handleScroll = () => {
      if (!welcomeCardRef.current) return;
      const rect = welcomeCardRef.current.getBoundingClientRect();
      const offset = getOffset();
      if (rect.bottom <= offset) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('resize', setupObserver);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    if (!confirmingLogout) {
      setConfirmingLogout(true);
      setTimeout(() => setConfirmingLogout(false), 4000);
      return;
    }
    logout();
    navigate('/');
  };

  const isLinkActive = (currentPath, linkPath) => {
    if (linkPath === '/') {
      return currentPath === '/' || currentPath === '/user/dashboard' || currentPath.startsWith('/product') || currentPath.startsWith('/search') || currentPath.startsWith('/categor');
    }
    if (linkPath === '/shops') {
      return currentPath.startsWith('/shop') || currentPath.startsWith('/store');
    }
    if (linkPath === '/wishlist') {
      return currentPath === '/wishlist';
    }
    if (linkPath === '/user/orders') {
      return currentPath.startsWith('/user/orders') || currentPath === '/order-summary' || currentPath === '/order-confirmation';
    }
    if (linkPath === '/user/profile') {
      return currentPath.startsWith('/user/profile') ||
             currentPath.startsWith('/user/orders') ||
             currentPath === '/user/address' ||
             currentPath === '/user/notifications' ||
             currentPath === '/user/settings';
    }
    return currentPath === linkPath;
  };

  const isDashboardRoute = pathname.startsWith('/user');


  return (
    <div className={isDashboardRoute ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-28 sm:pt-8 sm:pb-32 lg:py-10 w-full overflow-visible" : "w-full pb-20 lg:pb-0"}>
      {/* Logged-in User Account Status & Identity Header */}
      {isDashboardRoute && (
        <div ref={welcomeCardRef} className="bg-gradient-to-r from-[#7B1E3A] via-[#5A1028] to-[#4A2C2A] rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 mb-6 sm:mb-8 text-white border-2 border-[#D4AF37]/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 border-2 border-[#D4AF37] flex items-center justify-center text-2xl sm:text-3xl font-bold text-[#D4AF37] shadow-inner flex-shrink-0" style={{ fontFamily: 'Playfair Display' }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : '✦'}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-[#D4AF37] bg-black/20 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
                  ✦ {user?.tier || 'Connoisseur'} Member
                </span>
                <span className="text-[10px] sm:text-xs text-[#2D8F5E] font-bold bg-white/95 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2D8F5E] animate-pulse"></span>
                  Authenticated Session
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white m-0 leading-tight" style={{ fontFamily: 'Playfair Display' }}>
                Welcome, {user?.name || 'Saree Connoisseur'}
              </h1>
              <p className="text-xs sm:text-sm text-white/75 m-0 mt-0.5 font-light">
                {user?.email || 'Active Account'} {user?.phone ? `· ${user.phone}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white/15 text-xs text-white/90 w-full md:w-auto justify-between md:justify-start">
            <span className="text-[#D4AF37] font-bold flex items-center gap-1.5">
              <FiCheckCircle size={14} /> Silk Mark Verified Access
            </span>
            <span className="bg-[#D4AF37] text-[#4A2C2A] font-bold px-2 py-0.5 rounded text-[10px] uppercase">Active</span>
          </div>
        </div>
      )}

      {/* Persistent User Dashboard Navigation Strip (Desktop Only: lg and above) */}
      {isDashboardRoute && isSticky && (
        <div
          style={{ height: navHeight > 0 ? `${navHeight}px` : '104px' }}
          className="hidden lg:block w-full mb-6 sm:mb-8"
          aria-hidden="true"
        />
      )}
      {isDashboardRoute && (
        <div
          ref={navRef}
          className={
            isSticky
              ? 'hidden lg:block fixed top-[64px] sm:top-[72px] lg:top-[76px] left-0 right-0 z-40 bg-white border-b-2 border-[#D4AF37]/30 shadow-lg'
              : 'hidden lg:block w-full z-40 bg-white border-2 border-[#D4AF37]/30 shadow-lg rounded-2xl sm:rounded-3xl mb-6 sm:mb-8'
          }
        >
          <div className={isSticky ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6' : 'py-4 sm:py-6 px-4 sm:px-6'}>
            <div className="flex items-stretch justify-between gap-3 sm:gap-5 lg:gap-6 overflow-x-auto pb-2 sm:pb-0 scrollbar-hidden w-full">
              {links.map(l => {
                const isActive = isLinkActive(pathname, l.path);
                return (
                  <Link
                    key={l.name}
                    to={l.path}
                    onClick={() => { if (confirmingLogout) setConfirmingLogout(false); }}
                    className={`flex-1 min-w-[75px] sm:min-w-[120px] flex flex-col items-center justify-center gap-2.5 sm:gap-3 py-4 sm:py-5 px-3.5 sm:px-5 rounded-2xl transition-all no-underline text-center select-none ${
                      isActive
                        ? 'bg-[#7B1E3A] text-white border-2 border-[#D4AF37] shadow-md sm:shadow-lg scale-[1.02]'
                        : 'bg-[#FFF8F0]/70 hover:bg-[#FFF8F0] text-[#7B1E3A] border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:shadow-md'
                    }`}
                  >
                    <div className={`flex items-center justify-center ${isActive ? 'text-[#D4AF37]' : 'text-[#7B1E3A]'}`}>
                      {l.icon}
                    </div>
                    <span className="text-xs sm:text-base font-bold tracking-tight whitespace-nowrap">
                      {l.name}
                    </span>
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className={`flex-1 min-w-[75px] sm:min-w-[120px] flex flex-col items-center justify-center gap-2.5 sm:gap-3 py-4 sm:py-5 px-3.5 sm:px-5 rounded-2xl transition-all cursor-pointer text-center select-none ${
                  confirmingLogout
                    ? 'bg-red-600 text-white border-2 border-red-700 shadow-lg scale-[1.02]'
                    : 'bg-red-50/80 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-400 hover:shadow-md'
                }`}
              >
                <div className={`flex items-center justify-center ${confirmingLogout ? 'text-white' : 'text-red-600'}`}>
                  <FiLogOut className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <span className="text-xs sm:text-base font-bold tracking-tight whitespace-nowrap">
                  {confirmingLogout ? 'Confirm?' : 'Logout'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Content Area (Moved up so it's above the fixed bottom nav) */}
      <div className="w-full">
        <Outlet />
      </div>

      {/* Fixed Bottom Navigation Strip for Mobile & Tablet (< lg) */}
      <div
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-[#D4AF37]/30 shadow-[0_-4px_20px_rgba(0,0,0,0.12)] px-2 sm:px-4 pt-2 sm:pt-2.5 flex items-stretch justify-between gap-1 sm:gap-2 overflow-x-auto"
      >
        {links.map(l => {
          const isActive = isLinkActive(pathname, l.path);
          return (
            <Link
              key={l.name}
              to={l.path}
              onClick={() => { if (confirmingLogout) setConfirmingLogout(false); }}
              className={`flex-1 min-w-[62px] sm:min-w-[75px] flex flex-col items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 sm:px-2 rounded-xl transition-all no-underline text-center select-none ${
                isActive
                  ? 'bg-[#7B1E3A] text-white border border-[#D4AF37] shadow-sm scale-[1.02]'
                  : 'bg-[#FFF8F0]/70 hover:bg-[#FFF8F0] text-[#7B1E3A] border border-[#D4AF37]/30 hover:border-[#D4AF37]'
              }`}
            >
              <div className={`flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6 ${isActive ? 'text-[#D4AF37]' : 'text-[#7B1E3A]'}`}>
                {l.icon}
              </div>
              <span className="text-[11px] sm:text-xs font-bold tracking-tight whitespace-nowrap leading-none">
                {l.name}
              </span>
            </Link>
          );
        })}
        {user && (
          <button
            onClick={handleLogout}
            className={`flex-1 min-w-[62px] sm:min-w-[75px] flex flex-col items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 sm:px-2 rounded-xl transition-all cursor-pointer text-center select-none ${
              confirmingLogout
                ? 'bg-red-600 text-white border border-red-700 shadow-sm scale-[1.02]'
                : 'bg-red-50/80 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-400'
            }`}
          >
            <div className={`flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6 ${confirmingLogout ? 'text-white' : 'text-red-600'}`}>
              <FiLogOut />
            </div>
            <span className="text-[11px] sm:text-xs font-bold tracking-tight whitespace-nowrap leading-none">
              {confirmingLogout ? 'Confirm?' : 'Logout'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
