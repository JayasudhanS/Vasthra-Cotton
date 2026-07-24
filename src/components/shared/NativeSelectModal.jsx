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
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#D4AF37]/20 bg-[#FFF8F0]">
            <h3 className="text-lg sm:text-xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>
              Select {title}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#4A2C2A] hover:bg-[#E8C94A] transition-colors border border-[#D4AF37]/30 shadow-sm"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Options List */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-2 sm:p-3 space-y-1">
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
                  className={`w-full flex items-center justify-between px-4 py-3.5 sm:py-4 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-[#7B1E3A] text-white shadow-md'
                      : 'bg-transparent text-[#4A2C2A] hover:bg-[#FFF8F0]'
                  }`}
                >
                  <span className={`text-sm sm:text-base font-medium ${isSelected ? 'font-bold' : ''}`}>
                    {opt}
                  </span>
                  <div
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected ? 'border-white bg-white/20' : 'border-[#D4AF37]/50'
                    }`}
                  >
                    {isSelected && <FiCheck size={14} className="text-white" />}
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
