import { useTranslation } from 'react-i18next';
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
import { MdTrendingUp, MdTrendingDown, MdPictureAsPdf } from 'react-icons/md';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analytics = ({ transactions, selectedDate }) => {
  const { t, i18n } = useTranslation();
  // --- Yearly Bar Chart Data ---
  const currentYear = selectedDate.getFullYear();
  const months = i18n.language === 'vi' 
    ? ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
        label: t('income'),
        data: yearlyIncome,
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderRadius: 4,
      },
      {
        label: t('expense'),
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
        text: t('yearly_summary', { year: currentYear }), 
        font: { size: 18, weight: 'bold' },
        padding: { bottom: 24 }
      },
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
    return new Intl.NumberFormat(i18n.language === 'vi' ? 'vi-VN' : 'en-US', { style: 'currency', currency: i18n.language === 'vi' ? 'VND' : 'USD' }).format(amount);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', { day: '2-digit', month: '2-digit' });
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // jsPDF mặc định không hỗ trợ bộ mã Unicode. 
    // FormatCurrency của JS chứa ký tự khoảng trắng đặc biệt (No-break space) và ký hiệu ₫ (U+20AB) gây lỗi font "&".
    // Giải pháp: Loại bỏ hoàn toàn dấu tiếng Việt và XÓA SẠCH những byte không nằm trong bảng chuẩn ASCII.
    const cleanString = (str) => {
      if (!str) return '';
      let s = str.toString();
      // Chuyển ký hiệu tiền tệ
      s = s.replace(/₫/g, 'VND').replace(/đ/g, 'd').replace(/Đ/g, 'D');
      // Tách và loại bỏ dấu tiếng Việt
      s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      // Triệt tiêu mọi khoảng trắng ẩn & ký tự Unicode không hiển thị được
      s = s.replace(/[^\x20-\x7E]/g, ' '); 
      return s.trim();
    };

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    // Gõ text Tiếng Việt không dấu trực tiếp luôn để bớt phụ thuộc vào file script encoding.
    doc.text(`Bao Cao Tai Chinh - Nam ${currentYear}`, 14, 22);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Ngay xuat bao cao: ${new Date().toLocaleDateString('vi-VN')}`, 14, 30);

    const totalInc = yearlyIncome.reduce((a, b) => a + b, 0);
    const totalExp = yearlyExpense.reduce((a, b) => a + b, 0);
    const saved = totalInc - totalExp;

    doc.text(`Tong Thu Nhap: ${cleanString(formatCurrency(totalInc))}`, 14, 40);
    doc.text(`Tong Chi Tieu: ${cleanString(formatCurrency(totalExp))}`, 14, 48);
    doc.text(`Tiet Kiem Duoc: ${cleanString(formatCurrency(saved))}`, 14, 56);

    const tableData = transactions
      .filter(t => new Date(t.date).getFullYear() === currentYear)
      .sort((a,b) => new Date(b.date) - new Date(a.date))
      .slice(0, 40)
      .map(t => [
        cleanString(formatDate(t.date)),
        cleanString(t.category),
        t.type === 'income' ? 'Thu' : 'Chi',
        cleanString(formatCurrency(t.amount))
      ]);

    autoTable(doc, {
      startY: 65,
      head: [['Ngay', 'Danh muc', 'Loai', 'So tien']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] }
    });

    doc.save(`Bao_Cao_Tai_Chinh_${currentYear}.pdf`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-black text-zinc-800 dark:text-white tracking-tighter">Báo Cáo Phân Tích</h1>
          <p className="text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1">
            Năm {currentYear}
          </p>
        </div>
        <button 
          onClick={handleExportPDF}
          className="btn-primary flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-xl shadow-emerald-500/20"
        >
          <MdPictureAsPdf size={20} />
          Xuất PDF
        </button>
      </div>

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
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t('top_incomes')}</h3>
          </div>
          <div className="space-y-4">
            {topIncome.length === 0 ? (
              <p className="text-gray-400 text-center py-8 italic">{t('no_data')}</p>
            ) : (
              topIncome.map((t, idx) => (
                <div key={t.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-700">
                  <div className="w-8 h-8 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 dark:text-gray-100 truncate">{t.category}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(t.date)} - {t.note || '...'}</p>
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
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t('top_expenses')}</h3>
          </div>
          <div className="space-y-4">
            {topExpense.length === 0 ? (
              <p className="text-gray-400 text-center py-8 italic">{t('no_data')}</p>
            ) : (
              topExpense.map((t, idx) => (
                <div key={t.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-700">
                  <div className="w-8 h-8 flex items-center justify-center font-bold text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 dark:text-gray-100 truncate">{t.category}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(t.date)} - {t.note || '...'}</p>
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
