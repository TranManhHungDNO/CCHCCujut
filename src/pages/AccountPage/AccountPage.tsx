
import React, { useEffect, useState } from "react";
import { Page, Box, Text, Avatar, Button, Icon, useSnackbar } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import { authorize, getUserInfo, getPhoneNumber } from "zmp-sdk/apis";

// Giao diện Header Xanh
const HeaderBackground = styled(Box)`
  ${tw`w-full p-4 pb-16`};
  background: linear-gradient(135deg, #0068ff 0%, #00c6ff 100%);
`;

// Card thông tin nổi lên trên Header
const UserCard = styled(Box)`
  ${tw`bg-white rounded-xl shadow-md p-4 flex items-center gap-4 mx-4 -mt-10 relative z-10`};
`;

const AccountPage: React.FC = () => {
  const snackbar = useSnackbar();
  const [user, setUser] = useState<any>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. Load dữ liệu cũ từ LocalStorage khi mở trang (nếu có)
  useEffect(() => {
    const cachedUser = localStorage.getItem("current_user");
    if (cachedUser) {
      const parsed = JSON.parse(cachedUser);
      setUser(parsed.info);
      setPhone(parsed.phone);
    }
  }, []);

  // 2. Xử lý xin quyền (authorize) và lấy dữ liệu
  const handleAuthorizeAndGetInfo = async () => {
    setLoading(true);
    try {
      // BƯỚC A: Gọi authorize để xin quyền (Gom chung Tên/Avatar và SĐT vào 1 lần hỏi)
      const data = await authorize({
        scopes: ["scope.userInfo", "scope.userPhonenumber"], 
      });

      let currentUserInfo = user;
      let currentPhone = phone;

      // BƯỚC B: Nếu đồng ý cho userInfo -> Lấy Avatar + Tên
      if (data["scope.userInfo"]) {
        const { userInfo } = await getUserInfo({});
        currentUserInfo = userInfo;
        setUser(userInfo);
      }

      // BƯỚC C: Nếu đồng ý cho userPhonenumber -> Lấy Số điện thoại
      if (data["scope.userPhonenumber"]) {
        const response = await getPhoneNumber({});
        // Zalo SDK mới trả về token, xử lý lấy number hoặc token để hiển thị tạm
        currentPhone = response.number || response.token; 
        setPhone(currentPhone);
      }

      // Lưu lại vào LocalStorage
      if (currentUserInfo || currentPhone) {
        localStorage.setItem("current_user", JSON.stringify({ info: currentUserInfo, phone: currentPhone }));
        snackbar.openSnackbar({ type: "success", text: "Cập nhật thông tin thành công!" });
      }

    } catch (error: any) {
      // Bắt lỗi dựa trên đoạn code bạn cung cấp
      const code = error?.code;
      if (code === -201) {
        snackbar.openSnackbar({ type: "error", text: "Người dùng đã từ chối cấp quyền" });
      } else {
        snackbar.openSnackbar({ type: "error", text: "Có lỗi xảy ra, vui lòng thử lại" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page className="bg-gray-50 h-full">
      <Box className="mb-8">
        <HeaderBackground />
        
        <UserCard>
          {user ? (
            // TRẠNG THÁI 1: ĐÃ CÓ THÔNG TIN NGƯỜI DÙNG
            <>
              <Avatar src={user.avatar} size={64} className="border-2 border-gray-100 shadow-sm" />
              <Box className="flex-1">
                <Text.Title className="text-gray-900 text-lg mb-1">{user.name}</Text.Title>
                
                {phone ? (
                  // Có SĐT
                  <Text className="text-gray-500 font-medium text-sm flex items-center gap-1">
                    <Icon icon="zi-call" size={16} /> {phone}
                  </Text>
                ) : (
                  // Có User nhưng chưa có SĐT
                  <Button size="small" variant="secondary" onClick={handleAuthorizeAndGetInfo} loading={loading}>
                    Cung cấp SĐT
                  </Button>
                )}
              </Box>
            </>
          ) : (
            // TRẠNG THÁI 2: CHƯA ĐĂNG NHẬP
            <>
              <Avatar src="" size={64} className="bg-gray-200" />
              <Box className="flex-1">
                <Text.Title className="text-gray-800 text-base mb-2">Bạn chưa đăng nhập</Text.Title>
                <Button size="small" onClick={handleAuthorizeAndGetInfo} loading={loading}>
                  Đăng nhập Zalo
                </Button>
              </Box>
            </>
          )}
        </UserCard>
      </Box>
    </Page>
  );
};

export default AccountPage;