💰 money_tracker

money_tracker là ứng dụng web giúp người dùng theo dõi và quản lý các chỉ số tài chính cá nhân như thu nhập, chi tiêu, số dư và tiến độ tiết kiệm.
Ứng dụng phù hợp cho người dùng muốn duy trì thói quen chi tiêu lành mạnh và kiểm soát tài chính của mình một cách trực quan, khoa học. Let's me see

🚀 Tính năng chính

📊 Tổng quan tài chính (Dashboard):
Ghi nhận và hiển thị tự động số dư, tổng thu, tổng chi theo tháng.
🎯 Mục tiêu tiết kiệm (Savings Goal):
Giúp bạn thiết lập và theo dõi tiến độ đạt được mục tiêu qua thanh phần trăm (Progress bar).
📝 Quản lý giao dịch (Transaction Management):
Thêm, sửa, xóa các khoản thu/chi với thao tác hover chuột mượt mà.
📈 Phân tích trực quan (Analytics):
Hiển thị biểu đồ cột xu hướng toàn năm và biểu đồ tròn phân loại chi tiêu.
🔍 Lọc & Tìm kiếm nhanh (Filter & Search):
Hỗ trợ điều hướng dữ liệu theo từng tháng và tìm kiếm giao dịch theo từ khóa.
💾 Lưu trữ dữ liệu (Local Storage):
Mọi dữ liệu giao dịch và cài đặt (Dark/Light mode) đều được lưu trực tiếp trên trình duyệt, reload trang vẫn còn.

🧩 Cấu trúc thư mục

money-tracker
├─ node_modules
├─ public
│  └─ vite.svg
├─ src
│  ├─ assets
│  │  └─ react.svg
│  ├─ components
│  │  ├─ Dashboard.jsx
│  │  ├─ TransactionForm.jsx
│  │  ├─ TransactionList.jsx
│  │  ├─ Sidebar.jsx
│  │  └─ Charts.jsx
│  ├─ context
│  │  └─ AppContext.jsx
│  ├─ App.jsx
│  ├─ index.css
│  └─ main.jsx
├─ .gitignore
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ README.md
└─ vite.config.js

⚙️ Công nghệ sử dụng

ReactJS (Vite) – Xây dựng giao diện và xử lý logic ứng dụng
Tailwind CSS v4 – Thiết kế giao diện người dùng hiện đại, chuẩn Responsive
Chart.js & react-chartjs-2 – Render biểu đồ thống kê trực quan
Window.localStorage – Lưu trữ dữ liệu cục bộ phía client

🧠 Hướng dẫn cài đặt

Clone dự án: git clone https://github.com/thanhzicne/money-tracker.git

npm install
npm run dev