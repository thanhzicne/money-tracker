import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { MdEmail, MdPerson, MdLogout, MdDateRange, MdStars } from 'react-icons/md';

const Profile = ({ transactionsCount, totalBalance }) => {
  const { user, logout } = useAuth();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700">
        <div className="h-32 bg-blue-600 dark:bg-blue-900/40"></div>
        <div className="px-8 pb-8">
          <div className="relative -mt-16 flex flex-col md:flex-row items-end gap-6 mb-8">
            <div className="relative p-1 bg-white dark:bg-slate-800 rounded-3xl shadow-xl">
              <img 
                src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'User'}&background=random`} 
                alt="Avatar" 
                className="w-32 h-32 rounded-2xl object-cover"
              />
              <div className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 text-white rounded-xl shadow-lg border-4 border-white dark:border-slate-800">
                <MdStars size={20} />
              </div>
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{user?.displayName || 'Người dùng'}</h1>
              <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1 font-medium">
                <MdEmail size={18} className="text-blue-500" />
                {user?.email}
              </p>
            </div>
            <button
              onClick={logout}
              className="px-6 py-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl font-bold flex items-center gap-2 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all shadow-sm active:scale-[0.98]"
            >
              <MdLogout size={20} />
              Đăng xuất
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-50 dark:bg-slate-700/50 rounded-2xl border border-gray-100 dark:border-slate-600/50">
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Tổng tài sản</p>
              <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">
                {formatCurrency(totalBalance)}
              </h3>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-slate-700/50 rounded-2xl border border-gray-100 dark:border-slate-600/50">
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Số giao dịch</p>
              <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
                {transactionsCount}
              </h3>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-slate-700/50 rounded-2xl border border-gray-100 dark:border-slate-600/50">
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Ngày tham gia</p>
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 tracking-tight flex items-center gap-2">
                <MdDateRange size={20} className="text-blue-500" />
                {formatDate(user?.metadata.creationTime)}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
          <MdPerson className="text-blue-500" size={24} />
          Thông tin tài khoản
        </h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-6 border-b border-gray-100 dark:border-slate-700">
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">UID</p>
              <p className="font-mono text-sm text-gray-600 dark:text-gray-400 break-all">{user?.uid}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Phương thức đăng nhập</p>
              <p className="font-bold text-gray-700 dark:text-gray-200 capitalize">
                {user?.providerData[0]?.providerId === 'google.com' ? 'Google Account' : 'Email & Password'}
              </p>
            </div>
          </div>
          
          <div className="pt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed italic">
              * Toàn bộ dữ liệu giao dịch của bạn được mã hóa và lưu trữ an toàn trên máy chủ của chúng tôi. Bạn có thể đăng nhập trên các thiết bị khác để đồng bộ dữ liệu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
