import { useTranslation } from 'react-i18next';
import { 
  MdDashboard, 
  MdAnalytics, 
  MdChevronLeft, 
  MdChevronRight, 
  MdDarkMode, 
  MdLightMode,
  MdPerson,
  MdLogout,
  MdAccountBalanceWallet,
  MdTranslate,
  MdPieChart,
  MdPayments,
  MdTrendingUp
} from 'react-icons/md';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

const Sidebar = ({ 
  selectedDate, 
  changeMonth, 
  activePage, 
  setActivePage,
  wallets,
  activeWalletId,
  setActiveWalletId,
  sidebarOpen,
  setSidebarOpen
}) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { t, i18n } = useTranslation();
  
  const monthNames = i18n.language === 'vi' 
    ? ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"]
    : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const formattedDate = `${monthNames[selectedDate.getMonth()]}, ${selectedDate.getFullYear()}`;

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: <MdDashboard size={20} /> },
    { id: 'analytics', label: t('analytics'), icon: <MdAnalytics size={20} /> },
    { id: 'wallets', label: t('wallets'), icon: <MdAccountBalanceWallet size={20} /> },
    { id: 'budgeting', label: t('budget_title', 'Ngân sách'), icon: <MdPieChart size={20} /> },
    { id: 'debts', label: t('debts_title', 'Sổ Nợ'), icon: <MdPayments size={20} /> },
    { id: 'investments', label: t('invest_title', 'Đầu tư'), icon: <MdTrendingUp size={20} /> },
    { id: 'profile', label: t('profile'), icon: <MdPerson size={20} /> },
  ];

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'vi' ? 'en' : 'vi');
  };

  return (
    <aside className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-zinc-950 border-r border-zinc-100 dark:border-zinc-800 flex flex-col transition-all duration-300 z-40 lg:static lg:translate-x-0 lg:border-r lg:p-0 ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    }`}>
      <div className="p-6 flex flex-col items-center overflow-y-auto h-full">
        <h1 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mb-8 tracking-tighter">{t('app_name')}</h1>
        
        {/* Month Selector */}
        <div className="w-full flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 mb-6">
          <button 
            onClick={() => changeMonth(-1)}
            className="p-1.5 hover:bg-white dark:hover:bg-zinc-800 rounded-xl transition-all text-zinc-400 hover:text-emerald-600"
          >
            <MdChevronLeft size={24} />
          </button>
          <span className="font-black text-zinc-700 dark:text-zinc-200 text-xs uppercase tracking-widest">
            {formattedDate}
          </span>
          <button 
            onClick={() => changeMonth(1)}
            className="p-1.5 hover:bg-white dark:hover:bg-zinc-800 rounded-xl transition-all text-zinc-400 hover:text-emerald-600"
          >
            <MdChevronRight size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="w-full space-y-2 mb-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActivePage(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
                activePage === item.id
                  ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20'
                  : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              {item.icon}
              <span className="font-bold text-sm tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Mini Profile */}
        <div className="w-full mt-auto p-5 bg-zinc-50 dark:bg-zinc-900/30 rounded-[2rem] border border-zinc-100 dark:border-zinc-800/50">
          <div className="flex items-center gap-4 mb-4">
            <img 
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'User'}&background=10b981&color=fff`} 
              className="w-12 h-12 rounded-2xl object-cover border-2 border-white dark:border-zinc-800 shadow-sm"
              alt="Avatar"
            />
            <div className="min-w-0">
              <p className="text-sm font-black text-zinc-800 dark:text-white truncate tracking-tight">{user?.displayName || 'Người dùng'}</p>
              <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 truncate uppercase tracking-tighter">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-xl transition-all"
          >
            <MdLogout size={16} />
            {t('logout')}
          </button>
        </div>
      </div>

      {/* Toggles */}
      <div className="mt-auto p-6 border-t border-zinc-50 dark:border-zinc-800 space-y-3">
        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="w-full flex items-center justify-between px-5 py-3 bg-zinc-50 dark:bg-zinc-900 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all border border-zinc-100 dark:border-zinc-800"
        >
          <span className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
            {i18n.language === 'vi' ? 'Tiếng Việt' : 'English'}
          </span>
          <div className="p-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
            <MdTranslate size={18} />
          </div>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-between px-5 py-3 bg-zinc-50 dark:bg-zinc-900 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all border border-zinc-100 dark:border-zinc-800"
        >
          <span className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
            {isDarkMode ? t('dark_mode') : t('light_mode')}
          </span>
          <div className={`p-2 rounded-xl transition-all shadow-lg ${isDarkMode ? 'bg-emerald-600 text-white shadow-emerald-500/20' : 'bg-amber-100 text-amber-600 shadow-amber-500/10'}`}>
            {isDarkMode ? <MdDarkMode size={18} /> : <MdLightMode size={18} />}
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
