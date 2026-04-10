# **Hệ Thống Quản Lý Bán Hàng**  

## **Tổng Quan**  

Một **hệ thống quản lý bán hàng trên nền tảng web** được xây dựng bằng **Node.js, Express.js, MongoDB và Socket.io**, tuân theo mô hình **MVC**. Hệ thống này cung cấp **bảng điều khiển dành cho quản trị viên** để quản lý sản phẩm, người dùng và quyền truy cập, đồng thời mang đến trải nghiệm mua sắm thân thiện với khách hàng với **tính năng trò chuyện theo thời gian thực và quản lý bạn bè**.  

---

## **Tính Năng**  

<p align="center">
  <img src="https://github.com/Tantan1812/Sales-management-system/blob/main/admin.png" width="48%" alt="Bảng điều khiển quản trị">
  <img src="https://github.com/Tantan1812/Sales-management-system/blob/main/client.png" width="48%" alt="Giao diện khách hàng">
</p>

### **Admin**  
- **Tổng Quan** – Hiển thị số liệu thống kê và phân tích doanh số.  
- **Danh Mục Sản Phẩm** – Quản lý danh mục sản phẩm một cách hiệu quả.  
- **Danh Sách Sản Phẩm** – Xem, thêm, cập nhật và xóa sản phẩm.  
- **Nhóm Quyền & Phân Quyền** – Phân quyền và xác định mức truy cập.  
- **Quản Lý Tài Khoản Người Dùng** – Kiểm soát và quản lý người dùng đã đăng ký.  

### **Client**  
- **Trang Chủ** – Hiển thị các sản phẩm nổi bật và chương trình khuyến mãi.  
- **Sản Phẩm** – Duyệt và tìm kiếm sản phẩm.  
- **Giỏ Hàng** – Thêm, xóa và cập nhật sản phẩm trong giỏ hàng.  
- **Hệ Thống Bạn Bè** – Thêm và quản lý bạn bè (**cập nhật theo thời gian thực với Socket.io**).  
- **Phòng Chat** – Nhắn tin theo thời gian thực với bạn bè (**giao tiếp tức thì qua Socket.io**).  
- **Xác Thực Người Dùng** – Đăng ký, đăng nhập và đăng xuất.  
- **Quên Mật Khẩu & Xác Minh OTP** – Khôi phục mật khẩu an toàn.  
- **Cài Đặt Chung** – Quản lý hồ sơ cá nhân và tùy chỉnh.  

---

## **Công Nghệ Sử Dụng**  
- **Backend:** Node.js, Express.js, Mongoose (MongoDB).  
- **Frontend:** Pug, Bootstrap (giao diện responsive).  
- **Tính Năng Thời Gian Thực:** Socket.io (trò chuyện & hệ thống bạn bè).  
- **Xác Thực:** Đăng nhập bằng session với cơ chế xác minh bảo mật.  

---

## **Mô Hình MVC**  

MVC là một mô hình kiến trúc phần mềm phổ biến giúp phân tách các thành phần trong ứng dụng. Dưới đây là mô hình MVC áp dụng cho hệ thống này:  

<p align="center">
  <img src="https://github.com/trgtanhh04/Clinic-management/blob/main/mvc.png" width="70%" alt="Mô hình MVC">
</p>

---

## **Triển khai trên Vercel**  
- **Ứng dụng client:** [https://sale-management-website.vercel.app/](https://sale-management-website.vercel.app/)  
- **Ứng dụung admin:** [https://sale-management-website.vercel.app/](https://sale-management-website.vercel.app/admin/dashboard)  

Note: với úng dụng admin bạn đăng nhập tài khoản sau dưới quyền quản lý nội dung
```bash
email: truongtienanh16@gmail.com
password: 12345
```
---

## 📌 **Hướng Dẫn Chạy Ứng Dụng**  

### 1. **Clone Repository**  
```bash
git clone https://github.com/trgtanhh04/Sales-management-system.git
cd Sales-management-system
```

### 2. **Cài Đặt Các Gói Phụ Thuộc**  
Chạy lệnh sau để cài đặt tất cả thư viện cần thiết từ `package.json`:  
```bash
npm install
```

### 3. **Khởi Chạy Server**  
Chạy server bằng lệnh sau:  
```bash
npm start
```
Server sẽ chạy mặc định trên cổng **3000**.

### 4. **Truy Cập Ứng Dụng**  
- **Bảng Điều Khiển Quản Trị:** [http://localhost:3000/admin](http://localhost:3000/admin)  
- **Ứng Dụng Khách Hàng:** [http://localhost:3000](http://localhost:3000)  
