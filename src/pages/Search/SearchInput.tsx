import React, { FC, useCallback, useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { Box, Input, Icon, Modal, Button } from "zmp-ui";
import { SearchProps } from "zmp-ui/input";
import { vibrate, scanQRCode, openWebview } from "zmp-sdk/apis";

const StyledSearchInput = styled(Input.Search)`
    ${tw`bg-ng_10 flex-1 border-0`}
    .zaui-input-search-button .zaui-btn-icon {
        color: #b9bdc1;
    }
    .zaui-input-clear-btn .zaui-input-clear-icon {
        color: #767a7f;
    }
`;

const CameraButton = styled.div`
    ${tw`flex items-center justify-center rounded-full ml-3 cursor-pointer transition-all`}
    width: 40px;
    height: 40px;
    background: #f3f4f6;
    color: #4f46e5;
    flex-shrink: 0;
    
    &:active {
        transform: scale(0.9);
        background: #eef2ff;
    }
`;

interface SearchInputProps extends SearchProps {
    onInputChange?: React.ChangeEventHandler<HTMLInputElement>;
    disabled?: boolean;
}

const SearchInput: FC<SearchInputProps> = props => {
    const { onInputChange, disabled, ...rest } = props;
    
    // State quản lý việc hiển thị kết quả QR
    const [qrContent, setQrContent] = useState<string>("");
    const [modalVisible, setModalVisible] = useState(false);

    // HÀM XỬ LÝ QUÉT QR MỚI
    const handleScanQR = async () => {
        if (disabled) return;
        vibrate({}); // Rung nhẹ báo hiệu
        
        try {
            const { content } = await scanQRCode({});
            
            if (content) {
                // Kiểm tra xem mã QR chứa chữ bình thường hay là một đường Link (http/https)
                const isUrl = content.startsWith("http://") || content.startsWith("https://");

                if (isUrl) {
                    // 1. NẾU LÀ LINK: Mở thẳng trình duyệt để xem kết quả (rất tiện cho biên nhận CCHC)
                    openWebview({
                        url: content,
                        config: {
                            style: "bottomSheet",
                            leftButton: "back"
                        }
                    });
                } else {
                    // 2. NẾU LÀ TEXT: Bật Popup thông báo hiển thị trực tiếp thông tin
                    setQrContent(content);
                    setModalVisible(true);
                }
            }
        } catch (error) {
            console.log("Hủy quét QR:", error);
        }
    };

    const getSearchElement = useCallback(() => {
        const searchProps: SearchInputProps = {
            size: "small",
            clearable: true,
            ...rest,
        };

        searchProps.placeholder = "Nhập mã số hoặc quét QR...";
        return <StyledSearchInput {...searchProps} onChange={onInputChange} disabled={disabled} />;
    }, [onInputChange, disabled, rest]);

    return (
        <Box className="bg-white">
            <Box 
                flex 
                flexDirection="row" 
                alignItems="center" 
                justifyContent="space-between" 
                px={4} 
                pt={4} 
                pb={3} 
            >
                {getSearchElement()}
                
                {/* Nút Camera / QR Code */}
                <CameraButton onClick={handleScanQR}>
                    <Icon icon="zi-qrline" size={24} /> 
                </CameraButton>
            </Box>

            {/* MODAL HIỂN THỊ TRỰC TIẾP THÔNG TIN TỪ QR CODE */}
            <Modal
                visible={modalVisible}
                title="Thông tin từ mã QR"
                onClose={() => setModalVisible(false)}
            >
                <Box p={4} className="text-center">
                    <div style={{ wordBreak: 'break-word', lineHeight: '1.6', color: '#374151', fontSize: '15px' }}>
                        {qrContent}
                    </div>
                </Box>
                <Box flex justifyContent="center" mt={4} mb={2}>
                    <Button onClick={() => setModalVisible(false)} size="small" fullWidth>
                        Đóng
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default SearchInput;