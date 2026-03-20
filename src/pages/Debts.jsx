import React, { useState } from 'react';
import { MdAdd, MdEdit, MdDelete, MdCheck, MdCancel, MdPayments } from 'react-icons/md';

const Debts = ({ debts, addDebt, updateDebt, deleteDebt, wallets, addTransaction }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [showPayment, setShowPayment] = useState(null); // The debt being paid
  const [editingDebt, setEditingDebt] = useState(null);
  
  const [formData, setFormData] = useState({ 
    type: 'borrow', // 'borrow' (Tôi nợ) or 'loan' (Cho vay)
    person: '',
    totalAmount: '',
    dueDate: '',
    note: ''
  });

  const [paymentData, setPaymentData] = useState({
    amount: '',
    walletId: wallets[0]?.id || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.person || !formData.totalAmount) return;

    const data = {
      ...formData,
      totalAmount: Number(formData.totalAmount),
      paidAmount: editingDebt ? editingDebt.paidAmount : 0,
      status: editingDebt ? editingDebt.status : 'active'
    };

    if (editingDebt) {
      updateDebt({ ...data, id: editingDebt.id });
      setEditingDebt(null);
    } else {
      addDebt(data);
    }

    setFormData({ type: 'borrow', person: '', totalAmount: '', dueDate: '', note: '' });
    setShowAdd(false);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentData.amount || !paymentData.walletId || !showPayment) return;

    const payAmount = Number(paymentData.amount);
    const newPaidAmount = (showPayment.paidAmount || 0) + payAmount;
    
    // 1. Update Debt
    updateDebt({
      ...showPayment,
      paidAmount: newPaidAmount,
      status: newPaidAmount >= showPayment.totalAmount ? 'paid' : 'active'
    });

    // 2. Add Transaction
    await addTransaction({
      amount: payAmount,
      type: showPayment.type === 'borrow' ? 'expense' : 'income',
      category: showPayment.type === 'borrow' ? 'Trả nợ' : 'Thu nợ',
      date: new Date().toISOString().split('T')[0],
      note: `Thanh toán nợ cho ${showPayment.person}`,
      walletId: paymentData.walletId
    });

    setShowPayment(null);
    setPaymentData({ amount: '', walletId: wallets[0]?.id || '' });
    alert('Thanh toán thành công và đã ghi nhận vào giao dịch!');
  };

  const handleEdit = (debt) => {
    setEditingDebt(debt);
    setFormData({
      type: debt.type,
      person: debt.person,
      totalAmount: debt.totalAmount,
      dueDate: debt.dueDate || '',
      note: debt.note || ''
    });
    setShowAdd(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khoản này?')) {
      await deleteDebt(id);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const borrowList = debts.filter(d => d.type === 'borrow');
  const loanList = debts.filter(d => d.type === 'loan');

  const renderDebtCard = (debt) => {
    const remaining = debt.totalAmount - (debt.paidAmount || 0);
    const isPaid = remaining <= 0;

    return (
      <div key={debt.id} className={`card group p-6 relative overflow-hidden transition-all hover:shadow-xl ${isPaid ? 'opacity-70' : ''}`}>
        <div className="absolute top-0 right-0 p-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isPaid && (
            <button 
              onClick={() => setShowPayment(debt)}
              className="p-2 text-zinc-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all"
              title="Thanh toán"
            >
              <MdPayments size={18} />
            </button>
          )}
          <button 
            onClick={() => handleEdit(debt)}
            className="p-2 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
          >
            <MdEdit size={18} />
          </button>
          <button 
            onClick={() => handleDelete(debt.id)}
            className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
          >
            <MdDelete size={18} />
          </button>
        </div>
        
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-black text-zinc-800 dark:text-white tracking-tight">{debt.person}</h3>
            <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
              {debt.type === 'borrow' ? 'Tôi nợ' : 'Cho vay'} {isPaid && ' (Đã xong)'}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm font-black">
            <span className="text-zinc-500">Tổng cộng:</span>
            <span className="text-zinc-800 dark:text-white">{formatCurrency(debt.totalAmount)}</span>
          </div>
          <div className="flex justify-between text-sm font-black">
            <span className="text-emerald-500">Đã trả:</span>
            <span className="text-emerald-500">{formatCurrency(debt.paidAmount || 0)}</span>
          </div>
          <div className="flex justify-between text-sm font-black pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-rose-500">Còn lại:</span>
            <span className="text-rose-500">{formatCurrency(Math.max(remaining, 0))}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-800 dark:text-white tracking-tighter">Sổ nợ / Cho vay</h1>
          <p className="text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1">
            Quản lý công nợ
          </p>
        </div>
        {!showAdd && !showPayment && (
          <button 
            onClick={() => setShowAdd(true)}
            className="btn-primary flex items-center gap-2"
          >
            <MdAdd size={20} />
            Thêm khoản mới
          </button>
        )}
      </div>

      {showPayment && (
        <div className="card p-8 border-2 border-emerald-500/20 bg-emerald-50/10 dark:bg-emerald-900/5">
          <h3 className="text-lg font-black text-emerald-600 dark:text-emerald-400 mb-6 uppercase tracking-tight flex items-center gap-2">
            <MdPayments /> Thanh toán cho {showPayment.person}
          </h3>
          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase">Số tiền thanh toán</label>
                <input 
                  type="number" 
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                  className="input-field font-bold text-sm"
                  max={showPayment.totalAmount - (showPayment.paidAmount || 0)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase">Sử dụng Ví</label>
                <select 
                  value={paymentData.walletId}
                  onChange={(e) => setPaymentData({...paymentData, walletId: e.target.value})}
                  className="input-field font-bold text-sm w-full"
                  required
                >
                  {wallets.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button type="submit" className="btn-primary flex-1 py-4 flex items-center justify-center gap-2">
                <MdCheck size={20} /> Xác nhận
              </button>
              <button 
                type="button" 
                onClick={() => setShowPayment(null)} 
                className="btn-ghost px-8 border flex items-center justify-center gap-2"
              >
                <MdCancel size={20} /> Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {showAdd && !showPayment && (
        <div className="card p-8 border-2 border-emerald-500/20 bg-emerald-50/10 dark:bg-emerald-900/5">
          <h3 className="text-lg font-black text-zinc-800 dark:text-white mb-6 uppercase tracking-tight">
            {editingDebt ? 'Sửa thông tin' : 'Thêm khoản mới'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase">Loại</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="input-field font-bold text-sm w-full"
                >
                  <option value="borrow">Tôi mượn nợ người khác</option>
                  <option value="loan">Người khác mượn tiền tôi</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase">Đối tác (Tên người)</label>
                <input 
                  type="text" 
                  value={formData.person}
                  onChange={(e) => setFormData({...formData, person: e.target.value})}
                  className="input-field font-bold text-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase">Số tiền</label>
                <input 
                  type="number" 
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({...formData, totalAmount: e.target.value})}
                  className="input-field font-bold text-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase">Ghi chú (Tùy chọn)</label>
                <input 
                  type="text" 
                  value={formData.note}
                  onChange={(e) => setFormData({...formData, note: e.target.value})}
                  className="input-field font-bold text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <button type="submit" className="btn-primary flex-1 py-4 flex items-center justify-center gap-2">
                {editingDebt ? <MdCheck size={20} /> : <MdAdd size={20} />}
                {editingDebt ? 'Lưu thay đổi' : 'Thêm mới'}
              </button>
              <button 
                type="button" 
                onClick={() => { setShowAdd(false); setEditingDebt(null); }} 
                className="btn-ghost px-8 border border-zinc-200 dark:border-zinc-700 flex items-center gap-2"
              >
                <MdCancel size={20} />
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-black text-rose-500 mb-4 sticky top-0 py-2 bg-white dark:bg-zinc-950 z-10">Tôi Nợ (Cần trả)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
            {borrowList.length === 0 && <p className="text-zinc-500 italic text-sm">Không có khoản nợ nào.</p>}
            {borrowList.map(renderDebtCard)}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-black text-emerald-500 mb-4 sticky top-0 py-2 bg-white dark:bg-zinc-950 z-10">Cho Vay (Cần thu)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
            {loanList.length === 0 && <p className="text-zinc-500 italic text-sm">Không có khoản cho vay nào.</p>}
            {loanList.map(renderDebtCard)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Debts;
