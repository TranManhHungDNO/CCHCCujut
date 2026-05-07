import React from "react";
import ttdtImage from './dno.png'; // Đường dẫn đến tệp PNG, đổi tên biến import

const TTDTIcon: React.FC<any> = () => (
    <img src={ttdtImage} alt="ttdt" width={44} height={45} />
);

export default TTDTIcon;
