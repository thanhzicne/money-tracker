import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper to remove Vietnamese accents for PDF compatibility
const removeAccents = (str) => {
  if (!str) return '';
  return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9\s.,\-\/()$]/g, ''); // Keep only basic characters
};

export const exportToExcel = (transactions, fileName = 'transactions.xlsx') => {
  if (!transactions || transactions.length === 0) return;
  
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

export const exportToPDF = (transactions, fileName = 'transactions_report.pdf') => {
  if (!transactions || transactions.length === 0) return;

  try {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text("MONEY TRACKER - TRANSACTION REPORT", 14, 20);
    
    doc.setFontSize(10);
    doc.text(`Export Date: ${new Date().toLocaleString()}`, 14, 28);

    // Headers in non-accented Vietnamese/English for safety
    const tableColumn = ["Date", "Type", "Category", "Amount", "Note"];
    
    const tableRows = transactions.map(t => [
      t.date,
      removeAccents(t.type === 'income' ? 'Thu nhap' : 'Chi tieu'),
      removeAccents(t.category),
      // For currency, we'll use a simplified format to avoid 'đ' symbol issues
      `${new Intl.NumberFormat('vi-VN').format(t.amount)} VNĐ`,
      removeAccents(t.note || '')
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      styles: { 
        font: 'helvetica', 
        fontSize: 9,
        cellPadding: 3
      },
      headStyles: { 
        fillColor: [16, 185, 129], // Emerald
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });

    doc.save(fileName);
  } catch (error) {
    console.error("PDF Export Error:", error);
    alert("An error occurred while exporting PDF. Please try again.");
  }
};
