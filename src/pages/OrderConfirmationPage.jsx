import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiShoppingBag, FiList } from 'react-icons/fi';

export default function OrderConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const productName = location.state?.productName || 'Your saree';
  const total = location.state?.total || 0;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF8F0]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-lg w-full text-center card-base p-10 sm:p-14 bg-white border-2 border-[#D4AF37]/30 shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-[#2D8F5E]/15 text-[#2D8F5E] flex items-center justify-center mx-auto mb-6"
        >
          <FiCheckCircle size={42} />
        </motion.div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] mb-3" style={{ fontFamily: 'Playfair Display' }}>
          Order Placed Successfully
        </h1>

        <p className="text-sm text-[#6B4A48] mb-2 leading-relaxed">
          Thank you for shopping with <span className="font-bold text-[#7B1E3A]">Vasthra Cotton</span>.
        </p>

        <p className="text-sm text-[#6B4A48] mb-2 leading-relaxed">
          Your order has been received successfully.
        </p>

        <p className="text-sm text-[#6B4A48] mb-2 leading-relaxed">
          Our team will contact you shortly to confirm your order details and delivery.
        </p>

        <p className="text-sm text-[#6B4A48] mb-6 leading-relaxed">
          You will receive further updates soon. Thank you for choosing us.
        </p>

        {total > 0 && (
          <div className="bg-[#FFF8F0] rounded-xl p-4 mb-8 border border-[#D4AF37]/20">
            <span className="text-xs text-[#6B4A48] block mb-1">Total Amount</span>
            <span className="text-2xl font-bold text-[#7B1E3A]">₹{total.toLocaleString()}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/products" className="btn-golden !py-3 !px-6 !text-sm no-underline justify-center inline-flex items-center gap-2">
            <FiShoppingBag size={16} /> Continue Shopping
          </Link>
          <Link to="/user/orders" className="btn-outline-gold !py-3 !px-6 !text-sm no-underline justify-center inline-flex items-center gap-2">
            <FiList size={16} /> View Orders
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
