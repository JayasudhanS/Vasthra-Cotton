import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function WaitingApproval() {
  const navigate = useNavigate();

  return (
    <section className="min-h-[88vh] flex items-center justify-center py-16 px-4 bg-[#FFF8F0]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[580px] bg-white rounded-2xl p-8 sm:p-12 shadow-xl border border-[#D4AF37]/35 mx-auto text-center"
      >
        <div className="w-20 h-20 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center mx-auto mb-6 text-green-600 shadow-sm">
          <FiCheck size={44} strokeWidth={2.5} />
        </div>

        <h1 className="text-[26px] sm:text-[28px] lg:text-[32px] font-bold text-[#7B1E3A] m-0 mb-4 leading-tight" style={{ fontFamily: 'Playfair Display' }}>
          Registration Successful
        </h1>

        <div className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-300 text-amber-800 font-semibold text-[15px] shadow-xs">
            <span>⏳</span>
            <span>Pending Admin Verification</span>
          </span>
        </div>

        <div className="text-[16px] sm:text-[17px] text-[#6B4A48] leading-relaxed space-y-3 mb-8">
          <p className="m-0">
            Your shop registration has been submitted successfully.
          </p>
          <p className="m-0">
            Your application is currently under review by our Admin team.
          </p>
          <p className="m-0 text-[#7B1E3A] font-medium">
            Please wait until your shop has been approved before accessing the Shop Dashboard.
          </p>
        </div>

        <div className="bg-[#FFF8F0] border border-[#D4AF37]/50 rounded-xl p-6 text-left space-y-3 mx-auto max-w-md shadow-sm mb-8">
          <h3 className="text-[#7B1E3A] font-bold text-[17px] m-0 mb-3">Current Status:</h3>
          <ul className="space-y-3 m-0 p-0 list-none text-[15px] sm:text-[16px] text-[#4A2C2A]">
            <li className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs flex-shrink-0">⏳</span>
              <span className="font-semibold text-amber-800">Pending Approval</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/login/shopkeeper', { state: { fromSuccess: true } })}
            style={{ height: '54px' }}
            className="w-full rounded-[12px] bg-gradient-to-r from-[#D4AF37] to-[#E8C94A] hover:from-[#E8C94A] hover:to-[#D4AF37] text-[#4A2C2A] text-[18px] font-bold cursor-pointer shadow-md hover:shadow-lg transition-all flex items-center justify-center"
          >
            Go to Login
          </button>
        </div>
      </motion.div>
    </section>
  );
}
