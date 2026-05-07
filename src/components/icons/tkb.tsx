import React from "react";
import tkbImage from './tkb.png'; // Đường dẫn đến tệp PNG, đổi tên biến import

const tkbIcon: React.FC<any> = () => (
    <img src={tkbImage} alt="un" width={44} height={45} />
);

export default tkbIcon;
