import React from "react";
import vlconPNG from './vieclam.png'; // Đường dẫn đến tệp PNG

const vlIcon: React.FC<any> = () => (
    <img src={vlconPNG} alt="vl Icon" width={44} height={45} />
);

export default vlIcon;
