import React from "react";
import dataconPNG from './data.png'; // Đường dẫn đến tệp PNG

const dataIcon: React.FC<any> = () => (
    <img src={dataconPNG} alt="data Icon" width={44} height={45} />
);

export default dataIcon;
