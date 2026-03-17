import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children, ...props }) => {
  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      <Sidebar {...props} />
      <main className="flex-1 overflow-y-auto p-8 lg:ml-64 bg-transparent">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
