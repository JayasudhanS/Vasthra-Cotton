import { motion } from 'framer-motion';
import { FiShoppingCart, FiTrash2, FiArrowRight, FiMinus, FiPlus, FiChevronLeft } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  const deliveryCharge = cart.length > 0 ? 30 : 0;
  const estimatedTotal = cartTotal + deliveryCharge;

  const handleCheckout = () => {
    // Navigate to order summary or checkout with cart items
    // Since there's an existing OrderSummaryPage that takes a product, we'll adapt or just pass the cart
    navigate('/order-summary', { state: { fromCart: true, cart, cartTotal, deliveryCharge, estimatedTotal } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#D4AF37]/20 mb-8 gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">✦ Your Selections</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0 flex items-center gap-2.5" style={{ fontFamily: 'Playfair Display' }}>
            <FiShoppingCart className="text-[#D4AF37] fill-[#D4AF37]" /> Shopping Cart
          </h1>
        </div>
        {cart.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="badge badge-warning !text-xs font-bold px-3.5 py-1.5">
              {cartCount} Items
            </span>
            <button onClick={clearCart} className="text-xs text-red-500 hover:text-red-700 font-semibold underline cursor-pointer bg-transparent border-none p-0">
              Clear Cart
            </button>
          </div>
        )}
      </div>

      {cart.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card-base text-center py-20 px-6 max-w-lg mx-auto bg-white border-dashed">
          <div className="w-20 h-20 rounded-full bg-[#7B1E3A]/10 text-[#7B1E3A] flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner">
            <FiShoppingCart />
          </div>
          <h2 className="text-2xl text-[#7B1E3A] font-bold mb-2" style={{ fontFamily: 'Playfair Display' }}>
            Your Cart is Empty
          </h2>
          <p className="text-sm text-[#6B4A48] mb-8 font-light leading-relaxed">
            Looks like you haven't added any beautiful weaves to your cart yet. Explore our collections and find your perfect saree.
          </p>
          <Link to="/products" className="btn-golden !py-3 !px-8 !text-xs no-underline shadow-md inline-flex items-center gap-2">
            Continue Shopping <FiArrowRight />
          </Link>
        </motion.div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          
          {/* Cart Items List */}
          <div className="w-full lg:w-2/3 flex flex-col gap-5">
            {cart.map((product, i) => (
              <motion.div 
                key={product.id} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.05 }}
                className="card-base bg-white border border-[#D4AF37]/20 shadow-sm hover:shadow-md transition-all duration-300 p-4 sm:p-5 flex flex-col sm:flex-row gap-5 relative group"
              >
                {/* Image */}
                <Link to={`/product/${product.id}`} className="block w-full sm:w-32 aspect-[4/5] sm:aspect-square overflow-hidden relative bg-[#FFF8F0] rounded-xl flex-shrink-0">
                  <img src={product.image || product.images?.[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                </Link>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 pr-8 sm:pr-0">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold mb-1 block">{product.shopName}</p>
                        <Link to={`/product/${product.id}`} className="text-lg font-bold text-[#7B1E3A] hover:text-[#D4AF37] transition-colors no-underline line-clamp-1 block mb-2" style={{ fontFamily: 'Playfair Display' }}>
                          {product.name}
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl font-bold text-[#7B1E3A]">₹{(product.offerPrice || product.price).toLocaleString()}</span>
                      {product.offerPrice && product.offerPrice < product.price && (
                        <span className="text-sm text-[#6B4A48] line-through font-light">₹{product.price.toLocaleString()}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions & Quantity */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center bg-[#FFF8F0] border border-[#D4AF37]/30 rounded-lg overflow-hidden h-9">
                      <button 
                        onClick={() => updateQuantity(product.id, product.quantity - 1)}
                        className="w-9 h-full flex items-center justify-center text-[#7B1E3A] hover:bg-[#D4AF37]/20 transition-colors cursor-pointer border-none bg-transparent"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="w-10 h-full flex items-center justify-center text-sm font-bold text-[#4A2C2A] border-x border-[#D4AF37]/20">
                        {product.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(product.id, product.quantity + 1)}
                        className="w-9 h-full flex items-center justify-center text-[#7B1E3A] hover:bg-[#D4AF37]/20 transition-colors cursor-pointer border-none bg-transparent"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeFromCart(product.id)} 
                      title="Remove from cart"
                      className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 w-9 h-9 rounded-lg flex items-center justify-center border border-red-200 text-red-500 hover:bg-red-500 hover:text-white cursor-pointer bg-red-50/50 transition-all shadow-sm"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="card-base bg-white border border-[#D4AF37]/20 shadow-md p-6 lg:sticky lg:top-[100px]">
              <h3 className="text-xl font-bold text-[#7B1E3A] mb-5 border-b border-[#D4AF37]/20 pb-4" style={{ fontFamily: 'Playfair Display' }}>
                Order Summary
              </h3>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-[#6B4A48]">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="font-semibold text-[#4A2C2A]">₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#6B4A48]">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-[#4A2C2A]">₹{deliveryCharge.toLocaleString()}</span>
                </div>
                {/* Optional: Add discount row if needed */}
              </div>

              <div className="border-t border-[#D4AF37]/20 pt-4 mb-8 flex justify-between items-end">
                <div>
                  <span className="block text-xs uppercase tracking-widest text-[#D4AF37] font-bold mb-1">Estimated Total</span>
                  <span className="text-2xl font-bold text-[#7B1E3A]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, letterSpacing: 'normal' }}>
                    ₹{estimatedTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleCheckout}
                  className="btn-maroon w-full !py-3.5 !text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  Proceed to Checkout <FiArrowRight size={16} />
                </button>
                <Link to="/products" className="btn-outline-gold w-full !py-3.5 !text-sm flex items-center justify-center gap-2 no-underline text-center">
                  <FiChevronLeft size={16} /> Continue Shopping
                </Link>
              </div>

              <div className="mt-6 flex items-center justify-center gap-4 border-t border-[#D4AF37]/10 pt-5">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-[#4A2C2A] uppercase">100% Secure</span>
                  <span className="text-[9px] text-[#6B4A48]">Checkout</span>
                </div>
                <div className="w-px h-6 bg-[#D4AF37]/20"></div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-[#4A2C2A] uppercase">Quality</span>
                  <span className="text-[9px] text-[#6B4A48]">Guaranteed</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
