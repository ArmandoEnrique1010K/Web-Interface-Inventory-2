import { BlueLoader } from "@/components/BlueLoader/BlueLoader";

export const LoadingView = () => {
    return (
        <div className=" md:min-h-[calc(100dvh+4rem)] min-h-[calc(100dvh-3rem)] flex flex-col justify-center  ">
            <BlueLoader />
        </div>
    );
};
