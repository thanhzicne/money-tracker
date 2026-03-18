import React from 'react';
import { useTranslation } from 'react-i18next';
import { MdTrendingUp, MdTrendingDown, MdAccountBalanceWallet } from 'react-icons/md';

const SummaryCards = ({ stats }) => {
  const { t, i18n } = useTranslation();
  const cards = [
    {
      title: t('total_income'),
      amount: stats.income,
      color: 'bg-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      icon: <MdTrendingUp size={24} />,
      textColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      title: t('total_expense'),
      amount: stats.expense,
      color: 'bg-rose-500',
      bg: 'bg-rose-50 dark:bg-rose-500/10',
      icon: <MdTrendingDown size={24} />,
      textColor: 'text-rose-600 dark:text-rose-400'
    },
    {
      title: t('total_balance'),
      amount: stats.balance,
      color: 'bg-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      icon: <MdAccountBalanceWallet size={24} />,
      textColor: 'text-emerald-600 dark:text-emerald-400'
    },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(i18n.language === 'vi' ? 'vi-VN' : 'en-US', { 
      style: 'currency', 
      currency: i18n.language === 'vi' ? 'VND' : 'USD' 
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
      {cards.map((card, index) => (
        <div key={index} className="card group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-5 sm:p-6 lg:p-7 relative overflow-hidden">
          <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 transition-transform group-hover:scale-150 ${card.color}`}></div>
          <div className={`p-3 sm:p-4 rounded-2xl shadow-sm ${card.bg} ${card.textColor} transition-transform group-hover:scale-110`}>
            {card.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 line-clamp-1">{card.title}</p>
            <h3 className={`text-lg sm:text-2xl font-black tracking-tight break-words ${card.textColor}`}>
              {formatCurrency(card.amount)}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
