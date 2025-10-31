"use client";

import { useEffect, useRef, useState, ChangeEvent, useCallback, useMemo } from "react";
import QRCodeStyling, { Options, FileExtension, DownloadOptions, ExtensionFunction } from "qr-code-styling";
import { SnapQROptions, UseSnapQRReturn } from "../types";
import { DEFAULT_OPTIONS, cn } from "../lib";

/**
 * React hook to create and manage a QR code using `qr-code-styling`.
 *
 * - Keeps an internal QRCodeStyling instance and a container ref for rendering.
 * - Exposes a small React component to place the QR on the page.
 * - Provides helpers for updating data/options, applying/removing extensions,
 *   downloading, and getting raw data (Blob/Buffer).
 *
 * @param initialData - initial string to encode into the QR code
 * @param initialOptions - optional initial SnapQROptions to configure appearance/behavior
 * @returns an object with component, instance, controls and helpers for the QR code
 */
export default function useSnapQR(initialData: string, initialOptions?: SnapQROptions): UseSnapQRReturn {
    // --- State ---
    const [currentData, setCurrentData] = useState(initialData);
    const [fileExt, setFileExt] = useState<FileExtension>("svg");
    const [options, setOptions] = useState<SnapQROptions>(initialOptions || {});
    const [error, setError] = useState<string | null>(null);

    // --- Refs ---
    const qrCodeRef = useRef<QRCodeStyling | null>(null); // holds the active QRCodeStyling instance
    const containerRef = useRef<HTMLDivElement>(null); // DOM container for display
    const isInitialized = useRef(false); // ensure we only initialize once

    // Track the original dimensions to use for downloads and raw exports.
    const originalDimensions = useRef({
        width: initialOptions?.layoutOptions?.width || 500,
        height: initialOptions?.layoutOptions?.height || 500
    });

    // --- Compute merged options ---
    // Merge DEFAULT_OPTIONS with user-supplied options and current state (data + file extension).
    const mergedOptions = useMemo(
        () => ({
            ...DEFAULT_OPTIONS,
            ...options?.layoutOptions,
            type: fileExt,
            data: currentData,
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

    // --- Event handlers / API exposed to consumers ---

    // Controlled input change handler for data field
    const onDataChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setCurrentData(event.target.value);
    }, []);

    // Directly replace the QR data value
    const updateData = useCallback((newData: string) => {
        setCurrentData(newData);
    }, []);

    /**
     * Merge and update options. Only the provided sub-sections are merged,
     * preserving previously set option groups.
     *
     * Also updates `originalDimensions` if width/height are provided so
     * downloads/export use the intended size.
     */
    const updateOptions = useCallback((newOptions: Partial<SnapQROptions>) => {
        setOptions((prevOptions) => {
            const merged: SnapQROptions = {
                ...prevOptions,
                ...newOptions,
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
                }
            };

            return merged;
        });

        // Keep download/export dimensions in sync when layout width/height are provided.
        if (newOptions.layoutOptions?.width || newOptions.layoutOptions?.height) {
            originalDimensions.current = {
                width: newOptions.layoutOptions?.width || originalDimensions.current.width,
                height: newOptions.layoutOptions?.height || originalDimensions.current.height
            };
        }
    }, []);

    // Handler to change the output file extension (svg/png/jpg)
    const onExtensionChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
        setFileExt(event.target.value as FileExtension);
    }, []);

    /**
     * Download the QR code using the original (export) dimensions.
     * Accepts either a string extension or a partial DownloadOptions object.
     */
    const onDownloadClick = useCallback(
        (downloadOptions?: Partial<DownloadOptions> | string) => {
            try {
                setError(null);

                // Create a temporary QR instance configured for export size to avoid changing the on-screen responsive instance.
                const downloadQR = async () => {
                    const QRCodeStyling = (await import("qr-code-styling")).default;
                    const tempQr = new QRCodeStyling({
                        ...mergedOptions,
                        width: originalDimensions.current.width,
                        height: originalDimensions.current.height
                    } as Options);

                    if (typeof downloadOptions === "string") {
                        tempQr.download(downloadOptions);
                    } else {
                        tempQr.download({
                            extension: fileExt,
                            ...downloadOptions
                        });
                    }
                };

                // run the async download
                downloadQR();
            } catch (error) {
                // Keep error state for UI and debugging
                console.error("Failed to download QR code:", error);
                setError("Failed to download QR code");
            }
        },
        [mergedOptions, fileExt]
    );

    /**
     * Get the raw exported data (Blob or Buffer) using the original export dimensions.
     * Returns null and sets error state on failure.
     */
    const getRawData = useCallback(
        async (extension?: FileExtension): Promise<Blob | Buffer | null> => {
            try {
                setError(null);

                const QRCodeStyling = (await import("qr-code-styling")).default;
                const tempQr = new QRCodeStyling({
                    ...mergedOptions,
                    width: originalDimensions.current.width,
                    height: originalDimensions.current.height
                } as Options);

                return await tempQr.getRawData(extension || fileExt);
            } catch (error) {
                console.error("Failed to get raw data:", error);
                setError("Failed to get raw data");
                return null;
            }
        },
        [mergedOptions, fileExt]
    );

    /**
     * If consumer wants to attach the QR to a different container element,
     * this appends the existing instance to the provided container.
     */
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

    /**
     * Apply a QRCodeStyling extension function to the current instance.
     * See `qr-code-styling` docs for extension shape.
     */
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

    /**
     * Remove the currently applied extension from the instance.
     */
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

    // --- Initialization: create QRCodeStyling instance once ---
    useEffect(() => {
        if (isInitialized.current) return;

        const initQRCode = async () => {
            try {
                setError(null);
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
        // Intentionally no dependencies to ensure this runs only once on mount.
        // mergedOptions is intentionally not included here to avoid re-creating the instance.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Update the on-screen QR code whenever visual options/data change.
     * We remove width/height so the instance remains responsive (size handled by container/resizer).
     */
    useEffect(() => {
        if (!isInitialized.current || !qrCodeRef.current) return;

        try {
            setError(null);
            const displayOptions = { ...mergedOptions } as Options;
            // Remove explicit size to keep responsiveness
            delete (displayOptions as Partial<Options>).width;
            delete (displayOptions as Partial<Options>).height;
            qrCodeRef.current.update(displayOptions);
        } catch (error) {
            console.error("Failed to update QR code:", error);
            setError("Failed to update QR code");
        }
    }, [mergedOptions]);

    /**
     * Observe container size and update the QR instance to keep it square & responsive.
     * Uses the smaller of width/height to preserve aspect ratio.
     */
    useEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;

                if (qrCodeRef?.current && width > 0 && height > 0) {
                    const size = Math.min(width, height);
                    qrCodeRef.current.update({
                        width: size,
                        height: size
                    });
                }
            }
        });

        resizeObserver.observe(containerRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    // Minimal presentational component for placing the QR in the app.
    const SnapQRComponent = useCallback<React.FC<{ className?: string }>>(
        ({ className = "" }) => (
            <div className={cn("snap-qr-container w-full h-full", className)}>
                {error && <div className='snap-qr-error text-red-500 text-sm bg-red-50 rounded p-2 mb-2'>{error}</div>}
                <div ref={containerRef} className='w-full h-full flex items-center justify-center' />
            </div>
        ),
        [error]
    );

    // Return stable API for consumers of the hook.
    return useMemo(
        () => ({
            SnapQRComponent,
            fileExt,
            currentData,
            error,
            qrCodeInstance: qrCodeRef.current,
            onDataChange,
            onExtensionChange,
            onDownloadClick,
            updateData,
            updateOptions,
            applyExtension,
            deleteExtension,
            getRawData,
            appendToContainer,
            originalDimensions: originalDimensions.current // exposed for debugging/advanced use
        }),
        [
            SnapQRComponent,
            fileExt,
            currentData,
            error,
            onDataChange,
            onExtensionChange,
            onDownloadClick,
            updateData,
            updateOptions,
            applyExtension,
            deleteExtension,
            getRawData,
            appendToContainer
        ]
    );
}
