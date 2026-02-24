import { Loader } from "../loader/Loader"

export const Loading = () => {
    return (
        <div className="w-screen h-screen flex items-center justify-center bg-black">
            <Loader />
        </div>
    )
}
