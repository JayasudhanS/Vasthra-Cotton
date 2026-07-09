import { createContext, useContext, useState } from 'react';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [counter, setCounter] = useState(101);

  const addProduct = (productData) => {
    const newProduct = {
      id: counter,
      status: 'pending', // Pending Approval initially
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      ...productData,
    };
    setProducts(prev => [newProduct, ...prev]);
    setCounter(prev => prev + 1);
    return newProduct;
  };

  const approveProduct = (id) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p));
  };

  const rejectProduct = (id) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const editProduct = (id, updatedData) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  return (
    <ProductContext.Provider value={{
      products,
      addProduct,
      approveProduct,
      rejectProduct,
      deleteProduct,
      editProduct
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);
