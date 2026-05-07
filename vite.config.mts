import { defineConfig } from "vite";
import zaloMiniApp from "zmp-vite-plugin";
import react from "@vitejs/plugin-react";
// import macrosPlugin from "vite-plugin-babel-macros"; // KHÔNG DÙNG PLUGIN NÀY NỮA

import path from "path";
import { fileURLToPath } from "url"; // Thêm dòng này để sửa lỗi __dirname

// Tạo biến __dirname tương thích với ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default () => {
    return defineConfig({
        root: "./src",
        base: "./",
        plugins: [
            zaloMiniApp(),
            // Cấu hình react plugin để dùng babel macros, thay thế cho plugin cũ
            react({
                babel: {
                    plugins: ["babel-plugin-macros"],
                },
            }),
            // macrosPlugin() // Xóa dòng này đi
        ],
        build: {
            target: "es2020",
        },
        resolve: {
            alias: {
                // Giờ các alias này sẽ hoạt động chính xác
                "@assets": path.resolve(__dirname, "src/assets"),
                "@components": path.resolve(__dirname, "src/components"),
                "@common": path.resolve(__dirname, "src/common"),
                "@constants": path.resolve(__dirname, "src/constants"),
                "@routes": path.resolve(__dirname, "src/routes"),
                "@shared": path.resolve(__dirname, "src/shared"),
                "@utils": path.resolve(__dirname, "src/utils"),
                "@pages": path.resolve(__dirname, "src/pages"),
                "@dts": path.resolve(__dirname, "src/types"),
                "@state": path.resolve(__dirname, "src/state"),
                "@service": path.resolve(__dirname, "src/service"),
                "@store": path.resolve(__dirname, "src/store"),
                "@mock": path.resolve(__dirname, "src/mock"),
            },
        },
    });
};