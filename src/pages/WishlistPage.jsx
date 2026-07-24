import { motion } from 'framer-motion';
import { FiHeart, FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { approvedProducts } = useProducts();

  // Enrich wishlist items with full product data from Firestore
  const enrichedWishlist = wishlist.map(item => {
    const fullProduct = approvedProducts.find(p => String(p.id) === String(item.id));
    return fullProduct || item;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20 mb-8">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">✦ Wardrobe Collection</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0 flex items-center gap-2.5" style={{ fontFamily: 'Playfair Display' }}>
            <FiHeart className="text-[#D4AF37] fill-[#D4AF37]" /> My Saved Weaves
          </h1>
        </div>
        <span className="badge badge-warning !text-xs font-bold px-3.5 py-1.5">
          {enrichedWishlist.length} Weaves
        </span>
      </div>

      {enrichedWishlist.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card-base text-center py-20 px-6 max-w-lg mx-auto bg-white border-dashed">
          <div className="w-20 h-20 rounded-full bg-[#7B1E3A]/10 text-[#7B1E3A] flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner">
            <FiHeart />
          </div>
          <h2 className="text-2xl text-[#7B1E3A] font-bold mb-2" style={{ fontFamily: 'Playfair Display' }}>
            Your Wishlist is Empty
          </h2>
          <p className="text-sm text-[#6B4A48] mb-8 font-light leading-relaxed">
            Explore our curated handloom collections from Kanchipuram and Banaras to start saving your favorite sarees!
          </p>
          <Link to="/products" className="btn-golden !py-3 !px-8 !text-xs no-underline shadow-md inline-flex items-center gap-2">
            Browse All Weaves <FiArrowRight />
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrichedWishlist.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card-base bg-white border border-[#D4AF37]/20 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <Link to={`/product/${product.id}`} className="block aspect-[4/5] overflow-hidden relative bg-[#FFF8F0] rounded-t-2xl">
                  <img src={product.image || product.imageUrl || product.images?.[0] || ''} alt={product.name || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  <span className="absolute top-3.5 left-3.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/20">
                    {product.category || 'Saree'}
                  </span>
                </Link>
                <div className="p-5 sm:p-6">
                  {product.shopName && (
                    <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold mb-1 block">{product.shopName}</p>
                  )}
                  <Link to={`/product/${product.id}`} className="text-base font-bold text-[#7B1E3A] hover:text-[#D4AF37] transition-colors no-underline line-clamp-1 block" style={{ fontFamily: 'Playfair Display' }}>
                    {product.name || 'Saree'}
                  </Link>
                  <div className="flex items-center gap-2 mt-2">
                    {typeof product.offerPrice === 'number' && product.offerPrice > 0 && (
                      <span className="text-lg font-bold text-[#7B1E3A]">₹{product.offerPrice.toLocaleString()}</span>
                    )}
                    {typeof product.price === 'number' && product.price > 0 && product.price !== product.offerPrice && (
                      <span className="text-xs text-[#6B4A48] line-through font-light">₹{product.price.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-5 sm:p-6 pt-0 flex gap-2.5">
                <button 
                  onClick={() => { addToCart(product); removeFromWishlist(product.id); }} 
                  className="btn-golden flex-1 justify-center !py-2.5 !text-xs cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <FiShoppingBag size={14} /> Move to Cart
                </button>
                <button onClick={() => removeFromWishlist(product.id)} title="Remove from wishlist"
                  className="w-10 h-10 rounded-xl flex items-center justify-center border border-red-200 text-red-500 hover:bg-red-500 hover:text-white cursor-pointer bg-red-50/50 transition-all">
                  <FiTrash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
