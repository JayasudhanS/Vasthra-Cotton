import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { doc, setDoc, deleteDoc, collection, onSnapshot } from 'firebase/firestore';
import { db, COLLECTIONS } from '../firebase/config';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();

  // Real-time Firestore listener for authenticated user's wishlist
  useEffect(() => {
    if (!user?.uid) {
      setWishlist([]);
      return;
    }

    const wishlistColRef = collection(db, COLLECTIONS.USERS, user.uid, 'wishlist');
    const unsubscribe = onSnapshot(wishlistColRef, (snapshot) => {
      const items = snapshot.docs.map(d => ({
        ...d.data(),
        id: d.id,
      }));
      setWishlist(items);
    }, (error) => {
      console.error('Wishlist listener error:', error);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const addToWishlist = useCallback(async (product) => {
    if (!user?.uid || !product?.id) return;
    // Optimistic local update
    setWishlist(prev => {
      if (prev.find(p => p.id === product.id)) return prev;
      return [...prev, product];
    });
    // Persist to Firestore
    try {
      const wishlistDocRef = doc(db, COLLECTIONS.USERS, user.uid, 'wishlist', String(product.id));
      await setDoc(wishlistDocRef, {
        id: product.id,
        name: product.name || '',
        image: product.image || product.imageUrl || product.images?.[0] || '',
        price: product.price || 0,
        offerPrice: product.offerPrice || 0,
        category: product.category || '',
        fabric: product.fabric || '',
        shopName: product.shopName || '',
        addedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      // Revert on failure
      setWishlist(prev => prev.filter(p => p.id !== product.id));
    }
  }, [user?.uid]);

  const removeFromWishlist = useCallback(async (id) => {
    if (!user?.uid) return;
    // Optimistic local update
    setWishlist(prev => prev.filter(p => p.id !== id));
    try {
      const wishlistDocRef = doc(db, COLLECTIONS.USERS, user.uid, 'wishlist', String(id));
      await deleteDoc(wishlistDocRef);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  }, [user?.uid]);

  const isInWishlist = useCallback((id) => wishlist.some(p => String(p.id) === String(id)), [wishlist]);

  const toggleWishlist = useCallback((product) => {
    if (!user) {
      // Guest users: redirect handled by the calling component
      return 'login_required';
    }
    if (isInWishlist(product.id)) removeFromWishlist(product.id);
    else addToWishlist(product);
    return 'toggled';
  }, [user, isInWishlist, removeFromWishlist, addToWishlist]);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
