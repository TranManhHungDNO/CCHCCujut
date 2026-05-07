Mẫu Chính quyền điện tử (E-Government Template)
Mục lục
Tổng quan
Cấu trúc dự án
Quản lý trạng thái
Cài đặt
Cấu hình
Scripts
Giấy phép
Tổng quan

Template dành cho ứng dụng Zalo Mini App Chính quyền điện tử.

Ảnh minh họa
		
<img width="1604" alt="screen shot" src="./readme-assets/screen1.png">	<img width="1604" alt="screen shot" src="./readme-assets/screen2.png">	<img width="1604" alt="screen shot" src="./readme-assets/screen3.png">
<img width="1604" alt="screen shot" src="./readme-assets/screen4.png">	<img width="1604" alt="screen shot" src="./readme-assets/screen5.png">	<img width="1604" alt="screen shot" src="./readme-assets/screen6.png">
Demo

Quét mã QR bằng ứng dụng Zalo để trải nghiệm Mini App mẫu.

Cấu trúc dự án

Dự án được tổ chức theo cấu trúc thư mục nhằm dễ quản lý và mở rộng mã nguồn.

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
Mô tả các thư mục chính
src/components: Chứa các UI component và component dùng chung trong toàn bộ dự án.
src/pages: Chứa các trang và các section của từng trang. Mỗi page tương ứng với một route hoặc giao diện cụ thể của ứng dụng.
src/pages/index: Chứa cấu hình route của ứng dụng.
src/constants: Chứa các hằng số sử dụng trong dự án như API endpoint và các giá trị cấu hình.
.env.production và .env.development: Dùng để cấu hình VITE_BASE_URL theo từng môi trường triển khai.
.env: Chứa các biến cấu hình của ứng dụng. Cần cập nhật APP_ID tại đây.
src/utils: Chứa các hàm tiện ích dùng chung.
src/types: Chứa các khai báo kiểu dữ liệu (TypeScript) nhằm tăng tính an toàn và dễ bảo trì mã nguồn.
src/css: Chứa CSS toàn cục và cấu hình Tailwind CSS.
src/assets: Chứa tài nguyên tĩnh như hình ảnh, font chữ,...
src/mock: Chứa dữ liệu giả lập để phục vụ kiểm thử giao diện.
src/services:
services.ts: Xử lý các API service chính.
services.mock.ts: Mock service dùng khi test UI.
zalo.ts: Chứa các hàm gọi API của Zalo Mini App.
Quản lý trạng thái

Dự án sử dụng Zustand
 để quản lý state.

State được chia thành nhiều “slice” theo từng chức năng:

authSlice: Quản lý trạng thái xác thực người dùng.
appSlice: Quản lý trạng thái toàn ứng dụng như thông báo và giao diện theme.
feedbackSlice: Quản lý dữ liệu phản hồi cho các tính năng mở rộng sau này.
informationGuideSlice: Quản lý dữ liệu hướng dẫn thông tin.
organizationSlice: Quản lý thông tin tổ chức/cơ quan.
scheduleSlice: Quản lý lịch hẹn và đặt lịch làm việc.

Mã nguồn quản lý state nằm trong thư mục:

/src/store
Cài đặt

Để cài đặt các dependency cho dự án, thực hiện các bước sau:

Đảm bảo đã cài đặt Node.js
 trên máy tính.
Mở Terminal hoặc Command Prompt và di chuyển tới thư mục gốc của dự án.
Chạy lệnh sau để cài đặt dependency bằng yarn:
yarn install

Hoặc nếu dùng npm:

npm install

Lệnh này sẽ tự động tải và cài đặt toàn bộ package được khai báo trong package.json.

Cấu hình

Để cấu hình dự án theo môi trường triển khai và ứng dụng của riêng bạn, thực hiện các bước dưới đây.

Cấu hình API Base URL

Chỉnh sửa biến VITE_BASE_URL trong các file:

.env.production
.env.development

Ví dụ:

VITE_BASE_URL=https://api.example.com
Cấu hình API Endpoint

Các endpoint API được khai báo tại file:

src/constants/common.ts

Ví dụ:

export const API = {
    GET_ORGANIZATION: "/get_organization_api",
    SEARCH_PROFILES: "/search_profiles_api",
    GET_ARTICLES: "/get_articles_api",
    FEEDBACK: "/feedback_api",
    FEEDBACK_TYPES: "/feedback_types_api",
    INFORMATION_GUIDE: "/information_guide_api",
    UPLOAD_IMAGE: "/upload_image_api",
    CREATE_SCHEDULE: "/create_schedule_api",
    GET_SCHEDULE: "/get_schedule_api",
};

Có thể chỉnh sửa tên endpoint phù hợp với backend của hệ thống.

Cấu hình APP_ID

Cập nhật APP_ID trong file .env bằng ID ứng dụng Zalo Mini App của bạn.

Ví dụ:

APP_ID=1234567890
Scripts

Các script hỗ trợ trong dự án:

npm start: Khởi động ứng dụng.
npm deploy: Triển khai ứng dụng lên môi trường production.
Giấy phép

Dự án thuộc sở hữu của Zalo Mini App Team.