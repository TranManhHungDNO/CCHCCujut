import React, { useEffect, useState, useRef } from "react";
import { Box, Text, Spinner, Page } from "zmp-ui";
import PageLayout from "@components/layout/PageLayout";
import BottomNavigationPage from "../Home/BottomNavigationPage";

// IMPORT THÊM CHO GIAO DIỆN VIDEO
import styled from "styled-components";
import { PlayCircle } from "@phosphor-icons/react";

// --- 1. STYLED COMPONENTS (CSS) ---

// Xóa StyledPage cũ vì PageLayout đã lo phần Header xanh rồi
const VideoContainer = styled(Box)`
  padding-top: 0px; 
`;

const PlayerContainer = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: #000;
  z-index: 10;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  /* Không cần margin-top vì PageLayout đã đẩy content xuống dưới Header xanh rồi */
`;

const ThumbnailPlayer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const ThumbnailImgPlayer = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.8;
`;

const PlayIconWrapperPlayer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ffffff;
`;

const VideoListContainer = styled.div`
  background: #f8fafc;
  padding: 16px;
  padding-bottom: 120px; 
`;

const VideoListItemCard = styled.div`
  display: flex;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
  cursor: pointer;
  border: 1px solid rgba(226, 232, 240, 0.5);
`;

const ThumbnailList = styled.div`
  position: relative;
  width: 120px;
  aspect-ratio: 16 / 9;
  background-color: #000;
  flex-shrink: 0;
`;

const ContentBoxList = styled(Box)`
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`;

// --- 2. COMPONENT PLAYER TRÊN TOP ---
const TopPlayer = ({ video, autoplay }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(autoplay);
  }, [video, autoplay]);

  return (
    <PlayerContainer>
      {isPlaying && video ? (
        video.video_type === "youtube" ? (
          <iframe
            width="100%"
            height="100%"
            src={`${video.video_url}${video.video_url.includes('?') ? '&' : '?'}autoplay=1`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <video width="100%" height="100%" controls autoPlay>
            <source src={video.video_url} type="video/mp4" />
          </video>
        )
      ) : video ? (
        <ThumbnailPlayer onClick={() => setIsPlaying(true)}>
          <ThumbnailImgPlayer src={video.thumbnail} alt="thumb" />
          <PlayIconWrapperPlayer>
            <PlayCircle size={56} weight="fill" />
          </PlayIconWrapperPlayer>
        </ThumbnailPlayer>
      ) : (
        <Box flex justifyContent="center" alignItems="center" height="100%"><Spinner visible /></Box>
      )}
    </PlayerContainer>
  );
};

// --- 3. COMPONENT CHÍNH ---
const InformationGuidePage = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [autoplay, setAutoplay] = useState(false);

  useEffect(() => {
    fetch("https://mini.dno.vn/cchc-cujut/videos.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.channel?.items) {
          const valid = data.channel.items.filter(i => i.video_url);
          setVideos(valid);
          if (valid.length > 0) setCurrentVideo(valid[0]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (video) => {
    setCurrentVideo(video);
    setAutoplay(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    // Dùng title ở đây để PageLayout tự vẽ Header xanh kèm ảnh nền giống trang bản đồ
    <PageLayout title="Báo và PTTH Lâm Đồng">
      <Page className="bg-gray-100">
        {/* KHÔNG DÙNG <Header /> CỦA Zalo UI Ở ĐÂY NỮA VÌ PAGELAYOUT ĐÃ CÓ RỒI */}
        
        {loading ? (
          <Box flex justifyContent="center" alignItems="center" style={{ height: "100vh" }}>
            <Spinner visible />
          </Box>
        ) : (
          <VideoContainer>
            {/* KHUNG PHÁT VIDEO */}
            <TopPlayer video={currentVideo} autoplay={autoplay} />
            
            {/* DANH SÁCH VIDEO */}
            <VideoListContainer>
              <Text bold size="normal" className="mb-4 text-blue-800" style={{fontSize: "16px"}}>
                DANH SÁCH VIDEO MỚI
              </Text>
              
              {videos
                .filter(v => v.link !== currentVideo?.link)
                .map((item, index) => (
                  <VideoListItemCard key={index} onClick={() => handleSelect(item)}>
                    <ThumbnailList>
                      <img src={item.thumbnail} style={{width: '100%', height: '100%', objectFit: 'cover'}} alt="thumb" />
                      <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', color:'#fff', opacity: 0.9}}>
                        <PlayCircle size={28} weight="fill" />
                      </div>
                    </ThumbnailList>
                    
                    <ContentBoxList>
                      <Text bold size="small" className="line-clamp-2" style={{lineHeight: "1.4", color: "#1a202c"}}>
                        {item.title}
                      </Text>
                      <Text size="xxxSmall" className="text-gray-500" style={{marginTop: "4px"}}>
                        📅 {item.pubDate}
                      </Text>
                    </ContentBoxList>
                  </VideoListItemCard>
                ))}
            </VideoListContainer>
          </VideoContainer>
        )}
        
        <BottomNavigationPage />
      </Page>
    </PageLayout>
  );
};

export default InformationGuidePage;