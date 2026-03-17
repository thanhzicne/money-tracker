import { useState, useEffect, useMemo } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './useAuth';

const STORAGE_KEYS = {
  SAVINGS_GOAL: 'mt_savings_goal',
};

export const useMoneyTracker = () => {
  const { user } = useAuth();
  
  // --- STATE ---
  const [transactions, setTransactions] = useState([]);
  const [savingsGoal, setSavingsGoal] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVINGS_GOAL);
    return saved ? JSON.parse(saved) : 5000000;
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // --- FIRESTORE SYNC ---
  useEffect(() => {
    if (!user) {
      // Defer state update to avoid synchronous setState warning in useEffect
      const timer = setTimeout(() => {
        setTransactions(prev => prev.length > 0 ? [] : prev);
        setLoading(prev => prev ? false : prev);
      }, 0);
      return () => clearTimeout(timer);
    }

    // Defer state update to avoid synchronous setState warning in useEffect
    const timer = setTimeout(() => {
      setLoading(prev => !prev ? true : prev);
    }, 0);

    const q = query(
      collection(db, 'transactions'), 
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setTransactions(data);
      setLoading(false);
    });

    // Fetch user settings (savings goal)
    const fetchSettings = async () => {
      const settingsDoc = await getDoc(doc(db, 'settings', user.uid));
      if (settingsDoc.exists()) {
        setSavingsGoal(settingsDoc.data().savingsGoal);
      }
    };
    fetchSettings();

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [user]);

  const updateSavingsGoal = async (newGoal) => {
    setSavingsGoal(newGoal);
    if (user) {
      await setDoc(doc(db, 'settings', user.uid), { savingsGoal: newGoal }, { merge: true });
    } else {
      localStorage.setItem(STORAGE_KEYS.SAVINGS_GOAL, JSON.stringify(newGoal));
    }
  };

  // --- DERIVED STATE ---
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === selectedDate.getMonth() && 
             date.getFullYear() === selectedDate.getFullYear();
    });
  }, [transactions, selectedDate]);

  const stats = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    return {
      income,
      expense,
      balance: income - expense
    };
  }, [filteredTransactions]);

  const totalBalance = useMemo(() => {
    return transactions.reduce((sum, t) => {
      return t.type === 'income' ? sum + Number(t.amount) : sum - Number(t.amount);
    }, 0);
  }, [transactions]);

  const savingsProgress = useMemo(() => {
    if (savingsGoal <= 0) return 0;
    const progress = (totalBalance / savingsGoal) * 100;
    return Math.min(Math.max(progress, 0), 100);
  }, [totalBalance, savingsGoal]);

  // --- ACTIONS ---
  const addTransaction = async (t) => {
    if (!user) return;
    await addDoc(collection(db, 'transactions'), {
      ...t,
      userId: user.uid,
      createdAt: new Date().toISOString()
    });
  };

  const updateTransaction = async (updated) => {
    if (!user) return;
    const { id, ...data } = updated;
    await updateDoc(doc(db, 'transactions', id), data);
  };

  const deleteTransaction = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, 'transactions', id));
  };

  const changeMonth = (offset) => {
    const nextDate = new Date(selectedDate);
    nextDate.setMonth(nextDate.getMonth() + offset);
    setSelectedDate(nextDate);
  };

  return {
    transactions,
    filteredTransactions,
    stats,
    totalBalance,
    savingsGoal,
    setSavingsGoal: updateSavingsGoal,
    savingsProgress,
    selectedDate,
    setSelectedDate,
    changeMonth,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    loading
  };
};
