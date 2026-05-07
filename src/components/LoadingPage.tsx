import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

// --- 1. HIỆU ỨNG HOẠT ẢNH ---
const spinRight = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const spinLeft = keyframes`
  0% { transform: rotate(360deg); }
  100% { transform: rotate(0deg); }
`;

const pulseLogo = keyframes`
  0%, 100% { 
    transform: scale(1); 
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.4), inset 0 0 20px rgba(0, 212, 255, 0.4); 
  }
  50% { 
    transform: scale(1.03); 
    box-shadow: 0 0 40px rgba(0, 212, 255, 0.7), inset 0 0 25px rgba(0, 212, 255, 0.5); 
  }
`;

// Chữ chớp sáng Neon tĩnh
const textGlow = keyframes`
  0%, 100% { 
    text-shadow: 0 0 8px rgba(0, 212, 255, 0.8), 0 0 15px rgba(0, 212, 255, 0.5); 
    opacity: 1; 
  }
  50% { 
    text-shadow: 0 0 3px rgba(0, 212, 255, 0.4); 
    opacity: 0.8; 
  }
`;

// --- 2. STYLED COMPONENTS ---
const FullScreenContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column; /* Đổi thành column để xếp vòng sáng trên, chữ dưới */
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  background: linear-gradient(135deg, #090a0f, #1a153a, #10101a);
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  gap: 30px; /* Khoảng cách giữa khối vòng xoay và chữ */
`;

const LoaderContainer = styled.div`
  position: relative;
  width: 260px;
  height: 260px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SpinnerOuter = styled.div`
  position: absolute;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  border: 2px dashed rgba(0, 212, 255, 0.3);
  border-top: 3px solid #00d4ff; 
  border-bottom: 3px solid #00d4ff;
  animation: ${spinRight} 8s linear infinite;
`;

const SpinnerInner = styled.div`
  position: absolute;
  width: 230px;
  height: 230px;
  border-radius: 50%;
  border: 1px dotted rgba(255, 255, 255, 0.4);
  border-left: 3px solid #00d4ff;
  animation: ${spinLeft} 4s linear infinite;
`;

const Logo = styled.img`
  width: 140px;
  height: 140px;
  object-fit: contain;
  border-radius: 50%;
  z-index: 13;
  border: 4px solid #00d4ff;
  background: #fff;
  animation: ${pulseLogo} 3s ease-in-out infinite;
`;

const TitleContainer = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MainTitle = styled.h1`
  margin: 0;
  color: #ffffff;
  font-family: 'Montserrat', 'Segoe UI', sans-serif;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  animation: ${textGlow} 2s infinite ease-in-out;
`;

const SubTitle = styled.h2`
  margin: 0;
  color: #00d4ff;
  font-family: 'Montserrat', 'Segoe UI', sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 4px;
  text-transform: uppercase;
  opacity: 0.9;
`;

// --- 3. COMPONENT CHÍNH ---
const LoadingPage: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });

    const timer = setTimeout(() => onFinish(), 4000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <FullScreenContainer>
      {init && (
        <Particles
          id="tsparticles"
          options={{
            fpsLimit: 60,
            particles: {
              color: { value: "#ffffff" },
              links: {
                color: "#00d4ff",
                distance: 150,
                enable: true,
                opacity: 0.3,
                width: 1,
              },
              move: { enable: true, speed: 1, direction: "none", outModes: { default: "out" } },
              number: { value: 50, density: { enable: true, width: 800, height: 800 } },
              opacity: { value: 0.4 },
              shape: { type: "circle" },
              size: { value: { min: 1, max: 2 } },
            },
            interactivity: {
              events: { onHover: { enable: true, mode: "grab" } },
              modes: { grab: { distance: 200, links: { opacity: 0.6 } } },
            },
            detectRetina: true,
          }}
        />
      )}

      <MainContent>
        {/* Khối Logo và vòng sáng xoay */}
        <LoaderContainer>
          <SpinnerOuter />
          <SpinnerInner />
          <Logo src="https://mini.dno.vn/cchc-cujut/cchc-cujut.png" alt="Logo Cư Jút" />
        </LoaderContainer>

        {/* Khối chữ cố định bên dưới */}
        <TitleContainer>
          <MainTitle>Cải Cách Hành Chính Cư Jút</MainTitle>
          <SubTitle>Nâng cao chất lượng phục vụ </SubTitle>
        </TitleContainer>
      </MainContent>
    </FullScreenContainer>
  );
};

export default LoadingPage;