import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiHeart, FiPackage, FiUser, FiLogOut, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import BreadcrumbBack from '../components/shared/BreadcrumbBack';

const links = [
  { name: 'Home', path: '/user/dashboard', icon: <FiHome className="w-6 h-6 sm:w-8 sm:h-8" /> },
  { name: 'Wishlist', path: '/wishlist', icon: <FiHeart className="w-6 h-6 sm:w-8 sm:h-8" /> },
  { name: 'Orders', path: '/user/orders', icon: <FiPackage className="w-6 h-6 sm:w-8 sm:h-8" /> },
  { name: 'Profile', path: '/user/profile', icon: <FiUser className="w-6 h-6 sm:w-8 sm:h-8" /> },
];

export default function UserLayout() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [confirmingLogout, setConfirmingLogout] = useState(false);

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
    if (linkPath === '/user/dashboard') {
      return currentPath === '/user/dashboard' || currentPath === '/user' || currentPath === '/';
    }
    if (linkPath === '/wishlist') {
      return currentPath === '/wishlist';
    }
    if (linkPath === '/user/orders') {
      return currentPath.startsWith('/user/orders') || currentPath === '/order-summary' || currentPath === '/order-confirmation';
    }
    if (linkPath === '/user/profile') {
      return currentPath.startsWith('/user/profile') ||
             currentPath === '/user/address' ||
             currentPath === '/user/notifications' ||
             currentPath === '/user/settings';
    }
    return currentPath === linkPath;
  };

  // Avoid duplicate breadcrumb when inner pages (like Wishlist or Cart) render their own BreadcrumbBack
  const showBreadcrumb = pathname === '/user/dashboard' ||
                         pathname === '/user/orders' ||
                         pathname.startsWith('/user/orders/') ||
                         pathname === '/user/profile';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 w-full">
      {showBreadcrumb && <BreadcrumbBack />}

      {/* Logged-in User Account Status & Identity Header */}
      <div className="bg-gradient-to-r from-[#7B1E3A] via-[#5A1028] to-[#4A2C2A] rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 mb-6 sm:mb-8 text-white border-2 border-[#D4AF37]/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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

      {/* Persistent User Dashboard Navigation Strip */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 border-2 border-[#D4AF37]/30 shadow-lg">
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

      {/* Page Content Area */}
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
}

