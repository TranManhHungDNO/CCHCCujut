import React, { FunctionComponent, useState, useEffect, useRef } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { Link } from "react-router-dom";
import { openWebview, vibrate } from "zmp-sdk/apis";
import { motion, AnimatePresence, Reorder } from "framer-motion";

// 1. IMPORT ICONS - ĐÃ ĐỔI FileSearch THÀNH FileMagnifyingGlass
import {
  GlobeHemisphereWest, MagnifyingGlass, Desktop, 
  CalendarCheck, Megaphone, Receipt, 
  Circuitry, VideoCamera, ShieldCheck, Television,
  MapPinArea, Robot, FileMagnifyingGlass 
} from "@phosphor-icons/react";

// --- 1. INTERFACES ---
interface Utility {
  key: string;
  label: string;
  icon: any;
  link?: string;
  path?: string;
  gradient: string;
  shadowColor: string; 
}

export const APP_UTILITIES: Utility[] = [
  { key: "01", label: "DVC Quốc gia", icon: GlobeHemisphereWest, link: "https://dichvucong.gov.vn", gradient: "linear-gradient(135deg, #6366f1, #4338ca)", shadowColor: "rgba(99, 102, 241, 0.45)" },
  { key: "02", label: "Tra cứu TTHC", icon: MagnifyingGlass, path: "/search", gradient: "linear-gradient(135deg, #06b6d4, #0891b2)", shadowColor: "rgba(6, 182, 212, 0.45)" },
  { key: "09", label: "An ninh khu vực", icon: ShieldCheck, path: "/profile", gradient: "linear-gradient(135deg, #be123c, #9f1239)", shadowColor: "rgba(190, 18, 60, 0.45)" },
  { key: "12", label: "Tổ CNS Cộng đồng", icon: Circuitry, path: "/cns-list", gradient: "linear-gradient(135deg, #14b8a6, #0f766e)", shadowColor: "rgba(20, 184, 166, 0.45)" },
  { key: "08", label: "Bản đồ di chuyển", icon: MapPinArea, path: "/guidelines", gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)", shadowColor: "rgba(139, 92, 246, 0.45)" },
  { key: "04", label: "Camera Giao thông", icon: VideoCamera, path: "/cam", gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)", shadowColor: "rgba(59, 130, 246, 0.45)" },  
  { key: "06", label: "Phản ánh kiến nghị", icon: Megaphone, path: "/feedbacks", gradient: "linear-gradient(135deg, #ec4899, #db2777)", shadowColor: "rgba(236, 72, 153, 0.45)" }, 
  { key: "11", label: "Báo và PTTH Lâm Đồng", icon: Television, path: "/information-guide", gradient: "linear-gradient(135deg, #d946ef, #a21caf)", shadowColor: "rgba(217, 70, 239, 0.45)" },
  { key: "03", label: "Học vụ số", icon: Desktop, link: "https://binhdanhocvuso.gov.vn/", gradient: "linear-gradient(135deg, #f59e0b, #d97706)", shadowColor: "rgba(245, 158, 11, 0.45)" }, 
  { key: "10", label: "Trợ lý AI", icon: Robot, link: "https://trolythongminh.ai.vn/", gradient: "linear-gradient(135deg, #0284c7, #0369a1)", shadowColor: "rgba(2, 132, 199, 0.45)" },
  { key: "05", label: "Lịch hẹn công dân", icon: CalendarCheck, path: "/schedule-appointment-result", gradient: "linear-gradient(135deg, #10b981, #059669)", shadowColor: "rgba(16, 185, 129, 0.45)" },
  { key: "07", label: "Tra cứu hồ sơ", icon: FileMagnifyingGlass, path: "/", gradient: "linear-gradient(135deg, #15803d, #166534)", shadowColor: "rgba(21, 128, 61, 0.45)" },
];

