import { Outlet } from "react-router-dom"
import { Sidebar } from "../views/Sidebar"

export const DashboardLayout = () => {
    return (
        <>
            <div className="flex flex-col sm:flex-row bg-slate-50 min-h-screen ">
                <Sidebar />
                <main className="overflow-y-auto w-full">
                    <Outlet />
                </main>

            </div>
        </>
    )
}
