import React from "react";
import dgImage from './dg.png'; // Đường dẫn đến tệp PNG, đổi tên biến import

const dgIcon: React.FC<any> = () => (
    <img src={dgImage} alt="un" width={44} height={45} />
);

export default dgIcon;
