import { Options } from "qr-code-styling";

export const DEFAULT_OPTIONS: Partial<Options> = {
    width: 300,
    height: 300,
    margin: 2,
    qrOptions: {
        typeNumber: 4,
        mode: "Byte",
        errorCorrectionLevel: "Q"
    },
    imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.3,
        margin: 4,
        crossOrigin: "anonymous",
        saveAsBlob: false
    },
    dotsOptions: {
        color: "#000000",
        type: "dots"
    },
    backgroundOptions: {
        color: "#ffffff"
    },
    cornersSquareOptions: {
        color: "#222222",
        type: "extra-rounded"
    },
    cornersDotOptions: {
        color: "#222222",
        type: "extra-rounded"
    }
} as const;

export const DEFAULT_IMAGE = "https://static.thenounproject.com/png/3159389-84.png";
