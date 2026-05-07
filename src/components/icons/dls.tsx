import React from "react";
import dlsconPNG from './dls.png'; // Đường dẫn đến tệp PNG

const dlsIcon: React.FC<any> = () => (
    <img src={dlsconPNG} alt="dls Icon" width={44} height={45} />
);

export default dlsIcon;
