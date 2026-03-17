import React, { useState } from 'react';
import { MdSearch, MdFilterList, MdEdit, MdDelete, MdTrendingUp, MdTrendingDown } from 'react-icons/md';

const TransactionList = ({ transactions, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filtered = transactions.filter(t => {
    const matchesSearch = t.note.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="card h-full flex flex-col p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white mb-0">Lịch sử giao dịch</h2>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Danh sách các khoản thu chi</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative group flex-1 md:flex-none">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Tìm theo ghi chú..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 w-full md:w-56 font-bold text-sm transition-all"
            />
          </div>
          <div className="relative group">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 cursor-pointer appearance-none text-sm font-black uppercase tracking-wider transition-all"
            >
              <option value="all">Tất cả</option>
              <option value="income">Chỉ thu</option>
              <option value="expense">Chỉ chi</option>
            </select>
            <MdFilterList className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-4 custom-scrollbar">
        {filtered.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 py-12">
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl mb-4">
              <MdFilterList size={48} />
            </div>
            <p className="text-sm font-black uppercase tracking-widest">Không có dữ liệu</p>
          </div>
        ) : (
          filtered.sort((a, b) => new Date(b.date) - new Date(a.date)).map((t) => (
            <div 
              key={t.id} 
              className="group flex items-center gap-5 p-5 rounded-3xl border border-slate-50 dark:border-slate-800/50 bg-white dark:bg-slate-900 hover:border-blue-100 dark:hover:border-blue-900/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
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
                  <h4 className="font-black text-slate-800 dark:text-white truncate tracking-tight">{t.category}</h4>
                  <span className={`font-black text-lg tracking-tighter ${
                    t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 truncate pr-4">{t.note || 'Không có ghi chú'}</p>
                  <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">{formatDate(t.date)}</span>
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
