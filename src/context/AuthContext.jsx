import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  sendPasswordResetEmail, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  where, 
  onSnapshot 
} from 'firebase/firestore';
import { auth, db, COLLECTIONS } from '../firebase/config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'user' | 'shopkeeper' | 'admin'
  const [pendingShops, setPendingShops] = useState([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to auth state changes & load user document from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, COLLECTIONS.USERS, firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const docData = userSnap.data();
          const isShop = docData.role === 'shopOwner' || docData.role === 'shopkeeper';
          const normalizedRole = docData.role === 'admin' 
            ? 'admin' 
            : isShop 
              ? 'shopkeeper' 
              : 'user';

          // Check if shop owner application is pending or rejected
          if (isShop && (docData.status === 'Pending' || docData.status === 'pending')) {
            await signOut(auth);
            setUser(null);
            setRole(null);
            setLoading(false);
            return;
          }

          if (isShop && (docData.status === 'Rejected' || docData.status === 'rejected')) {
            await signOut(auth);
            setUser(null);
            setRole(null);
            setLoading(false);
            return;
          }

          setUser({ ...docData, id: firebaseUser.uid, uid: firebaseUser.uid });
          setRole(normalizedRole);
        } else if (firebaseUser.email?.toLowerCase() === 'admin@vasthracotton.com') {
          // Auto-initialize predefined administrator account in Firestore if missing
          const adminData = {
            uid: firebaseUser.uid,
            name: 'Administrator',
            email: 'admin@vasthracotton.com',
            phone: '',
            role: 'admin',
            status: 'Active',
            createdAt: new Date().toISOString(),
            profileImage: '/images/placeholder.png'
          };
          await setDoc(userRef, adminData);
          setUser({ ...adminData, id: firebaseUser.uid });
          setRole('admin');
        } else {
          // Fallback if user registered outside or social login without doc yet
          const newUserData = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            phone: firebaseUser.phoneNumber || '',
            role: 'user',
            status: 'Active',
            createdAt: new Date().toISOString(),
            profileImage: firebaseUser.photoURL || '/images/placeholder.png'
          };
          await setDoc(userRef, newUserData);
          setUser({ ...newUserData, id: firebaseUser.uid });
          setRole('user');
        }
      } catch (error) {
        console.error('Error fetching user data from Firestore:', error);
        setUser(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen for pending/all shopkeeper applications from Firestore for Admin
  useEffect(() => {
    if (role !== 'admin') {
      setPendingShops([]);
      return;
    }

    const q = query(
      collection(db, COLLECTIONS.USERS),
      where('role', 'in', ['shopOwner', 'shopkeeper'])
    );

    const unsubShops = onSnapshot(q, (snapshot) => {
      const shopsData = snapshot.docs.map(docSnap => ({
        ...docSnap.data(),
        id: docSnap.id,
        status: (docSnap.data().status || 'Pending').toLowerCase()
      }));
      setPendingShops(shopsData);
    }, (error) => {
      console.error('Error listening to pending shops:', error);
    });

    return () => unsubShops();
  }, [role]);

  // Firebase Email/Password Login
  const login = async (email, password, expectedRole) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const userRef = doc(db, COLLECTIONS.USERS, firebaseUser.uid);
      let userSnap = await getDoc(userRef);

      // Handle predefined administrator account auto-initialization on login
      if (!userSnap.exists() && email.toLowerCase() === 'admin@vasthracotton.com') {
        const adminData = {
          uid: firebaseUser.uid,
          name: 'Administrator',
          email: 'admin@vasthracotton.com',
          phone: '',
          role: 'admin',
          status: 'Active',
          createdAt: new Date().toISOString(),
          profileImage: '/images/placeholder.png'
        };
        await setDoc(userRef, adminData);
        userSnap = await getDoc(userRef);
      }

      if (!userSnap.exists()) {
        await signOut(auth);
        return { success: false, message: 'User profile not found in Firestore database.' };
      }

      const docData = userSnap.data();
      const isShop = docData.role === 'shopOwner' || docData.role === 'shopkeeper';
      const normalizedRole = docData.role === 'admin' ? 'admin' : isShop ? 'shopkeeper' : 'user';

      // Enforce Admin access restrictions
      if (expectedRole === 'admin' && docData.role !== 'admin') {
        await signOut(auth);
        return { success: false, message: 'Access denied. Administrator privileges required.' };
      }

      // Enforce Shop Owner status review
      if (isShop && (docData.status === 'Pending' || docData.status === 'pending')) {
        await signOut(auth);
        return {
          success: false,
          message: 'Your registration has been submitted successfully. Your account is currently under review by our administrator. You will be able to access your dashboard once your account has been approved.'
        };
      }

      if (isShop && (docData.status === 'Rejected' || docData.status === 'rejected')) {
        await signOut(auth);
        return { success: false, message: 'Your shop owner account application was not approved.' };
      }

      setUser({ ...docData, id: firebaseUser.uid, uid: firebaseUser.uid });
      setRole(normalizedRole);

      return { success: true, role: normalizedRole };
    } catch (error) {
      console.error('Firebase login error:', error);
      let msg = error.message;
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        msg = 'Invalid email address or password. Please verify your credentials.';
      } else if (error.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      }
      return { success: false, message: msg };
    }
  };

  // Firebase Email/Password Registration
  const register = async (formData, registerRole) => {
    try {
      const isShop = registerRole === 'shopkeeper' || registerRole === 'shopOwner';
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const firebaseUser = userCredential.user;

      const userData = {
        uid: firebaseUser.uid,
        name: formData.name || '',
        email: formData.email,
        phone: formData.phone || '',
        role: isShop ? 'shopOwner' : 'user',
        status: isShop ? 'Pending' : 'Active',
        createdAt: new Date().toISOString(),
        profileImage: '/images/placeholder.png',
        ...(isShop ? {
          shopName: formData.shopName || formData.name || '',
          address: formData.address || '',
          description: formData.description || '',
        } : {})
      };

      await setDoc(doc(db, COLLECTIONS.USERS, firebaseUser.uid), userData);

      if (isShop) {
        await signOut(auth);
        return {
          success: true,
          pending: true,
          message: 'Your registration has been submitted successfully. Your account is currently under review by our administrator. You will be able to access your dashboard once your account has been approved.'
        };
      }

      setUser({ ...userData, id: firebaseUser.uid });
      setRole('user');
      return { success: true, pending: false };
    } catch (error) {
      console.error('Firebase registration error:', error);
      let msg = error.message;
      if (error.code === 'auth/email-already-in-use') {
        msg = 'This email address is already registered. Please log in instead.';
      } else if (error.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      }
      return { success: false, message: msg };
    }
  };

  // Backward compatible alias
  const registerShopkeeper = async (shopData) => {
    return register(shopData, 'shopkeeper');
  };

  // Google Sign-In
  const signInWithGoogle = async (expectedRole) => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;

      const userRef = doc(db, COLLECTIONS.USERS, firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const docData = userSnap.data();
        const isShop = docData.role === 'shopOwner' || docData.role === 'shopkeeper';
        const normalizedRole = docData.role === 'admin' ? 'admin' : isShop ? 'shopkeeper' : 'user';

        if (expectedRole === 'admin' && docData.role !== 'admin') {
          await signOut(auth);
          return { success: false, message: 'Access denied. Administrator privileges required.' };
        }

        if (isShop && (docData.status === 'Pending' || docData.status === 'pending')) {
          await signOut(auth);
          return {
            success: false,
            message: 'Your account is currently under review by our administrator.'
          };
        }

        setUser({ ...docData, id: firebaseUser.uid, uid: firebaseUser.uid });
        setRole(normalizedRole);
        return { success: true, role: normalizedRole };
      } else {
        if (expectedRole === 'admin') {
          await signOut(auth);
          return { success: false, message: 'Access denied. Administrator privileges required.' };
        }

        const isShop = expectedRole === 'shopkeeper';
        const newUserData = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          phone: firebaseUser.phoneNumber || '',
          role: isShop ? 'shopOwner' : 'user',
          status: isShop ? 'Pending' : 'Active',
          createdAt: new Date().toISOString(),
          profileImage: firebaseUser.photoURL || '/images/placeholder.png'
        };

        await setDoc(userRef, newUserData);

        if (isShop) {
          await signOut(auth);
          return {
            success: true,
            pending: true,
            message: 'Your registration has been submitted successfully. Your account is currently under review by our administrator.'
          };
        }

        setUser({ ...newUserData, id: firebaseUser.uid });
        setRole('user');
        return { success: true, role: 'user' };
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
      return { success: false, message: error.message || 'Google Sign-In failed.' };
    }
  };

  // Forgot Password
  const forgotPassword = async (email) => {
    try {
      if (!email) return { success: false, message: 'Please enter your email address first.' };
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'Password reset link sent to your email.' };
    } catch (error) {
      console.error('Password reset error:', error);
      let msg = error.message;
      if (error.code === 'auth/user-not-found') {
        msg = 'No account found with this email address.';
      }
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setRole(null);
    }
  };

  const updateUser = async (updatedFields) => {
    const userId = user?.uid || user?.id;
    if (!userId) return;
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      await updateDoc(userRef, updatedFields);
      setUser(prev => prev ? { ...prev, ...updatedFields } : updatedFields);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  // Admin Shop Approval/Rejection Actions
  const approveShop = async (id) => {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, id);
      await updateDoc(userRef, { status: 'Active' });
    } catch (error) {
      console.error('Error approving shop:', error);
    }
  };

  const rejectShop = async (id) => {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, id);
      await updateDoc(userRef, { status: 'Rejected' });
    } catch (error) {
      console.error('Error rejecting shop:', error);
    }
  };

  const deleteShop = async (id) => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.USERS, id));
    } catch (error) {
      console.error('Error deleting shop:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      role,
      pendingShops,
      loading,
      register,
      registerShopkeeper,
      approveShop,
      rejectShop,
      deleteShop,
      login,
      signInWithGoogle,
      forgotPassword,
      logout,
      updateUser,
      isAuthenticated: !!user
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
