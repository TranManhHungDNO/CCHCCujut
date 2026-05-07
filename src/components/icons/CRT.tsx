import React from "react";
import CRTconPNG from './CRT.png'; // Đường dẫn đến tệp PNG

const CRTIcon: React.FC<any> = () => (
    <img src={CRTconPNG} alt="CRT Icon" width={44} height={45} />
);

export default CRTIcon;
