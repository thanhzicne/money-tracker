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
  getDoc,
  or
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
  const [wallets, setWallets] = useState([]);
  const [activeWalletId, setActiveWalletId] = useState('all');
  const [savingsGoal, setSavingsGoal] = useState(5000000);
  const [budgets, setBudgets] = useState([]);
  const [debts, setDebts] = useState([]);
  const [investments, setInvestments] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // --- FIRESTORE SYNC ---
  useEffect(() => {
    if (!user) {
      // Defer state update to avoid synchronous setState warning in useEffect
      const timer = setTimeout(() => {
        setTransactions(prev => prev.length > 0 ? [] : prev);
        setWallets(prev => prev.length > 0 ? [] : prev);
        setLoading(prev => prev ? false : prev);
      }, 0);
      return () => clearTimeout(timer);
    }

    // Defer state update to avoid synchronous setState warning in useEffect
    const timer = setTimeout(() => {
      setLoading(prev => !prev ? true : prev);
    }, 0);

    // 1. Transactions Sync
    const qTransactions = query(
      collection(db, 'transactions'), 
      or(
        where('userId', '==', user.uid),
        where('memberEmails', 'array-contains', user.email)
      )
    );

    const unsubTransactions = onSnapshot(qTransactions, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setTransactions(data);
      setLoading(false);
      
      // Check for recurring transactions
      checkRecurring(data, user.uid);
    });

    // 2. Wallets Sync
    const qWallets = query(
      collection(db, 'wallets'),
      or(
        where('userId', '==', user.uid),
        where('memberEmails', 'array-contains', user.email)
      )
    );

    const unsubWallets = onSnapshot(qWallets, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setWallets(data);
    });

    // 3. Budgets Sync
    const qBudgets = query(
      collection(db, 'budgets'),
      or(
        where('userId', '==', user.uid),
        where('memberEmails', 'array-contains', user.email)
      )
    );

    const unsubBudgets = onSnapshot(qBudgets, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setBudgets(data);
    });

    // 4. Debts Sync
    const qDebts = query(
      collection(db, 'debts'),
      or(
        where('userId', '==', user.uid),
        where('memberEmails', 'array-contains', user.email)
      )
    );

    const unsubDebts = onSnapshot(qDebts, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setDebts(data);
    });

    // 5. Investments Sync
    const qInvestments = query(
      collection(db, 'investments'),
      or(
        where('userId', '==', user.uid),
        where('memberEmails', 'array-contains', user.email)
      )
    );

    const unsubInvestments = onSnapshot(qInvestments, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setInvestments(data);
    });

    // Fetch user settings (savings goal)
    const fetchSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', user.uid));
        if (settingsDoc.exists()) {
          setSavingsGoal(settingsDoc.data().savingsGoal);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();

    return () => {
      clearTimeout(timer);
      unsubTransactions();
      unsubWallets();
      unsubBudgets();
      unsubDebts();
      unsubInvestments();
    };
  }, [user]);

  // --- RECURRING LOGIC ---
  const checkRecurring = async (allTransactions, uid) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Find recurring templates
    const recurringTemplates = allTransactions.filter(t => t.isRecurring && !t.parentRecurringId);

    for (const template of recurringTemplates) {
      // Check if this month already has an entry for this template
      const hasEntry = allTransactions.some(t => 
        t.parentRecurringId === template.id && 
        new Date(t.date).getMonth() === currentMonth &&
        new Date(t.date).getFullYear() === currentYear
      );

      if (!hasEntry) {
        // Create new entry for current month
        const newDate = new Date(template.date);
        newDate.setMonth(currentMonth);
        newDate.setFullYear(currentYear);

        await addDoc(collection(db, 'transactions'), {
          ...template,
          date: newDate.toISOString().split('T')[0],
          parentRecurringId: template.id,
          userId: uid, // Ensure userId is passed
          memberEmails: template.memberEmails || [user.email],
          createdAt: new Date().toISOString(),
        });
      }
    }
  };

  const updateSavingsGoal = async (newGoal) => {
    setSavingsGoal(newGoal);
    if (user) {
      await setDoc(doc(db, 'settings', user.uid), { savingsGoal: newGoal }, { merge: true });
    }
  };

  // --- DERIVED STATE ---
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const date = new Date(t.date);
      const matchesMonth = date.getMonth() === selectedDate.getMonth() && 
                          date.getFullYear() === selectedDate.getFullYear();
      const matchesWallet = activeWalletId === 'all' || t.walletId === activeWalletId;
      return matchesMonth && matchesWallet;
    });
  }, [transactions, selectedDate, activeWalletId]);

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
    // 1. Calculate sum of initial balances
    const initialSum = wallets
      .filter(w => activeWalletId === 'all' || w.id === activeWalletId)
      .reduce((sum, w) => sum + Number(w.initialBalance || 0), 0);

    // 2. Calculate sum of transactions
    const filteredTransactions = activeWalletId === 'all' 
      ? transactions 
      : transactions.filter(t => t.walletId === activeWalletId);

    const transactionsSum = filteredTransactions.reduce((sum, t) => {
      if (t.type === 'transfer') {
        // Transfers are handled by the individual linked transactions usually, 
        // but if we have a single 'transfer' type, we need to know if it's 'from' or 'to'.
        // However, the prompt says "tự động sinh ra 2 giao dịch ngầm đồng thời".
        // So we should expect 2 transactions for each transfer.
        return sum; 
      }
      return t.type === 'income' ? sum + Number(t.amount) : sum - Number(t.amount);
    }, 0);

    return initialSum + transactionsSum;
  }, [transactions, wallets, activeWalletId]);

  const netWorth = useMemo(() => {
    const investSum = investments.reduce((sum, i) => sum + Number(i.currentValue || i.initialValue || 0), 0);
    const loanSum = debts.filter(d => d.type === 'loan').reduce((sum, d) => sum + (d.totalAmount - (d.paidAmount || 0)), 0);
    const borrowSum = debts.filter(d => d.type === 'borrow').reduce((sum, d) => sum + (d.totalAmount - (d.paidAmount || 0)), 0);
    return totalBalance + investSum + loanSum - borrowSum;
  }, [totalBalance, investments, debts]);

  const savingsProgress = useMemo(() => {
    if (savingsGoal <= 0) return 0;
    const progress = (totalBalance / savingsGoal) * 100;
    return Math.min(Math.max(progress, 0), 100);
  }, [totalBalance, savingsGoal]);

  // --- ACTIONS ---
  const addTransaction = async (t) => {
    if (!user) return;
    
    // Budget & large transaction warning logic
    if (t.type === 'expense') {
      const amount = Number(t.amount);
      if (amount >= 5000000) {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Giao dịch Lớn", { body: `Bạn vừa ghi nhận một khoản chi khá lớn (${amount.toLocaleString()}đ)` });
        }
      }

      // Check budget threshold
      const month = t.date.slice(0, 7); // YYYY-MM
      const relatedBudget = budgets.find(b => b.category === t.category && b.month === month);
      
      if (relatedBudget) {
        const currentSpent = transactions
          .filter(tx => tx.type === 'expense' && tx.category === t.category && tx.date.startsWith(month))
          .reduce((sum, tx) => sum + Number(tx.amount), 0);
        
        const newSpent = currentSpent + amount;
        const limit80 = relatedBudget.amount * 0.8;
        
        let alertMsg = '';
        if (newSpent > relatedBudget.amount && currentSpent <= relatedBudget.amount) {
          alertMsg = `CẢNH BÁO: Đã vượt 100% ngân sách cho "${t.category}" tháng này!`;
        } else if (newSpent >= limit80 && currentSpent < limit80) {
          alertMsg = `CẢNH BÁO: Bạn đã dùng hơn 80% ngân sách cho "${t.category}" tháng này!`;
        }
        
        if (alertMsg) {
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Cảnh báo Ngân sách", { body: alertMsg });
          } else {
            alert(alertMsg);
          }
        }
      }
    }

    const wallet = wallets.find(w => w.id === t.walletId);
    const memberEmails = wallet?.memberEmails || [user.email];

    await addDoc(collection(db, 'transactions'), {
      ...t,
      userId: user.uid,
      memberEmails,
      createdAt: new Date().toISOString()
    });
  };

  const addTransfer = async (transferData) => {
    if (!user) return;
    const { fromWalletId, toWalletId, amount, date, note } = transferData;
    const fromWallet = wallets.find(w => w.id === fromWalletId);
    const toWallet = wallets.find(w => w.id === toWalletId);

    const transferGroupId = crypto.randomUUID();

    // 1. Expense from source wallet
    await addDoc(collection(db, 'transactions'), {
      amount: Number(amount),
      type: 'expense',
      category: 'Chuyển tiền',
      date,
      note: note || `Chuyển đến ${toWallet?.name}`,
      walletId: fromWalletId,
      walletName: fromWallet?.name,
      userId: user.uid,
      memberEmails: fromWallet?.memberEmails || [user.email],
      transferGroupId,
      createdAt: new Date().toISOString()
    });

    // 2. Income to destination wallet
    await addDoc(collection(db, 'transactions'), {
      amount: Number(amount),
      type: 'income',
      category: 'Nhận tiền',
      date,
      note: note || `Nhận từ ${fromWallet?.name}`,
      walletId: toWalletId,
      walletName: toWallet?.name,
      userId: user.uid,
      memberEmails: toWallet?.memberEmails || [user.email],
      transferGroupId,
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

  const addWallet = async (wallet) => {
    if (!user) return;
    await addDoc(collection(db, 'wallets'), {
      ...wallet,
      userId: user.uid,
      memberEmails: [user.email],
      createdAt: new Date().toISOString()
    });
  };

  const updateWallet = async (updated) => {
    if (!user) return;
    const { id, ...data } = updated;
    await updateDoc(doc(db, 'wallets', id), data);
  };

  const deleteWallet = async (id) => {
    if (!user) return;
    // Basic check: don't delete if there are transactions
    const hasTransactions = transactions.some(t => t.walletId === id);
    if (hasTransactions) {
      throw new Error("Cannot delete wallet with existing transactions");
    }
    await deleteDoc(doc(db, 'wallets', id));
  };

  const changeMonth = (offset) => {
    const nextDate = new Date(selectedDate);
    nextDate.setMonth(nextDate.getMonth() + offset);
    setSelectedDate(nextDate);
  };

  const addBudget = async (budget) => {
    if (!user) return;
    await addDoc(collection(db, 'budgets'), {
      ...budget,
      userId: user.uid,
      memberEmails: [user.email],
      createdAt: new Date().toISOString()
    });
  };

  const updateBudget = async (updated) => {
    if (!user) return;
    const { id, ...data } = updated;
    await updateDoc(doc(db, 'budgets', id), data);
  };

  const deleteBudget = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, 'budgets', id));
  };

  const addDebt = async (debt) => {
    if (!user) return;
    await addDoc(collection(db, 'debts'), {
      ...debt,
      userId: user.uid,
      memberEmails: [user.email],
      createdAt: new Date().toISOString()
    });
  };

  const updateDebt = async (updated) => {
    if (!user) return;
    const { id, ...data } = updated;
    await updateDoc(doc(db, 'debts', id), data);
  };

  const deleteDebt = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, 'debts', id));
  };

  const addInvestment = async (inv) => {
    if (!user) return;
    await addDoc(collection(db, 'investments'), {
      ...inv,
      userId: user.uid,
      memberEmails: [user.email],
      createdAt: new Date().toISOString()
    });
  };

  const updateInvestment = async (updated) => {
    if (!user) return;
    const { id, ...data } = updated;
    await updateDoc(doc(db, 'investments', id), data);
  };

  const deleteInvestment = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, 'investments', id));
  };

  return {
    transactions,
    filteredTransactions,
    wallets,
    activeWalletId,
    setActiveWalletId,
    addWallet,
    updateWallet,
    deleteWallet,
    stats,
    totalBalance,
    savingsGoal,
    setSavingsGoal: updateSavingsGoal,
    savingsProgress,
    selectedDate,
    setSelectedDate,
    changeMonth,
    addTransaction,
    addTransfer,
    updateTransaction,
    deleteTransaction,
    budgets,
    addBudget,
    updateBudget,
    deleteBudget,
    debts,
    addDebt,
    updateDebt,
    deleteDebt,
    investments,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    netWorth,
    loading
  };
};
