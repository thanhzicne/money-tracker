import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MdAdd, MdSave, MdCancel, MdRefresh, MdSwapHoriz } from 'react-icons/md';

const categories = {
  income: ['Lương', 'Kinh doanh', 'Đầu tư', 'Thưởng', 'Khác'],
  expense: ['Ăn uống', 'Di chuyển', 'Mua sắm', 'Giải trí', 'Hóa đơn', 'Sức khỏe', 'Giáo dục', 'Khác'],
  transfer: ['Chuyển tiền nội bộ']
};

const TransactionForm = ({ onAdd, onUpdate, onTransfer, editingTransaction, setEditingTransaction, wallets }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('expense'); // 'expense', 'income', 'transfer'
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
    walletId: '',
    toWalletId: '',
    isRecurring: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTransaction) {
      setActiveTab(editingTransaction.type);
      setFormData({
        ...editingTransaction,
        amount: Math.abs(editingTransaction.amount)
      });
    } else {
      setFormData(prev => ({
        ...prev,
        type: activeTab,
        walletId: wallets[0]?.id || '',
        toWalletId: wallets[1]?.id || '',
        category: categories[activeTab][0]
      }));
    }
  }, [editingTransaction, wallets, activeTab]);

  const validate = () => {
    const newErrors = {};
    if (!formData.amount || Number(formData.amount) <= 0) newErrors.amount = t('amount') + ' không hợp lệ';
    if (!formData.date) newErrors.date = t('date') + ' không được để trống';
    
    if (activeTab === 'transfer') {
      if (!formData.walletId) newErrors.walletId = t('from_wallet') + ' không được để trống';
      if (!formData.toWalletId) newErrors.toWalletId = t('to_wallet') + ' không được để trống';
      if (formData.walletId === formData.toWalletId) newErrors.toWalletId = 'Ví nguồn và ví đích không được trùng nhau';
    } else {
      if (!formData.walletId) newErrors.walletId = 'Vui lòng chọn ví';
      if (!formData.category) newErrors.category = t('category') + ' không được để trống';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (activeTab === 'transfer') {
      onTransfer({
        fromWalletId: formData.walletId,
        toWalletId: formData.toWalletId,
        amount: Number(formData.amount),
        date: formData.date,
        note: formData.note
      });
    } else {
      const selectedWallet = wallets.find(w => w.id === formData.walletId);
      const transaction = {
        ...formData,
        type: activeTab,
        amount: Number(formData.amount),
        walletName: selectedWallet?.name
      };

      if (editingTransaction) {
        onUpdate(transaction);
        setEditingTransaction(null);
      } else {
        onAdd(transaction);
      }
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      type: activeTab,
      category: categories[activeTab][0],
      date: new Date().toISOString().split('T')[0],
      note: '',
      walletId: wallets[0]?.id || '',
      toWalletId: wallets[1]?.id || '',
      isRecurring: false
    });
    setErrors({});
  };

  return (
    <div className="card h-full p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-emerald-600"></div>
      
      {/* Tabs */}
      <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-2xl mb-8">
        {['expense', 'income', 'transfer'].map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white dark:bg-zinc-800 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'}`}
          >
            {tab === 'transfer' ? <MdSwapHoriz className="inline mr-2" size={16} /> : null}
            {t(tab)}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-6">
        <div className={`p-3 rounded-2xl shadow-lg ${editingTransaction ? 'bg-amber-500 shadow-amber-500/20' : 'bg-emerald-600 shadow-emerald-500/20'} text-white`}>
          {activeTab === 'transfer' ? <MdSwapHoriz size={24} /> : (editingTransaction ? <MdSave size={24} /> : <MdAdd size={24} />)}
        </div>
        <div>
          <h2 className="text-xl font-black text-zinc-800 dark:text-white mb-0">
            {activeTab === 'transfer' ? t('transfer') : (editingTransaction ? t('edit_transaction') : t('new_transaction'))}
          </h2>
          <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">
            {activeTab === 'transfer' ? 'Luân chuyển tiền giữa các ví' : (editingTransaction ? 'Cập nhật thông tin cũ' : 'Thêm khoản thu chi mới')}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">{t('amount')}</label>
          <div className="relative group">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-zinc-400 dark:text-zinc-500 group-focus-within:text-emerald-500 transition-colors">₫</span>
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

        {activeTab !== 'transfer' ? (
          <div className="grid grid-cols-2 gap-5">
            {/* Wallet Selection */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">{t('wallets')}</label>
              <select
                value={formData.walletId}
                onChange={(e) => setFormData({ ...formData, walletId: e.target.value })}
                className={`input-field font-bold text-sm cursor-pointer ${errors.walletId ? 'border-rose-500 ring-4 ring-rose-500/10' : ''}`}
              >
                <option value="">{t('select_wallet')}...</option>
                {wallets.map(w => (
                  <option key={w.id} value={w.id}>{w.icon} {w.name}</option>
                ))}
              </select>
              {errors.walletId && <p className="text-rose-500 text-[10px] font-black uppercase tracking-wider mt-1 ml-1">{errors.walletId}</p>}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">{t('category')}</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={`input-field font-bold text-sm cursor-pointer ${errors.category ? 'border-rose-500 ring-4 ring-rose-500/10' : ''}`}
              >
                {categories[activeTab].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5">
            {/* From Wallet */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">{t('from_wallet')}</label>
              <select
                value={formData.walletId}
                onChange={(e) => setFormData({ ...formData, walletId: e.target.value })}
                className={`input-field font-bold text-sm cursor-pointer ${errors.walletId ? 'border-rose-500 ring-4 ring-rose-500/10' : ''}`}
              >
                <option value="">{t('select_wallet')}...</option>
                {wallets.map(w => (
                  <option key={w.id} value={w.id}>{w.icon} {w.name}</option>
                ))}
              </select>
              {errors.walletId && <p className="text-rose-500 text-[10px] font-black uppercase tracking-wider mt-1 ml-1">{errors.walletId}</p>}
            </div>

            {/* To Wallet */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">{t('to_wallet')}</label>
              <select
                value={formData.toWalletId}
                onChange={(e) => setFormData({ ...formData, toWalletId: e.target.value })}
                className={`input-field font-bold text-sm cursor-pointer ${errors.toWalletId ? 'border-rose-500 ring-4 ring-rose-500/10' : ''}`}
              >
                <option value="">{t('select_wallet')}...</option>
                {wallets.map(w => (
                  <option key={w.id} value={w.id}>{w.icon} {w.name}</option>
                ))}
              </select>
              {errors.toWalletId && <p className="text-rose-500 text-[10px] font-black uppercase tracking-wider mt-1 ml-1">{errors.toWalletId}</p>}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">{t('date')}</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`input-field font-bold text-sm cursor-pointer ${errors.date ? 'border-rose-500 ring-4 ring-rose-500/10' : ''}`}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">{t('note')}</label>
            <input
              type="text"
              placeholder={activeTab === 'transfer' ? t('transfer_note') : "Mua gì, làm gì..."}
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="input-field font-bold text-sm"
            />
          </div>
        </div>

        {activeTab !== 'transfer' && (
          <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <MdRefresh size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black text-zinc-800 dark:text-white uppercase tracking-widest">{t('recurring_setup')}</p>
                <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-tighter">{t('is_recurring')}</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setFormData({ ...formData, isRecurring: !formData.isRecurring })}
              className={`w-12 h-6 rounded-full transition-all relative ${formData.isRecurring ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isRecurring ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>
        )}

        <div className="flex gap-4 pt-2">
          <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-3 py-4 shadow-xl">
            {activeTab === 'transfer' ? <MdSwapHoriz size={20} /> : (editingTransaction ? <MdSave size={20} /> : <MdAdd size={20} />)}
            <span className="tracking-wide">
              {activeTab === 'transfer' ? t('transfer') : (editingTransaction ? t('save') : t('add'))}
            </span>
          </button>
          
          {(editingTransaction || activeTab === 'transfer') && (
            <button 
              type="button" 
              onClick={() => {
                setEditingTransaction(null);
                resetForm();
              }}
              className="btn-ghost flex items-center justify-center gap-2 px-8 border border-zinc-200 dark:border-zinc-700"
            >
              <MdCancel size={20} />
              {t('cancel')}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
