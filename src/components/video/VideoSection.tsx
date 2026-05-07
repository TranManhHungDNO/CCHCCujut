import React, { FC, useEffect, useState, useRef } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { Box, Text } from "zmp-ui";
import { Article } from "@dts";
import VideoList from "./VideoList"; 

export interface VideoProps {}

// THAY ĐỔI: Loại bỏ border, shadow, rounded và giảm mb xuống mb-3
const Wrapper = styled(Box)`
    ${tw`bg-white mb-3`}; /* Loại bỏ rounded-lg, shadow-md, border */
`;

const Header = styled(Box)`
    ${tw`flex items-center px-4 pt-2`}
`;

const VideoSection: FC<VideoProps> = () => {
    const [videos, setVideos] = useState<Article[]>([]); 
    const [loading, setLoading] = useState(true);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://mini.dno.vn/cchc-cujut/index.php');
                const result = await response.json();

                if (result?.data?.data?.medias) {
                    const formattedVideos: Article[] = result.data.data.medias.map(item => ({
                        id: item.id,
                        title: item.title,
                        thumb: item.thumb,
                        link: item.link_view,
                        createdAt: new Date(item.create_date),
                        total_view: item.total_view,
                        total_share: item.total_share,
                        total_like: item.total_like,
                    }));
                    setVideos(formattedVideos);
                }
            } catch (error) {
                console.error("Failed to fetch videos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    return (
        <Wrapper> 
                        <VideoList ref={listRef} loading={loading} data={videos} />
        </Wrapper>
    );
};

export default VideoSection;