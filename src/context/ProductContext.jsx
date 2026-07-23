import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { db, COLLECTIONS } from '../firebase/config';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firestoreError, setFirestoreError] = useState(null);

  // Real-time Firestore listener for ALL products
  // NO orderBy — avoids requiring a Firestore index. Sorting is done client-side.
  useEffect(() => {
    const colRef = collection(db, COLLECTIONS.PRODUCTS);
    let retryTimer = null;
    let retryCount = 0;
    const MAX_RETRIES = 3;

    const startListener = () => {
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
        setFirestoreError(null);
        retryCount = 0; // Reset retry count on success
      }, (error) => {
        console.error('Firestore products listener error:', error);
        console.error('Error code:', error.code, '| Message:', error.message);
        setFirestoreError(error.message || 'Failed to load products');
        setLoading(false);
        // IMPORTANT: Do NOT clear products on error — keep existing data visible
        // This prevents products from "disappearing" due to permission/network errors

        // Retry with backoff if we haven't exceeded max retries
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          const delay = Math.min(2000 * Math.pow(2, retryCount - 1), 10000);
          console.warn(`Retrying Firestore products listener in ${delay}ms (attempt ${retryCount}/${MAX_RETRIES})...`);
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

  // Only approved products for public-facing pages
  // Case-insensitive check to handle any status casing or schema flag from Admin module
  const approvedProducts = useMemo(() =>
    products.filter(p => {
      const s = (p.status || p.publishStatus || '').toString().trim().toLowerCase();
      const isApp = p.isApproved === true || p.approved === true;
      return s === 'approved' || isApp;
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
      await updateDoc(doc(db, COLLECTIONS.PRODUCTS, id), { status: 'approved', approvedAt: new Date().toISOString() });
    } catch (error) {
      console.error('Error approving product:', error);
      // Fallback to local state update
      setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p));
    }
  };

  // Reject product: update Firestore status
  const rejectProduct = async (id) => {
    try {
      await updateDoc(doc(db, COLLECTIONS.PRODUCTS, id), { status: 'rejected', rejectedAt: new Date().toISOString() });
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

  // Edit product fields in Firestore (generic, used by admin for immediate updates)
  const editProduct = async (id, updatedData) => {
    try {
      await updateDoc(doc(db, COLLECTIONS.PRODUCTS, id), updatedData);
    } catch (error) {
      console.error('Error editing product:', error);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    }
  };

  // Admin direct edit: immediately updates the live product (no approval required)
  const adminEditProduct = async (id, updatedData) => {
    try {
      await updateDoc(doc(db, COLLECTIONS.PRODUCTS, id), {
        ...updatedData,
        lastEditedBy: 'admin',
        lastEditedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error in admin edit:', error);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    }
  };

  // Shopkeeper edit: stores pending changes on the product document for admin review
  // The live product remains unchanged until admin approves
  const submitProductEdit = async (id, pendingChanges, shopkeeperName) => {
    try {
      await updateDoc(doc(db, COLLECTIONS.PRODUCTS, id), {
        pendingEdit: {
          ...pendingChanges,
          submittedBy: shopkeeperName || 'Shop Owner',
          submittedAt: new Date().toISOString(),
          editStatus: 'pending',
        },
      });
      return { success: true, message: 'Edit submitted for admin review. Your live product remains unchanged until approved.' };
    } catch (error) {
      console.error('Error submitting product edit:', error);
      return { success: false, message: error.message || 'Failed to submit edit.' };
    }
  };

  // Admin approves pending edit: merges pendingEdit into live product fields
  const approvePendingEdit = async (id) => {
    try {
      const productRef = doc(db, COLLECTIONS.PRODUCTS, id);
      const productSnap = await getDoc(productRef);
      if (!productSnap.exists()) return;

      const data = productSnap.data();
      if (!data.pendingEdit) return;

      const { submittedBy, submittedAt, editStatus, ...editFields } = data.pendingEdit;
      await updateDoc(productRef, {
        ...editFields,
        pendingEdit: null,
        lastEditedBy: submittedBy,
        lastEditedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error approving pending edit:', error);
    }
  };

  // Admin rejects pending edit: removes the pendingEdit from the product
  const rejectPendingEdit = async (id) => {
    try {
      await updateDoc(doc(db, COLLECTIONS.PRODUCTS, id), { pendingEdit: null });
    } catch (error) {
      console.error('Error rejecting pending edit:', error);
    }
  };

  return (
    <ProductContext.Provider value={{
      products,
      approvedProducts,
      loading,
      firestoreError,
      addProduct,
      approveProduct,
      rejectProduct,
      deleteProduct,
      editProduct,
      adminEditProduct,
      submitProductEdit,
      approvePendingEdit,
      rejectPendingEdit
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);
