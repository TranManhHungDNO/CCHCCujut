import React from "react";
import tsImage from './ts.png'; // Đường dẫn đến tệp PNG, đổi tên biến import

const tsIcon: React.FC<any> = () => (
    <img src={tsImage} alt="un" width={44} height={45} />
);

export default tsIcon;
