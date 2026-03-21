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

# 🌟 Những Tính Năng Nổi Bật (Mới Cập Nhật)

### 🤖 Trợ lý AI: Reality Check (Cảnh tỉnh chốt đơn)
- Tích hợp mô hình ngôn ngữ **Google Gemini AI** (chuẩn `gemini-2.5-flash` tiên tiến nhất).
- Đóng vai "chuyên gia tài chính xéo xắt" để phản biện, phân tích và khuyên răn người dùng trước các quyết định mua sắm bốc đồng. AI tự động quy đổi giá trị món đồ thèm muốn ra số ngày đi làm, số bát phở... dựa vào đúng số dư và thu nhập thực tế của bạn.
- **Bảo mật tuyệt đối:** Kiến trúc gọi API thông qua **Vercel Serverless Functions** (giấu kín hoàn toàn API Key ở cấp độ vòng bảo vệ Backend, không lộ ra code Frontend).

### 💳 Quản lý Đa ví (Multiple Wallets) thông minh
- Cho phép cá nhân hóa và tạo vô số nguồn tiền (Tiền mặt, Ngân hàng, Thẻ tín dụng, Ví điện tử...).
- Tính năng **Chuyển tiền (Transfer)** giữa các ví tự động sinh cặp lệnh kép để cân bằng dòng tiền một cách chuẩn chỉ.
- Dashboard theo dõi riêng biệt hoặc tổng hợp biến động từ mọi ví cộng lại.

### 📄 Cỗ máy Xuất Báo cáo (PDF & Excel)
- Truy xuất toàn bộ dữ liệu giao dịch thành báo cáo chỉ với 1 lượt click.
- Tích hợp engine xuất **PDF** xử lý hoàn hảo **100% Tiếng Việt có dấu** kết hợp nhúng font chữ tùy chỉnh, định dạng bảng biểu báo cáo siêu nét.
- Hỗ trợ xuất trực tiếp bảng tính **Excel (`.xlsx`)** cho những nhu cầu phân tích chuyên môn.

### 🎨 Trải nghiệm & Giao diện Cao cấp (Premium UI/UX)
- Hỗ trợ hoàn chỉnh giao diện **Dark Mode / Light Mode** thông minh thích ứng với màn hình.
- Ứng dụng ngôn ngữ thiết kế **Glassmorphism**, đổ bóng Gradients mượt mà cùng bộ phối màu đẳng cấp, thoát khỏi vẻ nhàm chán của các app tài chính truyền thống.
- Micro-animations cực kỳ tinh tế (Fade in, Slide up, Hover scale) trên từng thẻ chạm.
- Tích hợp bảng điểm **Sức khỏe Tài chính** và hệ thống đăng ký theo dõi ở trang Profile cá nhân.

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