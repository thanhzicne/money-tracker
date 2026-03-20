import React, { useState, useMemo } from 'react';
import { MdAdd, MdEdit, MdDelete, MdCheck, MdCancel, MdPieChart } from 'react-icons/md';

const CATEGORIES = [
  'Ăn uống', 'Mua sắm', 'Di chuyển', 'Giải trí', 'Hóa đơn', 'Sức khỏe', 'Giáo dục', 'Khác'
];

const Budgeting = ({ budgets, addBudget, updateBudget, deleteBudget, transactions, selectedDate }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  
  const currentMonth = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`;
  
  const [formData, setFormData] = useState({ 
    category: CATEGORIES[0], 
    amount: '',
    month: currentMonth
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.amount) return;

    const data = {
      ...formData,
      amount: Number(formData.amount)
    };

    if (editingBudget) {
      updateBudget({ ...data, id: editingBudget.id });
      setEditingBudget(null);
    } else {
      addBudget(data);
    }

    setFormData({ category: CATEGORIES[0], amount: '', month: currentMonth });
    setShowAdd(false);
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      amount: budget.amount,
      month: budget.month
    });
    setShowAdd(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ngân sách này?')) {
      await deleteBudget(id);
    }
  };

  // Only show budgets for the currently selected month in the UI
  const currentMonthBudgets = useMemo(() => {
    return budgets.filter(b => b.month === currentMonth);
  }, [budgets, currentMonth]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-800 dark:text-white tracking-tighter">Quản lý Ngân sách</h1>
          <p className="text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1">
            Tháng {selectedDate.getMonth() + 1}/{selectedDate.getFullYear()}
          </p>
        </div>
        {!showAdd && (
          <button 
            onClick={() => {
              setFormData({ ...formData, month: currentMonth });
              setShowAdd(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <MdAdd size={20} />
            Thêm Ngân sách
          </button>
        )}
      </div>

      {showAdd && (
        <div className="card p-8 border-2 border-emerald-500/20 bg-emerald-50/10 dark:bg-emerald-900/5">
          <h3 className="text-lg font-black text-zinc-800 dark:text-white mb-6 uppercase tracking-tight">
            {editingBudget ? 'Sửa Ngân sách' : 'Thêm Ngân sách'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Danh mục</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="input-field font-bold text-sm w-full"
                  required
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Số tiền Ngân sách</label>
                <input 
                  type="number" 
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="Ví dụ: 5000000"
                  className="input-field font-bold text-sm"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <button type="submit" className="btn-primary flex-1 py-4 flex items-center justify-center gap-2">
                {editingBudget ? <MdCheck size={20} /> : <MdAdd size={20} />}
                {editingBudget ? 'Lưu' : 'Thêm mới'}
              </button>
              <button 
                type="button" 
                onClick={() => { setShowAdd(false); setEditingBudget(null); }} 
                className="btn-ghost px-8 border border-zinc-200 dark:border-zinc-700 flex items-center gap-2"
              >
                <MdCancel size={20} />
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentMonthBudgets.length === 0 ? (
          <div className="col-span-full py-12 text-center text-zinc-500 dark:text-zinc-400 font-bold">
            Chưa có ngân sách nào cho tháng này.
          </div>
        ) : (
          currentMonthBudgets.map(budget => {
            // Calculate total spent for this category in the current month
            const spent = transactions
              .filter(tx => tx.type === 'expense' && tx.category === budget.category && tx.date.startsWith(budget.month))
              .reduce((sum, tx) => sum + Number(tx.amount), 0);
            
            const progress = (spent / budget.amount) * 100;
            const isWarning = progress >= 80 && progress < 100;
            const isDanger = progress >= 100;
            
            let barColor = 'bg-emerald-500';
            if (isDanger) barColor = 'bg-rose-500';
            else if (isWarning) barColor = 'bg-amber-500';

            return (
              <div key={budget.id} className="card group p-6 relative overflow-hidden transition-all hover:shadow-xl">
                <div className="absolute top-0 right-0 p-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEdit(budget)}
                    className="p-2 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                  >
                    <MdEdit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(budget.id)}
                    className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
                  >
                    <MdDelete size={18} />
                  </button>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-2xl ${isDanger ? 'bg-rose-100 text-rose-600' : isWarning ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    <MdPieChart size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-zinc-800 dark:text-white">{budget.category}</h3>
                    <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500">
                      Ngân sách: {formatCurrency(budget.amount)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-sm font-black">
                    <span className="text-zinc-500 dark:text-zinc-400">Đã chi: {formatCurrency(spent)}</span>
                    <span className={isDanger ? 'text-rose-500' : isWarning ? 'text-amber-500' : 'text-emerald-500'}>
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${barColor} transition-all duration-500`} 
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs font-bold text-right mt-1 text-zinc-400 dark:text-zinc-500">
                    Còn lại: {formatCurrency(Math.max(budget.amount - spent, 0))}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Budgeting;
