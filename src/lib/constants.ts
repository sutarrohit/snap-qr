import { Options } from "qr-code-styling";

export const DEFAULT_OPTIONS: Partial<Options> = {
    width: 300,
    height: 300,
    margin: 7,
    qrOptions: {
        typeNumber: 0,
        mode: "Byte",
        errorCorrectionLevel: "H"
    },
    imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.1,
        margin: 3,
        crossOrigin: "anonymous",
        saveAsBlob: true
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

export const DEFAULT_IMAGE = "./logo.svg";
