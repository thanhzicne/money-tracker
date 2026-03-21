import React, { useState, useRef } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { MdMenuOpen, MdClose, MdKeyboardArrowUp } from 'react-icons/md';

const Layout = ({ children, ...props }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      // Vì Layout linh hoạt nên thanh cuộn thường nằm ở window (trình duyệt)
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden z-30 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar {...props} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="flex-1 overflow-y-auto bg-transparent w-full transition-all duration-300">
        <div className="p-4 md:p-6 lg:p-8 w-full">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                aria-label="Open Menu"
              >
                {sidebarOpen ? (
                  <MdClose size={24} className="text-zinc-800 dark:text-white" />
                ) : (
                  <MdMenuOpen size={24} className="text-zinc-800 dark:text-white" />
                )}
              </button>
              <h1 className="text-lg font-black text-emerald-600 dark:text-emerald-400">{props.activePage}</h1>
            </div>
            <Header 
              wallets={props.wallets} 
              activeWalletId={props.activeWalletId} 
              setActiveWalletId={props.setActiveWalletId}
              activePage={props.activePage}
              budgets={props.budgets}
            />
            {children}
          </div>
        </div>
        
        {/* Nút cuộn lên đầu trang */}
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-6 md:bottom-10 md:right-10 p-3 rounded-full bg-emerald-500 text-white shadow-xl hover:bg-emerald-600 hover:shadow-emerald-500/30 active:scale-95 transition-all duration-300 z-50 transform ${
            showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'
          }`}
          aria-label="Cuộn lên đầu trang"
        >
          <MdKeyboardArrowUp size={28} />
        </button>
      </main>
    </div>
  );
};

export default Layout;
