import React, { FC, useEffect, useState, useRef } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { Box, Text } from "zmp-ui";
import { Article } from "@dts";
import NewsList from "./NewsList";

export interface NewsProps {}

// 1. Loại bỏ border, shadow, rounded và giảm mb xuống mb-3 theo yêu cầu
const Wrapper = styled(Box)`
    ${tw`bg-white mb-3`}; 
    /* Đã lược bỏ: rounded-lg, shadow-md, border */
`;

const Header = styled(Box)`
    ${tw`flex items-center px-4 pt-2`}
`;

const NewsSection: FC<NewsProps> = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://mini.dno.vn/cchc-cujut/video.php');
                const result = await response.json();

                // Kiểm tra cấu trúc dữ liệu từ API
                if (result?.data?.data?.medias) {
                    const formattedArticles: Article[] = result.data.data.medias.map(item => ({
                        id: item.id,
                        title: item.title,
                        thumb: item.thumb,
                        link: item.link_view,
                        createdAt: new Date(item.create_date),
                        total_view: item.total_view,
                        total_share: item.total_share,
                        total_like: item.total_like,
                    }));
                    setArticles(formattedArticles);
                }
            } catch (error) {
                console.error("Failed to fetch news:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    return (
        <Wrapper> 
            <Header>
                {/* SỬA LỖI: Đổi "medium" thành "large" hoặc "normal" 
                   để khớp với Type definition của zmp-ui 
                */}
                <Text.Title size="large">Video</Text.Title>
            </Header>
            <NewsList ref={listRef} loading={loading} data={articles} />
        </Wrapper>
    );
};

export default NewsSection;