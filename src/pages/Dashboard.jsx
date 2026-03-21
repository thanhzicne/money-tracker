import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdDownload, MdTableChart, MdPictureAsPdf, MdAutoAwesome } from 'react-icons/md';
import SummaryCards from '../components/SummaryCards';
import SavingsGoal from '../components/SavingsGoal';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import DashboardCharts from '../components/DashboardCharts';
import RealityCheckModal from '../components/RealityCheckModal';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';

const Dashboard = ({ 
  transactions,
  filteredTransactions, 
  stats, 
  savingsGoal, 
  setSavingsGoal, 
  savingsProgress, 
  addTransaction, 
  addTransfer,
  updateTransaction, 
  deleteTransaction,
  selectedDate,
  wallets,
  setActivePage,
  jars
}) => {
  const { t } = useTranslation();
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isRealityCheckOpen, setIsRealityCheckOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Section 1: Summary & Export */}
      <section className="flex flex-col xl:flex-row gap-6 md:gap-8 items-start w-full">
        <div className="flex-1 w-full space-y-6">
          <SummaryCards stats={stats} />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-br from-rose-50 to-purple-50 dark:from-slate-800 dark:to-slate-800 p-4 md:p-5 rounded-3xl border border-rose-100 dark:border-rose-900/30">
            <div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm">Bạn sắp chốt đơn món đắt tiền?</h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">Để chuyên gia AI phản biện giúp bạn trước khi đưa ra quyết định nhé.</p>
            </div>
            <button 
              onClick={() => setIsRealityCheckOpen(true)}
              className="flex items-center justify-center sm:justify-start gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white rounded-xl font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] active:scale-[0.98] transition-all text-xs tracking-wide whitespace-nowrap shrink-0"
            >
              <MdAutoAwesome size={16} /> Hỏi AI trước khi mua
            </button>
          </div>
        </div>
        <div className="w-full xl:w-80 card p-5 md:p-6 flex flex-col gap-3 md:gap-4 shrink-0">
          <h3 className="text-xs md:text-sm font-black text-zinc-800 dark:text-white uppercase tracking-widest mb-2 flex items-center gap-2">
            <MdDownload className="text-emerald-500" size={18} />
            {t('export_data')}
          </h3>
          <button 
            onClick={() => exportToExcel(transactions)}
            className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 p-2.5 md:p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs md:text-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors border border-emerald-100 dark:border-emerald-800/50"
          >
            <MdTableChart size={18} />
            <span className="hidden sm:inline">{t('export_excel')}</span>
          </button>
          <button 
            onClick={() => exportToPDF(transactions)}
            className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 p-2.5 md:p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-bold text-xs md:text-sm hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors border border-rose-100 dark:border-rose-800/50"
          >
            <MdPictureAsPdf size={18} />
            <span className="hidden sm:inline">{t('export_pdf')}</span>
          </button>
        </div>
      </section>

      {/* Section 2: Savings Goal (Full Width) */}
      <section>
        <SavingsGoal 
          goal={savingsGoal} 
          setGoal={setSavingsGoal} 
          progress={savingsProgress} 
          balance={stats.balance} 
        />
      </section>

      {/* Section 3: Wallet Mini List (Below Goal) */}
      {wallets.length > 0 && (
        <section className="space-y-3 md:space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">{t('wallets')}</h3>
            <button 
              onClick={() => setActivePage('wallets')}
              className="text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:underline"
            >
              {t('all')} →
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
            {wallets.slice(0, 4).map(wallet => {
              const txSum = transactions
                .filter(t => t.walletId === wallet.id)
                .reduce((sum, t) => t.type === 'income' ? sum + Number(t.amount) : sum - Number(t.amount), 0);
              const balance = Number(wallet.initialBalance || 0) + txSum;
              
              return (
                <div 
                  key={wallet.id} 
                  onClick={() => setActivePage('wallets')}
                  className="card p-3 md:p-5 flex flex-col items-start gap-3 hover:shadow-lg transition-all cursor-pointer border-l-4" 
                  style={{ borderLeftColor: wallet.color || '#10b981' }}
                >
                  <div className="w-8 md:w-10 h-8 md:h-10 flex items-center justify-center text-lg md:text-xl bg-zinc-50 dark:bg-zinc-900 rounded-xl">
                    {wallet.icon || '💳'}
                  </div>
                  <div className="flex-1 min-w-0 w-full">
                    <h4 className="font-black text-zinc-800 dark:text-white text-[9px] md:text-[10px] uppercase tracking-wider truncate">{wallet.name}</h4>
                    <p className={`text-xs md:text-sm font-black tracking-tight truncate ${balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {`${new Intl.NumberFormat('vi-VN').format(balance)} VNĐ`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Section 4: Management (Form & List) */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8 items-stretch">
        <div className="lg:col-span-1 space-y-4 md:space-y-6">
          <TransactionForm 
            onAdd={addTransaction} 
            onUpdate={updateTransaction}
            onTransfer={addTransfer}
            editingTransaction={editingTransaction}
            setEditingTransaction={setEditingTransaction}
            wallets={wallets}
            jars={jars}
          />
        </div>
        <TransactionList 
          transactions={filteredTransactions} 
          onEdit={setEditingTransaction} 
          onDelete={deleteTransaction} 
        />
      </section>

      {/* Section 4: Analysis (Charts) */}
      <section>
        <DashboardCharts transactions={filteredTransactions} selectedDate={selectedDate} />
      </section>

      <RealityCheckModal 
        isOpen={isRealityCheckOpen} 
        onClose={() => setIsRealityCheckOpen(false)} 
        totalBalance={stats?.balance || 0} 
        income={stats?.income || 0} 
        expense={stats?.expense || 0} 
      />
    </div>
  );
};

export default Dashboard;
