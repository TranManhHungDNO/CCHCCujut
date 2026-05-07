import React from "react";
import pahtconPNG from './paht.png'; // Đường dẫn đến tệp PNG

const pahtIcon: React.FC<any> = () => (
    <img src={pahtconPNG} alt="paht Icon" width={44} height={45} />
);

export default pahtIcon;
