import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdAdd, MdArchive, MdMoreVert, MdDelete, MdEdit, MdCheck, MdCancel, MdCompareArrows } from 'react-icons/md';

const Jars = ({ jars, addJar, updateJar, deleteJar, totalBalance, transferBetweenJars }) => {
  const { t, i18n } = useTranslation();
  const [showAdd, setShowAdd] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [editingJar, setEditingJar] = useState(null);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    percent: '', 
    balance: '', 
    color: '#3b82f6' 
  });
  
  const [transferData, setTransferData] = useState({
    fromJarId: '',
    toJarId: '',
    amount: ''
  });

  const colors = [
    { name: 'Emerald', code: '#10b981' },
    { name: 'Blue', code: '#3b82f6' },
    { name: 'Amber', code: '#f59e0b' },
    { name: 'Rose', code: '#f43f5e' },
    { name: 'Violet', code: '#8b5cf6' },
    { name: 'Zinc', code: '#71717a' }
  ];

  const currentTotalPercent = jars.reduce((sum, j) => sum + Number(j.percent || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.percent) return;

    try {
      if (editingJar) {
        await updateJar({ ...formData, id: editingJar.id });
        setEditingJar(null);
      } else {
        await addJar(formData);
      }
      setFormData({ name: '', percent: '', balance: '', color: '#3b82f6' });
      setShowAdd(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!transferData.fromJarId || !transferData.toJarId || !transferData.amount) return;
      if (transferData.fromJarId === transferData.toJarId) {
         alert("Vui lòng chọn 2 hũ khác nhau");
         return;
      }
      await transferBetweenJars(transferData.fromJarId, transferData.toJarId, Number(transferData.amount));
      setTransferData({ fromJarId: '', toJarId: '', amount: '' });
      setShowTransfer(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (jar) => {
    setEditingJar(jar);
    setFormData({
      name: jar.name,
      percent: jar.percent,
      balance: jar.balance,
      color: jar.color || '#3b82f6'
    });
    setShowAdd(true);
    setShowTransfer(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xoá hũ này?')) {
      try {
        await deleteJar(id);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const formatCurrency = (amount) => {
    if (typeof i18n !== 'undefined' && i18n.language === 'en') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }
    return `${new Intl.NumberFormat('vi-VN').format(amount)} VNĐ`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-800 dark:text-white tracking-tighter">Hũ Chi Tiêu</h1>
          <div className="flex items-center gap-3 mt-1">
             <div className="w-32 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${currentTotalPercent > 100 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                  style={{ width: `${Math.min(currentTotalPercent, 100)}%` }}
                ></div>
             </div>
             <p className={`text-sm font-bold uppercase tracking-widest ${currentTotalPercent > 100 ? 'text-rose-500' : 'text-zinc-500 dark:text-zinc-400'}`}>
               Đã phân bổ: {currentTotalPercent}%
             </p>
          </div>
        </div>
        <div className="flex gap-3">
          {!showTransfer && jars.length >= 2 && (
            <button 
              onClick={() => { setShowTransfer(true); setShowAdd(false); setEditingJar(null); }}
              className="btn-ghost flex items-center gap-2"
            >
              <MdCompareArrows size={20} />
              Luân chuyển
            </button>
          )}
          {!showAdd && (
            <button 
              onClick={() => { setShowAdd(true); setShowTransfer(false); setEditingJar(null); }}
              className="btn-primary flex items-center gap-2"
            >
              <MdAdd size={20} />
              Thêm Hũ
            </button>
          )}
        </div>
      </div>

      {showTransfer && (
        <div className="card p-8 border-2 border-emerald-500/20 bg-emerald-50/10 dark:bg-emerald-900/5">
          <h3 className="text-lg font-black text-zinc-800 dark:text-white mb-6 uppercase tracking-tight">
            Luân Chuyển Tiền Giữa Các Hũ
          </h3>
          <form onSubmit={handleTransferSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Từ hũ</label>
                <select 
                  value={transferData.fromJarId}
                  onChange={(e) => setTransferData({...transferData, fromJarId: e.target.value})}
                  className="input-field font-bold text-sm bg-white dark:bg-zinc-800"
                  required
                >
                  <option value="">Chọn hũ nguồn...</option>
                  {jars.map(j => (
                    <option key={j.id} value={j.id}>{j.name} ({formatCurrency(j.balance)})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Sang hũ</label>
                <select 
                  value={transferData.toJarId}
                  onChange={(e) => setTransferData({...transferData, toJarId: e.target.value})}
                  className="input-field font-bold text-sm bg-white dark:bg-zinc-800"
                  required
                >
                  <option value="">Chọn hũ đích...</option>
                  {jars.map(j => (
                    <option key={j.id} value={j.id}>{j.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Số tiền</label>
                <input 
                  type="number" 
                  value={transferData.amount}
                  onChange={(e) => setTransferData({...transferData, amount: e.target.value})}
                  placeholder="0"
                  className="input-field font-bold text-sm"
                  required
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <button type="submit" className="btn-primary flex-1 py-4 flex items-center justify-center gap-2">
                <MdCheck size={20} />
                Chuyển Tiền
              </button>
              <button 
                type="button" 
                onClick={() => setShowTransfer(false)} 
                className="btn-ghost px-8 border border-zinc-200 dark:border-zinc-700 flex items-center gap-2"
              >
                <MdCancel size={20} />
                Huỷ
              </button>
            </div>
          </form>
        </div>
      )}

      {showAdd && (
        <div className="card p-8 border-2 border-emerald-500/20 bg-emerald-50/10 dark:bg-emerald-900/5">
          <h3 className="text-lg font-black text-zinc-800 dark:text-white mb-6 uppercase tracking-tight">
            {editingJar ? 'Sửa Hũ Chi Tiêu' : 'Thêm Hũ Mới'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Tên Hũ</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ví dụ: Thiết yếu, Đầu tư..."
                  className="input-field font-bold text-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Tỷ lệ % phân bổ</label>
                <input 
                  type="number" 
                  value={formData.percent}
                  onChange={(e) => setFormData({...formData, percent: e.target.value})}
                  placeholder="10"
                  max="100"
                  className="input-field font-bold text-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Số dư ban đầu</label>
                <input 
                  type="number" 
                  value={formData.balance}
                  onChange={(e) => setFormData({...formData, balance: e.target.value})}
                  placeholder="0"
                  disabled={!!editingJar}
                  className="input-field font-bold text-sm disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Màu sắc</label>
              <div className="flex gap-3">
                {colors.map(color => (
                  <button
                    key={color.code}
                    type="button"
                    onClick={() => setFormData({...formData, color: color.code})}
                    className={`w-8 h-8 rounded-full transition-all border-4 ${formData.color === color.code ? 'border-white dark:border-zinc-700 scale-125 shadow-lg' : 'border-transparent opacity-60'}`}
                    style={{ backgroundColor: color.code }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <button type="submit" className="btn-primary flex-1 py-4 flex items-center justify-center gap-2">
                {editingJar ? <MdCheck size={20} /> : <MdAdd size={20} />}
                {editingJar ? t('save') : t('add')}
              </button>
              <button 
                type="button" 
                onClick={() => { setShowAdd(false); setEditingJar(null); }} 
                className="btn-ghost px-8 border border-zinc-200 dark:border-zinc-700 flex items-center gap-2"
              >
                <MdCancel size={20} />
                {t('cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jars.map(jar => {
          const progress = totalBalance > 0 ? Math.min(Math.max((jar.balance / totalBalance) * 100, 0), 100) : 0;
          
          return (
            <div key={jar.id} className="card group p-8 relative overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1">
              <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: jar.color || '#3b82f6' }}></div>
              <div className="absolute top-0 right-0 p-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(jar)}
                  className="p-2 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                >
                  <MdEdit size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(jar.id)}
                  className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
                >
                  <MdDelete size={18} />
                </button>
              </div>
              
              <div className="flex items-start gap-5 mb-6">
                <div className="w-14 h-14 flex items-center justify-center text-3xl bg-zinc-50 dark:bg-zinc-900 rounded-2xl shadow-inner border border-zinc-100 dark:border-zinc-800" style={{ color: jar.color || '#3b82f6' }}>
                  <MdArchive size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-zinc-800 dark:text-white tracking-tight">{jar.name}</h3>
                  <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">{jar.percent}% Thu nhập</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">SỐ DƯ HŨ</p>
                <p className={`text-3xl font-black tracking-tighter ${jar.balance >= 0 ? 'text-zinc-800 dark:text-white' : 'text-rose-600 dark:text-rose-400'}`}>
                  {formatCurrency(jar.balance)}
                </p>
              </div>
              
              <div className="mt-5 space-y-2">
                <div className="flex justify-between text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                  <span>Tỷ trọng tài sản</span>
                  <span>{progress.toFixed(1)}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                   <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: jar.color || '#3b82f6' }}></div>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Jars;
