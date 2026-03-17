import React from 'react';
import { useTranslation } from 'react-i18next';
import { MdAccountBalanceWallet, MdNotifications } from 'react-icons/md';

const Header = ({ wallets, activeWalletId, setActiveWalletId, activePage }) => {
  const { t } = useTranslation();

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard': return t('dashboard');
      case 'analytics': return t('analytics');
      case 'wallets': return t('wallets_management');
      case 'profile': return t('profile');
      default: return t('dashboard');
    }
  };

  return (
    <header className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-100 dark:border-zinc-800/50">
      <div>
        <h2 className="text-2xl font-black text-zinc-800 dark:text-white tracking-tight">{getPageTitle()}</h2>
        <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mt-1">
          {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Global Wallet Filter */}
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500">
            <MdAccountBalanceWallet size={18} />
          </div>
          <select
            value={activeWalletId}
            onChange={(e) => setActiveWalletId(e.target.value)}
            className="pl-11 pr-10 py-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl font-black text-[10px] uppercase tracking-widest outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-sm transition-all cursor-pointer appearance-none min-w-[180px]"
          >
            <option value="all">{t('all')} {t('wallets')}</option>
            {wallets?.map(w => (
              <option key={w.id} value={w.id}>{w.icon} {w.name}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        <button className="p-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-zinc-400 hover:text-emerald-500 transition-all shadow-sm">
          <MdNotifications size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
