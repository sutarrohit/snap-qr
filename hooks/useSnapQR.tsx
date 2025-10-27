"use client";

import { useEffect, useRef, useState, ChangeEvent } from "react";
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
    FileExtension
} from "qr-code-styling";

interface LayoutOptions {
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
    QRComponent: React.FC<{ className?: string }>;
    onDataChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onExtensionChange: (event: ChangeEvent<HTMLSelectElement>) => void;
    onDownloadClick: () => void;
    updateData: (newData: string) => void;
    updateOptions: (newOptions: Partial<SnapQROptions>) => void;
    fileExt: FileExtension;
    currentData: string;
}

export const useSnapQR = (initialData: string, snapQrOptions?: SnapQROptions): UseSnapQRReturn => {
    const {
        layoutOptions,
        qrOptions,
        imageOptions,
        dotsOptions,
        backgroundOptions,
        cornersSquareOptions,
        cornersDotOptions
    } = snapQrOptions || {};

    const [currentData, setCurrentData] = useState(initialData);
    const [options, setOptions] = useState<Options>({
        width: layoutOptions?.width || 200,
        height: layoutOptions?.height || 200,
        type: layoutOptions?.type || "svg",
        shape: layoutOptions?.shape || "circle",
        data: currentData,
        image: layoutOptions?.image || "/favicon.ico",
        margin: layoutOptions?.margin ?? 2,
        nodeCanvas: layoutOptions?.nodeCanvas,
        jsdom: layoutOptions?.jsdom,
        qrOptions: {
            typeNumber: qrOptions?.typeNumber || (0 as TypeNumber),
            mode: qrOptions?.mode || ("Byte" as Mode),
            errorCorrectionLevel: qrOptions?.errorCorrectionLevel || ("Q" as ErrorCorrectionLevel)
        },
        imageOptions: {
            hideBackgroundDots: imageOptions?.hideBackgroundDots ?? true,
            imageSize: imageOptions?.imageSize || 0.4,
            margin: imageOptions?.margin || 4,
            crossOrigin: imageOptions?.crossOrigin || "anonymous"
        },
        dotsOptions: {
            color: dotsOptions?.color || "#222222",
            type: dotsOptions?.type || ("dot" as DotType),
            gradient: dotsOptions?.gradient
        },
        backgroundOptions: {
            color: backgroundOptions?.color || "#ffffff",
            gradient: backgroundOptions?.gradient
        },
        cornersSquareOptions: {
            color: cornersSquareOptions?.color || "#222222",
            type: cornersSquareOptions?.type || ("extra-rounded" as CornerSquareType),
            gradient: cornersSquareOptions?.gradient
        },
        cornersDotOptions: {
            color: cornersDotOptions?.color || "#222222",
            type: cornersDotOptions?.type || ("extra-rounded" as CornerDotType),
            gradient: cornersDotOptions?.gradient
        }
    });

    const [fileExt, setFileExt] = useState<FileExtension>("svg");
    const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    // Initialize QRCodeStyling only on client side
    useEffect(() => {
        const initQRCode = async () => {
            const QRCodeStyling = (await import("qr-code-styling")).default;
            setQrCode(new QRCodeStyling(options));
        };

        initQRCode();
    }, []);

    useEffect(() => {
        if (ref.current && qrCode) {
            qrCode.append(ref.current);
        }
    }, [qrCode, ref]);

    useEffect(() => {
        if (!qrCode) return;
        qrCode.update(options);
    }, [qrCode, options]);

    const onDataChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newData = event.target.value;
        setCurrentData(newData);
        setOptions((options) => ({
            ...options,
            data: newData
        }));
    };

    const updateData = (newData: string) => {
        setCurrentData(newData);
        setOptions((options) => ({
            ...options,
            data: newData
        }));
    };

    const onExtensionChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setFileExt(event.target.value as FileExtension);
    };

    const onDownloadClick = () => {
        if (!qrCode) return;
        qrCode.download({
            extension: fileExt
        });
    };

    const updateOptions = (newOptions: Partial<SnapQROptions>) => {
        setOptions((prev) => ({
            ...prev,
            ...newOptions.layoutOptions,
            qrOptions: { ...prev.qrOptions, ...newOptions.qrOptions },
            imageOptions: { ...prev.imageOptions, ...newOptions.imageOptions },
            dotsOptions: { ...prev.dotsOptions, ...newOptions.dotsOptions },
            backgroundOptions: { ...prev.backgroundOptions, ...newOptions.backgroundOptions },
            cornersSquareOptions: { ...prev.cornersSquareOptions, ...newOptions.cornersSquareOptions },
            cornersDotOptions: { ...prev.cornersDotOptions, ...newOptions.cornersDotOptions }
        }));
    };

    const QRComponent: React.FC<{ className?: string }> = ({ className }) => (
        <div className={`flex flex-col items-center justify-center size-fit overflow-auto ${className}`}>
            <div ref={ref} />
        </div>
    );

    return {
        QRComponent,
        onDataChange,
        onExtensionChange,
        onDownloadClick,
        updateData,
        updateOptions,
        fileExt,
        currentData
    };
};
