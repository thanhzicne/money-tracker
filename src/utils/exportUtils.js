import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToExcel = (transactions, fileName = 'transactions.xlsx') => {
  const data = transactions.map(t => ({
    'Ngày': t.date,
    'Loại': t.type === 'income' ? 'Thu nhập' : 'Chi tiêu',
    'Danh mục': t.category,
    'Số tiền': t.amount,
    'Ghi chú': t.note,
    'Ví': t.walletName || 'Mặc định'
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
  XLSX.writeFile(workbook, fileName);
};

export const exportToPDF = (transactions, fileName = 'transactions.pdf') => {
  const doc = new jsPDF();
  
  const tableColumn = ["Ngày", "Loại", "Danh mục", "Số tiền", "Ghi chú"];
  const tableRows = [];

  transactions.forEach(t => {
    const rowData = [
      t.date,
      t.type === 'income' ? 'Thu nhập' : 'Chi tiêu',
      t.category,
      new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(t.amount),
      t.note
    ];
    tableRows.push(rowData);
  });

  doc.autoTable(tableColumn, tableRows, { startY: 20 });
  doc.text("Báo cáo giao dịch", 14, 15);
  doc.save(fileName);
};
