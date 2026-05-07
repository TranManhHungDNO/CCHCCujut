import React from "react";
import tthcImage from './tthc.png'; // Đường dẫn đến tệp PNG, đổi tên biến import

const tthcIcon: React.FC<any> = () => (
    <img src={tthcImage} alt="tthc" width={44} height={45} />
);

export default tthcIcon;
