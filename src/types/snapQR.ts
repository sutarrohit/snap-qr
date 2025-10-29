import QRCodeStyling, {
    DrawType,
    TypeNumber,
    Mode,
    ErrorCorrectionLevel,
    DotType,
    CornerSquareType,
    CornerDotType,
    Options,
    ShapeType,
    FileExtension,
    DownloadOptions,
    ExtensionFunction
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
    responsive?: boolean;
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
    fileExt: FileExtension;
    currentData: string;
    error: string | null;
    qrCodeInstance: QRCodeStyling | null;
    onDataChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onExtensionChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    onDownloadClick: (downloadOptions?: Partial<DownloadOptions> | string) => void;
    updateData: (newData: string) => void;
    updateOptions: (newOptions: Partial<SnapQROptions>) => void;
    applyExtension: (extension: ExtensionFunction) => void;
    deleteExtension: () => void;
    getRawData: (extension?: FileExtension) => Promise<Blob | Buffer | null>;
    appendToContainer: (container?: HTMLElement) => void;
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
