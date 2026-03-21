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
  const [authSystemError, setAuthSystemError] = useState(null);

  // Xử lý getRedirectResult ngay khi app khởi tạo để khắc phục vòng lặp Login do Mobile rớt phiên.
  useEffect(() => {
    let cancelled = false;
    let unsubscribe = () => {};

    (async function initAuth() {
      try {
        const result = await getRedirectResult(auth);
        if (!result) {
          // Kiểm tra xem chúng ta có vừa mới kích hoạt vòng lặp redirect không
          if (window.localStorage.getItem('awaiting_redirect') === 'true') {
             // Đã redirect xong nhưng kết quả rỗng => Safari ITP đã xoá session!
             setAuthSystemError("Trình duyệt Safari/iOS đã chặn liên kết Đăng nhập (Lỗi ITP). Vui lòng tắt 'Prevent Cross-Site Tracking' trong Cài đặt Safari, hoặc không dùng PWA/Local IP.");
          }
        }
        window.localStorage.removeItem('awaiting_redirect');
      } catch (e) {
        console.error("Redirect Error:", e);
        window.localStorage.removeItem('awaiting_redirect');
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
    // Nếu là iOS PWA (Standalone), Popup sẽ mở ra ngoài Safari và kẹt ở đó. Nên ép dùng Redirect.
    const isIos = /Mac|iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    
    if (isIos && isStandalone) {
       window.localStorage.setItem('awaiting_redirect', 'true');
       setPersistence(auth, browserLocalPersistence).catch(()=>{});
       return signInWithRedirect(auth, googleProvider);
    }

    return signInWithPopup(auth, googleProvider).catch((error) => {
      const fallbackCodes = new Set([
        'auth/popup-blocked',
        'auth/popup-closed-by-user',
        'auth/cancelled-popup-request'
      ]);
      if (fallbackCodes.has(error?.code)) {
        window.localStorage.setItem('awaiting_redirect', 'true');
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
    authSystemError,
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