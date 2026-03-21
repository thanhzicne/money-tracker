import React, { useState, useEffect } from 'react';
import { MdClose, MdAutoAwesome, MdWarning } from 'react-icons/md';
import { getRealityCheck, formatFinancialContext } from '../services/aiService';

const RealityCheckModal = ({ isOpen, onClose, totalBalance, income, expense }) => {
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setItemName('');
      setItemPrice('');
      setResult(null);
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePriceChange = (e) => {
    // Only allow digits
    const value = e.target.value.replace(/\D/g, '');
    setItemPrice(value);
  };

  const formatCurrency = (val) => {
    if (!val) return '';
    return new Intl.NumberFormat('vi-VN').format(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemName || !itemPrice) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const context = formatFinancialContext(totalBalance, income, expense);
      const output = await getRealityCheck(itemName, Number(itemPrice), context);
      setResult(output);
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi kết nối tới AI. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Simple Markdown Renderer for **bold**, *italic*, and line breaks
  const renderMarkdown = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, index) => {
      if (line.trim() === '') return <br key={index} />;
      
      // Parse Bold (**text**)
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={index} className="mb-2">
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i} className="font-bold text-gray-900 dark:text-white bg-amber-100 dark:bg-amber-900/30 px-1 rounded">{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('*') && part.endsWith('*')) {
              return <em key={i} className="text-gray-800 dark:text-gray-200">{part.slice(1, -1)}</em>;
            }
            return <span key={i}>{part}</span>;
          })}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-rose-500/10 border border-gray-100 dark:border-slate-700 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500"></div>
        
        <div className="flex items-center justify-between p-6 pb-2 border-b border-gray-100 dark:border-slate-700/50">
          <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600 flex items-center gap-2 drop-shadow-sm">
            <MdAutoAwesome className="text-rose-500 drop-shadow" size={26} />
            Cảnh tỉnh Chốt đơn
          </h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-50 dark:bg-slate-700 rounded-full transition-colors">
            <MdClose size={24} />
          </button>
        </div>

        <div className="p-6">
          {!result && !loading && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Hãy thành thật khai báo món đồ bạn đang định "vung tay quá trán". Khai thiệt đi để AI còn mắng cho tỉnh ra.</p>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tên món đồ muốn mua</label>
                <input 
                  type="text" 
                  value={itemName} 
                  onChange={(e) => setItemName(e.target.value)} 
                  placeholder="Ví dụ: Bàn phím cơ, Điện thoại mới..."
                  className="w-full bg-gray-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-purple-400 dark:focus:border-purple-500 transition-colors"
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Giá tiền dự kiến (VNĐ)</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formatCurrency(itemPrice)} 
                    onChange={handlePriceChange} 
                    placeholder="2,000,000"
                    className="w-full bg-gray-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-xl px-4 py-3 pb-3 pr-10 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-purple-400 dark:focus:border-purple-500 transition-colors font-bold"
                    required 
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold bg-gray-50 dark:bg-slate-900 pl-2">đ</span>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl text-sm flex gap-2 items-start border border-rose-100 dark:border-rose-800/50">
                  <MdWarning size={20} className="shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <button 
                type="submit" 
                disabled={!itemName || !itemPrice}
                className="w-full mt-6 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-rose-500 hover:from-rose-600 to-purple-600 hover:to-purple-700 shadow-lg shadow-rose-200 dark:shadow-none transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed uppercase tracking-wider text-sm flex items-center justify-center gap-2"
              >
                <MdAutoAwesome size={20} />
                <span>Hỏi Chỉ Đạo Chuyên Gia</span>
              </button>
            </form>
          )}

          {loading && (
            <div className="py-14 flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 w-full h-full border-4 border-rose-100 dark:border-slate-700 rounded-full"></div>
                <div className="absolute inset-0 w-full h-full border-4 border-t-rose-500 border-r-purple-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-rose-500 animate-pulse">
                  <MdAutoAwesome size={32} />
                </div>
              </div>
              <div className="text-center">
                <h4 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600 animate-pulse mb-2">
                  AI đang vãn cảnh sinh nghiệp...
                </h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Đang check ví của bạn...</p>
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              <div className="p-6 pt-12 mt-6 bg-gradient-to-br from-rose-50 via-white to-purple-50 dark:from-slate-700/80 dark:via-slate-800 dark:to-slate-800 rounded-2xl border border-rose-100/50 dark:border-slate-600/50 relative shadow-inner">
                <div className="absolute -top-6 left-6 p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-rose-50 dark:border-slate-700 rotate-[-5deg] z-10">
                  <span className="text-4xl filter drop-shadow">💅</span>
                </div>
                <div className="text-gray-800 dark:text-gray-200 text-base leading-relaxed whitespace-pre-wrap font-medium text-justify">
                  {renderMarkdown(result)}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setResult(null)}
                  className="flex-1 py-4.5 rounded-xl font-bold text-rose-600 dark:text-white bg-rose-50 dark:bg-slate-700 hover:bg-rose-100 dark:hover:bg-slate-600 border border-rose-100 dark:border-transparent transition-all active:scale-[0.98] shadow-sm uppercase tracking-wider text-xs"
                >
                  Thử Món Khác
                </button>
                <button 
                  onClick={onClose}
                  className="flex-1 py-4.5 rounded-xl font-bold text-white bg-slate-900 dark:bg-purple-600 hover:bg-slate-800 dark:hover:bg-purple-700 transition-all active:scale-[0.98] shadow-lg shadow-slate-200 dark:shadow-none uppercase tracking-wider text-xs flex items-center justify-center gap-1.5"
                >
                  <MdClose size={16} /> Đã Bừng Tỉnh
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealityCheckModal;
