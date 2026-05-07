import React from "react";
import gtImage from './gt.png'; // Đường dẫn đến tệp PNG, đổi tên biến import

const gtIcon: React.FC<any> = () => (
    <img src={gtImage} alt="un" width={44} height={45} />
);

export default gtIcon;
