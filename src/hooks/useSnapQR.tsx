"use client";

import { useEffect, useRef, useState, ChangeEvent, useCallback, useMemo } from "react";
import QRCodeStyling, { Options, FileExtension, DownloadOptions, ExtensionFunction } from "qr-code-styling";
import { SnapQROptions, UseSnapQRReturn } from "../types";
import { DEFAULT_OPTIONS, DEFAULT_IMAGE, cn } from "../lib";

export default function useSnapQR(initialData: string, initialOptions?: SnapQROptions): UseSnapQRReturn {
    const [currentData, setCurrentData] = useState(initialData);
    const [fileExt, setFileExt] = useState<FileExtension>("svg");
    const [options, setOptions] = useState<SnapQROptions>(initialOptions || {});
    const [error, setError] = useState<string | null>(null);

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
                setError(null);
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
                setError("Failed to initialize QR code");
            }
        };

        initQRCode();
    }, []); // Empty dependency - only run once

    // Efficient updates
    useEffect(() => {
        if (!isInitialized.current || !qrCodeRef.current) return;

        try {
            setError(null);
            qrCodeRef.current.update(mergedOptions as Options);
        } catch (error) {
            console.error("Failed to update QR code:", error);
            setError("Failed to update QR code");
        }
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

    // Enhanced download with more options
    const onDownloadClick = useCallback(
        (downloadOptions?: Partial<DownloadOptions> | string) => {
            if (!qrCodeRef.current) return;

            try {
                setError(null);
                if (typeof downloadOptions === "string") {
                    qrCodeRef.current.download(downloadOptions);
                } else {
                    qrCodeRef.current.download({
                        extension: fileExt,
                        ...downloadOptions
                    });
                }
            } catch (error) {
                console.error("Failed to download QR code:", error);
                setError("Failed to download QR code");
            }
        },
        [fileExt]
    );

    // Get raw data without downloading
    const getRawData = useCallback(
        async (extension?: FileExtension): Promise<Blob | Buffer | null> => {
            if (!qrCodeRef.current) return null;

            try {
                setError(null);
                return await qrCodeRef.current.getRawData(extension || fileExt);
            } catch (error) {
                console.error("Failed to get raw data:", error);
                setError("Failed to get raw data");
                return null;
            }
        },
        [fileExt]
    );

    // Extension management
    const applyExtension = useCallback((extension: ExtensionFunction) => {
        if (qrCodeRef.current) {
            try {
                setError(null);
                qrCodeRef.current.applyExtension(extension);
            } catch (error) {
                console.error("Failed to apply extension:", error);
                setError("Failed to apply extension");
            }
        }
    }, []);

    const deleteExtension = useCallback(() => {
        if (qrCodeRef.current) {
            try {
                setError(null);
                qrCodeRef.current.deleteExtension();
            } catch (error) {
                console.error("Failed to delete extension:", error);
                setError("Failed to delete extension");
            }
        }
    }, []);

    // Manual container attachment
    const appendToContainer = useCallback((container?: HTMLElement) => {
        if (qrCodeRef.current && container) {
            try {
                setError(null);
                container.innerHTML = "";
                qrCodeRef.current.append(container);
            } catch (error) {
                console.error("Failed to append to container:", error);
                setError("Failed to append to container");
            }
        }
    }, []);

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
            <div className={cn(`snap-qr-container overflow-auto ${className}`)}>
                {error && <div className='snap-qr-error text-red-500 text-sm p-2 bg-red-50 rounded'>{error}</div>}
                <div ref={containerRef} />
            </div>
        ),
        [error]
    );

    return useMemo(
        () => ({
            SnapQRComponent,
            onDataChange,
            onExtensionChange,
            onDownloadClick,
            updateData,
            updateOptions,
            applyExtension,
            deleteExtension,
            getRawData,
            appendToContainer,
            fileExt,
            currentData,
            error,
            qrCodeInstance: qrCodeRef.current
        }),
        [
            SnapQRComponent,
            onDataChange,
            onExtensionChange,
            onDownloadClick,
            updateData,
            updateOptions,
            applyExtension,
            deleteExtension,
            getRawData,
            appendToContainer,
            fileExt,
            currentData,
            error
        ]
    );
}
