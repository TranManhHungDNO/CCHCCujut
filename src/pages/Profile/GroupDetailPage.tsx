import { openPhone } from "zmp-sdk/apis";
import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Text, Spinner, Icon, Button, Input } from "zmp-ui";
import PageLayout from "@components/layout/PageLayout";
import BottomNavigationPage from "../Home/BottomNavigationPage";

const GroupDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const groupName = location.state?.groupName; 
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchMember, setSearchMember] = useState("");

  // 1. Logic Fetch dữ liệu chi tiết tổ
  useEffect(() => {
    const fetchGroupDetail = async () => {
      if (!groupName) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await fetch(`https://cns.dno.vn/api.php?action=get_group_detail&to=${encodeURIComponent(groupName)}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGroupDetail();
  }, [groupName]);

  // 2. Logic chuyển hướng sang hồ sơ thành viên
  const goToProfile = (memberId: string) => {
    if (!memberId) return;
    navigate("/cns-profile", { state: { memberId } }); 
  };

  // 3. Logic gọi điện bằng SDK
  const handleCall = (phone: string) => {
    openPhone({ phoneNumber: phone });
  };

  // 4. Logic nhắn tin Zalo
  const handleZalo = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const zaloLink = `https://zalo.me/84${cleanPhone.replace(/^0+/, '')}`;
    window.open(zaloLink, "_blank");
  };

  // 5. Logic lọc thành viên theo tên hoặc chức danh
  const filteredMembers = useMemo(() => {
    if (!data?.members) return [];
    return data.members.filter((m: any) =>
      m.ho_ten.toLowerCase().includes(searchMember.toLowerCase()) ||
      (m.chuc_danh_cns && m.chuc_danh_cns.toLowerCase().includes(searchMember.toLowerCase()))
    );
  }, [data, searchMember]);

  return (
    <PageLayout title={groupName || "Chi tiết Tổ CNS"}>
      {/* Box chứa nội dung chính, dịch xuống 60px để không bị Banner đè */}
      <Box p={4} style={{ paddingTop: "60px" }}>
        
        {/* THANH TÌM KIẾM THÀNH VIÊN */}
        <Box mb={4}>
          <Input.Search
            placeholder="Tìm tên hoặc chức danh..."
            value={searchMember}
            onChange={(e) => setSearchMember(e.target.value)}
            allowClear
          />
        </Box>

        {loading ? (
          <Box flex justifyContent="center" mt={10}>
            <Spinner />
          </Box>
        ) : (
          <Box pb={24}> {/* pb-24 để không bị Menu dưới che khuất nội dung cuối */}
            <Text size="small" style={{ color: "#666", marginBottom: "12px" }}>
              Danh sách {filteredMembers.length} thành viên
            </Text>

            {filteredMembers.map((member: any, index: number) => {
              const isLeader = member.chuc_danh_cns?.toLowerCase().includes("tổ trưởng");
              const isSubLeader = member.chuc_danh_cns?.toLowerCase().includes("tổ phó");

              return (
                <Box
                  key={index}
                  onClick={() => goToProfile(member.id)}
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    padding: "16px",
                    marginBottom: "16px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    border: "1px solid #f0f0f0",
                    cursor: "pointer"
                  }}
                >
                  {/* Khu vực Avatar và Tên */}
                  <Box flex alignItems="center" mb={3}>
                    <Box
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        background: isLeader ? "#fff7ed" : isSubLeader ? "#eff6ff" : "#f3f4f6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "12px"
                      }}
                    >
                      <Icon 
                        icon="zi-user" 
                        style={{ color: isLeader ? "#f97316" : isSubLeader ? "#3b82f6" : "#9ca3af" }} 
                      />
                    </Box>

                    <Box style={{ flex: 1 }}>
                      <Text bold style={{ fontSize: "16px", color: "#111827" }}>
                        {member.ho_ten}
                      </Text>
                      <Box mt={1}>
                        <span style={{
                          fontSize: "12px",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          background: isLeader ? "#ffedd5" : isSubLeader ? "#dbeafe" : "#f1f5f9",
                          color: isLeader ? "#9a3412" : isSubLeader ? "#1e40af" : "#475569"
                        }}>
                          {member.chuc_danh_cns || "Thành viên"}
                        </span>
                      </Box>
                    </Box>
                    <Icon icon="zi-chevron-right" style={{ color: "#d1d5db" }} />
                  </Box>

                  {/* Nút hành động nhanh (Gọi/Zalo) */}
                  {member.so_dien_thoai && (
                    <Box flex style={{ gap: "8px", borderTop: "1px dashed #eee", paddingTop: "12px" }}>
                      <Button
                        fullWidth
                        size="small"
                        variant="secondary"
                        prefixIcon={<Icon icon="zi-call" />}
                        onClick={(e) => { 
                          e.stopPropagation(); // Không cho nhảy vào Profile khi bấm nút gọi
                          handleCall(member.so_dien_thoai); 
                        }}
                        style={{ borderRadius: "8px", backgroundColor: "#ecfdf5", color: "#059669", border: "none" }}
                      >
                        Gọi điện
                      </Button>
                      
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

      {/* Menu điều hướng dưới cùng */}
      <BottomNavigationPage />
    </PageLayout>
  );
};

export default GroupDetailPage;