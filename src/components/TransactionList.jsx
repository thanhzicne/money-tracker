import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdSearch, MdFilterList, MdEdit, MdDelete, MdTrendingUp, MdTrendingDown, MdFileDownload } from 'react-icons/md';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(i18n.language === 'vi' ? 'vi-VN' : 'en-US', { 
      style: 'currency', 
      currency: i18n.language === 'vi' ? 'VND' : 'USD' 
    }).format(amount);
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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-6">
        <div>
          <h2 className="text-xl font-black text-zinc-800 dark:text-white mb-0">{t('history')}</h2>
          <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">Danh sách các khoản thu chi</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative group flex-1 md:flex-none">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 w-full md:w-56 font-bold text-sm transition-all"
            />
          </div>
          <div className="relative group">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-4 pr-10 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 cursor-pointer appearance-none text-sm font-black uppercase tracking-wider transition-all"
            >
              <option value="all">{t('all')}</option>
              <option value="income">{t('only_income')}</option>
              <option value="expense">{t('only_expense')}</option>
            </select>
            <MdFilterList className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={18} />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => exportToExcel(filtered)}
              className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all shadow-sm"
              title={t('export_excel')}
            >
              <MdFileDownload size={20} />
            </button>
            <button 
              onClick={() => exportToPDF(filtered)}
              className="p-2.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all shadow-sm"
              title={t('export_pdf')}
            >
              <MdFileDownload size={20} />
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
              className="group flex items-center gap-5 p-5 rounded-3xl border border-zinc-50 dark:border-zinc-900/50 bg-white dark:bg-zinc-950 hover:border-emerald-100 dark:hover:border-emerald-900/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300"
            >
              <div className={`p-4 rounded-2xl shadow-sm transition-transform group-hover:scale-110 ${
                t.type === 'income' 
                  ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400' 
                  : 'bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400'
              }`}>
                {t.type === 'income' ? <MdTrendingUp size={24} /> : <MdTrendingDown size={24} />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-black text-zinc-800 dark:text-white truncate tracking-tight">{t.category}</h4>
                  <span className={`font-black text-lg tracking-tighter ${
                    t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 truncate pr-4">{t.note || 'Không có ghi chú'}</p>
                    {t.walletName && (
                      <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-full text-[8px] font-black uppercase">{t.walletName}</span>
                    )}
                  </div>
                  <span className="text-[10px] font-black text-zinc-300 dark:text-zinc-600 uppercase tracking-widest">{formatDate(t.date)}</span>
                </div>
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                <button 
                  onClick={() => onEdit(t)}
                  className="p-3 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-all shadow-sm hover:shadow-md active:scale-90"
                  title="Sửa"
                >
                  <MdEdit size={18} />
                </button>
                <button 
                  onClick={() => onDelete(t.id)}
                  className="p-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-all shadow-sm hover:shadow-md active:scale-90"
                  title="Xóa"
                >
                  <MdDelete size={18} />
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
