import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck } from 'react-icons/fi';

export default function NativeSelectModal({ isOpen, onClose, title, options, value, onChange }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg sm:max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#D4AF37]/20 bg-[#FFF8F0]">
            <h3 className="text-xl sm:text-2xl font-bold text-[#7B1E3A] m-0 leading-tight" style={{ fontFamily: 'Playfair Display' }}>
              Select {title}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#4A2C2A] hover:bg-[#E8C94A] transition-colors border border-[#D4AF37]/30 shadow-sm flex-shrink-0"
              aria-label="Close dialog"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Options List */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-3">
            {options.map((opt) => {
              const isSelected = value === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 min-h-[64px] rounded-xl text-left transition-all border ${
                    isSelected
                      ? 'bg-[#7B1E3A] text-white border-[#7B1E3A] shadow-md'
                      : 'bg-transparent text-[#4A2C2A] border-[#D4AF37]/20 hover:border-[#D4AF37]/60 hover:bg-[#FFF8F0]'
                  }`}
                >
                  <span className={`text-[18px] sm:text-[20px] leading-snug flex-1 pr-4 ${isSelected ? 'font-bold' : 'font-medium'}`}>
                    {opt}
                  </span>
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-[3px] flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected ? 'border-white bg-white/20' : 'border-[#D4AF37]/50'
                    }`}
                  >
                    {isSelected && <FiCheck size={18} className="text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
