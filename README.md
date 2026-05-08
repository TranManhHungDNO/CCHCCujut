# 🏛️ Mẫu Chính quyền điện tử (E-Government Template)

[![Platform: Zalo Mini App](https://img.shields.io/badge/Platform-Zalo%20Mini%20App-blue)](https://mini.zalo.me/)
[![License: Zalo Mini App Team](https://img.shields.io/badge/License-Zalo%20Mini%20App%20Team-orange)](#)

Template chuyên dụng dành cho ứng dụng **Zalo Mini App** trong lĩnh vực Chính quyền điện tử, giúp đẩy nhanh quá trình phát triển các dịch vụ công trực tuyến.

---

## 📌 Mục lục
- [Tổng quan](#tổng-quan)
- [Ảnh minh họa](#ảnh-minh-họa)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Quản lý trạng thái](#quản-lý-trạng-thái)
- [Cài đặt](#cài-đặt)
- [Cấu hình](#cấu-hình)
- [Scripts](#scripts)
- [Giấy phép](#giấy-phép)

---

## 📖 Tổng quan
Template này cung cấp khung sườn hoàn chỉnh cho các tính năng thường thấy trong ứng dụng Chính quyền số như: tra cứu hồ sơ, đặt lịch hẹn, gửi phản hồi và tin tức hướng dẫn.

### 🖼️ Ảnh minh họa
<div align="center">
    <img width="32%" alt="screen 1" src="./readme-assets/screen1.png">
    <img width="32%" alt="screen 2" src="./readme-assets/screen2.png">
    <img width="32%" alt="screen 3" src="./readme-assets/screen3.png">
</div>
<div align="center" style="margin-top: 10px;">
    <img width="32%" alt="screen 4" src="./readme-assets/screen4.png">
    <img width="32%" alt="screen 5" src="./readme-assets/screen5.png">
    <img width="32%" alt="screen 6" src="./readme-assets/screen6.png">
</div>

### 📲 Demo
> Quét mã QR bằng ứng dụng Zalo để trải nghiệm Mini App mẫu trực tiếp.

---

## 📂 Cấu trúc dự án
Dự án được tổ chức chặt chẽ nhằm tối ưu việc bảo trì và mở rộng:

```text
.
├── src
│   ├── components      # UI components dùng chung
│   ├── services        # Xử lý API (thật và mock) & Zalo SDK
│   ├── mock            # Dữ liệu giả lập (db.json)
│   ├── pages           # Các trang và router
│   ├── constants       # Hằng số, API Endpoints
│   ├── store           # Quản lý trạng thái (Zustand)
│   ├── utils           # Hàm tiện ích
│   ├── types           # Khai báo TypeScript types
│   ├── css             # Global CSS & Tailwind cấu hình
│   └── assets          # Tài nguyên tĩnh (ảnh, icon)
├── .env                # Biến môi trường chung (APP_ID)
├── .env.development    # Cấu hình môi trường dev
├── .env.production     # Cấu hình môi trường prod
└── package.json
