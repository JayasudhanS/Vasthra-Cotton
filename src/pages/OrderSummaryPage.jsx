import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMinus, FiPlus, FiTruck, FiShield, FiArrowLeft } from 'react-icons/fi';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';

export default function OrderSummaryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { placeOrder } = useOrders();
  const { user } = useAuth();
  const product = location.state?.product;
  const shop = location.state?.shop;

  const [quantity, setQuantity] = useState(1);
  const [delivery, setDelivery] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-[#7B1E3A]/10 text-[#7B1E3A] flex items-center justify-center mx-auto mb-6 text-3xl">🛒</div>
        <h2 className="text-2xl font-bold text-[#7B1E3A] mb-3" style={{ fontFamily: 'Playfair Display' }}>No Product Selected</h2>
        <p className="text-sm text-[#6B4A48] mb-6">Please select a product to proceed with your order.</p>
        <button onClick={() => navigate('/products')} className="btn-golden !py-3 !px-8 !text-sm cursor-pointer">Browse Sarees</button>
      </div>
    );
  }

  const subtotal = product.offerPrice * quantity;
  const deliveryCharge = 30;
  const total = subtotal + deliveryCharge;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      await placeOrder({
        productId: product.id,
        productName: product.name,
        productImage: product.image || product.imageUrl || product.thumbnail || '',
        shopId: product.shopId || product.ownerId || '',
        shopName: product.shopName || '',
        shopLogo: shop?.logo || '',
        ownerId: product.ownerId || product.shopId || '',
        price: product.offerPrice,
        quantity,
        fabric: product.fabric || '',
        color: product.color || '',
        customerName: delivery.name,
        customerPhone: delivery.phone,
        customerAddress: `${delivery.address}, ${delivery.city}, ${delivery.state} - ${delivery.pincode}`,
      });
      navigate('/order-confirmation', { state: { productName: product.name, total } });
    } catch (err) {
      console.error('Failed to place order:', err);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 sm:py-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-[#7B1E3A] font-semibold mb-6 bg-transparent border-none cursor-pointer p-0 hover:text-[#D4AF37] transition-colors">
        <FiArrowLeft size={18} /> Back to Product
      </button>

      <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] mb-8" style={{ fontFamily: 'Playfair Display' }}>Order Summary</h1>

      <div className="grid lg:grid-cols-5 gap-8 items-start">
        {/* Product Details */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-3 space-y-6">
          <div className="card-base p-6 sm:p-7 md:p-8 bg-white border border-[#D4AF37]/20">
            <div className="flex gap-5">
              <img src={product.image} alt={product.name} className="w-28 h-36 sm:w-32 sm:h-40 rounded-xl object-cover border border-[#D4AF37]/30 shadow-sm flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4AF37] block mb-1">✦ {product.shopName}</span>
                <h3 className="text-lg font-bold text-[#7B1E3A] m-0 mb-2 leading-tight" style={{ fontFamily: 'Playfair Display' }}>{product.name}</h3>
                <p className="text-xs text-[#6B4A48] m-0 mb-4">{product.fabric} · {product.color}</p>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold text-[#7B1E3A] uppercase tracking-wider">Qty</span>
                  <div className="flex items-center border border-[#D4AF37]/30 rounded-lg overflow-hidden">
                    <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center bg-[#FFF8F0] hover:bg-[#D4AF37]/20 text-[#7B1E3A] cursor-pointer border-none transition-colors"><FiMinus size={14} /></button>
                    <span className="w-10 h-8 flex items-center justify-center text-sm font-bold text-[#7B1E3A] bg-white">{quantity}</span>
                    <button type="button" onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center bg-[#FFF8F0] hover:bg-[#D4AF37]/20 text-[#7B1E3A] cursor-pointer border-none transition-colors"><FiPlus size={14} /></button>
                  </div>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-[#7B1E3A]">₹{product.offerPrice.toLocaleString()}</span>
                  <span className="text-sm text-[#6B4A48] line-through">₹{product.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Form */}
          <form onSubmit={handlePlaceOrder} id="order-form" className="card-base p-6 sm:p-7 md:p-8 bg-white border border-[#D4AF37]/20 space-y-5">
            <h3 className="text-base font-bold text-[#7B1E3A] m-0 uppercase tracking-wider flex items-center gap-2">
              <FiTruck className="text-[#D4AF37]" /> Delivery Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Full Name *</label>
                <input type="text" required value={delivery.name} onChange={e => setDelivery({ ...delivery, name: e.target.value })} placeholder="Enter your full name" className="input-field !h-11 !text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Phone Number *</label>
                <input type="tel" required value={delivery.phone} onChange={e => setDelivery({ ...delivery, phone: e.target.value })} placeholder="+91 98765 43210" className="input-field !h-11 !text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Address *</label>
              <input type="text" required value={delivery.address} onChange={e => setDelivery({ ...delivery, address: e.target.value })} placeholder="House No, Street, Landmark" className="input-field !h-11 !text-sm" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">City *</label>
                <input type="text" required value={delivery.city} onChange={e => setDelivery({ ...delivery, city: e.target.value })} placeholder="City" className="input-field !h-11 !text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">State *</label>
                <input type="text" required value={delivery.state} onChange={e => setDelivery({ ...delivery, state: e.target.value })} placeholder="State" className="input-field !h-11 !text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">PIN Code *</label>
                <input type="text" required value={delivery.pincode} onChange={e => setDelivery({ ...delivery, pincode: e.target.value })} placeholder="600001" className="input-field !h-11 !text-sm" />
              </div>
            </div>
          </form>
        </motion.div>

        {/* Price Summary Sidebar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 lg:sticky lg:top-[110px]">
          <div className="card-base p-6 sm:p-7 md:p-8 bg-white border border-[#D4AF37]/20 space-y-5">
            <h3 className="text-base font-bold text-[#7B1E3A] m-0 uppercase tracking-wider">Price Details</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-[#4A2C2A]">
                <span>Price ({quantity} item{quantity > 1 ? 's' : ''})</span>
                <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#4A2C2A]">
                <span>Delivery Charge</span>
                <span className="font-semibold">₹{deliveryCharge}</span>
              </div>
              <div className="border-t border-[#D4AF37]/20 pt-3 flex justify-between text-[#7B1E3A] font-bold text-lg">
                <span>Total Amount</span>
                <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, letterSpacing: 'normal' }}>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-[#2D8F5E] font-medium bg-[#2D8F5E]/10 p-4 rounded-xl">
              <FiShield size={16} /> Secure Order · No Online Payment Required
            </div>

            <button type="submit" form="order-form" className="btn-golden w-full justify-center !py-3.5 !text-sm cursor-pointer shadow-lg">
              Place Order
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
