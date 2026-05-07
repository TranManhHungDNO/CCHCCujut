import React from "react";
import hpImage from './hp.png'; // Đường dẫn đến tệp PNG, đổi tên biến import

const hpIcon: React.FC<any> = () => (
    <img src={hpImage} alt="un" width={44} height={45} />
);

export default hpIcon;
