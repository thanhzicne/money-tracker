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

  const loginWithGoogle = async () => {
    try {
      // 1. Dùng Popup ngay lập tức để không bị trình duyệt nhận diện nhầm Popup-ẩn.
      return await signInWithPopup(auth, googleProvider);
    } catch (error) {
      const fallbackCodes = new Set([
        'auth/popup-blocked',
        'auth/popup-closed-by-user',
        'auth/cancelled-popup-request'
      ]);
      // 2. Nếu popup bị trình duyệt chặn (đặc biệt: Safari, Chrome Mobile tích hợp) => Dùng Redirect
      if (fallbackCodes.has(error?.code)) {
        try {
          // Buộc sử dụng localStorage trước khi Redirect để không lặp lại lỗi mất phiên.
          await setPersistence(auth, browserLocalPersistence);
        } catch (e) {
          console.warn("Chưa thể lưu Persistence:", e);
        }
        return signInWithRedirect(auth, googleProvider);
      }
      throw error;
    }
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