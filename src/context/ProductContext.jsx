import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, COLLECTIONS } from '../firebase/config';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real-time Firestore listener for ALL products
  // NO orderBy — avoids requiring a Firestore index. Sorting is done client-side.
  useEffect(() => {
    const colRef = collection(db, COLLECTIONS.PRODUCTS);
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const firestoreProducts = snapshot.docs.map(d => ({
        ...d.data(),
        id: d.id,
      }));
      // Sort client-side by createdAt descending (newest first)
      firestoreProducts.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB - dateA;
      });
      setProducts(firestoreProducts);
      setLoading(false);
    }, (error) => {
      console.error('Firestore products listener error:', error);
      // Fallback: try without any query constraints
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Only approved products for public-facing pages
  // Case-insensitive check to handle any status casing from Admin module
  const approvedProducts = useMemo(() =>
    products.filter(p => {
      const s = (p.status || '').toString().trim().toLowerCase();
      return s === 'approved';
    }),
    [products]
  );

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
