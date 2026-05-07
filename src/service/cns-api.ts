const BASE_API = "https://cns.dno.vn/api.php";

// Hàm bổ trợ để xử lý phản hồi từ server
const handleResponse = async (res: Response) => {
  if (!res.ok) {
    throw new Error(`Lỗi kết nối: ${res.status}`);
  }
  return await res.json();
};

export const getGroups = async () => {
  try {
    const res = await fetch(`${BASE_API}?action=get_groups`);
    return await handleResponse(res);
  } catch (error) {
    console.error("Lỗi lấy danh sách tổ:", error);
    return []; // Trả về mảng rỗng để App không bị crash
  }
};

export const getGroupDetail = async (groupName: string) => {
  try {
    const res = await fetch(`${BASE_API}?action=get_group_detail&to=${encodeURIComponent(groupName)}`);
    return await handleResponse(res);
  } catch (error) {
    console.error("Lỗi lấy chi tiết tổ:", error);
    return null;
  }
};

export const getMemberProfile = async (id: string | number) => {
  try {
    const res = await fetch(`${BASE_API}?action=get_profile&id=${id}`);
    return await handleResponse(res);
  } catch (error) {
    console.error("Lỗi lấy profile:", error);
    return null;
  }
};