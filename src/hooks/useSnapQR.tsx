"use client";

import { useEffect, useRef, useState, ChangeEvent, useCallback, useMemo } from "react";
import QRCodeStyling, { Options, FileExtension } from "qr-code-styling";
import { SnapQROptions, UseSnapQRReturn } from "../types";
import { DEFAULT_OPTIONS, DEFAULT_IMAGE, cn } from "../lib";

export default function useSnapQR(initialData: string, initialOptions?: SnapQROptions): UseSnapQRReturn {
    const [currentData, setCurrentData] = useState(initialData);
    const [fileExt, setFileExt] = useState<FileExtension>("svg");
    const [options, setOptions] = useState<SnapQROptions>(initialOptions || {});

    const qrCodeRef = useRef<QRCodeStyling | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInitialized = useRef(false);

    // Memoize merged options
    const mergedOptions = useMemo(
        () => ({
            ...DEFAULT_OPTIONS,
            ...options?.layoutOptions,
            type: fileExt,
            data: currentData,
            image: options?.layoutOptions?.image || DEFAULT_IMAGE,
            qrOptions: {
                ...DEFAULT_OPTIONS.qrOptions,
                ...options?.qrOptions
            },
            imageOptions: {
                ...DEFAULT_OPTIONS.imageOptions,
                ...options?.imageOptions
            },
            dotsOptions: {
                ...DEFAULT_OPTIONS.dotsOptions,
                ...options?.dotsOptions
            },
            backgroundOptions: {
                ...DEFAULT_OPTIONS.backgroundOptions,
                ...options?.backgroundOptions
            },
            cornersSquareOptions: {
                ...DEFAULT_OPTIONS.cornersSquareOptions,
                ...options?.cornersSquareOptions
            },
            cornersDotOptions: {
                ...DEFAULT_OPTIONS.cornersDotOptions,
                ...options?.cornersDotOptions
            }
        }),
        [options, fileExt, currentData]
    );

    // Single initialization effect
    useEffect(() => {
        if (isInitialized.current) return;

        const initQRCode = async () => {
            try {
                // Dynamic import for better bundle size
                const QRCodeStyling = (await import("qr-code-styling")).default;
                qrCodeRef.current = new QRCodeStyling(mergedOptions as Options);

                if (containerRef.current) {
                    containerRef.current.innerHTML = "";
                    qrCodeRef.current.append(containerRef.current);
                    isInitialized.current = true;
                }
            } catch (error) {
                console.error("Failed to initialize QR code:", error);
            }
        };

        initQRCode();
    }, []); // Empty dependency - only run once

    // Efficient updates
    useEffect(() => {
        if (!isInitialized.current || !qrCodeRef.current) return;
        qrCodeRef.current.update(mergedOptions as Options);
    }, [mergedOptions]);

    // Memoized event handlers
    const onDataChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setCurrentData(event.target.value);
    }, []);

    const updateData = useCallback((newData: string) => {
        setCurrentData(newData);
    }, []);

    const onExtensionChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
        setFileExt(event.target.value as FileExtension);
    }, []);

    const onDownloadClick = useCallback(() => {
        if (!qrCodeRef.current) return;

        // Use current instance for download
        qrCodeRef.current.download({ extension: fileExt });
    }, [fileExt]);

    // Proper updateOptions implementation
    const updateOptions = useCallback((newOptions: Partial<SnapQROptions>) => {
        setOptions((prevOptions) => ({
            ...prevOptions,
            // Deep merge for nested options
            layoutOptions: {
                ...prevOptions.layoutOptions,
                ...newOptions.layoutOptions
            },
            qrOptions: {
                ...prevOptions.qrOptions,
                ...newOptions.qrOptions
            },
            imageOptions: {
                ...prevOptions.imageOptions,
                ...newOptions.imageOptions
            },
            dotsOptions: {
                ...prevOptions.dotsOptions,
                ...newOptions.dotsOptions
            },
            backgroundOptions: {
                ...prevOptions.backgroundOptions,
                ...newOptions.backgroundOptions
            },
            cornersSquareOptions: {
                ...prevOptions.cornersSquareOptions,
                ...newOptions.cornersSquareOptions
            },
            cornersDotOptions: {
                ...prevOptions.cornersDotOptions,
                ...newOptions.cornersDotOptions
            },
            // Spread any other top-level properties
            ...newOptions
        }));
    }, []);

    const SnapQRComponent = useCallback<React.FC<{ className?: string }>>(
        ({ className = "" }) => (
            <div className={`snap-qr-container overflow-auto ${className}`}>
                <div ref={containerRef} className='snap-qr-canvas' />
            </div>
        ),
        []
    );

    return useMemo(
        () => ({
            SnapQRComponent,
            onDataChange,
            onExtensionChange,
            onDownloadClick,
            updateData,
            updateOptions,
            fileExt,
            currentData
        }),
        [
            SnapQRComponent,
            onDataChange,
            onExtensionChange,
            onDownloadClick,
            updateData,
            updateOptions,
            fileExt,
            currentData
        ]
    );
}
