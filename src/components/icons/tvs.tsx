import React from "react";
import tvsImage from './tvs.png'; // Đường dẫn đến tệp PNG, đổi tên biến import

const tvsIcon: React.FC<any> = () => (
    <img src={tvsImage} alt="un" width={44} height={45} />
);

export default tvsIcon;
