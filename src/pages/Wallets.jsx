import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdAdd, MdAccountBalanceWallet, MdMoreVert, MdDelete, MdEdit, MdCheck, MdCancel } from 'react-icons/md';

const Wallets = ({ wallets, addWallet, updateWallet, deleteWallet, totalBalance, transactions }) => {
  const { t } = useTranslation();
  const [showAdd, setShowAdd] = useState(false);
  const [editingWallet, setEditingWallet] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    initialBalance: '', 
    icon: '💳', 
    color: '#10b981' 
  });

  const icons = ['💳', '💵', '🏦', '💰', '📱', '🧧'];
  const colors = [
    { name: 'Emerald', code: '#10b981' },
    { name: 'Blue', code: '#3b82f6' },
    { name: 'Amber', code: '#f59e0b' },
    { name: 'Rose', code: '#f43f5e' },
    { name: 'Violet', code: '#8b5cf6' },
    { name: 'Zinc', code: '#71717a' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const data = {
      ...formData,
      initialBalance: Number(formData.initialBalance || 0)
    };

    if (editingWallet) {
      updateWallet({ ...data, id: editingWallet.id });
      setEditingWallet(null);
    } else {
      addWallet(data);
    }

    setFormData({ name: '', initialBalance: '', icon: '💳', color: '#10b981' });
    setShowAdd(false);
  };

  const handleEdit = (wallet) => {
    setEditingWallet(wallet);
    setFormData({
      name: wallet.name,
      initialBalance: wallet.initialBalance,
      icon: wallet.icon || '💳',
      color: wallet.color || '#10b981'
    });
    setShowAdd(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('delete_wallet_confirm'))) {
      try {
        await deleteWallet(id);
      } catch (error) {
        alert(t('cannot_delete_wallet'));
      }
    }
  };

  const getWalletBalance = (walletId, initialBalance = 0) => {
    const walletTransactions = transactions.filter(t => t.walletId === walletId);
    const txSum = walletTransactions.reduce((sum, t) => {
      return t.type === 'income' ? sum + Number(t.amount) : sum - Number(t.amount);
    }, 0);
    return Number(initialBalance) + txSum;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-800 dark:text-white tracking-tighter">{t('wallets_management')}</h1>
          <p className="text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1">{t('total_assets')}: {formatCurrency(totalBalance)}</p>
        </div>
        {!showAdd && (
          <button 
            onClick={() => setShowAdd(true)}
            className="btn-primary flex items-center gap-2"
          >
            <MdAdd size={20} />
            {t('add_wallet')}
          </button>
        )}
      </div>

      {showAdd && (
        <div className="card p-8 border-2 border-emerald-500/20 bg-emerald-50/10 dark:bg-emerald-900/5">
          <h3 className="text-lg font-black text-zinc-800 dark:text-white mb-6 uppercase tracking-tight">
            {editingWallet ? t('edit_wallet') : t('add_wallet')}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">{t('wallet_name')}</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ví dụ: Thẻ Visa, Ví Momo..."
                  className="input-field font-bold text-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">{t('initial_balance')}</label>
                <input 
                  type="number" 
                  value={formData.initialBalance}
                  onChange={(e) => setFormData({...formData, initialBalance: e.target.value})}
                  placeholder="0"
                  className="input-field font-bold text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">{t('wallet_icon')}</label>
                <div className="flex gap-3">
                  {icons.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({...formData, icon})}
                      className={`w-12 h-12 flex items-center justify-center text-xl rounded-2xl transition-all ${formData.icon === icon ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700'}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">{t('wallet_color')}</label>
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
            </div>

            <div className="flex gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <button type="submit" className="btn-primary flex-1 py-4 flex items-center justify-center gap-2">
                {editingWallet ? <MdCheck size={20} /> : <MdAdd size={20} />}
                {editingWallet ? t('save') : t('add')}
              </button>
              <button 
                type="button" 
                onClick={() => { setShowAdd(false); setEditingWallet(null); }} 
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
        {wallets.map(wallet => {
          const balance = getWalletBalance(wallet.id, wallet.initialBalance);
          return (
            <div key={wallet.id} className="card group p-8 relative overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1">
              <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: wallet.color || '#10b981' }}></div>
              <div className="absolute top-0 right-0 p-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(wallet)}
                  className="p-2 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                >
                  <MdEdit size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(wallet.id)}
                  className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
                >
                  <MdDelete size={18} />
                </button>
              </div>
              
              <div className="flex items-start gap-5 mb-6">
                <div className="w-14 h-14 flex items-center justify-center text-3xl bg-zinc-50 dark:bg-zinc-900 rounded-2xl shadow-inner border border-zinc-100 dark:border-zinc-800">
                  {wallet.icon || '💳'}
                </div>
                <div>
                  <h3 className="text-xl font-black text-zinc-800 dark:text-white tracking-tight">{wallet.name}</h3>
                  <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">{wallet.type || 'Standard'}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{t('currently_have')}</p>
                <p className={`text-3xl font-black tracking-tighter ${balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {formatCurrency(balance)}
                </p>
              </div>

              {wallet.initialBalance > 0 && (
                <div className="mt-4 pt-4 border-t border-zinc-50 dark:border-zinc-900/50 flex justify-between items-center">
                  <span className="text-[9px] font-black text-zinc-300 dark:text-zinc-600 uppercase tracking-widest">{t('initial_balance')}</span>
                  <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500">{formatCurrency(wallet.initialBalance)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wallets;
