import React, { useState, useEffect } from "react";
import { Box, Icon, Text, Select, useSnackbar, useNavigate } from "zmp-ui";
import tw from "twin.macro";
import "styled-components/macro";
import { Button, DatePicker, Input, TextArea } from "@components";
import { useStore } from "@store";
import { useForm, Controller } from "react-hook-form";
import { isValidPhoneNumber } from "@utils/string";
import { getUserInfo } from "zmp-sdk/apis";

const { Option } = Select;

// Dữ liệu danh sách lãnh đạo chuẩn
const LEADERS = [
    { id: 1, name: "Ngô Quốc Phong", role: "Chủ tịch UBND xã" },
    { id: 2, name: "Đỗ Đăng Khoa", role: "PCT UBND xã (Kinh tế)" },
    { id: 3, name: "Nguyễn Anh Sơn", role: "PCT UBND xã (Văn hóa)" }
];

export const CreateScheduleForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [dateValue, setDateValue] = useState<Date>(new Date());
    const [zaloInfo, setZaloInfo] = useState({ id: "", name: "", avatar: "" });

    const navigate = useNavigate();
    const { openSnackbar } = useSnackbar();
    
    const getSchedule = useStore(state => state.getSchedule);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm({ mode: "onChange" });

    // 1. LẤY THÔNG TIN ZALO
    useEffect(() => {
        const fetchZaloData = async () => {
            try {
                const { userInfo } = await getUserInfo({});
                setZaloInfo({
                    id: userInfo.id,
                    name: userInfo.name,
                    avatar: userInfo.avatar
                });
                setValue("fullName", userInfo.name);
            } catch (error) {
                console.error("Lỗi lấy thông tin Zalo:", error);
            }
        };
        fetchZaloData();
    }, [setValue]);

    // 2. XỬ LÝ GỬI FORM - CHỖ NÀY SẼ GHI ĐÈ LỊCH CŨ TRÊN DATABASE
    const onSubmit = async (data) => {
        setIsLoading(true);
        const { fullName, phoneNumber, content, timeSlot, leaderId } = data;
        
        const selectedLeader = LEADERS.find(l => l.id.toString() === leaderId);

        const offset = dateValue.getTimezoneOffset();
        const appointment_date = new Date(dateValue.getTime() - (offset * 60 * 1000))
            .toISOString()
            .split('T')[0];

        const payload = {
            zalo_user_id: zaloInfo.id,
            zalo_name: zaloInfo.name,
            zalo_avatar: zaloInfo.avatar,
            full_name: fullName,
            phone: phoneNumber,
            leader_id: selectedLeader?.id,
            leader_name: selectedLeader?.name,
            leader_role: selectedLeader?.role,
            content: content,
            appointment_date: appointment_date,
            time_slot: timeSlot,
            // Thêm flag để báo cho Backend biết đây là tạo mới ghi đè
            overwrite: true 
        };

        try {
            const response = await fetch("https://bachkhoaict.com/lich/api.php?action=create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.success) {
                openSnackbar({ type: "success", text: "Đặt lịch mới thành công!" });
                
                // Cập nhật lại Store ngay lập tức để trang Result lấy được data mới
                if(getSchedule) await getSchedule(); 
                
                // Chuyển hướng về trang kết quả
                navigate("/schedule-appointment-result", {
                    replace: true,
                    animate: true,
                });
            } else {
                openSnackbar({ type: "error", text: result.message || "Không thể đặt lịch." });
            }
        } catch (error) {
            openSnackbar({ type: "error", text: "Lỗi kết nối mạng!" });
        } finally {
            setIsLoading(false);
        }
    };

    const getErrorMessage = (field: string) => {
        if (errors[field]) {
            const mapNames: any = {
                fullName: "Họ và tên",
                phoneNumber: "Số điện thoại",
                content: "Nội dung",
                timeSlot: "Buổi làm việc",
                leaderId: "Lãnh đạo"
            };
            if (errors[field]?.type === "required") return `${mapNames[field]} không được để trống`;
            return `${mapNames[field]} không hợp lệ`;
        }
        return "";
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box tw="bg-white">
                <Box p={4}>
                    <Text tw="text-red-600 font-bold text-center mb-1">TẠO LỊCH HẸN MỚI</Text>
                    <Text tw="text-text_2 text-center text-xs">
                        (Lịch mới sẽ thay thế lịch cũ của bạn trên hệ thống)
                    </Text>
                </Box>
                <Box px={3}>
                    <DatePicker
                        inline
                        minDate={new Date()}
                        onChange={date => { if (date) setDateValue(date); }}
                        selected={dateValue}
                    />
                </Box>
            </Box>

            <Box p={4} mt={4} tw="bg-white">
                <Box>
                    <Controller
                        name="timeSlot"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Select
                                label="Thời gian làm việc*"
                                placeholder="Chọn buổi làm việc"
                                value={field.value}
                                onChange={field.onChange}
                                status={errors?.timeSlot ? "error" : "default"}
                                errorText={getErrorMessage("timeSlot")}
                            >
                                <Option value="Sáng (07h30-11h30)" title="Sáng (07h30-11h30)" />
                                <Option value="Chiều (13h30-17h30)" title="Chiều (13h30-17h30)" />
                            </Select>
                        )}
                    />
                </Box>
                <Box mt={4}>
                    <Controller
                        name="leaderId"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Select
                                label="Liên hệ ai?*"
                                placeholder="Chọn Lãnh đạo cần làm việc"
                                value={field.value}
                                onChange={field.onChange}
                                status={errors?.leaderId ? "error" : "default"}
                                errorText={getErrorMessage("leaderId")}
                            >
                                {LEADERS.map(leader => (
                                    <Option 
                                        key={leader.id} 
                                        value={leader.id.toString()} 
                                        title={`${leader.role} - ${leader.name}`} 
                                    />
                                ))}
                            </Select>
                        )}
                    />
                </Box>
                <Box mt={4}>
                    <Input
                        label="Họ và Tên*"
                        errorText={getErrorMessage("fullName")}
                        placeholder="Nhập Họ và Tên"
                        status={errors?.fullName ? "error" : "default"}
                        {...register("fullName", { required: true })}
                    />
                </Box>
                <Box mt={4}>
                    <Input
                        label="Số điện thoại*"
                        type="number"
                        errorText={getErrorMessage("phoneNumber")}
                        placeholder="Nhập số điện thoại"
                        status={errors?.phoneNumber ? "error" : "default"}
                        {...register("phoneNumber", {
                            required: true,
                            validate: value => isValidPhoneNumber(value),
                        })}
                    />
                </Box>
                <Box mt={4}>
                    <TextArea
                        label="Nội dung/Lý do làm việc*"
                        errorText={getErrorMessage("content")}
                        status={errors?.content ? "error" : "default"}
                        placeholder="Trình bày rõ mục đích làm việc..."
                        {...register("content", { required: true })}
                    />
                </Box>
            </Box>

            <Box p={4} mt={4} tw="bg-white mb-8">
                <Button
                    htmlType="submit"
                    fullWidth
                    suffixIcon={<Icon icon="zi-chevron-right" />}
                    loading={isLoading}
                >
                    XÁC NHẬN ĐẶT LỊCH MỚI
                </Button>
            </Box>
        </form>
    );
};