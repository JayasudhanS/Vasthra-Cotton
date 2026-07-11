import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiGrid, FiHeart, FiPackage, FiUser, FiLogOut } from 'react-icons/fi';
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
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      <BreadcrumbBack />
      {/* Top nav for user - Flipkart Category Strip Style */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 border-2 border-[#D4AF37]/30 shadow-lg">
        <div className="flex items-stretch justify-between gap-3 sm:gap-5 lg:gap-6 overflow-x-auto pb-2 sm:pb-0 scrollbar-hidden w-full">
          {links.map(l => {
            const isActive = pathname === l.path;
            return (
              <Link
                key={l.name}
                to={l.path}
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
            className="flex-1 min-w-[75px] sm:min-w-[120px] flex flex-col items-center justify-center gap-2.5 sm:gap-3 py-4 sm:py-5 px-3.5 sm:px-5 rounded-2xl transition-all cursor-pointer bg-red-50/80 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-400 hover:shadow-md text-center select-none"
          >
            <div className="flex items-center justify-center text-red-600">
              <FiLogOut className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <span className="text-xs sm:text-base font-bold tracking-tight whitespace-nowrap">
              Logout
            </span>
          </button>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

