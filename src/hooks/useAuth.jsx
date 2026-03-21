import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Luôn xử lý redirect OAuth TRƯỚC rồi mới subscribe onAuthStateChanged — tránh race
  // (Safari hay gặp: callback auth chạy trước khi redirect hoàn tất → user = null → kẹt ở Login).
  useEffect(() => {
    let cancelled = false;
    let unsubscribe = () => {};

    (async function initAuth() {
      try {
        await getRedirectResult(auth);
      } catch (e) {
        console.error(e);
      }
      if (cancelled) return;

      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (cancelled) return;
        setUser(currentUser);
        setLoading(false);
      });
    })();

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const loginWithGoogle = async () => {
    const ua = navigator.userAgent || '';
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isSafari =
      /Safari/i.test(ua) &&
      !/Chrome|CriOS|Edg|OPR|FxiOS|Android/i.test(ua);

    // Mobile/Safari: ưu tiên redirect + local persistence để ổn định sau vòng OAuth.
    if (isMobile || isSafari) {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch {
        await setPersistence(auth, browserSessionPersistence);
      }
      return signInWithRedirect(auth, googleProvider);
    }

    // Desktop: dùng popup cho UX nhanh hơn, nếu storage local không khả dụng thì fallback session.
    try {
      await setPersistence(auth, browserLocalPersistence);
    } catch {
      await setPersistence(auth, browserSessionPersistence);
    }

    try {
      return await signInWithPopup(auth, googleProvider);
    } catch (error) {
      const fallbackCodes = new Set([
        'auth/popup-blocked',
        'auth/popup-closed-by-user',
        'auth/cancelled-popup-request'
      ]);
      if (fallbackCodes.has(error?.code)) {
        return signInWithRedirect(auth, googleProvider);
      }
      throw error;
    }
  };
  
  const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const loginWithUsername = async (username, password) => {
    // 1. Find email by username in 'users' collection
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error('Tên đăng nhập không tồn tại');
    }

    const userData = querySnapshot.docs[0].data();
    const email = userData.email;

    // 2. Login with email and password
    return signInWithEmailAndPassword(auth, email, password);
  };
  
  const signupWithEmail = async (email, password, displayName, username) => {
    // 1. Check if username exists
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username.toLowerCase()));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      throw new Error('Tên đăng nhập đã được sử dụng');
    }

    // 2. Create user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // 3. Update profile
    await updateProfile(userCredential.user, { displayName });

    // 4. Save username mapping in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      uid: userCredential.user.uid,
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      displayName: displayName,
      createdAt: new Date().toISOString()
    });

    return userCredential;
  };

  const logout = () => signOut(auth);

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const value = {
    user,
    loading,
    loginWithGoogle,
    loginWithEmail,
    loginWithUsername,
    signupWithEmail,
    resetPassword,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
