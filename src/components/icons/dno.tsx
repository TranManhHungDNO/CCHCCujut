import React from "react";
import dnoImage from './dno.png'; // Đường dẫn đến tệp PNG, đổi tên biến import

const dnoIcon: React.FC<any> = () => (
    <img src={dnoImage} alt="un" width={44} height={45} />
);

export default dnoIcon;
