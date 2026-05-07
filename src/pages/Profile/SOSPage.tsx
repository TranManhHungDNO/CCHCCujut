import React from "react";
import { Page, Box, Text } from "zmp-ui";
import PageLayout from "@components/layout/PageLayout";

const WhitePage = () => {
  return (
    <PageLayout title="Trang thử nghiệm">
      <Box p={4} flex flexDirection="column" alignItems="center" justifyContent="center" style={{ paddingTop: "100px" }}>
        <Text bold size="large" style={{ color: "#16a34a" }}>
          ✅ KẾT NỐI THÀNH CÔNG!
        </Text>
        <Text style={{ marginTop: "10px", textAlign: "center" }}>
          Nếu Anh thấy dòng này, nghĩa là hệ thống Route và Export của Anh đã chạy chuẩn bài.
        </Text>
      </Box>
    </PageLayout>
  );
};

export default WhitePage;