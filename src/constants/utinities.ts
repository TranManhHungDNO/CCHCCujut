import { Utinity } from "@dts";
import logo from "@assets/logo.png";
import ca from "@assets/ca.png";
import bk from "@assets/bk-logo.jpg";

export const APP_UTINITIES: Array<Utinity> = [
    
];

export const CONTACTS: Array<Utinity> = [
   {
        key: "logo",
        label: "Zalo OA ",
        link: "",
        iconSrc: bk,
    },
];

export const PROCEDURES: Array<Utinity> = [
    {
        key: "logo",
        label: "UBND tỉnh ",
        link: "",
        iconSrc: logo,
    },
    {
        key: "ca",
        label: "Công an tỉnh ",
        link: "",
        iconSrc: ca,
    },
];
