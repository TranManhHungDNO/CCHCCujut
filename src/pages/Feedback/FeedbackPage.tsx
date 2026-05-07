import { Button } from "@components";
import PageLayout from "@components/layout/PageLayout";
import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { Box, Icon, Spinner, Text } from "zmp-ui";
import { openWebview } from "zmp-sdk/apis"; // Import API mở webview
import Background from "@assets/background.png";

const InfoContainer = styled(Box)`
    ${tw`bg-white flex items-center flex-col gap-4 `}
    background-image: url(${Background});
    background-position: center;
    background-repeat: no-repeat;
`;

const Title = styled.div`
    ${tw`text-[15px] text-[#767A7F]`}
`;

const FeedbackCard = styled(Box)`
    ${tw`bg-white p-4 mb-3 rounded-xl border border-gray-100 shadow-sm`}
    &:active {
        ${tw`bg-gray-50`}
    }
`;

const ImageGrid = styled.div`
    ${tw`grid grid-cols-3 gap-2 mt-3`}
`;

const Thumbnail = styled.img`
    ${tw`w-full h-20 object-cover rounded-lg border border-gray-100`}
`;

const FeedbackPage: React.FC = () => {
    const pageRef = useRef<HTMLDivElement>(null);

    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // FETCH DỮ LIỆU TỪ LINK JSON
    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                setLoading(true);
                const response = await fetch("https://bachkhoaict.com/paht/json.php");
                if (!response.ok) throw new Error("Không thể kết nối đến máy chủ");
                
                const data = await response.json();
                
                if (data && data.channel && data.channel.items) {
                    setFeedbacks(data.channel.items);
                } else {
                    setFeedbacks([]);
                }
            } catch (err: any) {
                setError("Không thể tải danh sách phản ánh. Vui lòng kiểm tra kết nối!");
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, []);

    // SỬA TẠI ĐÂY: Mở link gửi phản ánh bên ngoài
    const onSendFeedback = async () => {
        try {
            await openWebview({
                url: "https://bachkhoaict.com/paht/guiphananh.php",
                config: {
                    style: "normal",
                },
            });
        } catch (error) {
            console.error("Lỗi khi mở trang gửi phản ánh:", error);
        }
    };

    // Hàm mở chi tiết bằng Webview
    const goToDetail = async (link: string) => {
        const id = link.split("id=")[1];
        if (id) {
            try {
                await openWebview({
                    url: `https://bachkhoaict.com/paht/detail.php?id=${id}`,
                    config: {
                        style: "normal",
                    },
                });
            } catch (e) {
                console.error("Lỗi mở webview:", e);
            }
        }
    };

    return (
        <PageLayout title="Góp ý - phản ánh" id="feedbacks" ref={pageRef}>
            <InfoContainer p={8} m={0}>
                <Title>Bạn có sự việc cần phản ánh?</Title>
                <Button
                    onClick={onSendFeedback}
                    suffixIcon={<Icon icon="zi-chevron-right" />}
                >
                    Gửi phản ánh
                </Button>
            </InfoContainer>

            <Box p={4}>
                <Text size="large" bold tw="mb-4 text-gray-800">
                    Phản ánh gần đây
                </Text>

                {loading ? (
                    <Box flex justifyContent="center" mt={10}>
                        <Spinner />
                        <Text tw="ml-2 text-gray-500">Đang tải dữ liệu...</Text>
                    </Box>
                ) : error ? (
                    <Box p={4} tw="bg-red-50 rounded-lg">
                        <Text tw="text-red-500 text-center">{error}</Text>
                    </Box>
                ) : feedbacks.length === 0 ? (
                    <Text tw="text-center text-gray-400 mt-10">Chưa có phản ánh nào.</Text>
                ) : (
                    feedbacks.map((item, index) => (
                        <FeedbackCard 
                            key={index} 
                            onClick={() => goToDetail(item.link)}
                        >
                            <Box flex justifyContent="space-between" alignItems="flex-start">
                                <Text bold tw="text-gray-800 flex-1 pr-2">
                                    {item.title}
                                </Text>
                                <Icon icon="zi-chevron-right" size={16} tw="text-gray-400" />
                            </Box>
                            
                            <Text size="small" tw="text-gray-500 mt-1 line-clamp-2">
                                {item.description}
                            </Text>

                            {/* Hiển thị ảnh đính kèm */}
                            {item.images && item.images.length > 0 && (
                                <ImageGrid>
                                    {item.images.slice(0, 3).map((img, idx) => (
                                        <Thumbnail 
                                            key={idx} 
                                            src={`https://bachkhoaict.com/paht/${img}`} 
                                            alt="feedback-img" 
                                        />
                                    ))}
                                </ImageGrid>
                            )}
                            
                            <Box flex mt={3} alignItems="center">
                                <Icon icon="zi-clock-1" size={12} tw="text-gray-400 mr-1" />
                                <Text size="xxxSmall" tw="text-gray-400">
                                    {item.pubDate}
                                </Text>
                                
                                <Box tw="ml-auto px-2 py-0.5 bg-blue-50 rounded text-[10px] text-blue-600">
                                    {item.status || "Mới"}
                                </Box>
                            </Box>
                        </FeedbackCard>
                    ))
                )}
            </Box>
        </PageLayout>
    );
};

export default FeedbackPage;