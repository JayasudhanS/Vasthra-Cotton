import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMinus, FiPlus, FiTruck, FiShield, FiArrowLeft } from 'react-icons/fi';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function OrderSummaryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { placeOrder } = useOrders();
  const { user } = useAuth();
  const { clearCart } = useCart();
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

  const cart = location.state?.cart || [];
  const fromCart = location.state?.fromCart;
  const cartTotal = location.state?.cartTotal || 0;
  const estimatedTotal = location.state?.estimatedTotal || 0;

  if (!product && !fromCart) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-[#7B1E3A]/10 text-[#7B1E3A] flex items-center justify-center mx-auto mb-6 text-3xl">🛒</div>
        <h2 className="text-2xl font-bold text-[#7B1E3A] mb-3" style={{ fontFamily: 'Playfair Display' }}>No Product Selected</h2>
        <p className="text-sm text-[#6B4A48] mb-6">Please select a product to proceed with your order.</p>
        <button onClick={() => navigate('/products')} className="btn-golden !py-3 !px-8 !text-sm cursor-pointer">Browse Sarees</button>
      </div>
    );
  }

  const subtotal = fromCart ? cartTotal : (product?.offerPrice || product?.price || 0) * quantity;
  const deliveryCharge = 30;
  const total = fromCart ? estimatedTotal : subtotal + deliveryCharge;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      if (fromCart) {
        const promises = cart.map(item => placeOrder({
          productId: item.id,
          productName: item.name,
          productImage: item.image || item.imageUrl || item.thumbnail || '',
          shopId: item.shopId || item.ownerId || '',
          shopName: item.shopName || '',
          ownerId: item.ownerId || item.shopId || '',
          price: item.offerPrice || item.price,
          quantity: item.quantity,
          fabric: item.fabric || '',
          color: item.color || '',
          customerName: delivery.name,
          customerPhone: delivery.phone,
          customerAddress: `${delivery.address}, ${delivery.city}, ${delivery.state} - ${delivery.pincode}`,
        }));
        await Promise.all(promises);
        clearCart();
        navigate('/order-confirmation', { state: { productName: 'Cart Items', total } });
      } else {
        await placeOrder({
          productId: product.id,
          productName: product.name,
          productImage: product.image || product.imageUrl || product.thumbnail || '',
          shopId: product.shopId || product.ownerId || '',
          shopName: product.shopName || '',
          shopLogo: shop?.logo || '',
          ownerId: product.ownerId || product.shopId || '',
          price: product.offerPrice || product.price,
          quantity,
          fabric: product.fabric || '',
          color: product.color || '',
          customerName: delivery.name,
          customerPhone: delivery.phone,
          customerAddress: `${delivery.address}, ${delivery.city}, ${delivery.state} - ${delivery.pincode}`,
        });
        navigate('/order-confirmation', { state: { productName: product.name, total } });
      }
    } catch (err) {
      console.error('Failed to place order:', err);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 sm:py-12">

      <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] mb-8" style={{ fontFamily: 'Playfair Display' }}>Order Summary</h1>

      <div className="grid lg:grid-cols-5 gap-8 items-start">
        {/* Product Details */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-3 space-y-6">
          <div className="card-base p-6 sm:p-7 md:p-8 bg-white border border-[#D4AF37]/20">
            <div className="flex gap-5">
              {fromCart ? (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 p-4 border border-[#D4AF37]/20 rounded-xl mb-3">
                    <img src={item.image || item.imageUrl} alt={item.name} className="w-16 h-20 object-cover rounded-lg" />
                    <div>
                      <h3 className="font-bold text-[#7B1E3A]">{item.name}</h3>
                      <p className="text-xs text-[#6B4A48]">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold mt-1 text-[#4A2C2A]">₹{(item.offerPrice || item.price).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex gap-4 p-4 border border-[#D4AF37]/20 rounded-xl bg-white shadow-sm mb-6">
                  <img src={product.image || product.imageUrl} alt={product.name} className="w-20 h-24 object-cover rounded-lg border border-[#D4AF37]/20" />
                  <div className="flex-1">
                    <h3 className="font-bold text-[#7B1E3A] text-lg mb-1">{product.name}</h3>
                    <p className="text-sm text-[#6B4A48] mb-2">{product.shopName}</p>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 bg-[#FFF8F0] border border-[#D4AF37]/30 rounded-lg px-2 py-1">
                        <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-[#7B1E3A] hover:bg-[#D4AF37]/20 p-1 rounded">
                          <FiMinus size={14} />
                        </button>
                        <span className="font-bold text-sm min-w-[20px] text-center">{quantity}</span>
                        <button type="button" onClick={() => setQuantity(Math.min(10, quantity + 1))} className="text-[#7B1E3A] hover:bg-[#D4AF37]/20 p-1 rounded">
                          <FiPlus size={14} />
                        </button>
                      </div>
                      <span className="font-bold text-[#7B1E3A]">₹{(product.offerPrice || product.price).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
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
