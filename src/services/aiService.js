export const formatFinancialContext = (totalBalance, income, expense) => {
  const formatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
  return `
--- NGỮ CẢNH TÀI CHÍNH CỦA NGƯỜI DÙNG ---
- Tổng tài sản / Số dư tài khoản hiện tại: ${formatter.format(totalBalance || 0)}
- Tổng thu nhập tháng này: ${formatter.format(income || 0)}
- Tổng chi tiêu tháng này: ${formatter.format(expense || 0)}
-----------------------------------------`;
};

export const getRealityCheck = async (itemName, itemPrice, financialContext) => {
  try {
    const res = await fetch('/api/realityCheck', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        itemName, 
        itemPrice: Number(itemPrice), 
        financialContext 
      })
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || 'Lỗi server');
    }
    
    return data.response;
  } catch (error) {
    console.error("Reality Check Fetch Error:", error);
    throw new Error(error.message || 'AI đang quá tải hoặc Server cấu hình có vấn đề. Không thể mắng bạn ngay bây giờ.');
  }
};
