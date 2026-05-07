import React from "react";
import styled from "styled-components";
import { Box, Text } from "zmp-ui";
import { openWebview } from "zmp-sdk/apis";
import tw from "twin.macro";
import govLogo from "@assets/chinhphu.png";
import hcmLogo from "@assets/hcm.png";
import caLogo from "@assets/ca.png";

const StyledPage = styled(Box)`
  ${tw`w-full`};
  background-color: #ffffff;
  padding: 10px 0; /* tăng nhẹ padding tổng thể */
`;

/* ==== Card đầu tiên (BachKhoa ICT) ==== */
const Card = styled(Box)`
  ${tw`grid items-center z-[10]`};
  grid-template-columns: 54px 1fr 80px; /* ✅ tăng cột */
  background: #e6f0f2; /* ✅ xám xanh pastel */
  border: 1px solid #b6d0d4;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  height: 56px; /* ✅ tăng nhẹ chiều cao */
  width: 100%;
  margin: 0 auto 8px auto;
  padding: 6px 10px;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: #d7ecff;
    transform: translateY(-1px);
  }
`;

const LogoBox = styled.div`
  ${tw`flex items-center justify-center flex-shrink-0`};
  width: 36px; /* ✅ tăng logo */
  height: 36px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const InfoBox = styled.div`
  ${tw`flex flex-col justify-center text-left`};
  line-height: 1.25;
  padding-left: 6px;

  .title {
    font-weight: 700;
    font-size: 14px; /* ✅ tăng +2px so với 14px */
    color: #3b5560;  /* ✅ xám xanh dịu mắt */
  }
`;


const AccessButton = styled.button`
  ${tw`rounded-full font-semibold text-white border-none`};
  background-color: #0284c7;
  font-size: 12px; /* ✅ lớn hơn 10.5 → dễ đọc */
  padding: 5px 10px; /* ✅ tăng padding */
  box-shadow: 0 1px 3px rgba(2, 132, 199, 0.25);
  transition: all 0.25s ease;
  cursor: pointer;
  justify-self: end;
  align-self: center;
  white-space: nowrap;

  &:hover {
    filter: brightness(1.1);
  }

  &:active {
    transform: scale(0.96);
  }
`;

/* ==== Khối LIST nhiều dòng ==== */
const MultiList = styled(Box)`
  ${tw`flex flex-col rounded-lg shadow-sm`};
  background: #ffffff;
  border: 1px solid #b6d0d4;
  margin-bottom: 10px;
  padding: 6px 10px; /* ✅ tăng nhẹ padding */

  .item {
    ${tw`flex items-center justify-between py-1 cursor-pointer`};
    transition: all 0.2s ease;
    min-height: 50px; /* ✅ tăng từ 44 → 50 */

    &:hover {
      background: #f1f8ff;
      border-radius: 8px;
    }

    &:not(:last-child) {
      border-bottom: 1px solid #e2e8f0;
    }

    .left {
      ${tw`flex items-center`};
      gap: 10px;

      img {
        width: 30px; /* ✅ logo lớn hơn */
        height: 30px;
        border-radius: 50%;
        object-fit: cover;
      }

      span {
        font-weight: 600;
        font-size: 13.5px; /* ✅ tăng nhẹ chữ */
        color: #1e293b;
      }
    }

    button {
      ${tw`rounded-full font-semibold text-white border-none`};
      background-color: #0284c7;
      font-size: 12px;
      padding: 4px 10px;
      box-shadow: 0 1px 3px rgba(2, 132, 199, 0.25);
      transition: all 0.2s ease;
      white-space: nowrap;

      &:hover {
        filter: brightness(1.1);
      }

      &:active {
        transform: scale(0.96);
      }
    }
  }
`;

const Procedures: React.FC = () => {
  const handleOpen = (url: string) => {
    try {
      openWebview({
        url,
        config: { style: "normal", leftButton: "back" },
      });
    } catch {
      window.location.href = url;
    }
  };

  return (
    <StyledPage>
      {/* ✅ Card đầu tiên - BachKhoa ICT có nền xám xanh */}
          {/* ✅ Khối LIST dọc 3 dòng (tăng kích thước tổng thể) */}
      <MultiList>
        <div
          className="item"
          onClick={() => handleOpen("https://lamdong.gov.vn/")}
        >
          <div className="left">
            <img src={govLogo} alt="Cổng TTĐT Lâm Đồng" />
            <span>Cổng TTĐT Lâm Đồng</span>
          </div>
          
        </div>

        <div
          className="item"
          onClick={() => handleOpen("https://lamdong.gov.vn/sites/cchc/SitePages/Home.aspx")}
        >
          <div className="left">
            <img src={hcmLogo} alt="Chuyên trang CCHC Lâm Đồng" />
            <span>Chuyên trang CCHC Lâm Đồng</span>
          </div>
          
        </div>

        <div
          className="item"
          onClick={() => handleOpen("https://cujut.lamdong.gov.vn/cai-cach-hanh-chinh")}
        >
          <div className="left">
            <img src={hcmLogo} alt="CCHC Cư Jút" />
            <span>Chuyên trang CCHC Cư Jút</span>
          </div>
          
        </div>
      </MultiList>
    </StyledPage>
  );
};

export default Procedures;
