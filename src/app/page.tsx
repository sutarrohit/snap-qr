"use client";
import useSnapQR from "../index";

export default function Home() {
    const {
        SnapQRComponent,
        onDataChange,
        onExtensionChange,
        onDownloadClick,
        updateData,
        updateOptions,
        currentData
    } = useSnapQR(
        "https://paperdex.in",

        {
            layoutOptions: {
                width: 300,
                height: 300,
                type: "svg",
                shape: "square",
                margin: 2,
                image: "https://static.thenounproject.com/png/3159389-84.png"
            },

            qrOptions: {
                typeNumber: 4,
                mode: "Byte",
                errorCorrectionLevel: "Q"
            },
            cornersSquareOptions: {
                type: "extra-rounded"
            },

            imageOptions: {
                hideBackgroundDots: true,
                imageSize: 0.3,
                margin: 4,
                crossOrigin: "anonymous",
                saveAsBlob: true
            },
            dotsOptions: {
                color: "#000000",
                type: "dots"
            },
            backgroundOptions: {
                color: "#ffffff"
            }
        }
    );

    return (
        <div className='flex min-h-screen items-center justify-center border'>
            <div className='size-[500px] flex justify-center items-center'>
                <SnapQRComponent className='border-2 border-pink-500 rounded-2xl ' />
            </div>
            <input value={currentData} onChange={onDataChange} className='border px-2 py-1' />
            <select onChange={onExtensionChange}>
                <option value='svg'>SVG</option>
                <option value='png'>PNG</option>
                <option value='jpeg'>JPEG</option>
                <option value='webp'>WEBP</option>
            </select>
            <button onClick={onDownloadClick} className='border px-2 py-1'>
                Download
            </button>
            <button onClick={() => updateData("https://google.com")} className='border px-2 py-1'>
                Change Data
            </button>

            <button onClick={() => updateOptions({ dotsOptions: { color: "#FFC0CB" } })} className='border px-2 py-1'>
                Bg Color
            </button>

            <button onClick={() => updateOptions({ cornersDotOptions: { color: "red" } })} className='border px-2 py-1'>
                Bg Color
            </button>
        </div>
    );
}
