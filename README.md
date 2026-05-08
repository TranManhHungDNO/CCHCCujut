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
```text
├── src
│   ├── components   # Các nút SOS, Thanh tìm kiếm, Menu
│   ├── pages        # Giao diện chính, Danh mục TTHC, Bản đồ
│   ├── services     # Gọi API Zalo và Backend
│   └── utils        # Thuật toán tính khoảng cách địa lý
