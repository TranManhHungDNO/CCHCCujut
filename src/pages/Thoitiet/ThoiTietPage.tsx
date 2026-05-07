import React, { useEffect, useState } from "react";
import { Page, Button } from "zmp-ui";
import styled from "styled-components";
import PageLayout from "@components/layout/PageLayout"; // Đảm bảo rằng bạn có PageLayout component

// Các style cho widget thời tiết
const WeatherWidgetContainer = styled.div`
  text-align: center;
  padding: 16px;
  background-color: #f0f0f0;  // Thay ảnh nền bằng màu trắng nhạt
  background-size: cover;  // Không cần thiết với màu nền, có thể loại bỏ
  background-position: center;  // Không cần thiết với màu nền, có thể loại bỏ
  background-repeat: no-repeat;  // Không cần thiết với màu nền, có thể loại bỏ
`;

const WeatherTitle = styled.h2`
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 16px;
  color: #333;  // Màu chữ tối để dễ đọc trên nền trắng nhạt
`;

const WeatherDay = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const WeatherDetails = styled.div`
  color: #333;  // Màu chữ tối để dễ đọc trên nền trắng nhạt
`;

const WeatherTemp = styled.span`
  font-size: 20px;
  font-weight: bold;
  margin-left: 8px;
`;

const WeatherWidget = () => {
  const [data, setData] = useState<any>(null);  // Dữ liệu thời tiết sẽ được lưu vào đây
  const [latitude, setLatitude] = useState<string | null>(null);
  const [longitude, setLongitude] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
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
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=3&lang=vi`;

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
    return <p>Đang tải dữ liệu thời tiết...</p>;
  }

  const { location, forecast } = data;
  const { name, region } = location;

  return (
    <WeatherWidgetContainer>
      <WeatherTitle>
        Dự báo thời tiết tại {name}, {region}
      </WeatherTitle>
      <div>
        {forecast.forecastday.slice(0, 3).map((day: any) => (
          <WeatherDay key={day.date}>
            <WeatherDetails>
              <p>{new Date(day.date).toLocaleDateString()}</p>
              <img
                style={{ width: "48px", height: "48px" }}
                src={day.day.condition.icon}
                alt="Weather condition icon"
              />
              <WeatherTemp>{day.day.avgtemp_c}°C</WeatherTemp>
              <p>{day.day.condition.text}</p>
            </WeatherDetails>
            <WeatherDetails>
              <p>Tốc độ gió: {day.day.maxwind_kph} kph</p>
              <p>Độ ẩm: {day.day.avghumidity}%</p>
              <p>Lượng mưa: {day.day.totalprecip_mm} mm</p> {/* Thêm lượng mưa */}
            </WeatherDetails>
          </WeatherDay>
        ))}
      </div>
    </WeatherWidgetContainer>
  );
};

const ThoitietPage: React.FC = () => {
  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <PageLayout tw="bg-white" title="Dự báo thời tiết" id="informationGuides">
      <WeatherWidget />
      <div tw="mt-4 p-4 border border-gray-200">
        {/* Các chương PDF sẽ được thêm vào ở đây nếu cần */}
      </div>
    </PageLayout>
  );
};

export default ThoitietPage;
