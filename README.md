# 🏛️ Zalo Mini App - Cải cách hành chính xã Cư Jút

> **Sáng kiến:** Chuyển đổi số trong công tác quản lý và tương tác với nhân dân tại xã Cư Jút, tỉnh Lâm Đồng.

---

## 📖 Giới thiệu
Dự án được phát triển nhằm hiện đại hóa nền hành chính công, giúp người dân tiếp cận 454 thủ tục hành chính (TTHC) dễ dàng thông qua nền tảng Zalo, đồng thời hỗ trợ khẩn cấp SOS dựa trên vị trí địa lý.

## ✨ Tính năng nổi bật
- **🔎 Tra cứu TTHC thông minh:** Phân loại 11 lĩnh vực, hướng dẫn hồ sơ 100% bằng tiếng Việt dễ hiểu.
- **🚨 Hệ thống SOS (Smart Emergency):** Tự động xác định tọa độ WGS84 và hiển thị 10 điểm hỗ trợ gần nhất.
- **📩 Thông báo ZNS:** Tự động nhắc lịch trả kết quả hồ sơ cho người dân và cán bộ.
- **🗺️ Bản đồ số:** Tích hợp chỉ đường GIS đến bộ phận một cửa.
- **📊 Khảo sát E-Survey:** Đo lường sự hài lòng của người dân theo thời gian thực.

## 🛠️ Công nghệ tích hợp
- **Nền tảng:** Zalo Mini App SDK.
- **Ngôn ngữ:** TypeScript, JSX (React).
- **Hệ tọa độ:** WGS84 (World Geodetic System 1984).
- **Giao tiếp:** Webhook, API, Access Token.

## 📂 Cấu trúc thư mục (Source Code)
## 📂 Cấu trúc dự án
Dự án được tổ chức chặt chẽ theo cấu trúc thư mục hiện đại:

```text
.
├── src
│   ├── components      # UI components và các thành phần dùng chung
│   ├── services        # Xử lý API (thật & mock) và Zalo SDK
│   ├── mock            # Dữ liệu giả lập (db.json) phục vụ test UI
│   ├── pages           # Các trang và router (cấu hình tại src/pages/index)
│   ├── constants       # Hằng số, API Endpoints cấu hình chung
│   ├── store           # Quản lý trạng thái tập trung (Zustand)
│   ├── utils           # Các hàm tiện ích (Helper functions)
│   ├── types           # Định nghĩa kiểu dữ liệu (TypeScript)
│   ├── css             # Global CSS & Tailwind configuration
│   └── assets          # Tài nguyên tĩnh (hình ảnh, fonts, icons)
├── .env                # Biến môi trường chung (APP_ID)
├── .env.development    # Cấu hình môi trường Development
├── .env.production     # Cấu hình môi trường Production
├── .gitignore          # Các tệp loại trừ khi git push
├── package.json        # Danh sách thư viện và scripts
└── README.md
