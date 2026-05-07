import React, { useEffect, useState } from "react";
import { getLocation } from "zmp-sdk/apis";

// Định nghĩa kiểu dữ liệu cho API Thời tiết
interface WeatherData {
    current: {
        temp_c: number;
        condition: {
            text: string;
            icon: string;
        };
        wind_kph: number;
        humidity: number;
    };
    location: {
        name: string;
        region: string;
        country: string;
    };
}

export default function WeatherWidget() {
    const [data, setData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Hàm gọi API lấy dữ liệu thời tiết từ tọa độ
    const fetchWeatherData = async (lat: string | number, lon: string | number) => {
        const apiKey = "cda57f3aee814b3588380958242310";
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&lang=vi`;

        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error("Không thể kết nối máy chủ thời tiết");
            const resData = await res.json();
            setData(resData);
        } catch (error) {
            console.error("Weather API Error:", error);
            setErrorMessage("Lỗi khi tải dữ liệu thời tiết.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Sử dụng Zalo Mini App SDK để lấy vị trí người dân
        getLocation({
            success: (res) => {
                // Fix lỗi: Truy cập trực tiếp vào latitude/longitude (không qua .coords)
                const { latitude, longitude } = res;
                if (latitude && longitude) {
                    fetchWeatherData(latitude, longitude);
                } else {
                    setErrorMessage("Không nhận được tọa độ chính xác.");
                    setLoading(false);
                }
            },
            fail: (error) => {
                console.error("ZMP Location Error:", error);
                setErrorMessage("Vui lòng cho phép truy cập vị trí để xem thời tiết địa phương.");
                setLoading(false);
            }
        });
    }, []);

    // Giao diện khi đang tải
    if (loading) {
        return (
            <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
                Đang cập nhật thời tiết...
            </div>
        );
    }

    // Giao diện khi gặp lỗi
    if (errorMessage) {
        return (
            <div style={{ padding: "16px", textAlign: "center", color: "#ff4d4f", fontSize: "14px" }}>
                {errorMessage}
            </div>
        );
    }

    // Giao diện hiển thị chính
    if (!data) return null;

    const { temp_c, condition, wind_kph, humidity } = data.current;
    const { name, region } = data.location;

    return (
        <div style={{ 
            margin: "12px", 
            padding: "16px", 
            backgroundColor: "#ffffff", 
            borderRadius: "15px", 
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)" 
        }}>
            <div style={{ textAlign: "center" }}>
                <h3 style={{ margin: "0", fontSize: "18px", color: "#1a1a1a" }}>
                    {name}, {region}
                </h3>
                <p style={{ margin: "4px 0", color: "#757575", textTransform: "capitalize" }}>
                    {condition.text}
                </p>
                
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "8px 0" }}>
                    <img
                        style={{ width: "64px", height: "64px" }}
                        src={`https:${condition.icon}`}
                        alt="weather-icon"
                    />
                    <span style={{ fontSize: "40px", fontWeight: "bold", marginLeft: "10px", color: "#007aff" }}>
                        {temp_c}°C
                    </span>
                </div>

                <div style={{ 
                    display: "flex", 
                    justifyContent: "space-around", 
                    marginTop: "12px", 
                    paddingTop: "12px", 
                    borderTop: "1px solid #f0f0f0" 
                }}>
                    <div style={{ textAlign: "center" }}>
                        <p style={{ margin: "0", fontSize: "12px", color: "#999" }}>Tốc độ gió</p>
                        <p style={{ margin: "4px 0", fontWeight: "600", color: "#333" }}>{wind_kph} km/h</p>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <p style={{ margin: "0", fontSize: "12px", color: "#999" }}>Độ ẩm</p>
                        <p style={{ margin: "4px 0", fontWeight: "600", color: "#333" }}>{humidity}%</p>
                    </div>
                </div>
            </div>
        </div>
    );
}