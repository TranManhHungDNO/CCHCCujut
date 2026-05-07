import React, { useEffect, useState, useRef } from "react";
import { Box, Text, Spinner, Icon, Button } from "zmp-ui";
import PageLayout from "@components/layout/PageLayout";
import BottomNavigationPage from "../Home/BottomNavigationPage";

const ProfileInfo = () => {
  const [cameraList, setCameraList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsInstance = useRef<any>(null);

  const jsonUrl = "https://bachkhoaict.com/cameras.json";

  useEffect(() => {
    // 1. Nạp Script Hls giống cách nạp Leaflet ở trang SOS
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
    script.async = true;
    script.onload = () => {
      fetchData();
    };
    document.body.appendChild(script);

    const fetchData = async () => {
      try {
        const res = await fetch(jsonUrl);
        const json = await res.json();
        const data = json.data || json;
        setCameraList(data);
        if (data.length > 0) setCurrentUrl(data[0].link);
      } catch (err) {
        console.error("Lỗi fetch JSON:", err);
      } finally {
        setLoading(false);
      }
    };

    return () => {
      if (hlsInstance.current) hlsInstance.current.destroy();
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!currentUrl || !videoRef.current || !(window as any).Hls) return;

    const video = videoRef.current;
    // Tắt tiếng để vượt qua chính sách Autoplay của Zalo
    video.muted = true;

    if (hlsInstance.current) {
      hlsInstance.current.destroy();
    }

    const Hls = (window as any).Hls;
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        xhrSetup: (xhr: any) => {
          xhr.withCredentials = false; // Tránh lỗi phân quyền server
        }
      });
      hlsInstance.current = hls;
      hls.loadSource(currentUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(e => console.log("Cần tương tác để phát:", e));
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Hỗ trợ trực tiếp cho iPhone
      video.src = currentUrl;
    }
  }, [currentUrl]);

  return (
    <PageLayout title="Camera Cư Jút">
      <Box p={4} style={{ paddingTop: "60px", minHeight: "100vh", backgroundColor: "#fff" }}>
        
        <Box style={{ 
          width: "100%", aspectRatio: "16/9", backgroundColor: "#000", 
          borderRadius: "12px", overflow: "hidden", marginBottom: "16px",
          border: "2px solid #1e40af" 
        }}>
          <video 
            ref={videoRef} 
            controls 
            playsInline 
            autoPlay 
            muted 
            style={{ width: "100%", height: "100%" }} 
          />
        </Box>

        <Text bold style={{ color: "#1e40af", marginBottom: "12px", textTransform: "uppercase" }}>
          Danh sách vị trí giám sát
        </Text>

        {loading ? (
          <Box flex justifyContent="center"><Spinner /></Box>
        ) : (
          <Box>
            {cameraList.map((cam, index) => (
              <Button 
                key={index} 
                fullWidth 
                variant={currentUrl === cam.link ? "primary" : "secondary"}
                onClick={() => setCurrentUrl(cam.link)}
                style={{ marginBottom: "10px", justifyContent: "flex-start", borderRadius: "10px" }}
                prefixIcon={<Icon icon="zi-video" />}
              >
                {cam.title}
              </Button>
            ))}
          </Box>
        )}
      </Box>
      <BottomNavigationPage />
    </PageLayout>
  );
};

export default ProfileInfo;