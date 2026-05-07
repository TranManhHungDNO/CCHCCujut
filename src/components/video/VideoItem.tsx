import React, { FC, useCallback } from "react";
import { Avatar, Box, Text, Icon } from "zmp-ui";
import { DateTime } from "@utils";
import styled from "styled-components";
import tw from "twin.macro";
import { Article } from "@dts";
import { openWebView } from "/src/service/zalo";

export interface VideoItemProps {
 data: Article;
}

const Wrapper = styled.div`
 ${tw`flex flex-col h-full bg-transparent overflow-hidden`}; 
 position: relative;
    &:not(:last-child)::after {
        content: none;
    }
    &:not(:first-child) {
        margin-top: 0;
    }
`;

const ContentBox = styled(Box)`
 ${tw`flex-1 p-2 overflow-hidden`} 
`;

const Thumbnail = styled(Box)`
 ${tw`w-full bg-devider_1 rounded-md relative overflow-hidden`} 
 padding-top: 100%; 
    position: relative;
    
 img {
 ${tw`absolute top-0 left-0 w-full h-full object-cover rounded-md`} 
 }
`;

const PlayIcon = styled.div`
    ${tw`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10`}
    width: 0;
    height: 0;
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent;
    border-left: 25px solid rgba(255, 255, 255, 0.9);
    cursor: pointer;
`;

const Overlay = styled.div`
    ${tw`absolute inset-0 bg-black opacity-30 rounded-md z-0`}
`;

const StyledTitle = styled(Text.Title)`
 ${tw`mt-0 mb-1`}; 
 font-size: 11px; /* THAY ĐỔI: Giảm font size từ 13px xuống 11px */
    line-height: 1.3; /* THAY ĐỔI: Rút ngắn khoảng cách giữa các dòng */

    text-overflow: ellipsis; 
    overflow: hidden; 
    display: -webkit-box;
    -webkit-line-clamp: 3; 
    -webkit-box-orient: vertical;
    white-space: normal; 
    word-break: break-word; 
`;

const VideoItem: FC<VideoItemProps> = props => {
 const { data } = props;
 const { thumb, title, link } = data;

 const openVideoItem = useCallback(() => {
 if (!link) return;
 try {
            openWebView({
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
 <Wrapper role="presentation" onClick={openVideoItem}>
 <Thumbnail>
                <img src={thumb} alt={title} />
                <Overlay />
                <PlayIcon />
            </Thumbnail>

 <ContentBox flex flexDirection="column">
<StyledTitle>{title}</StyledTitle> 
 </ContentBox>
 </Wrapper>
 );
};

export default VideoItem;