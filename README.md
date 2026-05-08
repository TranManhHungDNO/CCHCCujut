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

⚙️ Hướng dẫn vận hành
Dành cho cán bộ: Quản trị nội dung thông qua AI Dashboard, cập nhật tin tức CCHC.

Dành cho người dân: Quét mã QR tại bộ phận Một cửa hoặc tìm kiếm "UBND xã Cư Jút" trên Zalo.

📈 Hiệu quả sáng kiến
Đối với người dân: Giảm 30-50% thời gian đi lại.

Đối với chính quyền: Rút ngắn quy trình, tăng tính công khai minh bạch.

Đối với an ninh: Hỗ trợ kịp thời các tình huống khẩn cấp thông qua định vị GPS.

👤 Thông tin tác giả
Tác giả: Trần Mạnh Hùng

Đơn vị: Phòng Văn hóa – Xã hội xã Cư Jút, tỉnh Lâm Đồng.

Địa chỉ: 353 đường Nguyễn Tất Thành, xã Cư Jút, tỉnh Lâm Đồng.
## 📂 Cấu trúc thư mục (Source Code)
Dự án được tổ chức chặt chẽ theo cấu trúc thư mục hiện đại:

.
├── src
│   ├── components
│   │   ├── UIComponent1
│   │   │   ├── index.ts
│   │   │   └── UIComponent1.tsx
│   │   ├── UIComponent2
│   │   │   ├── index.ts
│   │   │   └── UIComponent2.tsx
│   │   └── ...
│   ├── services
│   │   ├── services.ts
│   │   ├── services.mock.ts
│   │   └── zalo.ts
│   ├── mock
│   │   ├── db.json
│   ├── pages
│   │   ├── [PageName]
│   │   │   ├── index.ts
│   │   │   └── [PageName].tsx
│   │   ├── Page1
│   │   │   ├── index.ts
│   │   │   └── Page1.tsx
│   │   ├── Page2
│   │   │   ├── index.ts
│   │   │   ├── Section1.tsx
│   │   │   ├── Section2.tsx
│   │   │   └── Page2.tsx
│   │   └── ...
│   ├── constants
│   │   └── common.ts
│   ├── utils
│   ├── types
│   ├── css
│   │   ├── global.css
│   │   ├── tailwind.css
│   └── assets
│       ├── image1.png
│       ├── image2.png
│       └── ...
├── .env
├── .env.production
├── .env.development
├── .gitignore
├── package.json
└── README.md

##
