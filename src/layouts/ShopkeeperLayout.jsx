import { Link, Outlet, useLocation } from 'react-router-dom';
import { FiGrid, FiPackage, FiPlusCircle, FiClock, FiCheck, FiXCircle, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const links = [
  { name: 'Dashboard', path: '/shopkeeper/dashboard', icon: <FiGrid size={18} /> },
  { name: 'My Products', path: '/shopkeeper/products', icon: <FiPackage size={18} /> },
  { name: 'Add Product', path: '/shopkeeper/add-product', icon: <FiPlusCircle size={18} /> },
  { name: 'Profile', path: '/shopkeeper/profile', icon: <FiUser size={18} /> },
];

export default function ShopkeeperLayout() {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#D4AF37]/20 p-4 sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto shadow-sm">
        <div className="mb-6 px-3">
          <p className="text-xs uppercase tracking-wider text-[#D4AF37] font-bold">✦ Shopkeeper Panel</p>
        </div>
        <nav className="space-y-1.5 flex-1">
          {links.map(l => (
            <Link key={l.name} to={l.path}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all no-underline ${pathname === l.path ? 'bg-[#7B1E3A] text-white shadow-md' : 'text-[#4A2C2A] hover:bg-[#FFF8F0] hover:text-[#7B1E3A]'}`}>
              {l.icon} {l.name}
            </Link>
          ))}
        </nav>
        <div className="pt-4 border-t border-[#D4AF37]/15 mt-4">
          <button onClick={logout} className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer bg-transparent border border-transparent hover:border-red-200 w-full">
            <FiLogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#D4AF37]/20 z-40 flex overflow-x-auto px-2 py-2 gap-1 shadow-lg">
        {links.slice(0, 5).map(l => (
          <Link key={l.name} to={l.path}
            className={`flex flex-col items-center px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all no-underline flex-shrink-0 ${pathname === l.path ? 'text-[#7B1E3A] bg-[#FFF8F0]' : 'text-[#6B4A48]'}`}>
            {l.icon}
            <span className="mt-0.5">{l.name}</span>
          </Link>
        ))}
      </div>

      {/* Content */}
      <main className="flex-1 p-6 lg:p-8 pb-24 lg:pb-8 bg-[#FFF8F0]/30">
        <Outlet />
      </main>
    </div>
  );
}

