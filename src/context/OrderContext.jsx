import { createContext, useContext, useState } from 'react';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [orderCounter, setOrderCounter] = useState(1001);

  const placeOrder = (orderData) => {
    const newOrder = {
      id: `VC-${orderCounter}`,
      ...orderData,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Pending',
      deliveryCharge: 30,
      total: orderData.price * orderData.quantity + 30,
    };
    setOrders(prev => [newOrder, ...prev]);
    setOrderCounter(prev => prev + 1);
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => useContext(OrderContext);
