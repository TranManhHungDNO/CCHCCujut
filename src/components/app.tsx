import { MINI_APP_ID } from "@constants/common";
import Routes from "@pages";
import { useStore } from "@store";
import React, { useEffect, useState } from "react";
import { App, SnackbarProvider } from "zmp-ui";
import Auth from "./Auth";
import ErrorNotification from "./notifications/ErrorNotification";
import LoadingPage from "./LoadingPage"; // Import trang Loading
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MyApp = () => {
    const token = useStore(state => state.token);
    const [, getOrganization] = useStore(state => [
        state.organization,
        state.getOrganization,
    ]);

    const getOrg = async () => {
        try {
            await getOrganization({ miniAppId: MINI_APP_ID });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (token) {
            getOrg();
        }
    }, [token]);

    // State để quản lý loading
    const [isLoading, setIsLoading] = useState(true);

    // Hàm kết thúc loading
    const handleLoadingFinish = () => {
        setIsLoading(false);
    };

    return (
        <App>
            {isLoading ? ( // Hiển thị trang loading nếu đang trong trạng thái loading
                <LoadingPage onFinish={handleLoadingFinish} />
            ) : ( // Khi hết loading, hiển thị nội dung chính
                <SnackbarProvider>
                    <ErrorNotification />
                    <Auth />
                    <Routes />
                </SnackbarProvider>
            )}
        </App>
    );
};

export default MyApp;
