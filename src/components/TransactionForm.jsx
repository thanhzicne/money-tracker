import React, { useState, useEffect } from 'react';
import { MdAdd, MdSave, MdCancel } from 'react-icons/md';

const categories = {
  income: ['Lương', 'Kinh doanh', 'Đầu tư', 'Thưởng', 'Khác'],
  expense: ['Ăn uống', 'Di chuyển', 'Mua sắm', 'Giải trí', 'Hóa đơn', 'Sức khỏe', 'Giáo dục', 'Khác']
};

const TransactionForm = ({ onAdd, onUpdate, editingTransaction, setEditingTransaction }) => {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        ...editingTransaction,
        amount: Math.abs(editingTransaction.amount)
      });
    } else {
      setFormData({
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
        note: ''
      });
    }
  }, [editingTransaction]);

  const validate = () => {
    const newErrors = {};
    if (!formData.amount || Number(formData.amount) <= 0) newErrors.amount = 'Số tiền không hợp lệ';
    if (!formData.category) newErrors.category = 'Vui lòng chọn danh mục';
    if (!formData.date) newErrors.date = 'Vui lòng chọn ngày';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const transaction = {
      ...formData,
      amount: Number(formData.amount)
    };

    if (editingTransaction) {
      onUpdate(transaction);
      setEditingTransaction(null);
    } else {
      onAdd(transaction);
    }

    setFormData({
      amount: '',
      type: 'expense',
      category: '',
      date: new Date().toISOString().split('T')[0],
      note: ''
    });
    setErrors({});
  };

  return (
    <div className="card h-full p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
      <div className="flex items-center gap-4 mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div className={`p-3 rounded-2xl shadow-lg ${editingTransaction ? 'bg-amber-500 shadow-amber-500/20' : 'bg-blue-600 shadow-blue-500/20'} text-white`}>
          {editingTransaction ? <MdSave size={24} /> : <MdAdd size={24} />}
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white mb-0">
            {editingTransaction ? 'Sửa giao dịch' : 'Giao dịch mới'}
          </h2>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
            {editingTransaction ? 'Cập nhật thông tin cũ' : 'Thêm khoản thu chi mới'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Số tiền giao dịch</label>
          <div className="relative group">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors">₫</span>
            <input
              type="number"
              placeholder="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className={`input-field pl-10 text-2xl font-black tracking-tight ${errors.amount ? 'border-rose-500 ring-4 ring-rose-500/10' : ''}`}
            />
          </div>
          {errors.amount && <p className="text-rose-500 text-[10px] font-black uppercase tracking-wider mt-1 ml-1">{errors.amount}</p>}
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Phân loại</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value, category: '' })}
              className="input-field font-bold text-sm cursor-pointer"
            >
              <option value="income">↑ Thu nhập</option>
              <option value="expense">↓ Chi tiêu</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Danh mục</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={`input-field font-bold text-sm cursor-pointer ${errors.category ? 'border-rose-500 ring-4 ring-rose-500/10' : ''}`}
            >
              <option value="">Chọn loại...</option>
              {categories[formData.type].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-rose-500 text-[10px] font-black uppercase tracking-wider mt-1 ml-1">{errors.category}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Ngày thực hiện</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`input-field font-bold text-sm cursor-pointer ${errors.date ? 'border-rose-500 ring-4 ring-rose-500/10' : ''}`}
            />
            {errors.date && <p className="text-rose-500 text-[10px] font-black uppercase tracking-wider mt-1 ml-1">{errors.date}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Ghi chú nhanh</label>
            <input
              type="text"
              placeholder="Mua gì, làm gì..."
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="input-field font-bold text-sm"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-3 py-4 shadow-xl">
            {editingTransaction ? <MdSave size={20} /> : <MdAdd size={20} />}
            <span className="tracking-wide">{editingTransaction ? 'Lưu cập nhật' : 'Xác nhận thêm'}</span>
          </button>
          
          {editingTransaction && (
            <button 
              type="button" 
              onClick={() => setEditingTransaction(null)}
              className="btn-ghost flex items-center justify-center gap-2 px-8 border border-slate-200 dark:border-slate-700"
            >
              <MdCancel size={20} />
              Hủy
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
