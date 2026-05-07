import React from "react";
import lhImage from './lh.png'; // Đường dẫn đến tệp PNG, đổi tên biến import

const lhIcon: React.FC<any> = () => (
    <img src={lhImage} alt="un" width={44} height={45} />
);

export default lhIcon;
