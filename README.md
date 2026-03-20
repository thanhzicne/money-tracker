# 💰 money_tracker

**money_tracker** là ứng dụng web giúp người dùng theo dõi và quản lý các chỉ số tài chính cá nhân như **thu nhập, chi tiêu, số dư và tiến độ tiết kiệm**.

Ứng dụng phù hợp cho những người muốn xây dựng thói quen chi tiêu hợp lý và kiểm soát tài chính một cách **trực quan, khoa học và dễ sử dụng**.

---

# 🛠 Công nghệ sử dụng (Tech Stack)

- **Frontend:** ReactJS kết hợp với Vite (giúp build và bundle cực nhanh).
- **State Management:** React Context API (`AppContext.jsx`).
- **Lưu trữ dữ liệu (Hiện tại):** `localStorage` (lưu trữ trực tiếp trên trình duyệt).
- **Lưu trữ dữ liệu (Tương lai):** Firebase (Đã được cài đặt, chuẩn bị cho tính năng đồng bộ đám mây).
- **Tiện ích mở rộng:** Hỗ trợ xuất file qua `jsPDF` và `xlsx` (nằm trong định hướng phát triển).

---

# 🚀 Tính năng chính

### 📊 Tổng quan tài chính (Dashboard)
Hiển thị nhanh các thông tin quan trọng:
- Tổng số dư hiện tại
- Tổng thu nhập
- Tổng chi tiêu theo tháng

### 🎯 Mục tiêu tiết kiệm (Savings Goal)
Cho phép người dùng:
- Thiết lập mục tiêu tiết kiệm
- Theo dõi tiến độ đạt mục tiêu qua **Progress Bar** trực quan.

### 📝 Quản lý giao dịch (Transaction Management)
- Thêm giao dịch thu hoặc chi
- Chỉnh sửa, xóa giao dịch
- Danh sách giao dịch hiển thị rõ ràng với hiệu ứng hover mượt mà.

### 📈 Phân tích trực quan (Analytics)
- **Biểu đồ cột:** Thể hiện xu hướng tài chính theo tháng
- **Biểu đồ tròn:** Phân loại chi tiêu theo danh mục

### 🔍 Lọc & Tìm kiếm nhanh (Filter & Search)
- Lọc giao dịch theo **tháng**
- Tìm kiếm giao dịch theo **từ khóa**

---

# 💳 Tính năng nâng cao: Quản lý đa ví (Multiple Wallets)

Tính năng **Multiple Wallets** cho phép quản lý nhiều nguồn tài sản riêng biệt (Tiền mặt, Tài khoản ngân hàng, Thẻ tín dụng, Ví điện tử...). Mỗi ví hoạt động **độc lập**, giúp phản ánh chính xác tình trạng tài chính thực tế.

- **Quản lý ví (Wallet CRUD):** Tạo, sửa, xóa ví (kèm cảnh báo khi xóa ví có chứa giao dịch).
- **Tích hợp vào giao dịch:** Bắt buộc chọn ví liên quan khi tạo giao dịch mới.
- **Chuyển tiền giữa các ví (Transfer Mode):** Tự động tạo 1 giao dịch trừ tiền ở ví nguồn và 1 giao dịch cộng tiền ở ví đích để cân bằng dữ liệu.
- **Phân tích theo ví:** Xem tổng tài sản của tất cả ví hoặc dữ liệu của từng ví riêng biệt.

---

# 🔮 Định hướng phát triển (Roadmap)

Dự án dự kiến sẽ tiếp tục mở rộng để mang lại trải nghiệm toàn diện hơn:

- **🔔 Quản lý ngân sách & Cảnh báo:** Đặt giới hạn chi tiêu theo danh mục và push notification khi ngân sách chạm ngưỡng 80%.
- **☁️ Đồng bộ đám mây & Đa nền tảng:** Sử dụng Firebase để đồng bộ Real-time giữa Web, Mobile và Tablet. Hỗ trợ chế độ Offline.
- **👥 Quản lý tài chính nhóm (Shared Wallets):** Mời thành viên cùng tham gia quản lý quỹ gia đình/nhóm qua Link/Email với tính năng phân quyền rõ ràng.
- **🤝 Quản lý Nợ & Trả góp:** Ghi chép chi tiết khoản vay/nợ, tự động gạch nợ từng phần và nhắc nhở thanh toán thẻ tín dụng.
- **📈 Đầu tư & Đa tiền tệ:** Theo dõi tổng tài sản (Net Worth) bao gồm sổ tiết kiệm, crypto, chứng khoán và tự động cập nhật tỷ giá ngoại tệ.
- **🏆 Xuất báo cáo & Game hóa:** Tự động gửi email báo cáo (PDF/Excel) định kỳ và hệ thống chấm điểm, tặng huy hiệu sức khỏe tài chính.

---

# 🧩 Cấu trúc thư mục

```bash
money-tracker
├── node_modules
├── public
│   └── vite.svg
├── src
│   ├── assets
│   │   └── react.svg
│   ├── components
│   │   ├── Dashboard.jsx
│   │   ├── TransactionForm.jsx
│   │   ├── TransactionList.jsx
│   │   ├── Sidebar.jsx
│   │   └── Charts.jsx
│   ├── context
│   │   └── AppContext.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js