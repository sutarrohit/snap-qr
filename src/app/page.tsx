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
        currentData,
        fileExt,
        getRawData
    } = useSnapQR(
        "https://paperdex.in",

        {
            layoutOptions: {
                width: 300,
                height: 300,
                type: "svg",
                shape: "square",
                margin: 10,
                // image: "https://app.termix.ai/_next/image?url=%2Flogo.svg&w=128&q=75&dpl=dpl_4Er1WHeqMwUabYf1D299HgK6NTvR",
                responsive: false
            },

            dotsOptions: {
                color: "#000",
                type: "dots"
            },
            backgroundOptions: {
                color: "#7dea28"
            }
        }
    );

    const handleGetData = async () => {
        const rawData = await getRawData(fileExt);
        if (rawData) {
            // Use the raw data (Blob) for your needs
            console.log("Raw data size:", rawData);
        }
    };

    return (
        <div className='flex flex-col gap-4 min-h-screen items-center justify-center'>
            <div className='size-[250px] md:size-[500px] flex justify-center items-center border border-yellow-500'>
                <SnapQRComponent className='rounded-2xl border border-pink-500' />
            </div>
            <input value={currentData} onChange={onDataChange} className='border px-2 py-1' />
            <select onChange={onExtensionChange}>
                <option value='svg'>SVG</option>
                <option value='png'>PNG</option>
                <option value='jpeg'>JPEG</option>
                <option value='webp'>WEBP</option>
            </select>
            <button onClick={() => onDownloadClick()} className='border px-2 py-1'>
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
            <button onClick={handleGetData} className='border px-2 py-1'>
                Get Raw PNG Data
            </button>
        </div>
    );
}
