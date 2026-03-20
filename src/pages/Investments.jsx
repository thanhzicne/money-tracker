import React, { useState } from 'react';
import { MdAdd, MdEdit, MdDelete, MdCheck, MdCancel, MdTrendingUp, MdAccountBalance } from 'react-icons/md';

const TYPES = [
  { id: 'savings', label: 'Sổ tiết kiệm' },
  { id: 'stock', label: 'Cổ phiếu' },
  { id: 'crypto', label: 'Tiền ảo (Crypto)' },
  { id: 'real_estate', label: 'Bất động sản' },
  { id: 'other', label: 'Khác' }
];

const Investments = ({ investments, addInvestment, updateInvestment, deleteInvestment, netWorth }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [editingInv, setEditingInv] = useState(null);
  
  const [formData, setFormData] = useState({ 
    name: '',
    type: 'savings',
    initialValue: '',
    currentValue: '',
    note: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.initialValue) return;

    const data = {
      ...formData,
      initialValue: Number(formData.initialValue),
      currentValue: Number(formData.currentValue || formData.initialValue)
    };

    if (editingInv) {
      updateInvestment({ ...data, id: editingInv.id });
      setEditingInv(null);
    } else {
      addInvestment(data);
    }

    setFormData({ name: '', type: 'savings', initialValue: '', currentValue: '', note: '' });
    setShowAdd(false);
  };

  const handleEdit = (inv) => {
    setEditingInv(inv);
    setFormData({
      name: inv.name,
      type: inv.type,
      initialValue: inv.initialValue,
      currentValue: inv.currentValue,
      note: inv.note || ''
    });
    setShowAdd(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài sản này?')) {
      await deleteInvestment(id);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const totalInvested = investments.reduce((sum, i) => sum + Number(i.initialValue), 0);
  const currentTotal = investments.reduce((sum, i) => sum + Number(i.currentValue), 0);
  const totalProfit = currentTotal - totalInvested;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-800 dark:text-white tracking-tighter">Tài sản Đầu tư</h1>
          <p className="text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1">
            Tổng tài sản ròng (Net Worth): <span className={netWorth >= 0 ? "text-emerald-500" : "text-rose-500"}>{formatCurrency(netWorth)}</span>
          </p>
        </div>
        {!showAdd && (
          <button 
            onClick={() => setShowAdd(true)}
            className="btn-primary flex items-center gap-2"
          >
            <MdAdd size={20} />
            Thêm Tài sản
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 border-l-4 border-blue-500">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Tiền Vốn Đầu Tư</p>
          <p className="text-2xl font-black text-zinc-800 dark:text-white mt-1">{formatCurrency(totalInvested)}</p>
        </div>
        <div className="card p-6 border-l-4 border-purple-500">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Giá Trị Hiện Tại</p>
          <p className="text-2xl font-black text-zinc-800 dark:text-white mt-1">{formatCurrency(currentTotal)}</p>
        </div>
        <div className={`card p-6 border-l-4 ${totalProfit >= 0 ? 'border-emerald-500' : 'border-rose-500'}`}>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Tổng Lời / Lỗ</p>
          <p className={`text-2xl font-black mt-1 ${totalProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {totalProfit > 0 ? '+' : ''}{formatCurrency(totalProfit)}
          </p>
        </div>
      </div>

      {showAdd && (
        <div className="card p-8 border-2 border-emerald-500/20 bg-emerald-50/10 dark:bg-emerald-900/5">
          <h3 className="text-lg font-black text-zinc-800 dark:text-white mb-6 uppercase tracking-tight">
            {editingInv ? 'Sửa thông tin tài sản' : 'Thêm tài sản mới'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase">Loại Tài sản</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="input-field font-bold text-sm w-full"
                >
                  {TYPES.map(t => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase">Tên Tài sản (Mã Cổ phiếu, Tên Ngân hàng...)</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field font-bold text-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase">Số vốn ban đầu (VNĐ)</label>
                <input 
                  type="number" 
                  value={formData.initialValue}
                  onChange={(e) => setFormData({...formData, initialValue: e.target.value})}
                  className="input-field font-bold text-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase">Giá trị hiện tại (VNĐ)</label>
                <input 
                  type="number" 
                  value={formData.currentValue}
                  onChange={(e) => setFormData({...formData, currentValue: e.target.value})}
                  className="input-field font-bold text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <button type="submit" className="btn-primary flex-1 py-4 flex items-center justify-center gap-2">
                {editingInv ? <MdCheck size={20} /> : <MdAdd size={20} />}
                {editingInv ? 'Lưu thay đổi' : 'Thêm tài sản'}
              </button>
              <button 
                type="button" 
                onClick={() => { setShowAdd(false); setEditingInv(null); }} 
                className="btn-ghost px-8 border border-zinc-200 dark:border-zinc-700 flex items-center gap-2"
              >
                <MdCancel size={20} />
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {investments.length === 0 && (
          <div className="col-span-full py-12 text-center text-zinc-500">
            Chưa có tài sản đầu tư nào được ghi nhận.
          </div>
        )}
        {investments.map(inv => {
          const profit = inv.currentValue - inv.initialValue;
          const profitPercent = inv.initialValue > 0 ? (profit / inv.initialValue) * 100 : 0;
          const isProfitable = profit >= 0;

          return (
            <div key={inv.id} className="card group p-6 relative overflow-hidden transition-all hover:shadow-xl">
              <div className="absolute top-0 right-0 p-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(inv)}
                  className="p-2 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                >
                  <MdEdit size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(inv.id)}
                  className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
                >
                  <MdDelete size={18} />
                </button>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                  {inv.type === 'savings' ? <MdAccountBalance size={24} /> : <MdTrendingUp size={24} />}
                </div>
                <div>
                  <h3 className="text-lg font-black text-zinc-800 dark:text-white tracking-tight">{inv.name}</h3>
                  <p className="text-[10px] font-black text-zinc-400 uppercase">{TYPES.find(t => t.id === inv.type)?.label}</p>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                <div>
                  <p className="text-[10px] font-black text-zinc-400 uppercase">Giá trị hiện tại</p>
                  <p className="text-2xl font-black text-zinc-800 dark:text-white tracking-tighter">{formatCurrency(inv.currentValue)}</p>
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase">Vốn ban đầu</p>
                    <p className="text-sm font-bold text-zinc-600 dark:text-zinc-300">{formatCurrency(inv.initialValue)}</p>
                  </div>
                  <div className={`text-right ${isProfitable ? 'text-emerald-500' : 'text-rose-500'}`}>
                    <p className="text-[10px] font-black uppercase">Lời / Lỗ</p>
                    <p className="text-sm font-bold">
                      {isProfitable ? '+' : ''}{profitPercent.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Investments;
