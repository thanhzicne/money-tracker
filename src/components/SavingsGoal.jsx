import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdEdit, MdCheck, MdTrendingUp } from 'react-icons/md';

const SavingsGoal = ({ goal, setGoal, progress, balance }) => {
  const { t, i18n } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [tempGoal, setTempGoal] = useState(goal);

  const formatCurrency = (amount) => {
    if (typeof i18n !== 'undefined' && i18n.language === 'en') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }
    return `${new Intl.NumberFormat('vi-VN').format(amount)} VNĐ`;
  };

  const handleSave = () => {
    setGoal(Number(tempGoal));
    setIsEditing(false);
  };

  return (
    <div className="card p-5 md:p-8 mb-6 md:mb-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110"></div>
      <div className="flex flex-col gap-4 md:gap-6 mb-6 md:mb-8 relative z-10">
        <div className="flex items-start sm:items-center gap-3 md:gap-4">
          <div className="p-2.5 md:p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/20 flex-shrink-0">
            <MdTrendingUp size={20} />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg md:text-xl font-black text-slate-800 dark:text-white mb-0">{t('savings_goal')}</h2>
            <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400">{t('based_on_balance')}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full\">
          {isEditing ? (
            <div className="flex items-center gap-2 w-full\">
              <input
                type="number"
                value={tempGoal}
                onChange={(e) => setTempGoal(e.target.value)}
                className="input-field text-right flex-1 py-2.5 font-bold text-base md:text-lg"
                autoFocus
              />
              <button 
                onClick={handleSave}
                className="p-2.5 md:p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-90 flex-shrink-0"
              >
                <MdCheck size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 md:p-3.5 px-3 md:pl-5 rounded-2xl border border-slate-100 dark:border-slate-700/50 w-full justify-between\">
              <span className="font-black text-blue-600 dark:text-blue-400 text-base md:text-xl tracking-tight truncate\">
                {formatCurrency(goal)}
              </span>
              <button 
                onClick={() => { setTempGoal(goal); setIsEditing(true); }}
                className="p-2 md:p-2.5 hover:bg-white dark:hover:bg-slate-700 text-slate-400 hover:text-blue-500 rounded-xl transition-all shadow-sm hover:shadow-md flex-shrink-0"
              >
                <MdEdit size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('progress')}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-800 dark:text-white">{progress.toFixed(1)}%</span>
              <span className="text-sm font-bold text-slate-400 dark:text-slate-500">{t('completed')}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">{t('currently_have')}</span>
            <span className="text-lg font-black text-emerald-500">{formatCurrency(balance)}</span>
          </div>
        </div>
        
        <div className="relative h-5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-1 shadow-inner">
          <div 
            className={`h-full transition-all duration-1000 ease-out rounded-full relative ${
              progress >= 100 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-blue-400 to-blue-600'
            }`}
            style={{ width: `${progress}%` }}
          >
            <div className="absolute top-0 right-0 w-8 h-full bg-white/20 skew-x-12 -mr-4 animate-pulse"></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          <span>{t('start')}</span>
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">{formatCurrency(goal)} {t('goal')}</span>
        </div>
      </div>
    </div>
  );
};

export default SavingsGoal;
