import React from "react";
import CalendarIconPNG from './calendar.png'; // Đường dẫn đến tệp PNG

const CalendarIcon: React.FC<any> = () => (
    <img src={CalendarIconPNG} alt="Calendar Icon" width={44} height={45} />
);

export default CalendarIcon;
