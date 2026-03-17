import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
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
        return <Dashboard {...tracker} />;
      case 'analytics':
        return (
          <Analytics 
            transactions={tracker.transactions} 
            selectedDate={tracker.selectedDate} 
          />
        );
      case 'profile':
        return (
          <Profile 
            transactionsCount={tracker.transactions.length}
            totalBalance={tracker.totalBalance}
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
