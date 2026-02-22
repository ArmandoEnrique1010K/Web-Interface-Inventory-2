// Representa la barra lateral de la aplicación

import { logout } from "@/features/Auth/api/AuthAPI";
import type { MenuItem } from "@/shared/types"
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner";


const menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'dashboard', to: '/dashboard' },
    { label: 'Ordenes', icon: 'orders', to: '/orders' },
    { label: 'Productos', icon: 'products', to: '/products' },
    { label: 'Lotes de stock', icon: 'stock', to: '/stock' },
    { label: 'Movimientos', icon: 'movements', to: '/movements' },
    { label: 'Usuarios', icon: 'users', to: '/users' },
    { label: 'Ubicaciones', icon: 'locations', to: '/locations' },
]


export const Sidebar = () => {
    const navigate = useNavigate()

    // El pathname contiene la ruta actual
    const location = useLocation();

    const styleToCurrentPath = (to: String) => {
        if (location.pathname === to) {
            return 'bg-blue-700';
        }
        return 'bg-gray-500';
    }

    const { mutate } = useMutation({
        mutationFn: logout,
        onSuccess: (data) => {
            // Redirigir al usuario a la página de login
            toast.success(data);
            navigate('/')
        }
    })



    return (
        <div className="h-screen bg-gray-800 text-white hidden sm:flex flex-col justify-between">
            <div className="h-max">
                <div className="flex flex-col items-center my-4">
                    <img src="/inventory.png" className="bg-white rounded-full p-2" alt="Logo" />
                    <h1 className="mx-4 my-2 text-xl">Nombre de la empresa</h1>
                </div>

                <hr />
                <nav className="flex flex-col justify-center items-center space-y-2 mt-4">
                    {menuItems.map((item) => (
                        <Link to={item.to} key={item.label} className={`py-1 w-full text-center ${styleToCurrentPath(item.to)} hover:bg-gray-600 `} >{item.label}</Link>
                    ))}
                </nav>
            </div>

            <div>
                <hr />

                <form
                    className="p-0 m-0"
                    onSubmit={(e) => {
                        e.preventDefault();
                        mutate();
                    }}>
                    <button type="submit" className="w-full py-1 text-center bg-gray-500 hover:bg-gray-600 hover:cursor-pointer">Cerrar sesión</button>
                </form>

            </div>
        </div>
    )
}
