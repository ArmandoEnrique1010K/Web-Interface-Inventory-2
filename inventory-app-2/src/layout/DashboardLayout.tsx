import { Outlet } from "react-router-dom"
import { Sidebar } from "../views/Sidebar"

export const DashboardLayout = () => {
    return (
        <div className="flex flex-row bg-gray-300 h-screen flex-1">
            <Sidebar />
            <Outlet />
        </div>
    )
}
