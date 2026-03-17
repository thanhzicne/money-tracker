import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analytics = ({ transactions, selectedDate }) => {
  // --- Yearly Bar Chart Data ---
  const currentYear = selectedDate.getFullYear();
  const months = [
    'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 
    'T7', 'T8', 'T9', 'T10', 'T11', 'T12'
  ];

  const yearlyIncome = Array(12).fill(0);
  const yearlyExpense = Array(12).fill(0);

  transactions.forEach(t => {
    const date = new Date(t.date);
    if (date.getFullYear() === currentYear) {
      const monthIdx = date.getMonth();
      if (t.type === 'income') {
        yearlyIncome[monthIdx] += Number(t.amount);
      } else {
        yearlyExpense[monthIdx] += Number(t.amount);
      }
    }
  });

  const yearlyBarData = {
    labels: months,
    datasets: [
      {
        label: 'Thu nhập',
        data: yearlyIncome,
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderRadius: 4,
      },
      {
        label: 'Chi tiêu',
        data: yearlyExpense,
        backgroundColor: 'rgba(244, 63, 94, 0.7)',
        borderRadius: 4,
      },
    ],
  };

  const yearlyBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { boxWidth: 10, usePointStyle: true } },
      title: { 
        display: true, 
        text: `Biểu đồ thu chi năm ${currentYear}`, 
        font: { size: 18, weight: 'bold' },
        padding: { bottom: 24 }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}`;
          }
        }
      }
    },
    scales: {
      y: { beginAtZero: true, ticks: { callback: (value) => value.toLocaleString('vi-VN') } }
    },
  };

  // --- Top Transactions Data ---
  const currentMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === selectedDate.getMonth() && date.getFullYear() === currentYear;
  });

  const topIncome = [...currentMonthTransactions]
    .filter(t => t.type === 'income')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  const topExpense = [...currentMonthTransactions]
    .filter(t => t.type === 'expense')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="space-y-8">
      {/* Yearly Summary Chart */}
      <section className="card h-112.5">
        <Bar data={yearlyBarData} options={yearlyBarOptions} />
      </section>

      {/* Top Transactions Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top 3 Incomes */}
        <section className="card">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-slate-700 pb-4">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <MdTrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Top 3 Thu nhập lớn nhất</h3>
          </div>
          <div className="space-y-4">
            {topIncome.length === 0 ? (
              <p className="text-gray-400 text-center py-8 italic">Chưa có dữ liệu thu nhập trong tháng</p>
            ) : (
              topIncome.map((t, idx) => (
                <div key={t.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-700">
                  <div className="w-8 h-8 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 dark:text-gray-100 truncate">{t.category}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(t.date)} - {t.note || 'Không có ghi chú'}</p>
                  </div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(t.amount)}</span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Top 3 Expenses */}
        <section className="card">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-slate-700 pb-4">
            <div className="p-2 bg-rose-100 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-lg">
              <MdTrendingDown size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Top 3 Chi tiêu lớn nhất</h3>
          </div>
          <div className="space-y-4">
            {topExpense.length === 0 ? (
              <p className="text-gray-400 text-center py-8 italic">Chưa có dữ liệu chi tiêu trong tháng</p>
            ) : (
              topExpense.map((t, idx) => (
                <div key={t.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-700">
                  <div className="w-8 h-8 flex items-center justify-center font-bold text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 dark:text-gray-100 truncate">{t.category}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(t.date)} - {t.note || 'Không có ghi chú'}</p>
                  </div>
                  <span className="font-bold text-rose-600 dark:text-rose-400">{formatCurrency(t.amount)}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Analytics;
