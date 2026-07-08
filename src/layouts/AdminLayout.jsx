import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiClock, FiPackage, FiCheck, FiUsers, FiSettings, FiLogOut, FiShoppingBag, FiList } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const links = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: <FiGrid size={18} /> },
  { name: 'Orders', path: '/admin/orders', icon: <FiList size={18} /> },
  { name: 'Pending Shops', path: '/admin/pending-shops', icon: <FiClock size={18} /> },
  { name: 'Pending Products', path: '/admin/pending-products', icon: <FiPackage size={18} /> },
  { name: 'Approved Products', path: '/admin/approved-products', icon: <FiCheck size={18} /> },
  { name: 'Users', path: '/admin/users', icon: <FiUsers size={18} /> },
  { name: 'Categories', path: '/admin/categories', icon: <FiShoppingBag size={18} /> },
  { name: 'Settings', path: '/admin/settings', icon: <FiSettings size={18} /> },
];

export default function AdminLayout() {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      <aside className="hidden lg:flex flex-col w-[260px] bg-gradient-to-b from-[#4A2C2A] to-[#2D1A19] p-5 sticky top-[100px] h-[calc(100vh-100px)] overflow-y-auto">
        <div className="mb-6 px-3">
          <p className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">Admin Panel</p>
        </div>
        <nav className="space-y-1 flex-1">
          {links.map(l => (
            <Link key={l.name} to={l.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all no-underline ${pathname === l.path ? 'bg-[#D4AF37] text-[#4A2C2A]' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
              {l.icon} {l.name}
            </Link>
          ))}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-300 hover:bg-red-900/30 cursor-pointer bg-transparent border border-transparent hover:border-red-400/40 w-full mt-4">
          <FiLogOut size={18} /> Logout
        </button>
      </aside>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#4A2C2A] z-40 flex justify-around items-center px-2 py-2 gap-1 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] overflow-x-auto">
        {links.slice(0, 4).map(l => (
          <Link key={l.name} to={l.path}
            className={`flex flex-col items-center px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all no-underline flex-shrink-0 ${pathname === l.path ? 'text-[#D4AF37]' : 'text-white/60'}`}>
            {l.icon}
            <span className="mt-0.5">{l.name}</span>
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all flex-shrink-0 text-red-300 hover:bg-red-900/30 cursor-pointer bg-transparent border border-transparent"
        >
          <FiLogOut size={18} />
          <span className="mt-0.5">Logout</span>
        </button>
      </div>

      <main className="flex-1 p-5 sm:p-6 lg:p-10 pb-24 lg:pb-10 bg-[#FFF8F0]">
        <Outlet />
      </main>
    </div>
  );
}
