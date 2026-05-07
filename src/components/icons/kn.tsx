import React from "react";
import knImage from './kn.png'; // Đường dẫn đến tệp PNG, đổi tên biến import

const knIcon: React.FC<any> = () => (
    <img src={knImage} alt="un" width={44} height={45} />
);

export default knIcon;
