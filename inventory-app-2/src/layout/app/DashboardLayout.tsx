import { Outlet } from "react-router-dom";
import { Sidebar } from "../../views/Sidebar";

export const DashboardLayout = () => {
    return (
        <>
            {/* ID DE REACT-BURGER-MENU: OUTER-CONTAINER Y PAGE-WRAP */}
            <div
                id="outer-container"
                className="flex flex-col sm:flex-row bg-slate-50 min-h-screen "
            >
                <Sidebar />
                <main id="page-wrap" className="overflow-y-auto w-full">
                    <Outlet />
                </main>
            </div>
        </>
    );
};
