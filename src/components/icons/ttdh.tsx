import React from "react";
import ttdhImage from './ttdh.png'; // Đường dẫn đến tệp PNG, đổi tên biến import

const TTDHIcon: React.FC<any> = () => (
    <img src={ttdhImage} alt="ttdt" width={44} height={45} />
);

export default TTDHIcon;
