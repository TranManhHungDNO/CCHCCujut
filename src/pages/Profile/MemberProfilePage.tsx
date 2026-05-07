import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Text, Spinner, Icon, Button } from "zmp-ui";
import { openPhone, openWebview } from "zmp-sdk/apis"; // IMPORT thêm openWebview
import PageLayout from "@components/layout/PageLayout";
import BottomNavigationPage from "../Home/BottomNavigationPage";

const MemberProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const memberId = location.state?.memberId;

  const [member, setMember] = useState<any>(null);
  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [suggestedGroups, setSuggestedGroups] = useState<any[]>([]);

  useEffect(() => {
    const fetchFullData = async () => {
      if (!memberId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const resProfile = await fetch(`https://cns.dno.vn/api.php?action=get_profile&id=${memberId}`);
        const profileData = await resProfile.json();
        setMember(profileData);

        const currentGroupName = profileData.dia_chi_cns || profileData.ten_to;

        if (currentGroupName) {
          const resGroup = await fetch(`https://cns.dno.vn/api.php?action=get_group_detail&to=${encodeURIComponent(currentGroupName)}`);
          if (resGroup.ok) {
            const groupData = await resGroup.json();
            const otherMembers = (groupData.members || []).filter((m: any) => String(m.id) !== String(memberId));
            setGroupMembers(otherMembers);
          }
        }

        const resAllGroups = await fetch(`https://cns.dno.vn/api_cns.php`);
        const groupResult = await resAllGroups.json();
        let rawGroups = Array.isArray(groupResult) ? groupResult : (groupResult.items || groupResult.data || []);

        const others = rawGroups
          .filter((g: any) => g.ten_to !== currentGroupName)
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        setSuggestedGroups(others);

      } catch (error) {
        console.error("Lỗi fetch dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFullData();
  }, [memberId]);

  // HÀM GỌI ĐIỆN
  const handleCall = async (phone: string) => {
    try {
      await openPhone({ phoneNumber: phone });
    } catch (error) {
      window.location.href = `tel:${phone}`;
    }
  };

  // CẬP NHẬT: HÀM MỞ ZALO CHUẨN BÀI QUA SDK
  const handleOpenZalo = async (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '').replace(/^0+/, '');
    const url = `https://zalo.me/84${cleanPhone}`;
    try {
      // Dùng openWebview để Zalo App tự xử lý link
      await openWebview({
        url: url,
        config: {
          style: "normal",
        }
      });
    } catch (e) {
      // Fallback cho PC hoặc khi SDK lỗi
      window.open(url, "_blank");
    }
  };

  const goToGroupDetail = (groupName: string) => {
    navigate("/cns-group", { state: { groupName } });
  };

  if (loading) return <PageLayout title="Đang tải..."><Box flex justifyContent="center" mt={10}><Spinner /></Box></PageLayout>;

  return (
    <PageLayout title="Hồ sơ thành viên">
      <Box p={4} style={{ paddingTop: "60px" }}>
        
        {/* CARD 1: THÔNG TIN CÁ NHÂN */}
        <Box style={{ backgroundColor: "white", padding: "24px 16px", borderRadius: "16px", textAlign: "center", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <Box style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#eff6ff", display: "inline-flex", justifyContent: "center", alignItems: "center", marginBottom: "16px", border: "2px solid #3b82f6" }}>
            <Icon icon="zi-user" size={40} style={{ color: "#3b82f6" }} />
          </Box>
          
          <Text bold style={{ fontSize: "20px", color: "#1f2937" }}>{member?.ho_ten}</Text>
          <Text style={{ color: "#2563eb", fontWeight: "600", marginTop: "4px" }}>
            {member?.chuc_danh_cns || "Thành viên"}
          </Text>

          {member?.chuc_vu_thon && (
            <Box mt={1} style={{ backgroundColor: "#f3f4f6", display: "inline-block", padding: "2px 12px", borderRadius: "20px" }}>
              <Text size="xSmall" style={{ color: "#4b5563" }}>{member.chuc_vu_thon}</Text>
            </Box>
          )}
          
          <Box flex style={{ gap: "12px", marginTop: "24px" }}>
            <Button 
              fullWidth 
              onClick={() => handleCall(member?.so_dien_thoai)} 
              style={{ backgroundColor: "#16a34a" }}
              prefixIcon={<Icon icon="zi-call" />}
            >
              Gọi điện
            </Button>
            
            {/* Nút Zalo Chat dùng onClick xử lý qua API */}
            <Button 
              fullWidth 
              onClick={() => handleOpenZalo(member?.so_dien_thoai)}
              prefixIcon={<Icon icon="zi-chat" />}
            >
              Zalo Chat
            </Button>
          </Box>
        </Box>

        {/* CARD 2: CHI TIẾT TỔ */}
        <Box style={{ marginTop: "16px", backgroundColor: "white", borderRadius: "16px", padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
           <Box flex justifyContent="space-between" alignItems="center" onClick={() => (member?.dia_chi_cns || member?.ten_to) && goToGroupDetail(member.dia_chi_cns || member.ten_to)} style={{ cursor: "pointer" }}>
              <Text style={{ color: "#6b7280" }}>Thuộc tổ</Text>
              <Box flex alignItems="center">
                <Text bold style={{ color: "#1d4ed8" }}>{member?.dia_chi_cns || member?.ten_to}</Text>
                <Icon icon="zi-chevron-right" size={14} style={{ color: "#1d4ed8", marginLeft: "4px" }} />
              </Box>
           </Box>
        </Box>

        {/* CARD 3: THÀNH VIÊN CÙNG TỔ */}
        {groupMembers.length > 0 && (
          <Box style={{ marginTop: "24px" }}>
            <Text bold style={{ color: "#6b7280", textTransform: "uppercase", fontSize: "12px", marginBottom: "12px", letterSpacing: "1px" }}>
              Thành viên cùng tổ ({groupMembers.length})
            </Text>
            {groupMembers.map((gm: any) => (
              <Box key={gm.id} onClick={() => navigate("/cns-profile", { state: { memberId: gm.id }, replace: true })} style={{ backgroundColor: "white", padding: "12px", borderRadius: "16px", marginBottom: "12px", display: "flex", alignItems: "center", border: "1px solid #f3f4f6" }}>
                <Box style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "12px" }}>
                  <Icon icon="zi-user" style={{ color: "#3b82f6" }} />
                </Box>
                <Box style={{ flex: 1 }}>
                  <Text bold style={{ fontSize: "14px" }}>{gm.ho_ten}</Text>
                  <Text style={{ fontSize: "11px", color: "#6b7280" }}>{gm.chuc_danh_cns}</Text>
                </Box>
                <Icon icon="zi-chevron-right" size={16} style={{ color: "#d1d5db" }} />
              </Box>
            ))}
          </Box>
        )}

        {/* CARD 4: GỢI Ý CÁC TỔ KHÁC */}
        {suggestedGroups.length > 0 && (
          <Box style={{ marginTop: "24px", marginBottom: "40px" }}>
            <Text bold style={{ color: "#6b7280", textTransform: "uppercase", fontSize: "12px", marginBottom: "12px" }}>Gợi ý các tổ khác</Text>
            <Box style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {suggestedGroups.map((g, idx) => (
                <Box key={idx} onClick={() => goToGroupDetail(g.ten_to)} style={{ backgroundColor: "white", padding: "16px", borderRadius: "16px", border: "1px solid #e5e7eb", textAlign: "center" }}>
                  <Icon icon="zi-group" style={{ color: "#16a34a", marginBottom: "8px" }} />
                  <Text bold style={{ fontSize: "12px", display: "block" }}>{g.ten_to}</Text>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
      <BottomNavigationPage />
    </PageLayout>
  );
};

export default MemberProfilePage;