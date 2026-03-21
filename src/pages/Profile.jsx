import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { MdEmail, MdPerson, MdLogout, MdDateRange, MdStars, MdSecurityUpdateGood, MdTrendingUp, MdSavings, MdLocalFireDepartment, MdOutlineMail, MdAutoAwesome } from 'react-icons/md';

const Profile = ({ transactionsCount, totalBalance, netWorth, stats, savingsProgress, transactions = [], emailReport, updateEmailReportSetting }) => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(i18n.language === 'vi' ? 'vi-VN' : 'en-US', { 
      style: 'currency', 
      currency: i18n.language === 'vi' ? 'VND' : 'USD' 
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const calculateHealthScore = () => {
    let score = 0;
    
    // 1. Income vs Expense (Max 40)
    if (stats.expense === 0 && stats.income > 0) score += 40;
    else if (stats.income > 0) {
      const ratio = stats.income / stats.expense;
      if (ratio >= 1.5) score += 40;
      else if (ratio >= 1.1) score += 30;
      else if (ratio >= 1.0) score += 20;
      else score += 10;
    }

    // 2. Savings Progress (Max 30)
    score += (savingsProgress * 0.3);

    // 3. Net Worth (Max 30)
    if (netWorth > 50000000) score += 30;
    else if (netWorth > 10000000) score += 20;
    else if (netWorth > 0) score += 10;

    // 4. Consecutive Savings (Max 20)
    let consecutiveSavings = 0;
    if (transactions.length > 0) {
      const monthlyStats = {};
      transactions.forEach(t => {
        const date = new Date(t.date);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        if (!monthlyStats[key]) monthlyStats[key] = { income: 0, expense: 0 };
        monthlyStats[key][t.type] += Number(t.amount);
      });
      const sortedMonths = Object.keys(monthlyStats).sort((a, b) => {
        const [yA, mA] = a.split('-');
        const [yB, mB] = b.split('-');
        return new Date(yB, mB) - new Date(yA, mA);
      });
      for (const month of sortedMonths) {
        if (monthlyStats[month].income > monthlyStats[month].expense) consecutiveSavings++;
        else break;
      }
    }
    score += Math.min(consecutiveSavings * 5, 20);

    return Math.min(Math.round(score), 100);
  };

  const healthScore = calculateHealthScore();
  let scoreColor = 'text-emerald-500';
  let scoreBg = 'bg-emerald-100';
  if (healthScore < 50) { scoreColor = 'text-rose-500'; scoreBg = 'bg-rose-100'; }
  else if (healthScore < 80) { scoreColor = 'text-amber-500'; scoreBg = 'bg-amber-100'; }

  let consecutiveMonths = 0;
  if (transactions && transactions.length > 0) {
    const monthlyStats = {};
    transactions.forEach(t => {
      const date = new Date(t.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!monthlyStats[key]) monthlyStats[key] = { income: 0, expense: 0 };
      monthlyStats[key][t.type] += Number(t.amount);
    });
    const sortedMonths = Object.keys(monthlyStats).sort((a, b) => {
      const [yA, mA] = a.split('-');
      const [yB, mB] = b.split('-');
      return new Date(yB, mB) - new Date(yA, mA);
    });
    for (const month of sortedMonths) {
      if (monthlyStats[month].income > monthlyStats[month].expense) consecutiveMonths++;
      else break;
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700">
        <div className="h-32 bg-blue-600 dark:bg-blue-900/40"></div>
        <div className="px-8 pb-8">
          <div className="relative -mt-16 flex flex-col md:flex-row items-end gap-6 mb-8">
            <div className="relative p-1 bg-white dark:bg-slate-800 rounded-3xl shadow-xl">
              <img 
                src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'User'}&background=random`} 
                alt="Avatar" 
                className="w-32 h-32 rounded-2xl object-cover"
              />
              <div className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 text-white rounded-xl shadow-lg border-4 border-white dark:border-slate-800">
                <MdStars size={20} />
              </div>
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{user?.displayName || t('user')}</h1>
              <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1 font-medium">
                <MdEmail size={18} className="text-blue-500" />
                {user?.email}
              </p>
            </div>
            <button
              onClick={logout}
              className="px-6 py-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl font-bold flex items-center gap-2 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all shadow-sm active:scale-[0.98]"
            >
              <MdLogout size={20} />
              {t('logout')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-50 dark:bg-slate-700/50 rounded-2xl border border-gray-100 dark:border-slate-600/50">
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">{t('total_assets')}</p>
              <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">
                {formatCurrency(totalBalance)}
              </h3>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-slate-700/50 rounded-2xl border border-gray-100 dark:border-slate-600/50">
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">{t('transactions_count')}</p>
              <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
                {transactionsCount}
              </h3>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-slate-700/50 rounded-2xl border border-gray-100 dark:border-slate-600/50">
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">{t('joined_date')}</p>
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 tracking-tight flex items-center gap-2">
                <MdDateRange size={20} className="text-blue-500" />
                {formatDate(user?.metadata.creationTime)}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-8 bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 border-2 border-indigo-100 dark:border-slate-700">
        <h2 className="text-xl font-black text-indigo-800 dark:text-indigo-400 mb-6 flex items-center gap-2">
          <MdStars size={28} /> Điểm Sức Khỏe Tài Chính
        </h2>
        
        <div className="flex flex-col md:flex-row items-center gap-8 border-b-2 border-indigo-100 dark:border-slate-700 pb-8 mb-8">
          <div className="w-48 h-48 rounded-full border-8 border-indigo-100 dark:border-slate-700 flex flex-col items-center justify-center relative shadow-inner bg-white dark:bg-slate-800">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="88" cy="88" r="80" className="text-transparent stroke-current" strokeWidth="16" fill="none" />
              <circle cx="88" cy="88" r="80" className={`${scoreColor} stroke-current transition-all duration-1000 ease-out`} strokeWidth="16" strokeDasharray={`${healthScore * 5.02} 502`} strokeLinecap="round" fill="none" />
            </svg>
            <span className={`text-5xl font-black ${scoreColor} drop-shadow-sm z-10`}>{healthScore}</span>
            <span className="text-xs font-bold text-slate-400 mt-1 z-10 uppercase tracking-widest">/ 100</span>
          </div>

          <div className="flex-1 space-y-4 w-full">
            <h3 className="text-lg font-black text-slate-700 dark:text-white uppercase">Huy hiệu đạt được</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savingsProgress >= 100 && (
                <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-800 rounded-lg text-emerald-600 dark:text-emerald-400"><MdSavings size={20} /></div>
                  <span className="font-bold text-sm text-emerald-700 dark:text-emerald-400">Cao thủ Tiết kiệm</span>
                </div>
              )}
              {stats.income > stats.expense && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
                  <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg text-blue-600 dark:text-blue-400"><MdSecurityUpdateGood size={20} /></div>
                  <span className="font-bold text-sm text-blue-700 dark:text-blue-400">Kiểm soát dòng tiền</span>
                </div>
              )}
              {netWorth > 0 && (
                <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800/50">
                  <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg text-purple-600 dark:text-purple-400"><MdTrendingUp size={20} /></div>
                  <span className="font-bold text-sm text-purple-700 dark:text-purple-400">Tài sản Dương</span>
                </div>
              )}
              {transactionsCount >= 50 && (
                <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/50">
                  <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-lg text-amber-600 dark:text-amber-400"><MdStars size={20} /></div>
                  <span className="font-bold text-sm text-amber-700 dark:text-amber-400">Ghi chép chăm chỉ</span>
                </div>
              )}
              {consecutiveMonths >= 3 && (
                <div className="flex items-center gap-3 p-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-100 dark:border-rose-800/50 col-span-1 sm:col-span-2">
                  <div className="p-2 bg-rose-100 dark:bg-rose-800 rounded-lg text-rose-600 dark:text-rose-400"><MdLocalFireDepartment size={20} /></div>
                  <span className="font-bold text-sm text-rose-700 dark:text-rose-400">Chuỗi tiết kiệm ({consecutiveMonths} tháng liên tiếp) 🔥</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
          <MdPerson className="text-blue-500" size={24} />
          {t('account_info')}
        </h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-6 border-b border-gray-100 dark:border-slate-700">
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">UID</p>
              <p className="font-mono text-sm text-gray-600 dark:text-gray-400 break-all">{user?.uid}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{t('login_method')}</p>
              <p className="font-bold text-gray-700 dark:text-gray-200 capitalize">
                {user?.providerData[0]?.providerId === 'google.com' ? t('google_login') : 'Email & Password'}
              </p>
            </div>
          </div>
          
          <div className="pt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed italic">
              {t('sync_notice')}
            </p>
          </div>
        </div>
      </div>

      <div className="card p-8 mt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
          <MdOutlineMail className="text-blue-500" size={24} />
          Đăng ký Báo cáo Tự động
        </h2>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-100 dark:border-slate-700">
          <div>
            <h4 className="font-bold text-gray-800 dark:text-white">Gửi Báo cáo hàng tháng (PDF)</h4>
            <p className="text-xs text-gray-500">Nhận báo cáo tổng hợp chi tiêu tài chính định kỳ vào cuối tháng qua Email.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={emailReport} onChange={(e) => updateEmailReportSetting(e.target.checked)} />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-500"></div>
          </label>
        </div>
        {emailReport && (
          <p className="text-[10px] text-blue-500 mt-3 italic">* Hệ thống Backend (Firebase Cloud Functions) sẽ tự động quét trạng thái này và gửi báo cáo tổng hợp vào lúc 9:00 sáng mùng 1 hàng tháng qua hòm thư của bạn.</p>
        )}
      </div>

    </div>
  );
};

export default Profile;
