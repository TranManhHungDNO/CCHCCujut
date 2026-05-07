import React, { useCallback } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { Icon, List } from "zmp-ui";
import { openWebview, vibrate } from "zmp-sdk/apis";

// Định nghĩa cấu trúc dữ liệu TTHC
export interface TTHC_Item {
    maTTHC: string;
    tenTTHC: string;
}

interface SearchResultProps {
    item: TTHC_Item;
}

const StyledListItem = styled(List.Item)`
    background: white;
    margin: 8px 16px;
    border-radius: 12px;
    border: 1px solid #f0f0f0 !important;
    
    .zaui-list-item-title {
        font-weight: 600;
        ${tw`text-gray-800`}
        line-height: 1.5;
        /* --- ĐOẠN FIX LỖI KHUYẾT TẬT HIỂN THỊ NẰM Ở ĐÂY --- */
        white-space: normal !important; 
        word-break: break-word;
        display: block;
    }
    
    .zaui-list-item-suffix {
        align-items: center;
        display: flex;
    }
    
    &:active {
        background: #f9f9f9;
        transform: scale(0.98);
    }
    transition: all 0.2s;
`;

const Badge = styled.span`
    font-size: 11px;
    background: #eef2ff;
    color: #4f46e5;
    padding: 3px 8px;
    border-radius: 4px;
    font-weight: 600;
    margin-top: 8px;
    display: inline-block;
`;

const SearchResult: React.FC<SearchResultProps> = ({ item }) => {
    const onClickItem = useCallback(() => {
        vibrate({});
        // Ghép mã TTHC vào Link Dịch vụ công
        const targetUrl = `https://thutuc.dichvucong.gov.vn/p/home/dvc-tthc-category.html?tinh_bo=0&tu_khoa=${item.maTTHC}&co_quan_cong_bo=-1&cap_thuc_hien=-1&linh_vuc=-1&loai_tthc=-1&doi_tuong_thuc_hien=-1&is_advanced_search=0`;
        
        openWebview({
            url: targetUrl,
            config: {
                style: "bottomSheet",
                leftButton: "back"
            }
        });
    }, [item.maTTHC]);

    return (
        <StyledListItem
            onClick={onClickItem}
            title={item.tenTTHC}
            suffix={<Icon icon="zi-chevron-right" className="text-gray-400" />}
        >
            <Badge>Mã: {item.maTTHC}</Badge>
        </StyledListItem>
    );
};

export default SearchResult;