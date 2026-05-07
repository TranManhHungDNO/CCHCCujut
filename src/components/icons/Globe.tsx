import React from "react";
import GlobeIconPNG from './tthc.png'; // Đường dẫn đến tệp PNG

const GlobeIcon: React.FC<any> = () => (
    <img src={GlobeIconPNG} alt="Globe Icon" width={44} height={45} />
);

export default GlobeIcon;
