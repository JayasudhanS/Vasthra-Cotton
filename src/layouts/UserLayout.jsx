import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FiHome, FiGrid, FiHeart, FiPackage, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const links = [
  { name: 'Home', path: '/user/dashboard', icon: <FiHome size={18} /> },
  { name: 'Categories', path: '/categories', icon: <FiGrid size={18} /> },
  { name: 'Wishlist', path: '/wishlist', icon: <FiHeart size={18} /> },
  { name: 'Orders', path: '/user/orders', icon: <FiPackage size={18} /> },
  { name: 'Profile', path: '/user/profile', icon: <FiUser size={18} /> },
];

export default function UserLayout() {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      {/* Top nav for user */}
      <div className="flex items-center gap-2.5 mb-8 overflow-x-auto pb-2 scrollbar-hidden">
        {links.map(l => (
          <Link key={l.name} to={l.path}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all no-underline shadow-xs border ${pathname === l.path ? 'bg-[#7B1E3A] text-white border-[#7B1E3A] shadow-md' : 'bg-white text-[#4A2C2A] hover:bg-[#FFF8F0] border-[#D4AF37]/25 hover:border-[#D4AF37]'}`}>
            {l.icon} {l.name}
          </Link>
        ))}
        <button onClick={() => { logout(); }} className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-white text-red-500 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer border border-red-200 ml-auto shadow-xs">
          <FiLogOut size={18} /> Logout
        </button>
      </div>
      <Outlet />
    </div>
  );
}

