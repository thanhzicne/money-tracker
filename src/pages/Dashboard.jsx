import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdDownload, MdTableChart, MdPictureAsPdf } from 'react-icons/md';
import SummaryCards from '../components/SummaryCards';
import SavingsGoal from '../components/SavingsGoal';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import DashboardCharts from '../components/DashboardCharts';
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
  setActivePage
}) => {
  const { t } = useTranslation();
  const [editingTransaction, setEditingTransaction] = useState(null);

  return (
    <div className="space-y-8">
      {/* Section 1: Summary & Export */}
      <section className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 w-full">
          <SummaryCards stats={stats} />
        </div>
        <div className="w-full lg:w-72 card p-6 flex flex-col gap-4">
          <h3 className="text-sm font-black text-zinc-800 dark:text-white uppercase tracking-widest mb-2 flex items-center gap-2">
            <MdDownload className="text-emerald-500" size={18} />
            {t('export_data')}
          </h3>
          <button 
            onClick={() => exportToExcel(transactions)}
            className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-bold text-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors border border-emerald-100 dark:border-emerald-800/50"
          >
            <MdTableChart size={20} />
            Excel (.xlsx)
          </button>
          <button 
            onClick={() => exportToPDF(transactions)}
            className="flex items-center gap-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-bold text-sm hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors border border-rose-100 dark:border-rose-800/50"
          >
            <MdPictureAsPdf size={20} />
            PDF Report
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
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">{t('wallets')}</h3>
            <button 
              onClick={() => setActivePage('wallets')}
              className="text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:underline"
            >
              {t('all')} {t('wallets')} →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {wallets.slice(0, 4).map(wallet => {
              const txSum = transactions
                .filter(t => t.walletId === wallet.id)
                .reduce((sum, t) => t.type === 'income' ? sum + Number(t.amount) : sum - Number(t.amount), 0);
              const balance = Number(wallet.initialBalance || 0) + txSum;
              
              return (
                <div 
                  key={wallet.id} 
                  onClick={() => setActivePage('wallets')}
                  className="card p-5 flex items-center gap-4 hover:shadow-lg transition-all cursor-pointer border-l-4" 
                  style={{ borderLeftColor: wallet.color || '#10b981' }}
                >
                  <div className="w-10 h-10 flex items-center justify-center text-xl bg-zinc-50 dark:bg-zinc-900 rounded-xl">
                    {wallet.icon || '💳'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-zinc-800 dark:text-white text-[10px] uppercase tracking-wider truncate">{wallet.name}</h4>
                    <p className={`text-sm font-black tracking-tight ${balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(balance)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Section 4: Management (Form & List) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <TransactionForm 
          onAdd={addTransaction} 
          onUpdate={updateTransaction}
          onTransfer={addTransfer}
          editingTransaction={editingTransaction}
          setEditingTransaction={setEditingTransaction}
          wallets={wallets}
        />
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
    </div>
  );
};

export default Dashboard;
