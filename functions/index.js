const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// Chạy tự động vào 9:00 sáng ngày mùng 1 hàng tháng
exports.monthlyFinancialReport = functions.pubsub.schedule("0 9 1 * *").onRun(async (context) => {
  const usersSnapshot = await db.collection("settings").where("emailReport", "==", true).get();
  
  if (usersSnapshot.empty) {
    console.log("Không có người dùng nào đăng ký nhận báo cáo.");
    return null;
  }

  const currentDate = new Date();
  // Tháng trước
  const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  // Tháng hiện tại (giới hạn trên)
  const thisMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

  const promises = usersSnapshot.docs.map(async (doc) => {
    const data = doc.data();
    const uid = doc.id;
    const userEmail = data.userEmail;

    if (!userEmail) return;

    // Lấy giao dịch của tháng trước
    const txSnapshot = await db.collection("transactions")
      .where("userId", "==", uid)
      .where("date", ">=", lastMonth.toISOString())
      .where("date", "<", thisMonth.toISOString())
      .get();

    let totalIncome = 0;
    let totalExpense = 0;

    txSnapshot.forEach(txDoc => {
      const tx = txDoc.data();
      if (tx.type === "income") totalIncome += Number(tx.amount);
      if (tx.type === "expense") totalExpense += Number(tx.amount);
    });

    const netAmount = totalIncome - totalExpense;
    
    // Tạo cấu hình email đẩy thẳng vào collection 'mail' cho Firebase Extension Trigger Email
    await db.collection("mail").add({
      to: [userEmail],
      message: {
        subject: `Báo Cáo Tài Chính Tháng ${lastMonth.getMonth() + 1} - Money Tracker`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #4F46E5;">Chào bạn,</h2>
            <p>Dưới đây là bản tóm tắt thu chi tài chính của bạn trong tháng ${lastMonth.getMonth() + 1} vừa qua:</p>
            <ul style="font-size: 16px; line-height: 1.8;">
              <li><strong>Tổng Thu Nhập:</strong> <span style="color: #10B981;">${totalIncome.toLocaleString('vi-VN')} VNĐ</span></li>
              <li><strong>Tổng Chi Tiêu:</strong> <span style="color: #F43F5E;">${totalExpense.toLocaleString('vi-VN')} VNĐ</span></li>
              <li><strong>Số dư / Tiết kiệm:</strong> <span style="color: ${netAmount >= 0 ? '#10B981' : '#F43F5E'}; font-weight: bold;">${netAmount.toLocaleString('vi-VN')} VNĐ</span></li>
            </ul>
            <p>Hệ thống tự động ghi nhận dữ liệu dựa trên các giao dịch bạn đã nhập trên hệ thống Money Tracker.</p>
            <p>Hãy tiếp tục duy trì thói quen ghi chép nhé!</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #888;"><i>Trân trọng,<br>Hệ thống Tự động Money Tracker</i></p>
          </div>
        `
      }
    });

    console.log(`Đã xếp hàng gửi mail báo cáo cho ${userEmail}`);
  });

  await Promise.all(promises);
  console.log("Hoàn tất lập lịch gửi báo cáo hàng tháng cho toàn bộ người dùng đăng ký.");
  return null;
});
