import { getUserInfo, getPhoneNumber } from "zmp-sdk/apis";

export const UserService = {
  // 1. Lấy thông tin cơ bản (Avatar, Name)
  async fetchUserInfo() {
    try {
      const { userInfo } = await getUserInfo({});
      return userInfo;
    } catch (error) {
      console.error("Không lấy được thông tin user:", error);
      return null;
    }
  },

  // 2. Lấy số điện thoại (Cần xin quyền từ người dùng)
  async fetchUserPhone() {
    try {
      const { number } = await getPhoneNumber({});
      return number;
    } catch (error) {
      console.error("Người dùng từ chối cung cấp SĐT:", error);
      return null;
    }
  },

  // 3. Lưu User vào Local Storage để dùng offline
  saveLocalUser(user: any) {
    localStorage.setItem("current_user", JSON.stringify(user));
  },

  getLocalUser() {
    const user = localStorage.getItem("current_user");
    return user ? JSON.parse(user) : null;
  }
};