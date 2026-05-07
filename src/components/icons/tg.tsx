import React from "react";
import tgconPNG from './togiac.png'; // Đường dẫn đến tệp PNG

const tgIcon: React.FC<any> = () => (
    <img src={tgconPNG} alt="tg Icon" width={44} height={45} />
);

export default tgIcon;
