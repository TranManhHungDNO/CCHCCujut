import { OA } from "@dts";
import React, { FunctionComponent, useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import Logo from "@assets/logo.png";
import { useStore } from "@store";
import { openWebview } from "zmp-sdk/apis";

// =================== styled ===================
const Card = styled.div`
  ${tw`flex items-center justify-between p-3 mb-3 mt-[6px] rounded-2xl`};
  background-color: #e6f0f2; /* ✅ nền xám xanh */
  border: 1px solid #b6d0d4; /* ✅ viền xám xanh nhẹ hơn */
  transition: all 0.25s ease;
  cursor: pointer;
  align-items: center; /* ✅ toàn card cân giữa theo chiều dọc */

  &:hover {
    background-color: #d7e7ea; /* ✅ sáng hơn nhẹ khi hover */
    transform: translateY(-2px);
  }
`;


const LeftBox = styled.div`
  ${tw`flex items-center`};
  gap: 10px;
  align-items: center; /* ✅ logo + text cùng trục giữa */

  img {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    border: 2px solid white;
    object-fit: cover;
  }

  .text-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 1.35;
    align-items: center; /* ✅ text-box căn giữa nội dung bên trong */
  }

  .title {
    font-weight: 700;
    font-size: 14px;
    color: #1e293b;
    text-align: center; /* ✅ CCHC xã Cư Jút” căn giữa ngang */
    width: 100%;
    margin-bottom: 2px;
  }

  .desc {
    font-size: 12px;
    color: #475569;
    text-align: center; /* ✅ giữ nguyên căn giữa dòng mô tả */
    width: 100%;
    display: block;
  }
`;


const FollowButton = styled.button`
  ${tw`rounded-full font-semibold text-white border-none`};
  font-size: 11.5px;
  padding: 6px 14px;
  background-color: #0284c7;
  box-shadow: 0 2px 4px rgba(2, 132, 199, 0.3);
  transition: all 0.25s ease;
  cursor: pointer;
  white-space: nowrap; /* ✅ giữ nút không bị xuống hàng */
  align-self: center;  /* ✅ căn giữa theo trục dọc */

  &:hover {
    filter: brightness(1.1);
  }

  &:active {
    transform: scale(0.96);
  }
`;

// =================== component ===================
const OAItem: FunctionComponent<{ officialAccount: OA }> = ({
  officialAccount,
}) => {
  const { name, logoUrl, oaId, follow: initFollow } = officialAccount;
  const followOA = useStore((state) => state.followOA);
  const [followed, setFollowed] = useState(initFollow || false);

  const oaLink = "https://zalo.me/2472341768491376343";

  const handleOpen = (url: string) => {
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

  const handleFollow = async () => {
    try {
      await followOA({ id: oaId });
      setFollowed(true);
      handleOpen(oaLink);
    } catch (err) {
      console.error("Lỗi khi Quan tâm OA:", err);
    }
  };

  return (
    <Card onClick={() => handleOpen(oaLink)}>
      <LeftBox>
        <img src={logoUrl || Logo} alt={name} />
        <div className="text-box">
          <span className="title">{name}</span>
          <span className="desc">
            Quan tâm để nhận thông báo mới nhất
          </span>
        </div>
      </LeftBox>

      <FollowButton
        onClick={(e) => {
          e.stopPropagation();
          followed ? handleOpen(oaLink) : handleFollow();
        }}
      >
        {followed ? "Truy cập" : "Quan tâm"}
      </FollowButton>
    </Card>
  );
};

export default OAItem;
