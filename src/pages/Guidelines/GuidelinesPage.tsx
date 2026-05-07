import React, { useEffect, useState } from "react";
import { Box, Spinner, Text, Icon, Button, Page } from "zmp-ui";
import { openWebview } from "zmp-sdk/apis";
import PageLayout from "@components/layout/PageLayout";
import BottomNavigationPage from "../Home/BottomNavigationPage";

// Tọa độ 1: UBND xã Cư Jút
const DEST1_LAT = 12.588378854982452;
const DEST1_LNG = 107.89564173848747;
const DEST1_NAME = "Trụ sở UBND xã Cư Jút";

// Tọa độ 2: Trung tâm phục vụ Hành chính công
const DEST2_LAT = 12.58885656490002;
const DEST2_LNG = 107.88964877823143;
const DEST2_NAME = "Trung tâm phục vụ Hành chính công";

// Tọa độ 3: Công an xã Cư Jút
const DEST3_LAT = 12.589025970635015;
const DEST3_LNG = 107.89184809836041;
const DEST3_NAME = "Công an xã Cư Jút";

const UbndLocationPage = () => {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // 1. Nạp CSS Leaflet
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    // 2. Nạp Script Leaflet
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setUserPos({ lat, lng });
            renderMap(lat, lng);
            setLoading(false);
          },
          () => {
            setErrorMessage("Vui lòng bật GPS để xác định vị trí của bạn.");
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

  const renderMap = (uLat: number, uLng: number) => {
    const L = (window as any).L;
    const mapContainer = document.getElementById("map");
    if (!L || !mapContainer) return;

    const container = L.DomUtil.get("map");
    if (container != null) container._leaflet_id = null;

    const map = L.map("map");
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    const redIcon = L.icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const userMarker = L.marker([uLat, uLng]).addTo(map).bindPopup("<b>Vị trí của bạn</b>");
    const marker1 = L.marker([DEST1_LAT, DEST1_LNG], { icon: redIcon }).addTo(map).bindPopup(`<b>${DEST1_NAME}</b>`);
    const marker2 = L.marker([DEST2_LAT, DEST2_LNG], { icon: redIcon }).addTo(map).bindPopup(`<b>${DEST2_NAME}</b>`);
    const marker3 = L.marker([DEST3_LAT, DEST3_LNG], { icon: redIcon }).addTo(map).bindPopup(`<b>${DEST3_NAME}</b>`);

    const group = new L.featureGroup([userMarker, marker1, marker2, marker3]);
    map.fitBounds(group.getBounds(), { padding: [70, 70] });
  };

  // --- SỬA LỖI LOGIC DẪN ĐƯỜNG TẠI ĐÂY ---
  const openRouting = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    openWebview({ url: url });
  };

  return (
    <PageLayout title="Địa điểm hành chính">
      <Page className="bg-gray-100">
        <Box style={{ display: "flex", flexDirection: "column", minHeight: "100vh", paddingBottom: "120px" }}>
          
          {/* KHU VỰC MAP */}
          <Box style={{ width: "100%", height: "40vh", position: "relative" }}>
            <div id="map" style={{ width: "100%", height: "100%", zIndex: 1 }} />
            {loading && (
              <Box
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(255,255,255,0.7)",
                  zIndex: 10,
                }}
                flex
                justifyContent="center"
                alignItems="center"
              >
                <Spinner visible />
                <Text className="ml-2">Đang định vị...</Text>
              </Box>
            )}
          </Box>

          {/* DANH SÁCH ĐỊA ĐIỂM */}
          <Box p={4} style={{ marginTop: "-30px", zIndex: 10, position: "relative" }}>
            <Box
              style={{
                backgroundColor: "#fff",
                borderRadius: "20px",
                padding: "18px",
                boxShadow: "0 -5px 20px rgba(0,0,0,0.1)",
              }}
            >
              <Text bold size="large" className="mb-4 text-blue-900">
                Chọn điểm cần đến:
              </Text>

              {errorMessage ? (
                <Text style={{ color: "red", textAlign: "center" }}>{errorMessage}</Text>
              ) : (
                <Box>
                  {/* 1. UBND XÃ */}
                  <Box mb={3} style={{ padding: "12px", border: "1px solid #e5e7eb", borderRadius: "12px" }}>
                    <Box flex alignItems="center" mb={1}>
                      <Icon icon="zi-home" style={{ color: "#1e40af", marginRight: "8px" }} />
                      <Text bold style={{ color: "#1e40af" }}>{DEST1_NAME}</Text>
                    </Box>
                    <Text size="xxxSmall" className="text-gray-500 mb-2">Trụ sở làm việc chính</Text>
                    <Button
                      fullWidth
                      size="small"
                      onClick={() => openRouting(DEST1_LAT, DEST1_LNG)}
                      style={{ backgroundColor: "#2563eb", borderRadius: "8px" }}
                      prefixIcon={<Icon icon="zi-location" />}
                    >
                      Chỉ đường
                    </Button>
                  </Box>

                  {/* 2. TRUNG TÂM PHỤC VỤ HÀNH CHÍNH CÔNG */}
                  <Box mb={3} style={{ padding: "12px", border: "1px solid #e5e7eb", borderRadius: "12px" }}>
                    <Box flex alignItems="center" mb={1}>
                      <Icon icon="zi-user" style={{ color: "#065f46", marginRight: "8px" }} />
                      <Text bold style={{ color: "#065f46" }}>{DEST2_NAME}</Text>
                    </Box>
                    <Text size="xxxSmall" className="text-gray-500 mb-2">Tiếp nhận và trả kết quả hồ sơ</Text>
                    <Button
                      fullWidth
                      size="small"
                      onClick={() => openRouting(DEST2_LAT, DEST2_LNG)}
                      style={{ backgroundColor: "#059669", borderRadius: "8px" }}
                      prefixIcon={<Icon icon="zi-location" />}
                    >
                      Chỉ đường
                    </Button>
                  </Box>

                  {/* 3. CÔNG AN XÃ */}
                  <Box style={{ padding: "12px", border: "1px solid #e5e7eb", borderRadius: "12px" }}>
                    <Box flex alignItems="center" mb={1}>
                      <Icon icon="zi-shield-check" style={{ color: "#b91c1c", marginRight: "8px" }} />
                      <Text bold style={{ color: "#b91c1c" }}>{DEST3_NAME}</Text>
                    </Box>
                    <Text size="xxxSmall" className="text-gray-500 mb-2">Trụ sở Công an xã Cư Jút</Text>
                    <Button
                      fullWidth
                      size="small"
                      onClick={() => openRouting(DEST3_LAT, DEST3_LNG)}
                      style={{ backgroundColor: "#dc2626", borderRadius: "8px" }}
                      prefixIcon={<Icon icon="zi-location" />}
                    >
                      Chỉ đường
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        <BottomNavigationPage />
      </Page>
    </PageLayout>
  );
};

export default UbndLocationPage;