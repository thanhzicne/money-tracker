import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MdAccountBalanceWallet, MdNotifications, MdWarningAmber, MdNotificationsNone } from 'react-icons/md';
import CustomSelect from './CustomSelect';

const Header = ({ wallets, activeWalletId, setActiveWalletId, activePage, budgets = [] }) => {
  const { t, i18n } = useTranslation();
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = useMemo(() => {
    const alerts = [];
    budgets.forEach(b => {
      if (b.amount > 0) {
        const ratio = b.spent / b.amount;
        if (ratio >= 1) {
          alerts.push({
            id: b.id + '_exceeded',
            title: i18n.language === 'vi' ? 'Ngân sách vượt mức' : 'Budget Exceeded',
            message: i18n.language === 'vi' 
              ? `Bạn đã chi tiêu vượt hạn mức ${b.category}!`
              : `You have exceeded your ${b.category} budget!`,
            type: 'danger'
          });
        } else if (ratio >= 0.8) {
          alerts.push({
            id: b.id + '_warning',
            title: i18n.language === 'vi' ? 'Cảnh báo Ngân sách' : 'Budget Warning',
            message: i18n.language === 'vi'
              ? `Bạn đã tiêu hết ${Math.round(ratio * 100)}% hạn mức ${b.category}.`
              : `You have spent ${Math.round(ratio * 100)}% of your ${b.category} budget.`,
            type: 'warning'
          });
        }
      }
    });
    return alerts;
  }, [budgets, i18n.language]);

  const hasUnread = notifications.length > 0;

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

      <div className="flex items-center gap-3 w-full sm:w-auto relative" ref={notifRef}>
        {/* Global Wallet Filter */}
        <CustomSelect
          value={activeWalletId}
          onChange={setActiveWalletId}
          options={walletOptions}
          icon={MdAccountBalanceWallet}
          className="flex-1 sm:flex-none sm:min-w-[200px]"
        />

        <div className="relative">
          <button 
            onClick={() => setShowNotif(!showNotif)}
            className="p-2.5 md:p-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-zinc-400 hover:text-emerald-500 transition-all shadow-sm group flex-shrink-0 relative"
          >
            <MdNotifications className="group-hover:animate-shake" size={18} />
            {hasUnread && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse border border-white dark:border-zinc-900"></span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-black/50 overflow-hidden animate-fade-in z-50">
              <div className="p-4 border-b border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="font-bold text-zinc-800 dark:text-zinc-100">
                  {i18n.language === 'vi' ? 'Thông báo' : 'Notifications'}
                </h3>
                {hasUnread && (
                  <span className="bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                    {notifications.length} {i18n.language === 'vi' ? 'MỚI' : 'NEW'}
                  </span>
                )}
              </div>
              
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-3">
                      <MdNotificationsNone size={24} className="text-zinc-400 dark:text-zinc-500" />
                    </div>
                    <p className="text-sm font-bold text-zinc-600 dark:text-zinc-300">
                      {i18n.language === 'vi' ? 'Không có thông báo mới' : 'No new notifications'}
                    </p>
                    <p className="text-xs text-zinc-400 mt-1">
                      {i18n.language === 'vi' ? 'Bạn đang quản lý tài chính rất tốt!' : 'You are managing your finances well!'}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50 p-2">
                    {notifications.map(notif => (
                      <div key={notif.id} className="p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 rounded-xl transition-colors flex gap-4 items-start group">
                        <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 shadow-sm 
                          ${notif.type === 'danger' ? 'bg-rose-50 text-rose-500 border border-rose-100 dark:bg-rose-900/20 dark:border-rose-900/30' : 'bg-amber-50 text-amber-500 border border-amber-100 dark:bg-amber-900/20 dark:border-amber-900/30'}`}>
                          <MdWarningAmber size={20} className={notif.type === 'danger' ? 'animate-pulse' : ''} />
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <p className="font-bold text-sm text-zinc-800 dark:text-zinc-200 truncate">{notif.title}</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">{notif.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
