import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
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

  // Xử lý getRedirectResult ngay khi app khởi tạo để khắc phục vòng lặp Login do Mobile rớt phiên.
  useEffect(() => {
    let cancelled = false;
    let unsubscribe = () => {};

    (async function initAuth() {
      try {
        await getRedirectResult(auth);
      } catch (e) {
        console.error("Redirect Error:", e);
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

  const loginWithGoogle = () => {
    // 1. Dùng Popup ngay lập tức và ĐỒNG BỘ (Không async/await ở cấp này) để Safari không chặn chức năng Popup.
    return signInWithPopup(auth, googleProvider).catch((error) => {
      const fallbackCodes = new Set([
        'auth/popup-blocked',
        'auth/popup-closed-by-user',
        'auth/cancelled-popup-request'
      ]);
      // 2. Chạy Fallback nếu bất đắc dĩ bị chặn
      if (fallbackCodes.has(error?.code)) {
        setPersistence(auth, browserLocalPersistence).catch(()=>{});
        return signInWithRedirect(auth, googleProvider);
      }
      throw error;
    });
  };
  
  const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const loginWithUsername = async (username, password) => {
    // 1. Find email by username
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error('Tên đăng nhập không tồn tại');
    }

    const userData = querySnapshot.docs[0].data();
    const email = userData.email;

    // 2. Login with email
    return signInWithEmailAndPassword(auth, email, password);
  };
  
  const signupWithEmail = async (email, password, displayName, username) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username.toLowerCase()));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      throw new Error('Tên đăng nhập đã được sử dụng');
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    await updateProfile(userCredential.user, { displayName });

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