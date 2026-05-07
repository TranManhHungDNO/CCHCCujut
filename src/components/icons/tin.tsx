import React from "react";
import tinImage from './tin.png'; // Đường dẫn đến tệp PNG, đổi tên biến import

const tinIcon: React.FC<any> = () => (
    <img src={tinImage} alt="un" width={44} height={45} />
);

export default tinIcon;
