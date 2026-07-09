import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'user' | 'shopkeeper' | 'admin'
  const [pendingShops, setPendingShops] = useState([]);

  const registerShopkeeper = (shopData) => {
    const newShop = {
      id: Date.now(),
      status: 'pending',
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      ...shopData,
    };
    setPendingShops(prev => [newShop, ...prev]);
    return newShop;
  };

  const approveShop = (id) => {
    setPendingShops(prev => prev.map(s => s.id === id ? { ...s, status: 'approved' } : s));
  };

  const rejectShop = (id) => {
    setPendingShops(prev => prev.map(s => s.id === id ? { ...s, status: 'rejected' } : s));
  };

  const deleteShop = (id) => {
    setPendingShops(prev => prev.filter(s => s.id !== id));
  };

  const login = (userData, userRole) => {
    if (userRole === 'shopkeeper') {
      const foundPending = pendingShops.find(
        s => (userData.email && s.email === userData.email) || (userData.shopName && s.shopName === userData.shopName) || (userData.name && s.name === userData.name)
      );
      if (foundPending && foundPending.status !== 'approved') {
        return {
          success: false,
          message: 'Your registration has been submitted successfully. Your account is currently under review by our administrator. You will be able to access your dashboard once your account has been approved.'
        };
      }
    }
    setUser(userData);
    setRole(userRole);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setRole(null);
  };

  const updateUser = (updatedFields) => {
    setUser(prev => prev ? { ...prev, ...updatedFields } : updatedFields);
  };

  return (
    <AuthContext.Provider value={{
      user,
      role,
      pendingShops,
      registerShopkeeper,
      approveShop,
      rejectShop,
      deleteShop,
      login,
      logout,
      updateUser,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
