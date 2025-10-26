import SnapQR from "@/Components/snap";

export default function Home() {
    return (
        <div className='flex min-h-screen items-center justify-center border'>
            <div className='size-[500px] border border-purple-500'>
                <SnapQR data={"https://paperdex.in"} />
            </div>
        </div>
    );
}
