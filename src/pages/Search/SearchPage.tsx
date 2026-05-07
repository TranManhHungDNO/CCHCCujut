import PageLayout from "@components/layout/PageLayout";
import React, { useState, useEffect, useMemo } from "react";
import { Box } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import { useLocation } from "react-router-dom"; 
import SearchInput from "./SearchInput";
import SearchResultList from "./SearchResultList";
import { TTHC_Item } from "./SearchResult";
// BỔ SUNG IMPORT NAVI
import BottomNavigationPage from "../Home/BottomNavigationPage";

const Wrapper = styled(Box)`
    ${tw`bg-gray-50 min-h-screen`}
`;

// Hàm hỗ trợ tìm kiếm Tiếng Việt không dấu
const removeAccents = (str: string) => {
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        .toLowerCase();
};

const SearchPage: React.FC = () => {
    const location = useLocation();
    
    // Hứng từ khóa nếu có truyền từ trang Home (giọng nói hoặc gõ text)
    const defaultSearch = location.state?.initKeyword || "";

    const [searchValue, setSearchValue] = useState<string>(defaultSearch);
    const [tthcData, setTthcData] = useState<TTHC_Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // FETCH DỮ LIỆU JSON TỪ SERVER 
    useEffect(() => {
        const fetchThucTucData = async () => {
            try {
                setLoading(true);
                const response = await fetch("https://mini.dno.vn/cchc-cujut/tthc.php", {
                    cache: 'no-cache' 
                });
                
                if (!response.ok) {
                    throw new Error("Không thể tải dữ liệu từ máy chủ");
                }
                
                const data = await response.json();
                setTthcData(data);
            } catch (err: any) {
                console.error("Lỗi fetch:", err);
                setError("Đã xảy ra lỗi khi tải danh sách thủ tục. Vui lòng kiểm tra mạng!");
            } finally {
                setLoading(false);
            }
        };

        fetchThucTucData();
    }, []);

    const handleSearchChange = (e?: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e?.target.value || "");
    };

    // LỌC DỮ LIỆU REAL-TIME
    const filteredResults = useMemo(() => {
        const s = removeAccents(searchValue.trim());
        if (!s) return [];
        
        return tthcData.filter(item => 
            removeAccents(item.tenTTHC).includes(s) || 
            item.maTTHC.toLowerCase().includes(s)
        ).slice(0, 50); // Hiện 50 kết quả đầu tiên giúp app siêu mượt
    }, [searchValue, tthcData]);

    return (
        <PageLayout title="Tra cứu thủ tục">
            <Wrapper p={0} style={{ paddingBottom: "100px" }}> {/* Thêm padding bottom để không bị Navi đè lên kết quả cuối */}
                {/* Thanh tìm kiếm (Hỗ trợ giọng nói) */}
                <SearchInput 
                    value={searchValue}
                    onInputChange={handleSearchChange}
                    disabled={loading || !!error}
                />
                
                {/* Danh sách kết quả (Đã fix lỗi xuống hàng) */}
                <SearchResultList 
                    loading={loading} 
                    error={error}
                    results={filteredResults}
                    keyword={searchValue}
                    totalCount={tthcData.length}
                />
            </Wrapper>

            {/* BỔ SUNG THANH ĐIỀU HƯỚNG DƯỚI CÙNG */}
            <BottomNavigationPage />
        </PageLayout>
    );
};

export default SearchPage;