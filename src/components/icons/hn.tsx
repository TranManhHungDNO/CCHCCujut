import React from "react";
import hnImage from './hn.png'; // Đường dẫn đến tệp PNG, đổi tên biến import

const hnIcon: React.FC<any> = () => (
    <img src={hnImage} alt="un" width={44} height={45} />
);

export default hnIcon;
