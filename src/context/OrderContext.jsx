import { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db, COLLECTIONS } from '../firebase/config';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const { user, role } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ─── Real-time listener on Firestore 'orders' collection ───
  // NO orderBy to avoid requiring a Firestore composite index.
  // Sorting is done client-side after fetching, same pattern as ProductContext.
  useEffect(() => {
    const ordersRef = collection(db, COLLECTIONS.ORDERS);
    let retryTimer = null;
    let retryCount = 0;
    const MAX_RETRIES = 3;

    const startListener = () => {
      const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
        const allOrders = snapshot.docs.map(docSnap => {
          const data = docSnap.data();
          return {
            ...data,
            id: docSnap.id,
            // Normalize values for display safety
            total: data.total || 0,
            price: data.price || 0,
            quantity: data.quantity || 1,
            deliveryCharge: data.deliveryCharge || 30,
          };
        });

        // Sort client-side by createdAt descending (newest first)
        allOrders.sort((a, b) => {
          // Handle Firestore Timestamp objects and ISO strings
          const getTime = (val) => {
            if (!val) return 0;
            if (val.toDate) return val.toDate().getTime(); // Firestore Timestamp
            if (val.seconds) return val.seconds * 1000; // Firestore Timestamp plain object
            return new Date(val).getTime(); // ISO string
          };
          // Prefer createdAt, fall back to timestamp
          const timeA = getTime(a.createdAt) || getTime(a.timestamp) || 0;
          const timeB = getTime(b.createdAt) || getTime(b.timestamp) || 0;
          return timeB - timeA;
        });

        setOrders(allOrders);
        setLoading(false);
        retryCount = 0;
      }, (err) => {
        console.error('Error listening to orders:', err);
        console.error('Error code:', err.code, '| Message:', err.message);
        setLoading(false);

        // Retry with backoff if we haven't exceeded max retries
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          const delay = Math.min(2000 * Math.pow(2, retryCount - 1), 10000);
          console.warn(`Retrying Firestore orders listener in ${delay}ms (attempt ${retryCount}/${MAX_RETRIES})...`);
          retryTimer = setTimeout(() => {
            startListener();
          }, delay);
        }
      });

      return unsubscribe;
    };

    const unsubscribe = startListener();

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, []);

  // ─── Place a new order → writes to Firestore ───
  const placeOrder = async (orderData) => {
    try {
      const deliveryCharge = 30;
      const total = (orderData.price || 0) * (orderData.quantity || 1) + deliveryCharge;

      const orderDoc = {
        // Customer info
        userId: user?.uid || '',
        userName: user?.name || orderData.customerName || '',
        userEmail: user?.email || '',
        userPhone: orderData.customerPhone || user?.phone || '',
        customerName: orderData.customerName || user?.name || '',
        customerPhone: orderData.customerPhone || user?.phone || '',
        customerAddress: orderData.customerAddress || '',

        // Product info
        productId: orderData.productId || '',
        productName: orderData.productName || '',
        productImage: orderData.productImage || '',
        price: orderData.price || 0,
        quantity: orderData.quantity || 1,
        fabric: orderData.fabric || '',
        color: orderData.color || '',

        // Shop info — critical for Shop Owner order filtering
        shopId: orderData.shopId || orderData.ownerId || '',
        shopName: orderData.shopName || '',
        shopLogo: orderData.shopLogo || '',
        ownerId: orderData.ownerId || orderData.shopId || '',

        // Order meta
        status: 'Pending',
        paymentStatus: 'COD',
        paymentMethod: 'Cash on Delivery',
        deliveryCharge,
        total,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        createdAt: serverTimestamp(),
        timestamp: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, COLLECTIONS.ORDERS), orderDoc);
      return { id: docRef.id, ...orderDoc };
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  };

  // ─── Update order status in Firestore ───
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // ─── Filtered views for different roles ───

  // Customer: only their own orders
  const myOrders = orders.filter(o => user && o.userId === user.uid);

  // Shop Owner: only orders for their shop's products
  // Matches by ownerId (the product uploader's UID) or shopId, or shopName as fallback
  const shopOrders = orders.filter(o => {
    if (!user) return false;
    const uid = user.uid || user.id;
    if (!uid) return false;
    return (
      (o.ownerId && String(o.ownerId) === String(uid)) ||
      (o.shopId && String(o.shopId) === String(uid)) ||
      (o.shopName && user.shopName && o.shopName.toLowerCase().trim() === user.shopName.toLowerCase().trim())
    );
  });

  // Admin: all orders (unfiltered)
  const allOrders = orders;

  return (
    <OrderContext.Provider value={{
      orders,
      allOrders,
      myOrders,
      shopOrders,
      loading,
      placeOrder,
      updateOrderStatus,
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => useContext(OrderContext);
