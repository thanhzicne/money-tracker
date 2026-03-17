# 💰 money_tracker

**money_tracker** là ứng dụng web giúp người dùng theo dõi và quản lý các chỉ số tài chính cá nhân như **thu nhập, chi tiêu, số dư và tiến độ tiết kiệm**.

Ứng dụng phù hợp cho những người muốn xây dựng thói quen chi tiêu hợp lý và kiểm soát tài chính một cách **trực quan, khoa học và dễ sử dụng**.

---

# 🚀 Tính năng chính

### 📊 Tổng quan tài chính (Dashboard)
Hiển thị nhanh các thông tin quan trọng:

- Tổng số dư hiện tại
- Tổng thu nhập
- Tổng chi tiêu theo tháng

Giúp người dùng nắm bắt tình hình tài chính ngay khi mở ứng dụng.

---

### 🎯 Mục tiêu tiết kiệm (Savings Goal)
Cho phép người dùng:

- Thiết lập mục tiêu tiết kiệm
- Theo dõi tiến độ đạt mục tiêu

Tiến độ được hiển thị trực quan bằng **Progress Bar**.

---

### 📝 Quản lý giao dịch (Transaction Management)

Người dùng có thể:

- Thêm giao dịch thu hoặc chi
- Chỉnh sửa giao dịch
- Xóa giao dịch

Danh sách giao dịch hiển thị rõ ràng và có hiệu ứng **hover mượt mà**.

---

### 📈 Phân tích trực quan (Analytics)

Ứng dụng cung cấp các biểu đồ trực quan:

- **Biểu đồ cột** thể hiện xu hướng tài chính theo tháng
- **Biểu đồ tròn** phân loại chi tiêu theo danh mục

Giúp người dùng dễ dàng phân tích thói quen chi tiêu.

---

### 🔍 Lọc & Tìm kiếm nhanh (Filter & Search)

Hỗ trợ:

- Lọc giao dịch theo **tháng**
- Tìm kiếm giao dịch theo **từ khóa**

Giúp truy xuất dữ liệu nhanh chóng khi có nhiều giao dịch.

---

### 💾 Lưu trữ dữ liệu (Local Storage)

Toàn bộ dữ liệu được lưu trên **trình duyệt** bằng:

- `localStorage`

Bao gồm:

- giao dịch
- cài đặt giao diện (Dark / Light mode)

Reload trang vẫn giữ nguyên dữ liệu.

---

# 💳 Tính năng nâng cao: Quản lý đa ví (Multiple Wallets)

## Tổng quan

Tính năng **Multiple Wallets** cho phép người dùng quản lý nhiều nguồn tài sản riêng biệt như:

- 💵 Tiền mặt  
- 🏦 Tài khoản ngân hàng  
- 💳 Thẻ tín dụng  
- 📱 Ví điện tử (Momo, ZaloPay...)

Mỗi ví hoạt động **độc lập**, giúp phản ánh chính xác tình trạng tài chính thực tế.

---

## Quản lý ví (Wallet CRUD)

Người dùng có thể:

- Tạo ví mới
- Chỉnh sửa ví
- Xóa ví

Thông tin của mỗi ví gồm:

- Tên ví
- Số dư ban đầu
- Icon hiển thị
- Màu sắc nhận diện

Khi xóa ví, hệ thống sẽ cảnh báo và yêu cầu xử lý các giao dịch liên quan.

---

## Tích hợp vào giao dịch

### Chọn ví khi tạo giao dịch

Khi thêm hoặc chỉnh sửa giao dịch, người dùng phải **chọn ví liên quan**.

### Chuyển tiền giữa các ví

Ứng dụng hỗ trợ **Transfer Mode** để chuyển tiền giữa các ví.

Ví dụ:

VCB → Tiền mặt (2.000.000đ)

Hệ thống sẽ tự động tạo:

- 1 giao dịch trừ tiền ở ví nguồn
- 1 giao dịch cộng tiền ở ví đích

Giúp dữ liệu luôn cân bằng.

---

## Dashboard & Phân tích theo ví

Ứng dụng bổ sung **Wallet Filter** để:

- Xem **tổng tài sản của tất cả ví**
- Xem dữ liệu của **từng ví riêng biệt**

Ngoài ra còn có **Wallet Cards** hiển thị danh sách ví để người dùng nhanh chóng biết tiền đang nằm ở đâu.

---

## Cấu trúc dữ liệu

Dữ liệu được lưu trong **LocalStorage** với hai bảng chính:

- `wallets`
- `transactions`

Mỗi giao dịch chứa `walletId` để liên kết với ví tương ứng, giúp quản lý và truy vấn dữ liệu hiệu quả.

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