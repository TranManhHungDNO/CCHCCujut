import React, { useState, useEffect, useMemo } from "react";
import {
    HomeHeader,
    Utinities,
    NewsSection,
    VideoSection,
    ListOA,
} from "@components";
import PageLayout from "@components/layout/PageLayout";
import { useStore } from "@store";
import Procedures from "./Procedures";
import BottomNavigationPage from "./BottomNavigationPage";
import SearchInput from "../Search/SearchInput"; 
import SearchResultList from "../Search/SearchResultList";
import { TTHC_Item } from "../Search/SearchResult";
import { Box } from "zmp-ui";

// Hàm lọc tiếng Việt không dấu
const removeAccents = (str: string) => {
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        .toLowerCase();
};

const HomePage: React.FunctionComponent = () => {
    const [organization] = useStore(state => [
        state.organization,
        state.getOrganization,
    ]);

    // --- LOGIC TÌM KIẾM TẠI CHỖ ---
    const [searchValue, setSearchValue] = useState("");
    const [tthcData, setTthcData] = useState<TTHC_Item[]>([]);
    const [loading, setLoading] = useState(false);

    // Tải dữ liệu thủ tục ngay khi vào App
    useEffect(() => {
        const fetchThucTucData = async () => {
            try {
                setLoading(true);
                const response = await fetch("https://mini.dno.vn/cchc-cujut/tthc.php");
                const data = await response.json();
                setTthcData(data);
            } catch (err) {
                console.error("Lỗi tải dữ liệu:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchThucTucData();
    }, []);

    // Xử lý khi gõ hoặc nói Mic
    const handleSearchChange = (e?: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e?.target.value || "");
    };

    // Lọc kết quả
    const filteredResults = useMemo(() => {
        const s = removeAccents(searchValue.trim());
        if (!s) return [];
        return tthcData.filter(item => 
            removeAccents(item.tenTTHC).includes(s) || 
            item.maTTHC.toLowerCase().includes(s)
        ).slice(0, 50);
    }, [searchValue, tthcData]);

    return (
        <PageLayout
            id="home-page"
            customHeader={
                <HomeHeader
                    title="Cải cách hành chính xã Cư Jút"
                    name={organization?.name || ""}
                />
            }
        >
            {/* THANH SEARCH NGAY TRÊN HOME */}
            <SearchInput 
                value={searchValue}
                onInputChange={handleSearchChange} 
                placeholder="Nhập thủ tục hoặc bấm Mic để nói..." 
            />

            {/* KIỂM TRA: NẾU ĐANG CÓ TỪ KHÓA THÌ HIỆN KẾT QUẢ, KHÔNG THÌ HIỆN NỘI DUNG HOME */}
            {searchValue.trim() !== "" ? (
                <Box className="bg-white min-h-screen">
                    <SearchResultList 
                        loading={loading} 
                        results={filteredResults}
                        keyword={searchValue}
                        totalCount={tthcData.length}
                    />
                </Box>
            ) : (
                <>
                                        <Utinities />
                    <VideoSection /> 
                    <NewsSection />
                    <Procedures />
                      
                </>
            )}

            <BottomNavigationPage />
        </PageLayout>
    );
};

export default HomePage;