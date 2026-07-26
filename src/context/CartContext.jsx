import { createContext, useContext, useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  // Load from Firestore if logged in
  useEffect(() => {
    if (!user?.uid) {
      setCart([]);
      return;
    }
    const cartRef = doc(db, 'carts', user.uid);
    const unsubscribe = onSnapshot(cartRef, (docSnap) => {
      if (docSnap.exists()) {
        setCart(docSnap.data().items || []);
      } else {
        setCart([]);
      }
    });
    return () => unsubscribe();
  }, [user?.uid]);

  const saveCartToFirestore = async (newCart) => {
    if (!user?.uid) return;
    try {
      await setDoc(doc(db, 'carts', user.uid), {
        userId: user.uid,
        items: newCart,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error('Error saving cart to Firestore:', error);
    }
  };

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      let newCart;
      if (existing) {
        newCart = prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + qty } : p);
      } else {
        newCart = [...prev, { ...product, quantity: qty }];
      }
      saveCartToFirestore(newCart);
      return newCart;
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => {
      const newCart = prev.filter(p => p.id !== id);
      saveCartToFirestore(newCart);
      return newCart;
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return removeFromCart(id);
    setCart(prev => {
      const newCart = prev.map(p => p.id === id ? { ...p, quantity } : p);
      saveCartToFirestore(newCart);
      return newCart;
    });
  };

  const isInCart = (id) => cart.some(p => p.id === id);

  const getCartQuantity = (id) => {
    const item = cart.find(p => p.id === id);
    return item ? item.quantity : 0;
  };

  const clearCart = () => {
    setCart([]);
    saveCartToFirestore([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.offerPrice || item.price || 0) * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, isInCart, getCartQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
