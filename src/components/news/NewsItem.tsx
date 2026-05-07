import React, { FC, useCallback } from "react";
import { Box, Text } from "zmp-ui";
// 1. Sửa đường dẫn tương đối (Điều chỉnh số lượng ../ tùy theo vị trí thực tế của bạn)
import { DateTime } from "../../utils"; 
import styled from "styled-components";
import tw from "twin.macro";
import { Article } from "@dts";
// 2. Sử dụng trực tiếp từ SDK để tránh lỗi module @service
import { openWebview } from "zmp-sdk/apis"; 

export interface NewsItemProps {
    data: Article;
}

const Wrapper = styled.div`
    ${tw`flex flex-col h-full bg-transparent overflow-hidden`}; 
    position: relative;
    cursor: pointer;
`;

const ContentBox = styled(Box)`
    ${tw`flex-1 p-2 overflow-hidden`} 
`;

const Thumbnail = styled(Box)`
    ${tw`w-full bg-gray-100 rounded-md relative overflow-hidden`} 
    padding-top: 100%; 

    img {
        ${tw`absolute top-0 left-0 w-full h-full object-cover rounded-md`}
    }
`;

const StyledTitle = styled(Text.Title)`
    ${tw`mt-0 mb-1`}; 
    font-size: 11px; 
    line-height: 1.3; 

    text-overflow: ellipsis; 
    overflow: hidden; 
    display: -webkit-box;
    -webkit-line-clamp: 3; 
    -webkit-box-orient: vertical;
    white-space: normal; 
    word-break: break-word; 
`;

const NewsItem: FC<NewsItemProps> = props => {
    const { data } = props;
    const { thumb, title, link } = data;

    const openNewsItem = useCallback(() => {
        if (!link) return;
        try {
            // Sử dụng hàm chuẩn của Zalo Mini App
            openWebview({
                url: link,
                config: {
                    style: "normal",
                    leftButton: "back"
                }
            });
        } catch (err) {
            console.error("ERR: ", err);
        }
    }, [link]);

    return (
        <Wrapper role="presentation" onClick={openNewsItem}>
            <Thumbnail>
                <img src={thumb} alt={title} />
            </Thumbnail>
            
            <ContentBox flex flexDirection="column">
                <StyledTitle>{title}</StyledTitle> 
            </ContentBox>
        </Wrapper>
    );
};

export default NewsItem;