import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Text, Spinner, Icon, Button, Input } from "zmp-ui";
import { openPhone } from "zmp-sdk/apis";
import PageLayout from "@components/layout/PageLayout";
import BottomNavigationPage from "../Home/BottomNavigationPage";

const ITEMS_PER_PAGE = 15;

const GroupListPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // 1. Logic Fetch dữ liệu đầy đủ các trường hợp API
  useEffect(() => {
    const fetchAllGroups = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);
        
        const response = await fetch(`https://cns.dno.vn/api_cns.php`);
        if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);
        
        const result = await response.json();

        // Xử lý linh hoạt các cấu trúc JSON trả về khác nhau
        if (Array.isArray(result)) {
          setData(result);
        } else if (result && result.items) {
          setData(result.items);
        } else if (result && result.data) {
          setData(result.data);
        } else {
          throw new Error("Không tìm thấy danh sách tổ.");
        }
      } catch (error: any) {
        setErrorMsg("Lỗi tải dữ liệu. Vui lòng thử lại sau.");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllGroups();
  }, []);

  // 2. Logic lọc tìm kiếm theo tên tổ hoặc người đại diện
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const lowerQuery = searchQuery.toLowerCase();
    return data.filter((item) => 
      (item.ten_to && item.ten_to.toLowerCase().includes(lowerQuery)) ||
      (item.dai_dien && item.dai_dien.toLowerCase().includes(lowerQuery))
    );
  }, [data, searchQuery]);

  // Reset lại số lượng hiển thị khi tìm kiếm
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchQuery]);

  // 3. Logic phân trang (Paginated)
  const paginatedGroups = useMemo(() => {
    return filteredGroups.slice(0, visibleCount);
  }, [filteredGroups, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const handleGoToDetail = (groupName: string) => {
    navigate("/cns-group", { state: { groupName } });
  };

  // 4. Logic gọi điện bằng SDK (với Fallback)
  const handleCall = async (e: React.MouseEvent, phone: string) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài thẻ cha
    try {
      await openPhone({ phoneNumber: phone });
    } catch (error) {
      console.error("Lỗi SDK Gọi điện, dùng fallback:", error);
      window.location.href = `tel:${phone}`;
    }
  };

  // 5. Logic mở Zalo Link
  const handleZalo = (e: React.MouseEvent, link: string) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài thẻ cha
    if (link) {
      window.open(link, "_blank");
    }
  };

  return (
    <PageLayout title="Tổ công nghệ số cộng đông">
      {/* Box chính dịch xuống để không bị Banner che */}
      <Box p={4} style={{ paddingTop: "60px" }}>
        
        {/* THANH TÌM KIẾM */}
        <Box mb={4}>
          <Input.Search
            placeholder="Tìm tên tổ hoặc đại diện..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
          />
        </Box>

        {/* XỬ LÝ HIỂN THỊ: LỖI / LOADING / TRỐNG / DANH SÁCH */}
        {errorMsg ? (
          <Box style={{ backgroundColor: "#fef2f2", padding: "16px", borderRadius: "12px", border: "1px solid #fecaca" }}>
            <Text bold style={{ color: "#b91c1c" }}>⚠️ Lỗi: {errorMsg}</Text>
          </Box>
        ) : loading ? (
          <Box flex flexDirection="column" alignItems="center" justifyContent="center" mt={10}>
            <Spinner />
            <Text style={{ marginTop: "12px", color: "#6b7280" }}>Đang tải dữ liệu...</Text>
          </Box>
        ) : filteredGroups.length === 0 ? (
          <Box flex alignItems="center" justifyContent="center" mt={10}>
            <Text style={{ color: "#6b7280" }}>Không tìm thấy tổ nào phù hợp.</Text>
          </Box>
        ) : (
          <Box pb={24}> {/* Cách Bottom Navigation một khoảng an toàn */}
            {paginatedGroups.map((item: any, index: number) => (
              <Box 
                key={index} 
                onClick={() => handleGoToDetail(item.ten_to)}
                style={{ 
                  backgroundColor: "white", 
                  borderRadius: "16px", 
                  padding: "16px", 
                  marginBottom: "16px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  border: "1px solid #f3f4f6"
                }}
              >
                {/* Phần Tiêu đề Tổ & Đánh giá */}
                <Box flex justifyContent="space-between" alignItems="flex-start" pb={3} style={{ borderBottom: "1px solid #f9fafb" }}>
                  <Box>
                    <Text size="large" bold style={{ color: "#1d4ed8", lineHeight: "1.2", marginBottom: "4px" }}>
                      {item.ten_to}
                    </Text>
                    <Text size="xSmall" style={{ color: "#f59e0b", fontWeight: "500" }}>
                      Đánh giá: {item.sao || "⭐"}
                    </Text>
                  </Box>
                  <Icon icon="zi-chevron-right" style={{ color: "#9ca3af" }} />
                </Box>
                
                {/* Phần Người đại diện */}
                <Box flex alignItems="center" mt={3} mb={4}>
                  <Box style={{ width: "44px", height: "44px", backgroundColor: "#eff6ff", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", marginRight: "12px" }}>
                    <Icon icon="zi-user" style={{ color: "#3b82f6" }} />
                  </Box>
                  <Box>
                    <Text bold style={{ color: "#1f2937", fontSize: "15px" }}>
                      {item.dai_dien || "Chưa cập nhật tên"}
                    </Text>
                    <Text size="xSmall" style={{ backgroundColor: "#f3f4f6", color: "#4b5563", padding: "2px 6px", borderRadius: "4px", display: "inline-block", marginTop: "4px" }}>
                      {item.chuc_vu || "Thành viên"}
                    </Text>
                  </Box>
                </Box>

                {/* Phần Số điện thoại & Các nút hành động */}
                <Box flex justifyContent="space-between" alignItems="center">
                  <Box flex alignItems="center">
                    <Icon icon="zi-call" size={16} style={{ color: "#9ca3af", marginRight: "6px" }} />
                    <Text size="small" style={{ color: "#4b5563", fontWeight: "500" }}>
                      {item.sdt || "Chưa có SĐT"}
                    </Text>
                  </Box>
                  
                  <Box flex>
                    {item.sdt && (
                      <Button 
                        size="small" 
                        onClick={(e) => handleCall(e, item.sdt)}
                        style={{ marginRight: "8px", backgroundColor: "#dcfce7", color: "#166534", border: "none", borderRadius: "8px" }}
                      >
                        Gọi
                      </Button>
                    )}
                    
                  </Box>
                </Box>
              </Box>
            ))}

            {/* NÚT XEM THÊM */}
            {visibleCount < filteredGroups.length && (
              <Box flex justifyContent="center" pb={8} mt={2}>
                <Button 
                  variant="secondary" 
                  onClick={handleLoadMore}
                  style={{ borderRadius: "24px", backgroundColor: "white", color: "#2563eb", border: "1px solid #e5e7eb" }}
                >
                  Xem thêm tổ ({filteredGroups.length - visibleCount})
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Thanh Menu dưới cùng cố định */}
      <BottomNavigationPage />
    </PageLayout>
  );
};

export default GroupListPage;