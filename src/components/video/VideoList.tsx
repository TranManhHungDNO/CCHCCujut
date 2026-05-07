import React, { useState, useEffect } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { Article } from "@dts";
import { openWebview } from "zmp-sdk/apis";

export interface NewsListProps {
    data: Article[];
    loading?: boolean;
}

const Wrapper = styled.div`
    ${tw`w-full bg-white rounded-lg p-2 shadow-sm border border-gray-100`};
    overflow: hidden; 
`;

const HeaderTitle = styled.h2`
    ${tw`text-sm font-bold text-gray-900 mb-2 px-1`};
`;

const ItemRow = styled.div`
    ${tw`flex flex-row items-start gap-2 border-b border-gray-100 py-2 last:border-0 last:pb-0 first:pt-0 cursor-pointer active:opacity-60 transition-opacity`};
    min-height: 70px; 
`;

const ThumbCol = styled.div`
    ${tw`w-14 h-14 flex-shrink-0 relative overflow-hidden rounded bg-gray-100`};
    img { ${tw`w-full h-full object-cover`}; }
`;

const ContentCol = styled.div`
    ${tw`flex-1 flex flex-col justify-between h-full`};
`;

const MetaDate = styled.div`
    ${tw`text-[10px] text-gray-400 font-medium`};
`;

const Title = styled.h3`
    ${tw`text-xs font-bold text-gray-900 leading-tight mt-0.5 mb-1`};
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

// --- THÊM PHẦN STYLE CHO THANH THỐNG KÊ (STATS) ---
const StatsRow = styled.div`
    ${tw`flex flex-row items-center gap-3 mt-auto`};
`;

const StatItem = styled.div`
    ${tw`flex flex-row items-center gap-1 text-[10px] text-gray-400 font-medium`};
    svg {
        width: 12px;
        height: 12px;
        stroke-width: 2px;
    }
`;

const SliderViewport = styled.div`
    ${tw`relative overflow-hidden`};
    /* Tăng chiều cao lên để đủ chỗ cho hàng Icon */
    height: 240px; 
`;

const SliderTrack = styled.div<{ activeIndex: number }>`
    ${tw`flex flex-col transition-transform duration-700 ease-in-out`};
    transform: translateY(${props => `-${props.activeIndex * 100}%`});
    height: 100%;
`;

const SlideGroup = styled.div`
    ${tw`flex flex-col flex-shrink-0 w-full`};
    height: 100%;
    justify-content: flex-start;
`;

const formatDate = (dateInput: Date | string | undefined) => {
    if (!dateInput) return "";
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

const NewsList: React.FC<NewsListProps> = ({ data, loading = false }) => {
    
    const [activeIndex, setActiveIndex] = useState(0);
    
    const limitedData = data.slice(0, 6); 
    const chunkSize = 3; 
    
    const slides = [];

    for (let i = 0; i < limitedData.length; i += chunkSize) {
        slides.push(limitedData.slice(i, i + chunkSize));
    }

    useEffect(() => {
        if (slides.length <= 1) return;
        const interval = setInterval(() => {
            setActiveIndex((current) => (current === slides.length - 1 ? 0 : current + 1));
        }, 5000); 
        return () => clearInterval(interval);
    }, [slides.length]);

    const handleItemClick = (url?: string) => {
        if (url) {
            openWebview({
                url: url,
                config: {
                    style: "normal",
                    leftButton: "back",
                },
            });
        }
    };

    const renderItem = (item: Article) => (
        <ItemRow key={item.id} onClick={() => handleItemClick(item.link)}>
            <ThumbCol>
                <img 
                    src={item.thumb || item.cover || item.image || 'https://via.placeholder.com/150'} 
                    alt={item.title} 
                    loading="lazy"
                />
            </ThumbCol>
            <ContentCol>
                <div>
                    <MetaDate>{formatDate(item.createdAt || item.published_at)}</MetaDate>
                    <Title>{item.title}</Title>
                </div>
                
                {/* --- RENDER CÁC ICON THỐNG KÊ Ở ĐÂY --- */}
                <StatsRow>
                    <StatItem title="Lượt xem">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{item.total_view || 0}</span>
                    </StatItem>
                    
                    <StatItem title="Bình luận">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.436 3 12c0 2.206.966 4.2 2.625 5.625a3.32 3.32 0 01-1.255 2.25 1.5 1.5 0 00.925 2.684 1.5 1.5 0 001.075-.436 4.9 4.9 0 013.25-1.34 8.784 8.784 0 002.38.317z" />
                        </svg>
                        {/* Lưu ý: Bạn cần map thêm total_comment ở file VideoSection.tsx */}
                        <span>{(item as any).total_comment || 0}</span> 
                    </StatItem>

                    <StatItem title="Yêu thích">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                        <span>{item.total_like || 0}</span>
                    </StatItem>
                    
                    <StatItem title="Chia sẻ">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                        </svg>
                        <span>{item.total_share || 0}</span>
                    </StatItem>
                </StatsRow>
            </ContentCol>
        </ItemRow>
    );

    return (
        <Wrapper>
            <HeaderTitle>Tin tức - Sự kiện</HeaderTitle>

            {(loading || limitedData.length === 0) ? (
                 <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                       <ItemRow key={i}>
                           <div className="w-14 h-14 bg-gray-200 rounded shrink-0"></div>
                           <div className="flex-1 space-y-1 py-0.5">
                               <div className="h-2 bg-gray-200 rounded w-1/4 mb-2"></div>
                               <div className="h-3 bg-gray-200 rounded w-full"></div>
                               <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                               <div className="flex gap-3 mt-2">
                                   <div className="h-2 bg-gray-200 rounded w-6"></div>
                                   <div className="h-2 bg-gray-200 rounded w-6"></div>
                                   <div className="h-2 bg-gray-200 rounded w-6"></div>
                               </div>
                           </div>
                       </ItemRow>
                   ))}
                 </div>
            ) : (
                <SliderViewport>
                    <SliderTrack activeIndex={activeIndex}>
                        {slides.map((group, groupIndex) => (
                            <SlideGroup key={groupIndex}>
                                {group.map((item) => renderItem(item))}
                            </SlideGroup>
                        ))}
                    </SliderTrack>
                </SliderViewport>
            )}
        </Wrapper>
    );
};

export default NewsList;