import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdSearch, MdFilterList, MdEdit, MdDelete, MdTrendingUp, MdTrendingDown, MdFileDownload } from 'react-icons/md';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';
import CustomSelect from './CustomSelect';

const TransactionList = ({ transactions, onEdit, onDelete }) => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filtered = transactions.filter(t => {
    const noteMatch = (t.note || '').toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = (t.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = noteMatch || categoryMatch;
    const matchesFilter = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const filterOptions = [
    { value: 'all', label: t('all'), icon: '📊' },
    { value: 'income', label: t('only_income'), icon: '📈' },
    { value: 'expense', label: t('only_expense'), icon: '📉' }
  ];

  const formatCurrency = (amount) => {
    if (typeof i18n !== 'undefined' && i18n.language === 'en') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }
    return `${new Intl.NumberFormat('vi-VN').format(amount)} VNĐ`;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <div className="card h-full flex flex-col p-8">
      <div className="flex flex-col gap-4 md:gap-6 mb-6 md:mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-4 md:pb-6">
        <div>
          <h2 className="text-lg md:text-xl font-black text-zinc-800 dark:text-white mb-0">{t('history')}</h2>
          <p className="text-[10px] md:text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">Danh sách các khoản thu chi</p>
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-3 w-full items-stretch sm:items-center">
          <div className="relative group flex-1 min-w-0">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 w-full font-bold text-sm transition-all"
            />
          </div>
          
          <CustomSelect
            value={filterType}
            onChange={setFilterType}
            options={filterOptions}
            icon={MdFilterList}
            className="w-full sm:flex-1 min-w-[120px] sm:min-w-[140px]"
          />

          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={() => exportToExcel(filtered)}
              className="flex-1 sm:flex-none p-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all shadow-sm group"
              title={t('export_excel')}
            >
              <MdFileDownload className="group-hover:scale-110 transition-transform mx-auto" size={18} />
            </button>
            <button 
              onClick={() => exportToPDF(filtered)}
              className="flex-1 sm:flex-none p-2.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all shadow-sm group"
              title={t('export_pdf')}
            >
              <MdFileDownload className="group-hover:scale-110 transition-transform mx-auto" size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-4 custom-scrollbar">
        {filtered.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-300 py-12">
            <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl mb-4">
              <MdFilterList size={48} />
            </div>
            <p className="text-sm font-black uppercase tracking-widest">{t('no_data')}</p>
          </div>
        ) : (
          filtered.sort((a, b) => new Date(b.date) - new Date(a.date)).map((t) => (
            <div 
              key={t.id} 
              className="group flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-zinc-50 dark:border-zinc-900/50 bg-white dark:bg-zinc-950 hover:border-emerald-100 dark:hover:border-emerald-900/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300"
            >
              <div className={`p-3 sm:p-4 rounded-2xl shadow-sm flex-shrink-0 transition-transform group-hover:scale-110 ${
                t.type === 'income' 
                  ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400' 
                  : 'bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400'
              }`}>
                {t.type === 'income' ? <MdTrendingUp size={20} /> : <MdTrendingDown size={20} />}
              </div>
              
              <div className="flex-1 min-w-0 w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2 mb-2 sm:mb-1">
                  <h4 className="font-black text-sm sm:text-base text-zinc-800 dark:text-white truncate tracking-tight">{t.category}</h4>
                  <span className={`font-black text-base sm:text-lg tracking-tighter whitespace-nowrap ${
                    t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 truncate">{t.note || 'Không có ghi chú'}</p>
                    {t.walletName && (
                      <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-full text-[8px] font-black uppercase flex-shrink-0">{t.walletName}</span>
                    )}
                  </div>
                  <span className="text-[10px] font-black text-zinc-300 dark:text-zinc-600 uppercase tracking-widest flex-shrink-0">{formatDate(t.date)}</span>
                </div>
              </div>

              <div className="flex gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 sm:translate-x-4 sm:group-hover:translate-x-0 w-full sm:w-auto">
                <button 
                  onClick={() => onEdit(t)}
                  className="flex-1 sm:flex-none p-2.5 sm:p-3 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl sm:rounded-2xl transition-all shadow-sm hover:shadow-md active:scale-90"
                  title="Sửa"
                >
                  <MdEdit size={16} className="mx-auto sm:mx-0" />
                </button>
                <button 
                  onClick={() => onDelete(t.id)}
                  className="flex-1 sm:flex-none p-2.5 sm:p-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl sm:rounded-2xl transition-all shadow-sm hover:shadow-md active:scale-90"
                  title="Xóa"
                >
                  <MdDelete size={16} className="mx-auto sm:mx-0" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionList;
