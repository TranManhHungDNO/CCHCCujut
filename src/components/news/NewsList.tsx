import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { Article } from "@dts";
// SỬA TẠI ĐÂY: Dùng đường dẫn tương đối để tránh lỗi Alias
import NewsItemSkeleton from "../skeleton/NewsItemSkeleton"; 
import NewsItem from "./NewsItem";
import { openWebview } from "zmp-sdk/apis";

export interface NewsListProps {
    data: Article[];
    loading?: boolean;
}

const Wrapper = styled.div`
    ${tw`flex overflow-x-auto whitespace-nowrap pt-2 pb-4 px-4`};
    background-color: transparent;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth; 
    
    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const ItemWrapper = styled.div`
    ${tw`flex-shrink-0 w-1/4 h-full pr-2`}; 
    scroll-snap-align: start;
    cursor: pointer; 
`;

const NewsList = React.forwardRef<HTMLDivElement, NewsListProps>(
    (props, externalRef) => {
        const { data, loading = true } = props;
        const listRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            const listElement = listRef.current;
            if (!listElement || data.length === 0) return;

            const slideWidth = listElement.offsetWidth;
            const totalWidth = listElement.scrollWidth;
            const scrollInterval = 4000; 
            
            let currentScrollPosition = listElement.scrollLeft;

            const autoScroll = () => {
                currentScrollPosition += slideWidth;
                if (currentScrollPosition >= totalWidth) {
                    currentScrollPosition = 0;
                }
                listElement.scroll({
                    left: currentScrollPosition,
                    behavior: 'smooth'
                });
            };

            const intervalId = setInterval(autoScroll, scrollInterval);
            return () => clearInterval(intervalId);
            
        }, [data.length]);

        const setRef = (el: HTMLDivElement | null) => {
            (listRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
            if (typeof externalRef === 'function') {
                externalRef(el);
            } else if (externalRef) {
                externalRef.current = el;
            }
        };

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

        return (
            <Wrapper id="articles" ref={setRef}>
                {data.map(item => (
                    <ItemWrapper key={item.id} onClick={() => handleItemClick(item.link)}>
                        <NewsItem data={item} />
                    </ItemWrapper>
                ))}
                {loading && (
                    <>
                        <ItemWrapper><NewsItemSkeleton /></ItemWrapper>
                        <ItemWrapper><NewsItemSkeleton /></ItemWrapper>
                        <ItemWrapper><NewsItemSkeleton /></ItemWrapper>
                        <ItemWrapper><NewsItemSkeleton /></ItemWrapper>
                    </>
                )}
            </Wrapper>
        );
    },
);

export default NewsList;