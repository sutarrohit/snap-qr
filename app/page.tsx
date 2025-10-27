import SnapQR from "@/components/snapQR";

export default function Home() {
    return (
        <div className='flex min-h-screen items-center justify-center border'>
            <div className='size-[500px] border border-purple-500 flex justify-center items-center'>
                <SnapQR
                    data={"https://paperdex.in"}
                    className='border border-purple-500'
                    snapQrOptions={{
                        layoutOptions: {
                            width: 200,
                            height: 200,
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
                    }}
                />
            </div>
        </div>
    );
}
