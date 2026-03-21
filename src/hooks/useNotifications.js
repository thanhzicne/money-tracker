import { useMemo } from 'react';

export const useNotifications = (jars, debts, budgets, transactions) => {
  return useMemo(() => {
    const alerts = [];

    // 1. Debts Alerts
    if (debts && debts.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const in3Days = new Date();
      in3Days.setDate(in3Days.getDate() + 3);

      debts.forEach(debt => {
        const remaining = Number(debt.totalAmount) - Number(debt.paidAmount || 0);
        if (remaining > 0 && debt.dueDate) {
          const dueDate = new Date(debt.dueDate);
          const formattedDate = dueDate.toLocaleDateString('vi-VN');
          const isBorrow = debt.type === 'borrow';

          if (dueDate < today) {
            alerts.push({
              id: `debt-overdue-${debt.id}`,
              type: 'debt',
              severity: 'high',
              title: 'Quá hạn thanh toán',
              message: isBorrow 
                ? `Đã trễ hạn trả nợ cho ${debt.person} (${new Intl.NumberFormat('vi-VN').format(remaining)} VNĐ). Hạn: ${formattedDate}`
                : `Đã quá hạn thu nợ từ ${debt.person} (${new Intl.NumberFormat('vi-VN').format(remaining)} VNĐ). Hạn: ${formattedDate}`,
              date: new Date().toISOString()
            });
          } else if (dueDate <= in3Days) {
            alerts.push({
              id: `debt-upcoming-${debt.id}`,
              type: 'debt',
              severity: 'medium',
              title: 'Sắp đến hạn thanh toán',
              message: isBorrow
                ? `Sắp đến ngày trả nợ cho ${debt.person} (${new Intl.NumberFormat('vi-VN').format(remaining)} VNĐ). Hạn: ${formattedDate}`
                : `Sắp đến ngày thu nợ từ ${debt.person} (${new Intl.NumberFormat('vi-VN').format(remaining)} VNĐ). Hạn: ${formattedDate}`,
              date: new Date().toISOString() 
            });
          }
        }
      });
    }

    // 2. Budgets Alerts
    if (budgets && budgets.length > 0) {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const currentMonthTx = transactions?.filter(t => t.date.startsWith(currentMonth) && t.type === 'expense') || [];

      budgets.forEach(budget => {
        const spent = currentMonthTx
          .filter(t => t.category === budget.category)
          .reduce((sum, t) => sum + Number(t.amount), 0);
        
        const percent = (spent / Number(budget.amount)) * 100;

        if (percent > 100) {
          alerts.push({
            id: `budget-exceeded-${budget.id}`,
            type: 'budget',
            severity: 'high',
            title: 'Vượt ngân sách',
            message: `Bạn đã tiêu vượt ${percent.toFixed(0)}% ngân sách cho mục ${budget.category}.`,
            date: new Date().toISOString()
          });
        } else if (percent >= 80) {
          alerts.push({
            id: `budget-warning-${budget.id}`,
            type: 'budget',
            severity: 'low',
            title: 'Sắp hết ngân sách',
            message: `Ngân sách ${budget.category} đã tiêu hết ${percent.toFixed(0)}%. Hãy chú ý chi tiêu!`,
            date: new Date().toISOString()
          });
        }
      });
    }

    // 3. Jars Alerts
    if (jars && jars.length > 0) {
      jars.forEach(jar => {
        if (Number(jar.balance) < 0) {
          alerts.push({
            id: `jar-negative-${jar.id}`,
            type: 'jar',
            severity: 'high',
            title: 'Hũ chi tiêu âm tiền',
            message: `Hũ "${jar.name}" đang bị âm ${new Intl.NumberFormat('vi-VN').format(Math.abs(jar.balance))} VNĐ!`,
            date: new Date().toISOString()
          });
        }
      });
    }

    // Sort alerts by severity: high -> medium -> low
    const severityMap = { high: 3, medium: 2, low: 1 };
    return alerts.sort((a, b) => severityMap[b.severity] - severityMap[a.severity]);
    
  }, [jars, debts, budgets, transactions]);
};
