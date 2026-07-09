import { Link, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiHome } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function BreadcrumbBack({ items, title }) {
  const location = useLocation();
  const { user, role } = useAuth();

  const getHomePath = () => {
    if (!user) return '/';
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'shopkeeper') return '/shopkeeper/dashboard';
    return '/user/dashboard';
  };

  // Generate breadcrumbs if items not explicitly provided

  const getBreadcrumbs = () => {
    if (items) return items;

    if (location.pathname === '/user/dashboard') {
      return []; // Displays just Home
    }
    if (location.pathname === '/admin/dashboard') {
      return [{ label: 'Admin Dashboard', path: '/admin/dashboard' }];
    }
    if (location.pathname === '/shopkeeper/dashboard') {
      return [{ label: 'Shop Dashboard', path: '/shopkeeper/dashboard' }];
    }

    const parts = location.pathname.split('/').filter(Boolean);
    const result = [];
    parts.forEach((part, index, arr) => {
      // Remove generic role names such as User, Customer, Member
      if (['user', 'customer', 'member'].includes(part.toLowerCase())) {
        return;
      }
      const path = '/' + arr.slice(0, index + 1).join('/');
      let label = part.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      if (label === 'Shopkeeper') label = 'Shop';
      result.push({ label, path });
    });
    return result;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div
      style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', width: '100%', overflowX: 'auto' }}
      className="flex flex-row flex-nowrap items-center gap-2.5 sm:gap-3.5 mb-4 sm:mb-6 pb-2.5 sm:pb-3 border-b border-[#D4AF37]/20 w-full overflow-x-auto scrollbar-hidden whitespace-nowrap"
    >
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        style={{ width: 'auto', flexShrink: 0, display: 'inline-flex', alignItems: 'center' }}
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#7B1E3A] bg-[#FFF8F0] hover:bg-[#D4AF37] hover:text-white px-3 py-1.5 rounded-xl border border-[#D4AF37]/35 transition-all cursor-pointer shadow-xs flex-shrink-0 whitespace-nowrap !w-auto"
      >
        <FiArrowLeft size={15} className="flex-shrink-0" /> <span>Back</span>
      </button>

      {/* Vertical Divider */}
      <span
        style={{ width: 'auto', flexShrink: 0, display: 'inline-block' }}
        className="text-[#D4AF37]/60 font-light text-sm flex-shrink-0 select-none !w-auto mx-0.5"
      >
        |
      </span>

      {/* Breadcrumb Navigation Row */}
      <div
        aria-label="Breadcrumb"
        role="navigation"
        style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', width: 'auto' }}
        className="breadcrumb-row !flex !flex-row !flex-nowrap !items-center !gap-2 text-xs sm:text-sm text-[#6B4A48] !w-auto whitespace-nowrap"
      >
        <Link
          to={getHomePath()}
          style={{ width: 'auto', flexShrink: 0, display: 'inline-flex', alignItems: 'center' }}
          className="inline-flex items-center gap-1 text-[#6B4A48] hover:text-[#7B1E3A] font-medium transition-colors no-underline flex-shrink-0 whitespace-nowrap !w-auto"
        >
          <FiHome size={13} className="flex-shrink-0" /> <span>Home</span>
        </Link>

        {breadcrumbs.map((bc, idx) => (
          <div
            key={idx}
            style={{ width: 'auto', flexShrink: 0, display: 'inline-flex', alignItems: 'center' }}
            className="inline-flex items-center gap-2 flex-nowrap whitespace-nowrap flex-shrink-0 !w-auto"
          >
            <span
              style={{ width: 'auto', flexShrink: 0, display: 'inline-block' }}
              className="text-[#D4AF37] font-bold text-xs sm:text-sm flex-shrink-0 select-none !w-auto"
            >
              &gt;
            </span>
            {idx === breadcrumbs.length - 1 ? (
              <span
                style={{ width: 'auto', flexShrink: 0, display: 'inline-block' }}
                className="font-bold text-[#7B1E3A] whitespace-nowrap flex-shrink-0 !w-auto"
              >
                {title || bc.label}
              </span>
            ) : (
              <Link
                to={bc.path || '#'}
                style={{ width: 'auto', flexShrink: 0, display: 'inline-block' }}
                className="text-[#6B4A48] hover:text-[#7B1E3A] font-medium transition-colors no-underline whitespace-nowrap flex-shrink-0 !w-auto"
              >
                {bc.label}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
