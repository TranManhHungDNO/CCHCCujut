import React, { useEffect, useState } from "react";

export default function WeatherWidget() {
    const [data, setData] = useState<{
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
    }>();

    const [latitude, setLatitude] = useState<string | null>(null);
    const [longitude, setLongitude] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        // Sử dụng Geolocation API để lấy vị trí hiện tại
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude.toString());
                    setLongitude(position.coords.longitude.toString());
                },
                (error) => {
                    setErrorMessage("Không thể lấy vị trí. Vui lòng bật GPS.");
                    console.error(error);
                }
            );
        } else {
            setErrorMessage("Trình duyệt không hỗ trợ Geolocation API.");
        }
    }, []);

    useEffect(() => {
        if (latitude && longitude) {
            const apiKey = "cda57f3aee814b3588380958242310";
            const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&lang=vi`;

            fetch(url)
                .then((res) => res.json())
                .then((resData) => {
                    setData(resData);
                })
                .catch((error) => {
                    console.error("Error fetching weather data:", error);
                });
        }
    }, [latitude, longitude]);

    if (errorMessage) {
        return <p>{errorMessage}</p>;
    }

    if (!data) {
        return <p>Đang tải dữ liệu thời tiết...</p>; // Hiển thị thông báo khi chưa có dữ liệu
    }

    const { temp_c, condition, wind_kph, humidity } = data.current;
    const { name, region } = data.location;

    return (
        <div style={{ textAlign: "center", padding: "16px", backgroundColor: "white" }}>
            <h2>
                {name}, {region}
            </h2>
            <p>{condition.text}</p>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <img
                    style={{ width: "48px", height: "48px" }}
                    src={condition.icon}
                    alt="Weather condition icon"
                />
                <span style={{ fontSize: "36px", fontWeight: "bold", marginLeft: "8px" }}>
                    {temp_c}°C
                </span>
            </div>
            <div style={{ marginTop: "16px", display: "flex", justifyContent: "space-around" }}>
                <div>
                    <p style={{ fontWeight: "600" }}>Tốc độ gió</p>
                    <p>{wind_kph} kph</p>
                </div>
                <div>
                    <p style={{ fontWeight: "600" }}>Độ ẩm</p>
                    <p>{humidity}%</p>
                </div>
            </div>
        </div>
    );
}
