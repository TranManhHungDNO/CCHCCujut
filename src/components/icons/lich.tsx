import React from "react";
import lichImage from './lich.png'; // Đường dẫn đến tệp PNG, đổi tên biến import

const lichIcon: React.FC<any> = () => (
    <img src={lichImage} alt="un" width={44} height={45} />
);

export default lichIcon;