// --- 2. STYLED COMPONENTS ---
const SectionContainer = styled.div`${tw`p-4 bg-transparent relative`};`;
const HeaderContainer = styled.div`${tw`flex justify-between items-center mb-4`};`;
const ButtonGroup = styled.div`${tw`flex gap-2`};`;
const DefaultButton = styled.button`${tw`px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded-full shadow-sm`}; transition: all 0.2s; &:active { transform: scale(0.95); }`;
const EditButton = styled.button`${tw`px-4 py-1 text-xs font-bold text-white bg-blue-500 rounded-full shadow-md`}; transition: all 0.2s; &:active { transform: scale(0.95); }`;
const UtilitiesGrid = styled(Reorder.Group)`display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; width: 100%; list-style: none; padding: 0; margin: 0;`;
const ReorderItemMotion = styled(Reorder.Item)<{ $isEditMode: boolean }>`position: relative; touch-action: ${p => p.$isEditMode ? "none" : "auto"};`;
const CardContent = styled(motion.div)<{ $isEditMode: boolean }>`${tw`flex flex-col items-center justify-center text-center relative w-full h-full`}; background: #ffffff; border-radius: 20px; padding: 18px 8px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03); border: 1px solid rgba(240, 240, 240, 0.8); cursor: ${p => p.$isEditMode ? "grab" : "pointer"};`;
const IconContainer = styled(motion.div)<{ $gradient: string, $shadowColor: string }>`${tw`flex items-center justify-center mb-3`}; width: 52px; height: 52px; border-radius: 18px; background: ${p => p.$gradient}; position: relative; z-index: 2; box-shadow: 0 10px 20px -4px ${p => p.$shadowColor}; svg { width: 28px; height: 28px; color: #ffffff; }`;
const Label = styled.span`${tw`text-gray-800 font-semibold`}; font-size: 13px; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;`;
const RemoveBadge = styled.div`${tw`absolute -top-2 -right-2 bg-red-500 text-white rounded-full flex items-center justify-center font-bold shadow-md`}; width: 22px; height: 22px; font-size: 16px; z-index: 10; border: 2px solid white;`;

const Utilities: FunctionComponent = () => {
  const [items, setItems] = useState<Utility[]>(APP_UTILITIES);
  const [isEditMode, setIsEditMode] = useState(false);
  const timerRef = useRef<any>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const savedOrder = localStorage.getItem("utils_order");
    if (savedOrder) {
      const keys = JSON.parse(savedOrder);
      const orderedItems = keys.map((key: string) => APP_UTILITIES.find(u => u.key === key)).filter(Boolean);
      const newItems = APP_UTILITIES.filter(u => !keys.includes(u.key));
      setItems([...orderedItems, ...newItems].slice(0, 12));
    }
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isEditMode) return;
    startPosRef.current = { x: e.clientX, y: e.clientY };
    timerRef.current = setTimeout(() => { vibrate({}); setIsEditMode(true); }, 800);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!startPosRef.current || isEditMode) return;
    const dx = Math.abs(e.clientX - startPosRef.current.x);
    const dy = Math.abs(e.clientY - startPosRef.current.y);
    if (dx > 10 || dy > 10) { if (timerRef.current) clearTimeout(timerRef.current); startPosRef.current = null; }
  };

  const handleAction = (item: Utility) => {
    if (isEditMode) return;
    if (item.link) {
      openWebview({ 
        url: item.link, 
        config: { style: "normal", leftButton: "back" } 
      });
    }
  };

  return (
    <SectionContainer>
      <HeaderContainer>
        {isEditMode && (
          <ButtonGroup>
            <DefaultButton onClick={() => { setItems(APP_UTILITIES); localStorage.removeItem("utils_order"); setIsEditMode(false); }}>Mặc định</DefaultButton>
            <EditButton onClick={() => { setIsEditMode(false); localStorage.setItem("utils_order", JSON.stringify(items.map(i => i.key))); }}>Xong</EditButton>
          </ButtonGroup>
        )}
      </HeaderContainer>

      <UtilitiesGrid axis="y" values={items} onReorder={(newOrder) => setItems(newOrder as Utility[])}>
        <AnimatePresence mode="popLayout">
          {items.map((item) => {
            const IconComp = item.icon;
            return (
              <ReorderItemMotion
                key={item.key}
                value={item}
                $isEditMode={isEditMode}
                dragListener={isEditMode} 
                onPointerDown={handlePointerDown}
                onPointerUp={() => { if (timerRef.current) clearTimeout(timerRef.current); startPosRef.current = null; }}
                onPointerMove={handlePointerMove} 
              >
                {item.path && item.path !== "/" && !isEditMode ? (
                  <Link to={item.path} style={{ textDecoration: "none" }}>
                     <CardContent $isEditMode={isEditMode} whileTap={{ scale: 0.95 }}>
                        <IconContainer $gradient={item.gradient} $shadowColor={item.shadowColor}>
                          <IconComp weight="duotone" />
                        </IconContainer>
                        <Label>{item.label}</Label>
                      </CardContent>
                  </Link>
                ) : (
                  <CardContent 
                    $isEditMode={isEditMode}
                    onClick={() => handleAction(item)}
                    whileTap={!isEditMode ? { scale: 0.95 } : {}}
                    animate={isEditMode ? { rotate: [-1, 1, -1], transition: { repeat: Infinity, duration: 0.2 } } : { rotate: 0 }}
                  >
                    {isEditMode && <RemoveBadge>-</RemoveBadge>}
                    <IconContainer $gradient={item.gradient} $shadowColor={item.shadowColor}>
                      <IconComp weight="duotone" />
                    </IconContainer>
                    <Label>{item.label}</Label>
                  </CardContent>
                )}
              </ReorderItemMotion>
            );
          })}
        </AnimatePresence>
      </UtilitiesGrid>
    </SectionContainer>
  );
};

export default Utilities;