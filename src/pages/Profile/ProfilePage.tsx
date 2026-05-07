import React, { useEffect, useState } from "react";
import { Box, Spinner, Text, Icon, Button } from "zmp-ui";
import { openPhone } from "zmp-sdk/apis";
import PageLayout from "@components/layout/PageLayout";
import BottomNavigationPage from "../Home/BottomNavigationPage";

const SOSPage = () => {
  const [nearestStaff, setNearestStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Nạp CSS Leaflet
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    // Nạp Script Leaflet và lấy vị trí
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            fetchSOSData(lat, lng);
          },
          () => {
            setErrorMessage("Vui lòng bật GPS để xác định vị trí.");
            setLoading(false);
          }
        );
      } else {
        setErrorMessage("Thiết bị không hỗ trợ định vị GPS.");
        setLoading(false);
      }
    };
    document.body.appendChild(script);
  }, []);

  const fetchSOSData = async (lat: number, lng: number) => {
    try {
      const url = `https://mini.dno.vn/cchc-cujut/sos/sos.php?lat=${lat}&lng=${lng}&all=1&limit=10`;
      const response = await fetch(url);
      const data = await response.json();

      if (Array.isArray(data)) {
        setNearestStaff(data);
        renderMap(lat, lng, data);
      } else {
        setErrorMessage("Không tìm thấy dữ liệu.");
      }
    } catch (error) {
      setErrorMessage("Lỗi kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  const renderMap = (uLat: number, uLng: number, data: any[]) => {
    const L = (window as any).L;
    const mapContainer = document.getElementById("map");
    
    if (!L || !mapContainer) return;

    // Reset lại map container để tránh lỗi khi React render lại
    const container = L.DomUtil.get('map');
    if (container != null) {
      container._leaflet_id = null;
    }

    const map = L.map("map").setView([uLat, uLng], 14); // Zoom 14 cho dễ nhìn
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    // Marker vị trí của người dùng (Màu xanh)
    L.marker([uLat, uLng]).addTo(map).bindPopup("<b>Vị trí của bạn</b>").openPopup();

    // Marker các tổ hỗ trợ
    data.forEach((item) => {
      L.circleMarker([item.lat, item.lng], {
        color: 'red',
        radius: 8,
        fillOpacity: 0.8
      }).addTo(map).bindPopup(`
        <div style="font-size:13px; min-width: 150px;">
          <b style="color:#ef4444">${item.name}</b><br/>
          ${item.role}<br/>
          Đ/c: ${item.address}<br/>
          Cách: <b>${item.distance.toFixed(2)} km</b><br/>
          <div style="margin-top: 8px;">
            <a href="tel:${item.phone}" style="display:block; text-align:center; background:#16a34a; color:#fff; padding:6px; border-radius:4px; text-decoration:none; font-weight:bold;">
              📞 Gọi ngay
            </a>
          </div>
        </div>
      `);
    });
  };

  const handleCall = (phone: string) => {
    openPhone({ phoneNumber: phone });
  };

  return (
    <PageLayout title="Hỗ trợ khẩn cấp SOS">
      <Box style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden", backgroundColor: "#f3f4f6" }}>
        
        {/* KHU VỰC BẢN ĐỒ TRÀN MÀN HÌNH */}
        <div id="map" style={{ width: "100%", height: "100%", zIndex: 1 }} />

        {/* LOADING OVERLAY (Hiển thị giữa màn hình khi đang lấy tọa độ/dữ liệu) */}
        {loading && (
          <Box
            style={{
              position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: "rgba(255,255,255,0.7)", zIndex: 10,
              display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"
            }}
          >
            <Spinner visible />
            <Text bold style={{ marginTop: "12px", color: "#374151" }}>Đang định vị...</Text>
          </Box>
        )}

        {/* THÔNG BÁO LỖI (Nếu không bật GPS) */}
        {errorMessage && (
          <Box
            style={{
              position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
              backgroundColor: "#fee2e2", padding: "12px 24px", borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, width: "80%"
            }}
          >
            <Text bold style={{ color: "#dc2626", textAlign: "center" }}>{errorMessage}</Text>
          </Box>
        )}

        {/* DANH SÁCH CHI TIẾT (BOTTOM SHEET) */}
        {!loading && !errorMessage && nearestStaff.length > 0 && (
          <Box
            style={{
              position: "absolute", bottom: "65px", left: 0, right: 0, // 65px để tránh đè lên BottomNav
              maxHeight: "50vh", backgroundColor: "#ffffff",
              borderTopLeftRadius: "24px", borderTopRightRadius: "24px",
              boxShadow: "0 -4px 20px rgba(0,0,0,0.15)", zIndex: 10,
              display: "flex", flexDirection: "column"
            }}
          >
            {/* Thanh kéo trang trí (Drag handle) */}
            <div style={{ width: "40px", height: "5px", backgroundColor: "#d1d5db", borderRadius: "3px", margin: "12px auto 8px" }} />

            {/* Tiêu đề danh sách */}
            <Box px={4} pb={2}>
              <Text bold style={{ color: "#ef4444", fontSize: "16px" }}>DANH SÁCH HỖ TRỢ GẦN NHẤT</Text>
            </Box>

            {/* Vùng cuộn danh sách */}
            <Box px={4} pb={4} style={{ overflowY: "auto", flex: 1 }}>
              {nearestStaff.map((staff, index) => (
                <Box 
                  key={index} 
                  style={{ 
                    backgroundColor: "#f9fafb", padding: "14px", borderRadius: "12px", 
                    marginBottom: "12px", border: "1px solid #f3f4f6" 
                  }}
                >
                  <Box flex justifyContent="space-between" alignItems="center">
                    <Box style={{ flex: 1, paddingRight: "8px" }}>
                      <Text bold style={{ fontSize: "15px", color: "#1f2937", marginBottom: "4px" }}>{staff.name}</Text>
                      <Text size="xSmall" style={{ color: "#4b5563", marginBottom: "2px" }}><b>Chức vụ:</b> {staff.role}</Text>
                      <Text size="xSmall" style={{ color: "#4b5563", marginBottom: "2px" }}><b>Đ/c:</b> {staff.address}</Text>
                      <Text size="xSmall" style={{ color: "#ef4444", fontWeight: "bold", marginTop: "4px" }}>
                        📍 Cách đây: {staff.distance.toFixed(2)} km
                      </Text>
                    </Box>
                    <Button 
                      onClick={() => handleCall(staff.phone)}
                      style={{ backgroundColor: "#16a34a", borderRadius: "8px", height: "36px", width: "36px", padding: 0 }}
                      icon={<Icon icon="zi-call" />}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
      <BottomNavigationPage />
    </PageLayout>
  );
};

export default SOSPage;