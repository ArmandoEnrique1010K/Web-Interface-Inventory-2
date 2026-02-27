import { Outlet } from "react-router-dom"
import { Sidebar } from "../views/Sidebar"

export const DashboardLayout = () => {
    return (
        <div className="flex flex-col sm:flex-row bg-gray-300 min-h-screen">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    )
}
