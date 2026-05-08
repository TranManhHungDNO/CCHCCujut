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

📈 Hiệu quả sáng kiến
Thời gian: Rút ngắn 30-50% thời gian xử lý thủ tục.

Tương tác: Tăng 100% khả năng tiếp cận thông tin chính thống của người dân.

An ninh: Hệ thống SOS giúp xử lý sự cố nhanh gấp 3 lần thông thường.

Tác giả: Trần Mạnh Hùng

Đơn vị: Phòng Văn hóa – Xã hội xã Cư Jút, Lâm Đồng.


### Bước 3: Cách đưa lên GitHub
1.  Đăng nhập vào GitHub, vào Repository dự án của bạn.
2.  Nhấn vào nút **Add file** -> **Create new file**.
3.  Đặt tên file chính xác là: `README.md` (viết hoa toàn bộ chữ README).
4.  Dán đoạn mã (Code) mình gửi ở Bước 2 vào.
5.  Nhấn **Commit changes** để lưu lại.

**Tại sao làm cách này lại tốt hơn copy nguyên văn?**
* **Dễ đọc:** Nhà tuyển dụng hoặc đồng nghiệp nhìn vào biết ngay dự án làm về cái gì.
* **Chuyên nghiệp:** Thể hiện bạn biết cách sử dụng Markdown và hiểu tư duy quản lý dự án phần mềm.
* **Tối ưu tìm kiếm:** Các từ khóa về công nghệ (API, SDK, React) giúp dự án của bạn
