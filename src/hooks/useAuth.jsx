import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup,
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
  
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
