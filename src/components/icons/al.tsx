import React from "react";
import alImage from './al.png'; // Đường dẫn đến tệp PNG, đổi tên biến import

const alIcon: React.FC<any> = () => (
    <img src={alImage} alt="un" width={44} height={45} />
);

export default alIcon;
