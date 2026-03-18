import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  PointElement,
  LineElement
);

const DashboardCharts = ({ transactions, selectedDate }) => {
  const { t, i18n } = useTranslation();
  // --- Data Preparation for Bar Chart (Daily) ---
  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  const labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  const dailyIncome = Array(daysInMonth).fill(0);
  const dailyExpense = Array(daysInMonth).fill(0);

  transactions.forEach(t => {
    const day = new Date(t.date).getDate();
    if (t.type === 'income') {
      dailyIncome[day - 1] += Number(t.amount);
    } else {
      dailyExpense[day - 1] += Number(t.amount);
    }
  });

  const barData = {
    labels,
    datasets: [
      {
        label: t('income'),
        data: dailyIncome,
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderRadius: 4,
      },
      {
        label: t('expense'),
        data: dailyExpense,
        backgroundColor: 'rgba(244, 63, 94, 0.7)',
        borderRadius: 4,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { boxWidth: 10, usePointStyle: true, padding: 20 } },
      title: { display: true, text: t('daily_chart'), padding: { bottom: 20 }, font: { size: 16, weight: 'bold' } },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${new Intl.NumberFormat(i18n.language === 'vi' ? 'vi-VN' : 'en-US', { style: 'currency', currency: i18n.language === 'vi' ? 'VND' : 'USD' }).format(value)}`;
          }
        }
      }
    },
    scales: {
      y: { beginAtZero: true, ticks: { callback: (value) => value.toLocaleString(i18n.language === 'vi' ? 'vi-VN' : 'en-US') } }
    },
  };

  // --- Data Preparation for Donut Chart (Category) ---
  const expenses = transactions.filter(t => t.type === 'expense');
  const categoryTotals = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
    return acc;
  }, {});

  const totalExpense = expenses.reduce((sum, t) => sum + Number(t.amount), 0);
  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a);

  const donutData = {
    labels: sortedCategories.map(([cat]) => cat),
    datasets: [
      {
        data: sortedCategories.map(([, amount]) => amount),
        backgroundColor: [
          '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#71717a'
        ],
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: t('category_analysis'), padding: { bottom: 20 }, font: { size: 16, weight: 'bold' } },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw;
            const percentage = ((value / totalExpense) * 100).toFixed(1);
            return `${label}: ${new Intl.NumberFormat(i18n.language === 'vi' ? 'vi-VN' : 'en-US', { style: 'currency', currency: i18n.language === 'vi' ? 'VND' : 'USD' }).format(value)} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
      <div className="card h-[350px] md:h-[450px] p-4 md:p-8">
        <Bar data={barData} options={barOptions} />
      </div>
      <div className="card h-[350px] md:h-[450px] p-4 md:p-8">
        <div className="flex flex-col h-full">
          <div className="flex-1 min-h-0 relative">
            <Doughnut data={donutData} options={donutOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-6 md:pt-8">
              <span className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">{t('total_expense')}</span>
              <span className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tighter line-clamp-2">
                {new Intl.NumberFormat(i18n.language === 'vi' ? 'vi-VN' : 'en-US', { style: 'currency', currency: i18n.language === 'vi' ? 'VND' : 'USD' }).format(totalExpense)}
              </span>
            </div>
          </div>
          
          <div className="mt-4 md:mt-8 space-y-2 md:space-y-4 max-h-32 md:max-h-40 overflow-y-auto pr-2 custom-scrollbar\">
            {sortedCategories.map(([cat, amount], idx) => {
              const percentage = ((amount / totalExpense) * 100).toFixed(1);
              const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-violet-500', 'bg-pink-500', 'bg-cyan-500', 'bg-slate-500'];
              return (
                <div key={cat} className="group">
                  <div className="flex justify-between text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 group-hover:text-blue-500 transition-colors">
                    <span>{cat}</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden p-0.5 shadow-inner">
                    <div 
                      className={`${colors[idx % colors.length]} h-full rounded-full transition-all duration-1000 group-hover:brightness-110`} 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
