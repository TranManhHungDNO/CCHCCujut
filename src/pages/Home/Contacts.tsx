import React from "react";
import styled from "styled-components";
import { Box, Text } from "zmp-ui";
import { openWebview } from "zmp-sdk/apis";
import tw from "twin.macro";
import bkLogo from "@assets/bk-logo.jpg";

const StyledPage = styled(Box)`
  ${tw`w-full bg-ui_bg`};
`;

const ContactContainer = styled(Box)`
  ${tw`flex justify-start items-center z-[10]`};
  background: #ffebee;
  border-radius: 18px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  height: 80px;
  width: 100%;
  margin: 0 auto;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: #ffd6da;
    transform: translateY(-1px);
  }
`;

const Content = styled.div`
  ${tw`flex items-center`};
  gap: 10px; /* khoảng cách nhỏ giữa logo và chữ */
`;

const LogoBox = styled.div`
  ${tw`flex items-center justify-center rounded-full flex-shrink-0`};
  width: 48px;
  height: 48px;
  background: linear-gradient(145deg, #fca5a5, #f87171);
  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.3);
  transition: all 0.25s ease;

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    object-fit: cover;
  }
`;

const InfoBox = styled.div`
  ${tw`flex flex-col text-left`};
  line-height: 1.2;

  .title {
    font-weight: 700;
    font-size: 15px;
    color: #222;
  }

  .desc {
    font-size: 13px;
    color: #555;
  }
`;

const Contacts: React.FC = () => {
  const handleOpen = () => {
    const url = "https://zalo.me/1494758065624484019";
    try {
      openWebview({
        url,
        config: {
          style: "normal",
          leftButton: "back",
        },
      });
    } catch {
      window.location.href = url;
    }
  };

  return (
    <StyledPage>
      <ContactContainer onClick={handleOpen}>
        <Content>
          {/* Logo sát chữ */}
          <LogoBox>
            <img src={bkLogo} alt="Bách Khoa ICT" draggable={false} />
          </LogoBox>

          <InfoBox>
            <Text className="title">Bách Khoa ICT</Text>
            <Text className="desc">Đơn vị đồng hành</Text>
          </InfoBox>
        </Content>
      </ContactContainer>
    </StyledPage>
  );
};

export default Contacts;
