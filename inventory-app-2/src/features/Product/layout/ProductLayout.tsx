import { Outlet } from "react-router-dom"


export const ProductLayout = () => {
    return (
        <div className="flex flex-col">
            <Outlet />
        </div>
    )
}
