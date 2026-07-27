import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  sendPasswordResetEmail, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
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
  onSnapshot,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { auth, db, COLLECTIONS } from '../firebase/config';
import { logActivity } from '../utils/activityLogger';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'user' | 'shopkeeper' | 'admin'
  const [pendingShops, setPendingShops] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allShops, setAllShops] = useState([]);
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

          let shopDocData = {};
          if (isShop) {
            const shopRef = doc(db, COLLECTIONS.SHOPS, firebaseUser.uid);
            const shopSnap = await getDoc(shopRef);
            if (shopSnap.exists()) {
              shopDocData = shopSnap.data();
            }
          }

          setUser({ ...docData, ...shopDocData, id: firebaseUser.uid, uid: firebaseUser.uid });
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

  // Listen for all users and shops from Firestore when Admin is logged in
  useEffect(() => {
    if (role !== 'admin') {
      setPendingShops([]);
      setAllUsers([]);
      setAllShops([]);
      return;
    }

    let usersList = [];
    let shopsList = [];

    const updateCombinedShops = (uList, sList) => {
      const shopkeepersFromUsers = uList.filter(u => u.role === 'shopOwner' || u.role === 'shopkeeper').map(docData => ({
        ...docData,
        status: (docData.status || 'Pending').toLowerCase()
      }));
      const shopsFromShopsCol = sList.map(docData => ({
        ...docData,
        status: (docData.status || 'Pending').toLowerCase(),
        fromShopsCol: true
      }));

      const map = new Map();
      shopsFromShopsCol.forEach(s => map.set(s.id || s.uid, s));
      shopkeepersFromUsers.forEach(s => {
        const existing = map.get(s.id || s.uid);
        const merged = { ...(existing || {}), ...s };
        map.set(s.id || s.uid, merged);
        if (s.status === 'approved' && !existing?.fromShopsCol) {
          setDoc(doc(db, COLLECTIONS.SHOPS, s.id || s.uid), { ...merged, id: s.id || s.uid, uid: s.id || s.uid, status: 'approved', fromShopsCol: true }, { merge: true }).catch(() => {});
        }
      });
      setPendingShops(Array.from(map.values()));
    };

    const unsubUsers = onSnapshot(collection(db, COLLECTIONS.USERS), (snapshot) => {
      usersList = snapshot.docs.map(docSnap => ({
        ...docSnap.data(),
        id: docSnap.id,
        uid: docSnap.data().uid || docSnap.id
      }));
      setAllUsers(usersList);
      updateCombinedShops(usersList, shopsList);
    }, (error) => {
      console.error('Error listening to all users:', error);
    });

    const unsubShops = onSnapshot(collection(db, COLLECTIONS.SHOPS), (snapshot) => {
      shopsList = snapshot.docs.map(docSnap => ({
        ...docSnap.data(),
        id: docSnap.id
      }));
      setAllShops(shopsList);
      updateCombinedShops(usersList, shopsList);
    }, (error) => {
      console.error('Error listening to shops collection:', error);
    });

    return () => {
      unsubUsers();
      unsubShops();
    };
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
      if (isShop) {
        const shopStatus = (docData.status || 'pending').toLowerCase();
        
        if (shopStatus === 'pending') {
          await signOut(auth);
          return {
            success: true,
            role: 'pending_shopkeeper'
          };
        }

        if (shopStatus === 'rejected') {
          await signOut(auth);
          return { success: false, message: 'Your shop owner account application was not approved.' };
        }

        if (shopStatus === 'disabled') {
          await signOut(auth);
          return { success: false, message: 'Your shop account has been disabled by the Administrator. Please contact support.' };
        }
      }

      let shopDocData = {};
      if (isShop) {
        const shopRef = doc(db, COLLECTIONS.SHOPS, firebaseUser.uid);
        const shopSnap = await getDoc(shopRef);
        if (shopSnap.exists()) {
          shopDocData = shopSnap.data();
        }
      }

      setUser({ ...docData, ...shopDocData, id: firebaseUser.uid, uid: firebaseUser.uid });
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

      const baseUserData = {
        uid: firebaseUser.uid,
        name: formData.name || '',
        email: formData.email,
        phone: formData.phone || '',
        role: isShop ? 'shopkeeper' : 'user',
        status: isShop ? 'pending' : 'active',
        createdAt: new Date().toISOString(),
        profileImage: '/images/placeholder.png',
      };

      await setDoc(doc(db, COLLECTIONS.USERS, firebaseUser.uid), baseUserData);

      if (isShop) {
        const shopData = {
          shopId: firebaseUser.uid,
          ownerId: firebaseUser.uid,
          shopName: formData.shopName || formData.name || '',
          ownerName: formData.name || '',
          email: formData.email,
          phone: formData.phone || '',
          address: formData.address || '',
          gstNumber: formData.gstNumber || '',
          logo: '/images/placeholder.png',
          banner: '/images/placeholder.png',
          shopName: formData.shopName || '',
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        await setDoc(doc(db, COLLECTIONS.SHOPS, firebaseUser.uid), shopData);
        await logActivity('shop', `New Shop Registered: "${shopData.shopName}" awaiting verification`, 'bg-amber-500');
        await signOut(auth);
        return {
          success: true,
          pending: true,
          message: 'Your registration has been submitted successfully. Your account is currently under review by our administrator. You will be able to access your dashboard once your account has been approved.'
        };
      }

      setUser({ ...baseUserData, id: firebaseUser.uid });
      setRole('user');
      await logActivity('user', `New Customer Registered: "${baseUserData.name}" joined Vasthra Cotton`, 'bg-[#7B1E3A]');
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

  // Google Sign-In: popup first, fallback to redirect for mobile/deployed environments
  const pendingGoogleRole = useRef(null);

  // Handle Google redirect result on mount (when returning from redirect flow)
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (!result || !result.user) return; // No redirect result pending

        const firebaseUser = result.user;
        const expectedRole = pendingGoogleRole.current || sessionStorage.getItem('googleSignInRole') || 'user';
        sessionStorage.removeItem('googleSignInRole');

        const userRef = doc(db, COLLECTIONS.USERS, firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const docData = userSnap.data();
          const isShop = docData.role === 'shopOwner' || docData.role === 'shopkeeper';
          const normalizedRole = docData.role === 'admin' ? 'admin' : isShop ? 'shopkeeper' : 'user';

          if (expectedRole === 'admin' && docData.role !== 'admin') {
            await signOut(auth);
            return;
          }

          if (isShop && (docData.status === 'Pending' || docData.status === 'pending')) {
            await signOut(auth);
            return;
          }

          setUser({ ...docData, id: firebaseUser.uid, uid: firebaseUser.uid });
          setRole(normalizedRole);
        } else {
          if (expectedRole === 'admin') {
            await signOut(auth);
            return;
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

          await setDoc(doc(db, COLLECTIONS.USERS, firebaseUser.uid), newUserData);

          if (isShop) {
            await signOut(auth);
            return;
          }

          setUser({ ...newUserData, id: firebaseUser.uid });
          setRole('user');
        }
      } catch (error) {
        // Silently handle - redirect result only exists when returning from redirect flow
        if (error.code !== 'auth/redirect-cancelled-by-user') {
          console.error('Google redirect result error:', error);
        }
      }
    };

    handleRedirectResult();
  }, []);

  const signInWithGoogle = async (expectedRole) => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    // Helper to process Google sign-in result (shared by popup and redirect paths)
    const processGoogleUser = async (firebaseUser) => {
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

        if (isShop && (docData.status === 'Rejected' || docData.status === 'rejected')) {
          await signOut(auth);
          return { success: false, message: 'Your shop owner account application was not approved.' };
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
    };

    try {
      // Try popup first (works on desktop and some mobile browsers)
      const userCredential = await signInWithPopup(auth, provider);
      return await processGoogleUser(userCredential.user);
    } catch (popupError) {
      // If popup blocked or fails on mobile/production, fallback to redirect
      if (
        popupError.code === 'auth/popup-blocked' ||
        popupError.code === 'auth/popup-closed-by-user' ||
        popupError.code === 'auth/cancelled-popup-request' ||
        popupError.code === 'auth/internal-error' ||
        popupError.code === 'auth/network-request-failed'
      ) {
        try {
          // Store expected role in sessionStorage so we can retrieve it after redirect
          pendingGoogleRole.current = expectedRole;
          sessionStorage.setItem('googleSignInRole', expectedRole || 'user');
          await signInWithRedirect(auth, provider);
          // Page will redirect away, so this return won't execute
          return { success: true, redirecting: true };
        } catch (redirectError) {
          console.error('Google Sign-In redirect error:', redirectError);
          return { success: false, message: 'Google Sign-In failed. Please try again or use email/password login.' };
        }
      }

      console.error('Google Sign-In error:', popupError);
      // Provide user-friendly messages for common errors
      let msg = 'Google Sign-In failed. Please try again.';
      if (popupError.code === 'auth/account-exists-with-different-credential') {
        msg = 'An account with this email already exists using a different sign-in method. Please use email/password login.';
      } else if (popupError.code === 'auth/unauthorized-domain') {
        msg = 'This domain is not authorized for Google Sign-In. Please contact the administrator.';
      }
      return { success: false, message: msg };
    }
  };

  // Forgot Password
  const forgotPassword = async (email) => {
    try {
      if (!email) return { success: false, message: 'Please enter your email address first.' };
      
      const trimmedEmail = email.trim();
      if (!trimmedEmail) return { success: false, message: 'Please enter a valid email address.' };

      await sendPasswordResetEmail(auth, trimmedEmail, {
        url: "https://vasthracotton.netlify.app/login/user",
        handleCodeInApp: false,
      });
      
      return { success: true, message: 'Password reset link sent to your email.' };
    } catch (error) {
      console.error("Password Reset Error:", error);
      console.error("Error Code:", error.code);
      console.error("Error Message:", error.message);
      
      let msg = 'Failed to send password reset email. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        msg = 'No account found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        msg = 'The email address is not valid.';
      } else if (error.code === 'auth/network-request-failed') {
        msg = 'Network error. Please check your internet connection and try again.';
      } else if (error.code === 'auth/unauthorized-domain') {
        msg = 'Domain is not authorized for password reset operations.';
      } else if (error.code === 'auth/too-many-requests') {
        msg = 'Too many requests. Please wait a few minutes before trying again.';
      } else {
        msg = error.message;
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
      const userSnap = await getDoc(userRef).catch(() => null);
      const userData = userSnap?.exists() ? userSnap.data() : {};
      const approvedAt = new Date().toISOString();
      await updateDoc(userRef, { status: 'approved', approvedAt }).catch(() => {});
      const shopRef = doc(db, COLLECTIONS.SHOPS, id);
      await setDoc(shopRef, { ...userData, id, uid: id, status: 'approved', fromShopsCol: true, approvedAt }, { merge: true }).catch(() => {});
      await logActivity('shop', `Shop Approved: "${userData.shopName || userData.name || 'Weaver Partner'}" verified & onboarded`, 'bg-[#2D8F5E]');
    } catch (error) {
      console.error('Error approving shop:', error);
    }
  };

  const rejectShop = async (id) => {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, id);
      const userSnap = await getDoc(userRef).catch(() => null);
      const userData = userSnap?.exists() ? userSnap.data() : {};
      const rejectedAt = new Date().toISOString();
      await updateDoc(userRef, { status: 'rejected', rejectedAt }).catch(() => {});
      const shopRef = doc(db, COLLECTIONS.SHOPS, id);
      await setDoc(shopRef, { status: 'rejected', fromShopsCol: true, rejectedAt }, { merge: true }).catch(() => {});
      await logActivity('shop', `Shop Rejected: "${userData.shopName || userData.name || 'Weaver Partner'}" application denied`, 'bg-red-500');
    } catch (error) {
      console.error('Error rejecting shop:', error);
    }
  };

  const disableShop = async (id) => {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, id);
      const userSnap = await getDoc(userRef).catch(() => null);
      const userData = userSnap?.exists() ? userSnap.data() : {};
      const disableFields = { status: 'disabled', disabledAt: new Date().toISOString() };
      
      await updateDoc(userRef, disableFields).catch(() => {});

      const shopRef = doc(db, COLLECTIONS.SHOPS, id);
      await setDoc(shopRef, { ...disableFields, fromShopsCol: true }, { merge: true }).catch(() => {});

      // Automatically hide all products belonging to this shop
      const q1 = query(collection(db, COLLECTIONS.PRODUCTS), where('shopId', '==', id));
      const snapshot1 = await getDocs(q1);
      
      const q2 = query(collection(db, COLLECTIONS.PRODUCTS), where('ownerId', '==', id));
      const snapshot2 = await getDocs(q2);
      
      const batch = writeBatch(db);
      const disabledProductsMap = new Map();
      
      snapshot1.docs.forEach(d => disabledProductsMap.set(d.id, d));
      snapshot2.docs.forEach(d => disabledProductsMap.set(d.id, d));
      
      disabledProductsMap.forEach((docSnap, docId) => {
        batch.update(doc(db, COLLECTIONS.PRODUCTS, docId), { 
          status: 'disabled'
        });
      });
      
      if (disabledProductsMap.size > 0) {
        await batch.commit().catch(() => {});
      }
      await logActivity('shop', `Shop Disabled: "${userData.shopName || userData.name || 'Weaver Partner'}" access suspended`, 'bg-amber-600');
    } catch (error) {
      console.error('Error disabling shop:', error);
    }
  };

  const enableShop = async (id) => {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, id);
      const userSnap = await getDoc(userRef).catch(() => null);
      const userData = userSnap?.exists() ? userSnap.data() : {};
      const enableFields = { status: 'approved', enabledAt: new Date().toISOString() };
      
      await updateDoc(userRef, enableFields).catch(() => {});

      const shopRef = doc(db, COLLECTIONS.SHOPS, id);
      await setDoc(shopRef, { ...enableFields, fromShopsCol: true }, { merge: true }).catch(() => {});

      // Automatically restore all products belonging to this shop
      const q1 = query(collection(db, COLLECTIONS.PRODUCTS), where('shopId', '==', id));
      const snapshot1 = await getDocs(q1);
      
      const q2 = query(collection(db, COLLECTIONS.PRODUCTS), where('ownerId', '==', id));
      const snapshot2 = await getDocs(q2);
      
      const batch = writeBatch(db);
      const enabledProductsMap = new Map();
      
      snapshot1.docs.forEach(d => enabledProductsMap.set(d.id, d));
      snapshot2.docs.forEach(d => enabledProductsMap.set(d.id, d));
      
      enabledProductsMap.forEach((docSnap, docId) => {
        batch.update(doc(db, COLLECTIONS.PRODUCTS, docId), { 
          status: 'approved'
        });
      });
      
      if (enabledProductsMap.size > 0) {
        await batch.commit().catch(() => {});
      }
      await logActivity('shop', `Shop Enabled: "${userData.shopName || userData.name || 'Weaver Partner'}" re-enabled by Admin`, 'bg-[#2D8F5E]');
    } catch (error) {
      console.error('Error enabling shop:', error);
    }
  };

  const deleteShop = async (id) => {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, id);
      const userSnap = await getDoc(userRef).catch(() => null);
      const userData = userSnap?.exists() ? userSnap.data() : {};

      await deleteDoc(userRef).catch(() => {});
      await deleteDoc(doc(db, COLLECTIONS.SHOPS, id)).catch(() => {});

      const q1 = query(collection(db, COLLECTIONS.PRODUCTS), where('shopId', '==', id));
      const snapshot1 = await getDocs(q1);
      
      const q2 = query(collection(db, COLLECTIONS.PRODUCTS), where('ownerId', '==', id));
      const snapshot2 = await getDocs(q2);
      
      const batch = writeBatch(db);
      const deletedProductsMap = new Map();
      
      snapshot1.docs.forEach(d => deletedProductsMap.set(d.id, d));
      snapshot2.docs.forEach(d => deletedProductsMap.set(d.id, d));
      
      deletedProductsMap.forEach((docSnap, docId) => {
        batch.delete(doc(db, COLLECTIONS.PRODUCTS, docId));
      });
      
      if (deletedProductsMap.size > 0) {
        await batch.commit().catch(() => {});
      }
      await logActivity('shop', `Shop Deleted: "${userData.shopName || userData.name || 'Weaver Partner'}" permanently removed`, 'bg-red-600');
    } catch (error) {
      console.error('Error deleting shop:', error);
    }
  };

  const disableUser = async (id) => {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, id);
      const userSnap = await getDoc(userRef).catch(() => null);
      const userData = userSnap?.exists() ? userSnap.data() : {};
      
      await updateDoc(userRef, { status: 'disabled', disabledAt: new Date().toISOString() }).catch(() => {});
      await logActivity('user', `Customer Disabled: "${userData.name || userData.email || 'User'}" account disabled`, 'bg-amber-500');
    } catch (error) {
      console.error('Error disabling user:', error);
    }
  };

  const enableUser = async (id) => {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, id);
      const userSnap = await getDoc(userRef).catch(() => null);
      const userData = userSnap?.exists() ? userSnap.data() : {};
      
      await updateDoc(userRef, { status: 'active', enabledAt: new Date().toISOString() }).catch(() => {});
      await logActivity('user', `Customer Enabled: "${userData.name || userData.email || 'User'}" account enabled`, 'bg-[#2D8F5E]');
    } catch (error) {
      console.error('Error enabling user:', error);
    }
  };

  const deleteUser = async (id) => {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, id);
      const userSnap = await getDoc(userRef).catch(() => null);
      const userData = userSnap?.exists() ? userSnap.data() : {};
      
      await deleteDoc(userRef).catch(() => {});
      await logActivity('user', `Customer Deleted: "${userData.name || userData.email || 'User'}" account removed`, 'bg-red-600');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const updateLocalUser = (newData) => {
    setUser(prev => ({ ...prev, ...newData }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      role,
      pendingShops,
      allUsers,
      allShops,
      loading,
      register,
      registerShopkeeper,
      approveShop,
      rejectShop,
      disableShop,
      enableShop,
      deleteShop,
      disableUser,
      enableUser,
      deleteUser,
      login,
      signInWithGoogle,
      forgotPassword,
      logout,
      updateUser,
      updateLocalUser,
      isAuthenticated: !!user
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
