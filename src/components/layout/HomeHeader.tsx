import React, { FC, useEffect, useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import Logo from "@assets/slogo.png";
import Background from "@assets/header-background.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { authorize, getUserInfo } from "zmp-sdk/apis"; // Thêm thư viện Zalo API

interface SlideItem {
  src: string;
  alt?: string;
  caption?: string;
  link?: string;
}

export interface HomeHeaderProps {
  title: string;
  name: string;
}

const HeaderContainer = styled.div`
  ${tw`flex flex-row bg-main text-white items-center fixed top-0 left-0 w-full px-4 h-[calc(48px + var(--zaui-safe-area-inset-top, 0px))]`}
  padding-top: var(--zaui-safe-area-inset-top);
  z-index: 10;
  background: linear-gradient(
      0deg,
      rgba(4, 109, 214, 0.9),
      rgba(4, 109, 214, 0.9)
    ),
    url(${Background});
  background-size: cover;
  background-position: center;
`;

const Title = styled.div`${tw`text-base font-medium leading-tight`}`;
const StyledText = styled.div`${tw`text-xs opacity-80`}`;
const LogoWrapper = styled.div`
  ${tw`w-8 h-8 mr-2 cursor-pointer rounded-full overflow-hidden shrink-0 flex items-center justify-center`}
  /* Đã thêm cursor-pointer và bo tròn để avatar trông đẹp hơn */
`;

const SliderWrapper = styled.div`
  ${tw`relative w-full z-0`}
  height: 45vh;
  overflow: hidden;
  border-top-left-radius: 20px;
  border-bottom-right-radius: 20px;

  .swiper-pagination-bullet {
    background-color: white;
    opacity: 0.7;
  }
  .swiper-pagination-bullet-active {
    background-color: #007aff;
    opacity: 1;
  }

  @media (max-width: 768px) {
    height: 30vh;
  }
`;

const SlideImage = styled.img`${tw`w-full h-full object-cover`}`;
const LinkWrapper = styled.a`
  display: block;
  width: 100%;
  height: 100%;
  text-decoration: none;
  position: relative;
`;

const HomeHeader: FC<HomeHeaderProps> = ({ title, name }) => {
  const [sliderData, setSliderData] = useState<SlideItem[]>([]);
  const [userInfo, setUserInfo] = useState<any>(null);

  // 1. Kiểm tra trạng thái đăng nhập từ LocalStorage khi mở app
  useEffect(() => {
    const cachedUser = localStorage.getItem("current_user");
    if (cachedUser) {
      const parsed = JSON.parse(cachedUser);
      if (parsed.info) {
        setUserInfo(parsed.info);
      }
    }
  }, []);

  // 2. Lấy dữ liệu Slider
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("https://mini.dno.vn/cchc-cujut/index.php");
        const result = await response.json();
        const medias = result?.data?.data?.medias || [];
        const slides: SlideItem[] = medias.slice(0, 5).map((item, index) => ({
          src: item.thumb,
          alt: item.title || `Slide ${index + 1}`,
          link: item.link_view,
        }));
        setSliderData(slides);
      } catch {
        setSliderData([]);
      }
    })();
  }, []);

  // 3. Hàm xử lý khi bấm vào Logo
  const handleLogoClick = async () => {
    // Nếu đã có thông tin rồi thì không cần xin quyền lại
    if (userInfo) return; 

    try {
      // Gọi popup xin quyền thông tin người dùng
      const data = await authorize({
        scopes: ["scope.userInfo"],
      });

      // Nếu người dùng đồng ý
      if (data["scope.userInfo"]) {
        const { userInfo: fetchedUser } = await getUserInfo({});
        setUserInfo(fetchedUser);

        // Lưu vào LocalStorage để đồng bộ với trang AccountPage
        const cachedUser = localStorage.getItem("current_user");
        const parsed = cachedUser ? JSON.parse(cachedUser) : {};
        localStorage.setItem(
          "current_user",
          JSON.stringify({ ...parsed, info: fetchedUser })
        );
      }
    } catch (error) {
      console.log("Lỗi xin quyền hoặc người dùng từ chối:", error);
    }
  };

  return (
    <>
      <HeaderContainer>
        {/* CLICK VÀO ĐÂY ĐỂ XIN QUYỀN */}
        <LogoWrapper onClick={handleLogoClick}>
          <img 
            src={userInfo?.avatar || Logo} 
            alt={title} 
            className="w-full h-full object-cover" 
          />
        </LogoWrapper>
        
        <div>
          <Title>{title}</Title>
          {/* THAY ĐỔI CÂU CHỮ DỰA VÀO VIỆC CÓ USER HAY CHƯA */}
          <StyledText>
            {userInfo 
              ? `Tương tác giữa ${userInfo.name} với Chính quyền` 
              : name}
          </StyledText>
        </div>
      </HeaderContainer>

      <SliderWrapper>
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          pagination={{ clickable: true }}
          loop
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          slidesPerView={1}
          style={{ height: "100%" }}
        >
          {sliderData.length > 0 ? (
            sliderData.map((slide, idx) => (
              <SwiperSlide key={idx}>
                {slide.link ? (
                  <LinkWrapper
                    href={slide.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SlideImage src={slide.src} alt={slide.alt || ""} />
                  </LinkWrapper>
                ) : (
                  <SlideImage src={slide.src} alt={slide.alt || ""} />
                )}
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <SlideImage
                src="https://lamdong.gov.vn/ban-do-hanh-chinh/Shared%20Documents/images/101.png"
                alt="Slide mặc định"
              />
            </SwiperSlide>
          )}
        </Swiper>
      </SliderWrapper>
    </>
  );
};

export default HomeHeader;