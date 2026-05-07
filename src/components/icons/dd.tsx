import React from "react";
import ddImage from './dd.png'; // Đường dẫn đến tệp PNG, đổi tên biến import

const ddIcon: React.FC<any> = () => (
    <img src={ddImage} alt="un" width={44} height={45} />
);

export default ddIcon;
