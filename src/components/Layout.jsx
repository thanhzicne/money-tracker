import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { MdMenuOpen, MdClose } from 'react-icons/md';

const Layout = ({ children, ...props }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      </main>
    </div>
  );
};

export default Layout;
