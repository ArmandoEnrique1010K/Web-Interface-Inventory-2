import { Outlet } from "react-router-dom"

export const DashboardLayout = () => {
    return (
        <div>BIENVENIDO USUARIO
            <Outlet />

        </div>
    )
}
