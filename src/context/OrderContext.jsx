import { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
  query,
  orderBy,
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
  useEffect(() => {
    const ordersRef = collection(db, COLLECTIONS.ORDERS);
    const q = query(ordersRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allOrders = snapshot.docs.map(docSnap => ({
        ...docSnap.data(),
        id: docSnap.id,
        // Normalize the total for display safety
        total: docSnap.data().total || 0,
        price: docSnap.data().price || 0,
        quantity: docSnap.data().quantity || 1,
        deliveryCharge: docSnap.data().deliveryCharge || 30,
      }));
      setOrders(allOrders);
      setLoading(false);
    }, (err) => {
      console.error('Error listening to orders:', err);
      setLoading(false);
    });

    return () => unsubscribe();
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

        // Shop info
        shopId: orderData.shopId || '',
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

  // Shop Owner: only orders for their shop
  const shopOrders = orders.filter(o => {
    if (!user) return false;
    return (
      o.shopId === user.uid ||
      o.ownerId === user.uid ||
      (o.shopName && user.shopName && o.shopName.toLowerCase() === user.shopName.toLowerCase())
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
