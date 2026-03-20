import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Wallets from './pages/Wallets';
import Budgeting from './pages/Budgeting';
import Debts from './pages/Debts';
import Investments from './pages/Investments';
import Login from './pages/Login';
import { useMoneyTracker } from './hooks/useMoneyTracker';
import { AuthProvider, useAuth } from './hooks/useAuth';

import { ThemeProvider } from './hooks/useTheme';

function AppContent() {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const tracker = useMoneyTracker();

  if (!user) {
    return <Login />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard {...tracker} setActivePage={setActivePage} />;
      case 'analytics':
        return (
          <Analytics 
            transactions={tracker.transactions} 
            selectedDate={tracker.selectedDate} 
          />
        );
      case 'wallets':
        return (
          <Wallets 
            wallets={tracker.wallets}
            addWallet={tracker.addWallet}
            updateWallet={tracker.updateWallet}
            deleteWallet={tracker.deleteWallet}
            totalBalance={tracker.totalBalance}
            transactions={tracker.transactions}
          />
        );
      case 'budgeting':
        return (
          <Budgeting 
            budgets={tracker.budgets}
            addBudget={tracker.addBudget}
            updateBudget={tracker.updateBudget}
            deleteBudget={tracker.deleteBudget}
            transactions={tracker.transactions}
            selectedDate={tracker.selectedDate}
          />
        );
      case 'debts':
        return (
          <Debts 
            debts={tracker.debts}
            addDebt={tracker.addDebt}
            updateDebt={tracker.updateDebt}
            deleteDebt={tracker.deleteDebt}
            wallets={tracker.wallets}
            addTransaction={tracker.addTransaction}
          />
        );
      case 'investments':
        return (
          <Investments 
            investments={tracker.investments}
            addInvestment={tracker.addInvestment}
            updateInvestment={tracker.updateInvestment}
            deleteInvestment={tracker.deleteInvestment}
            netWorth={tracker.netWorth}
          />
        );
      case 'profile':
        return (
          <Profile 
            transactionsCount={tracker.transactions.length}
            totalBalance={tracker.totalBalance}
            netWorth={tracker.netWorth}
            stats={tracker.stats}
            savingsProgress={tracker.savingsProgress}
          />
        );
      default:
        return <Dashboard {...tracker} />;
    }
  };

  return (
    <Layout 
      selectedDate={tracker.selectedDate}
      changeMonth={tracker.changeMonth}
      activePage={activePage}
      setActivePage={setActivePage}
    >
      {tracker.loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        renderPage()
      )}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
