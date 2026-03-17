import React, { useState } from 'react';
import SummaryCards from '../components/SummaryCards';
import SavingsGoal from '../components/SavingsGoal';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import DashboardCharts from '../components/DashboardCharts';

const Dashboard = ({ 
  filteredTransactions, 
  stats, 
  savingsGoal, 
  setSavingsGoal, 
  savingsProgress, 
  addTransaction, 
  updateTransaction, 
  deleteTransaction,
  selectedDate 
}) => {
  const [editingTransaction, setEditingTransaction] = useState(null);

  return (
    <div className="space-y-8">
      {/* Section 1: Summary & Goal */}
      <section>
        <SummaryCards stats={stats} />
        <SavingsGoal 
          goal={savingsGoal} 
          setGoal={setSavingsGoal} 
          progress={savingsProgress} 
          balance={stats.balance} 
        />
      </section>

      {/* Section 2: Management (Form & List) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <TransactionForm 
          onAdd={addTransaction} 
          onUpdate={updateTransaction}
          editingTransaction={editingTransaction}
          setEditingTransaction={setEditingTransaction}
        />
        <TransactionList 
          transactions={filteredTransactions} 
          onEdit={setEditingTransaction} 
          onDelete={deleteTransaction} 
        />
      </section>

      {/* Section 3: Analysis (Charts) */}
      <section>
        <DashboardCharts transactions={filteredTransactions} selectedDate={selectedDate} />
      </section>
    </div>
  );
};

export default Dashboard;
