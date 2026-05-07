import React from "react";
import unImage from './un.png'; // Đường dẫn đến tệp PNG, đổi tên biến import

const unIcon: React.FC<any> = () => (
    <img src={unImage} alt="un" width={44} height={45} />
);

export default unIcon;
