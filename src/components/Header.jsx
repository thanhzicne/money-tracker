import React from 'react';
import { useTranslation } from 'react-i18next';
import { MdAccountBalanceWallet, MdNotifications } from 'react-icons/md';
import CustomSelect from './CustomSelect';

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

  const walletOptions = [
    { value: 'all', label: `${t('all')} ${t('wallets')}`, icon: '🌍' },
    ...(wallets?.map(w => ({ 
      value: w.id, 
      label: w.name, 
      icon: w.icon || '💳' 
    })) || [])
  ];

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 pb-4 md:pb-6 border-b border-zinc-100 dark:border-zinc-800/50 gap-4 sm:gap-0">
      <div className="min-w-0">
        <h2 className="text-xl md:text-2xl font-black text-zinc-800 dark:text-white tracking-tight">{getPageTitle()}</h2>
        <p className="text-[9px] md:text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mt-1">
          {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        {/* Global Wallet Filter */}
        <CustomSelect
          value={activeWalletId}
          onChange={setActiveWalletId}
          options={walletOptions}
          icon={MdAccountBalanceWallet}
          className="flex-1 sm:flex-none sm:min-w-[200px]"
        />

        <button className="p-2.5 md:p-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-zinc-400 hover:text-emerald-500 transition-all shadow-sm group flex-shrink-0">
          <MdNotifications className="group-hover:animate-shake" size={18} />
        </button>
      </div>
    </header>
  );
};

export default Header;
