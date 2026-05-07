import React from "react";
import CDSconPNG from './cds.png'; // Đường dẫn đến tệp PNG

const CDSIcon: React.FC<any> = () => (
    <img src={CDSconPNG} alt="CDS Icon" width={44} height={45} />
);

export default CDSIcon;
