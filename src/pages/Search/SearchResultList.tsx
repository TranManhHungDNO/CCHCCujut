import React, { FC } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { Box, Text, Spinner, Icon } from "zmp-ui";
import SearchResult, { TTHC_Item } from "./SearchResult";

interface SearchResultListProps {
    results: TTHC_Item[];
    loading?: boolean;
    error?: string | null;
    keyword: string;
    totalCount: number;
}

const Wrapper = styled.div<{ $fullHeight: string }>`
    position: relative;
    ${({ $fullHeight }) => 
        $fullHeight === "true" 
        ? `min-height: calc(100vh - calc(104px + var(--zaui-safe-area-inset-top, 0px)));` 
        : ""
    }
    display: flex;
    flex-direction: column;
    padding-bottom: 40px;
`;

const InfoWrapper = styled(Box)`
    ${tw`flex flex-col items-center justify-center flex-1 bg-transparent p-10 text-center mt-10`}
`;

const SearchResultList: FC<SearchResultListProps> = (props) => {
    const { loading, results, error, keyword, totalCount } = props;
    const isEmpty = !results.length;

    const renderContent = () => {
        if (loading) {
            return (
                <InfoWrapper>
                    <Spinner />
                    <Text className="text-gray-500 mt-4">Đang tải danh sách thủ tục...</Text>
                </InfoWrapper>
            );
        }

        if (error) {
            return (
                <InfoWrapper>
                    <Icon icon="zi-warning" className="text-red-400 mb-2" style={{fontSize: '48px'}}/>
                    <Text className="text-gray-600">{error}</Text>
                </InfoWrapper>
            );
        }

        if (!keyword.trim()) {
            return (
                <InfoWrapper>
                    <Icon icon="zi-search" className="text-gray-300 mb-2" style={{fontSize: '48px'}}/>
                    <Text className="text-gray-400">
                        Hệ thống đã cập nhật {totalCount} thủ tục.<br/>
                        Vui lòng nhập từ khóa để tìm kiếm.
                    </Text>
                </InfoWrapper>
            );
        }

        if (isEmpty) {
            return (
                <InfoWrapper>
                    <Text className="text-gray-400">Không tìm thấy kết quả nào cho "{keyword}"</Text>
                </InfoWrapper>
            );
        }

        return results.map(item => (
            <SearchResult key={item.maTTHC} item={item} />
        ));
    };

    return (
        <Wrapper $fullHeight={isEmpty || loading || !!error || !keyword.trim() ? "true" : "false"}>
            <Box mt={2}>
                {renderContent()}
            </Box>
        </Wrapper>
    );
};

export default SearchResultList;