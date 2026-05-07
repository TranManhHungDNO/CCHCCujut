import React from "react";
import ktImage from './kt.png'; // Đường dẫn đến tệp PNG, đổi tên biến import

const ktIcon: React.FC<any> = () => (
    <img src={ktImage} alt="un" width={44} height={45} />
);

export default ktIcon;
