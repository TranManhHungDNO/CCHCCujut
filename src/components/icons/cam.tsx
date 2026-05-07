import React from "react";
import camconPNG from './cam.png'; // Đường dẫn đến tệp PNG

const camIcon: React.FC<any> = () => (
    <img src={camconPNG} alt="cam Icon" width={44} height={45} />
);

export default camIcon;
