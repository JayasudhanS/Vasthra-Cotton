import { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db, COLLECTIONS } from '../firebase/config';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real-time Firestore listener for ALL products
  useEffect(() => {
    const q = query(collection(db, COLLECTIONS.PRODUCTS), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firestoreProducts = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProducts(firestoreProducts);
      setLoading(false);
    }, (error) => {
      console.error('Firestore products listener error:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Only approved products for public-facing pages
  const approvedProducts = products.filter(p => p.status === 'approved');

  // Add product to local state (for immediate UI feedback after AddProduct submission)
  const addProduct = (productData) => {
    // The Firestore listener will automatically pick up the new doc,
    // but we add it optimistically for instant UI feedback
    setProducts(prev => {
      const exists = prev.find(p => p.id === productData.id);
      if (exists) return prev;
      return [productData, ...prev];
    });
    return productData;
  };

  // Approve product: update Firestore status
  const approveProduct = async (id) => {
    try {
      await updateDoc(doc(db, COLLECTIONS.PRODUCTS, id), { status: 'approved' });
    } catch (error) {
      console.error('Error approving product:', error);
      // Fallback to local state update
      setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p));
    }
  };

  // Reject product: update Firestore status
  const rejectProduct = async (id) => {
    try {
      await updateDoc(doc(db, COLLECTIONS.PRODUCTS, id), { status: 'rejected' });
    } catch (error) {
      console.error('Error rejecting product:', error);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p));
    }
  };

  // Delete product from Firestore
  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.PRODUCTS, id));
    } catch (error) {
      console.error('Error deleting product:', error);
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  // Edit product fields in Firestore
  const editProduct = async (id, updatedData) => {
    try {
      await updateDoc(doc(db, COLLECTIONS.PRODUCTS, id), updatedData);
    } catch (error) {
      console.error('Error editing product:', error);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    }
  };

  return (
    <ProductContext.Provider value={{
      products,
      approvedProducts,
      loading,
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
