import {
    DrawType,
    TypeNumber,
    Mode,
    ErrorCorrectionLevel,
    DotType,
    CornerSquareType,
    CornerDotType,
    Options,
    ShapeType,
    FileExtension
} from "qr-code-styling";

export interface LayoutOptions {
    type?: DrawType;
    shape?: ShapeType;
    width?: number;
    height?: number;
    margin?: number;
    image?: string;
    nodeCanvas?: Options["nodeCanvas"];
    jsdom?: Options["jsdom"];
}

export interface SnapQROptions {
    layoutOptions?: LayoutOptions;
    qrOptions?: Options["qrOptions"];
    imageOptions?: Options["imageOptions"];
    dotsOptions?: Options["dotsOptions"];
    cornersSquareOptions?: Options["cornersSquareOptions"];
    cornersDotOptions?: Options["cornersDotOptions"];
    backgroundOptions?: Options["backgroundOptions"];
}

export interface UseSnapQRReturn {
    SnapQRComponent: React.FC<{ className?: string }>;
    onDataChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onExtensionChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    onDownloadClick: () => void;
    updateData: (newData: string) => void;
    updateOptions: (newOptions: Partial<SnapQROptions>) => void;
    fileExt: FileExtension;
    currentData: string;
}

// Props for standalone component (optional)
export interface SnapQRComponentProps {
    data: string;
    options?: SnapQROptions;
    className?: string;
    onDownload?: (extension: FileExtension) => void;
}

// Re-export QRCodeStyling types for convenience
export type {
    DrawType,
    TypeNumber,
    Mode,
    ErrorCorrectionLevel,
    DotType,
    CornerSquareType,
    CornerDotType,
    Options as QRCodeOptions,
    ShapeType,
    FileExtension
};
