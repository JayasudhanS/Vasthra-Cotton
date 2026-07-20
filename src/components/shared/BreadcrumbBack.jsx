import { FiArrowLeft } from 'react-icons/fi';

export default function BreadcrumbBack() {
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
    </div>
  );
}
