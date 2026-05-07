import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Box, Icon, Text, Spinner, Button, useSnackbar, useNavigate } from "zmp-ui";
import tw from "twin.macro";
import "styled-components/macro";

import html2canvas from "@xuannghia/html2canvas";
import { saveImage } from "@service/zalo";
import { getUserInfo } from "zmp-sdk/apis";

// Import Layout và Bottom Navigation của anh
import PageLayout from "@components/layout/PageLayout";
import BottomNavigationPage from "../Home/BottomNavigationPage";

const AppointmentScheduleResult = forwardRef<HTMLDivElement, any>((props, ref) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { openSnackbar } = useSnackbar(); 
    
    const [ticketData, setTicketData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // MÓC DATA TỪ DATABASE - TỰ ĐỘNG CẬP NHẬT KHI MỞ TRANG
    useEffect(() => {
        const fetchTicketFromDB = async () => {
            try {
                const { userInfo } = await getUserInfo({});
                // Gọi API lấy dữ liệu mới nhất (đã bao gồm Status và Note anh vừa sửa trên Admin)
                const response = await fetch(`https://bachkhoaict.com/lich/api.php?action=check_user&zalo_user_id=${userInfo.id}`);
                const result = await response.json();

                if (result.success && result.hasAppointment) {
                    setTicketData(result.data); 
                }
            } catch (error) {
                console.error("Lỗi đồng bộ vé:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTicketFromDB();
    }, []);

    // HÀM LƯU ẢNH VÉ
    const handleDownloadCard = async () => {
        if (cardRef.current) {
            try {
                const canvas = await html2canvas(cardRef.current, { 
                    useCORS: true, 
                    scale: 3, 
                    backgroundColor: "#f4f4f5" 
                });
                const imageData = canvas.toDataURL("image/png");
                await saveImage(imageData);
                openSnackbar({ type: "success", text: "Đã lưu vé vào thư viện ảnh!" });
            } catch (err) {
                openSnackbar({ type: "error", text: "Không thể lưu, vui lòng chụp màn hình!" });
            }
        }
    };

    // HÀM HIỂN THỊ NỘI DUNG
    const renderContent = () => {
        if (loading) return (
            <Box p={8} tw="flex flex-col items-center justify-center mt-10">
                <Spinner visible />
                <Text tw="mt-4 text-gray-500 animate-pulse">Đang đồng bộ vé điện tử...</Text>
            </Box>
        );

        if (!ticketData) return (
            <Box p={6} tw="flex flex-col items-center justify-center mt-10 mb-20">
                <Box tw="bg-blue-50 p-6 rounded-full mb-4">
                    <Icon icon="zi-calendar" tw="text-blue-500 text-5xl" />
                </Box>
                <Text tw="font-bold text-lg text-center">Bạn chưa có lịch hẹn nào</Text>
                <Text tw="text-gray-500 text-center mb-6 px-4">
                    Hãy đặt lịch trước để được hỗ trợ giải quyết công việc nhanh nhất.
                </Text>
                <Button 
                    variant="primary" 
                    fullWidth 
                    onClick={() => navigate("/create-schedule-appointment")} 
                    tw="rounded-xl shadow-md"
                >
                    ĐẶT LỊCH NGAY
                </Button>
            </Box>
        );

        // ===== LOGIC TÍNH TOÁN TRẠNG THÁI & HIỂN THỊ (ĐÃ CẬP NHẬT) =====
        let statusText = "Đang tiếp nhận";
        let statusColor = "text-yellow-600";
        let canBookNew = false; 

        // 1. Kiểm tra trạng thái từ Admin
        if (ticketData.status === 'da_xu_ly') {
            statusText = "Đã xử lý xong";
            statusColor = "text-green-600";
            canBookNew = true;
        } else if (ticketData.status === 'da_tiep_nhan') {
            statusText = "Đã tiếp nhận";
            statusColor = "text-blue-600";
        } else if (ticketData.status === 'tu_choi') {
            statusText = "Bị từ chối";
            statusColor = "text-red-600";
            canBookNew = true; 
        }

        // 2. Kiểm tra nếu is_active = 0 (Do hệ thống tự mở khóa vì quá hạn/hoàn thành)
        if (ticketData.is_active == 0) {
            canBookNew = true;
            // Chỉ đổi text nếu đang ở trạng thái mặc định, để tránh đè lên status "Đã xử lý"
            if (ticketData.status === 'dang_tiep_nhan') {
                statusText = "Đã quá hạn / Hoàn thành";
                statusColor = "text-gray-400";
            }
        }

        // 3. Logic phụ kiểm tra ngày (để chắc chắn)
        const today = new Date().toISOString().split('T')[0];
        if (ticketData.appointment_date < today && ticketData.is_active == 0) {
            canBookNew = true;
        }

        const qrContent = encodeURIComponent(`ID:${ticketData.id} - SDT:${ticketData.phone}`);
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${qrContent}`;

        return (
            <Box p={4} tw="bg-gray-100 min-h-screen pb-24">
                <Box 
                    ref={cardRef} 
                    tw="bg-white rounded-3xl shadow-lg overflow-hidden relative"
                    style={{ maxWidth: '350px', margin: '0 auto' }}
                >
                    {/* Header Vé */}
                    <Box tw="bg-gradient-to-r from-blue-700 to-blue-500 p-6 text-center">
                        <Text tw="text-white font-black text-2xl tracking-widest uppercase">PHIẾU HẸN</Text>
                        <Text tw="text-blue-100 text-[10px] tracking-widest mt-1 opacity-80">UBND xã Cư Jút - Lịch hẹn làm việc</Text>
                    </Box>

                    {/* Thân Vé */}
                    <Box p={5} tw="flex flex-col items-center">
                        <Box tw="flex flex-row items-center justify-center gap-4 w-full mt-2 mb-2">
                            {ticketData.zalo_avatar && (
                                <img 
                                    src={ticketData.zalo_avatar} 
                                    alt="Avatar" 
                                    crossOrigin="anonymous"
                                    tw="w-14 h-14 rounded-full border-2 border-blue-100 shadow-sm object-cover"
                                />
                            )}
                            <Box tw="flex flex-col items-center">
                                <Text tw="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">Số Thứ Tự Của Bạn</Text>
                                <Text tw="text-6xl font-black text-blue-600 leading-none drop-shadow-sm">#{ticketData.id}</Text>
                            </Box>
                        </Box>

                        <Box tw="w-full relative flex items-center my-4">
                            <Box tw="absolute -left-8 w-6 h-6 bg-gray-100 rounded-full" />
                            <Box tw="w-full border-t-2 border-dashed border-gray-200" />
                            <Box tw="absolute -right-8 w-6 h-6 bg-gray-100 rounded-full" />
                        </Box>

                        <Box tw="w-full space-y-3 px-2">
                            <Box tw="flex justify-between items-center">
                                <Text tw="text-gray-400 text-xs">Người đặt:</Text>
                                <Text tw="font-bold text-sm text-right">{ticketData.full_name}</Text>
                            </Box>
                            <Box tw="flex justify-between items-center">
                                <Text tw="text-gray-400 text-xs">Ngày hẹn:</Text>
                                <Text tw="font-bold text-sm text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{ticketData.appointment_date}</Text>
                            </Box>
                            <Box tw="flex justify-between items-center">
                                <Text tw="text-gray-400 text-xs">Khung giờ:</Text>
                                <Text tw="font-bold text-sm">{ticketData.time_slot}</Text>
                            </Box>

                            {/* Trạng thái */}
                            <Box tw="flex justify-between items-center pt-2 border-t border-dashed border-gray-100">
                                <Text tw="text-gray-400 text-xs">Trạng thái:</Text>
                                <Text tw="font-bold text-sm bg-gray-50 px-2 py-1 rounded" className={statusColor}>
                                    {statusText}
                                </Text>
                            </Box>

                            {/* LOGIC HIỂN THỊ GHI CHÚ PHẢN HỒI TỪ ADMIN */}
                            {ticketData.note && (
                                <Box tw="mt-3 p-3 bg-red-50 rounded-xl border border-red-100 animate-pulse">
                                    <Text tw="text-[10px] text-red-500 uppercase font-bold mb-1">📌 Phản hồi từ văn phòng:</Text>
                                    <Text tw="text-sm text-red-700 italic font-medium">"{ticketData.note}"</Text>
                                </Box>
                            )}
                            
                            {/* Thông tin lãnh đạo - Lấy từ DB */}
                            {(ticketData.leader_role || ticketData.leader_name) && (
                                <Box tw="mt-4 pt-4 border-t border-gray-50 flex flex-col items-center">
                                    <Text tw="text-[10px] text-gray-400 uppercase font-bold">Làm việc với</Text>
                                    <Text tw="font-black text-red-600 text-center uppercase mt-1">{ticketData.leader_role}</Text>
                                    <Text tw="text-sm font-bold text-gray-700">{ticketData.leader_name}</Text>
                                </Box>
                            )}
                        </Box>

                        {/* MÃ QR */}
                        <Box tw="mt-8 p-3 bg-white border-2 border-gray-100 rounded-xl shadow-inner flex flex-col items-center">
                            <img src={qrUrl} alt="QR" crossOrigin="anonymous" tw="w-32 h-32" />
                            <Text tw="text-[9px] text-gray-400 mt-2 font-bold tracking-widest uppercase">Mã xác thực điện tử</Text>
                        </Box>
                    </Box>

                    <Box tw="bg-gray-50 p-4 text-center border-t border-dashed border-gray-200">
                        <Text tw="text-[10px] text-gray-500 leading-tight">
                            Vui lòng mang theo CCCD khi đến làm việc.
                        </Text>
                    </Box>
                </Box>

                <Box py={8} px={4} tw="flex flex-col items-center gap-3">
                    <Button
                        variant="primary"
                        onClick={handleDownloadCard}
                        prefixIcon={<Icon icon="zi-download" />}
                        tw="rounded-full shadow-lg bg-blue-600 border-none w-full max-w-[320px]"
                    >
                        Tải Vé Về Máy
                    </Button>

                    {canBookNew && (
                        <Button
                            variant="secondary"
                            onClick={() => navigate("/create-schedule-appointment")}
                            prefixIcon={<Icon icon="zi-plus" />}
                            tw="rounded-full shadow-md bg-white text-blue-600 border border-blue-600 w-full max-w-[320px] mt-2"
                        >
                            Đặt Lịch Mới
                        </Button>
                    )}
                </Box>
            </Box>
        );
    };

    return (
        <PageLayout title="Kết Quả Đặt Lịch">
            {renderContent()}
            <BottomNavigationPage />
        </PageLayout>
    );
});

export default AppointmentScheduleResult;