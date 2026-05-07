import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Box, Modal, Button, Icon } from "zmp-ui";
import { openWebview, scanQRCode, vibrate } from "zmp-sdk/apis";

// --- IMPORT ICONS ---
import logo from "@assets/cjo.png";
import zaloLogo from "@assets/logo-zl.png";
import scanLogo from "@assets/logo-sc.gif";
import homeLogo from "@assets/home-icon.png"; 

import tw from "twin.macro";

const StyledPage = styled(Box)`
  ${tw`w-full`};
`;

const InvisibleOverlay = styled.div<{ isExpanded: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 99;
  display: ${({ isExpanded }) => (isExpanded ? "block" : "none")};
`;

const FabToggle = styled(Box)<{ isExpanded: boolean }>`
  position: fixed;
  right: 20px;
  bottom: 24px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  z-index: 100;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  ${tw`flex items-center justify-center cursor-pointer`};
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: ${({ isExpanded }) => (isExpanded ? "scale(0) rotate(-90deg)" : "scale(1) rotate(0)")};
  opacity: ${({ isExpanded }) => (isExpanded ? 0 : 1)};
  pointer-events: ${({ isExpanded }) => (isExpanded ? "none" : "auto")};
  &:active { transform: scale(0.9); }
`;

const BottomNavigation = styled(Box)<{ isExpanded: boolean }>`
  ${tw`flex justify-around items-center fixed left-1/2 z-[101]`};
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border-radius: 36px;
  height: 64px; 
  width: 85%; 
  max-width: 320px; 
  bottom: 24px; 
  padding: 0 16px;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: translateX(-50%)
    ${({ isExpanded }) => (isExpanded ? "translateY(0) scale(1)" : "translateY(40px) scale(0.8)")};
  opacity: ${({ isExpanded }) => (isExpanded ? 1 : 0)};
  pointer-events: ${({ isExpanded }) => (isExpanded ? "auto" : "none")};
`;

const NavigationItem = styled(Box)`
  ${tw`flex flex-col items-center justify-center cursor-pointer select-none`};
  height: 100%;
  width: 60px;
  .icon-wrapper {
    ${tw`flex items-center justify-center`};
    width: 100%;
    height: 100%;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  img {
    width: 36px;
    height: 36px;
    object-fit: contain;
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.15));
    transition: all 0.3s ease;
  }
  &:active .icon-wrapper {
    transform: translateY(-4px) scale(1.15);
  }
`;

const BottomNavigationPage: React.FC = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [qrContent, setQrContent] = useState("");

  const navigationItems = [
    {
      key: "home",
      label: "Trang chủ",
      path: "/", // Quay về màn hình chính
      icon: homeLogo, // Đảm bảo bạn có file này trong assets
    },
    {
      key: "portal",
      label: "Cổng TT",
      link: "http://cujut.lamdong.gov.vn/",
      icon: logo,
    },
    {
      key: "scan",
      label: "Quét QR",
      action: "scan_qr",
      icon: scanLogo,
    },
    {
      key: "zalo",
      label: "Zalo OA",
      link: "https://zalo.me/2472341768491376343",
      icon: zaloLogo,
    },
  ];

  const handleScanQR = async () => {
    vibrate({});
    setIsExpanded(false); 
    try {
      const { content } = await scanQRCode({});
      if (content) {
        const isUrl = content.startsWith("http://") || content.startsWith("https://");
        if (isUrl) {
          openWebview({
            url: content,
            config: { style: "bottomSheet", leftButton: "back" },
          });
        } else {
          setQrContent(content);
          setModalVisible(true);
        }
      }
    } catch (error) {
      console.log("Hủy quét QR:", error);
    }
  };

  const handleNavigation = (item: any) => {
    vibrate({});
    if (item.action === "scan_qr") {
      handleScanQR();
    } else if (item.path) {
      setIsExpanded(false); 
      navigate(item.path);
    } else if (item.link) {
      setIsExpanded(false); 
      openWebview({
        url: item.link,
        config: { style: "normal", leftButton: "back" },
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isExpanded) setIsExpanded(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isExpanded]);

  return (
    <StyledPage>
      <FabToggle 
        isExpanded={isExpanded} 
        onClick={() => {
          vibrate({});
          setIsExpanded(true);
        }}
      >
        <Icon icon="zi-more-grid" style={{ color: "#374151", fontSize: "24px" }} />
      </FabToggle>

      <InvisibleOverlay 
        isExpanded={isExpanded} 
        onClick={() => setIsExpanded(false)} 
      />

      <BottomNavigation isExpanded={isExpanded}>
        {navigationItems.map((item) => (
          <NavigationItem key={item.key} onClick={() => handleNavigation(item)}>
            <div className="icon-wrapper">
              <img src={item.icon} alt={item.label} draggable={false} />
            </div>
          </NavigationItem>
        ))}
      </BottomNavigation>

      <Modal
        visible={modalVisible}
        title="Thông tin từ mã QR"
        onClose={() => setModalVisible(false)}
      >
        <Box p={4} className="text-center">
          <div style={{ wordBreak: 'break-word', lineHeight: '1.6', color: '#374151', fontSize: '15px' }}>
            {qrContent}
          </div>
        </Box>
        <Box flex justifyContent="center" mt={4} mb={2}>
          <Button onClick={() => setModalVisible(false)} size="small" fullWidth>
            Đóng
          </Button>
        </Box>
      </Modal>
    </StyledPage>
  );
};

export default BottomNavigationPage;