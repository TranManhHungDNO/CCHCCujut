import React from "react";
import nkImage from './nk.png'; // Đường dẫn đến tệp PNG, đổi tên biến import

const nkIcon: React.FC<any> = () => (
    <img src={nkImage} alt="un" width={44} height={45} />
);

export default nkIcon;
