// Representa la barra lateral de la aplicación

import { logout } from "@/features/Auth/api/AuthAPI";
import { clearAuth } from "@/reducers/authSlice";
import type { MenuItem } from "types"
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner";
import { HomeIcon, ClipboardIcon, NewspaperIcon, ArchiveBoxIcon, ArrowsRightLeftIcon, UserGroupIcon, MapPinIcon, UserCircleIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/solid"
import { slide as Menu } from 'react-burger-menu'

const menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: <HomeIcon className="w-6 h-6" />, to: '/' },
    { label: 'Ordenes', icon: <ClipboardIcon className="w-6 h-6" />, to: '/orders' },
    { label: 'Productos', icon: <NewspaperIcon className="w-6 h-6" />, to: '/products' },
    { label: 'Lotes de stock', icon: <ArchiveBoxIcon className="w-6 h-6" />, to: '/stock' },
    { label: 'Movimientos', icon: <ArrowsRightLeftIcon className="w-6 h-6" />, to: '/movements' },
    { label: 'Usuarios', icon: <UserGroupIcon className="w-6 h-6" />, to: '/users' },
    { label: 'Ubicaciones', icon: <MapPinIcon className="w-6 h-6" />, to: '/locations' },
]


export const Sidebar = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // El pathname contiene la ruta actual
    const location = useLocation();

    //* APLICAR ESTILO DE FORMA CORRECTA
    const styleToCurrentPath = (to: string) => {
        // Previamente se utilizo (location.pathname === to)
        if (location.pathname.includes(to) && (to !== '/' || location.pathname === '/')) {
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
            // Limpiar la autenticación
            dispatch(clearAuth())
        }
    })



    return (
        <>
            <div className="sm:hidden block h-20 relative  items-center justify-center">
                <Menu
                    customBurgerIcon={<div className="text-black font-bold">Menu de hamburguesa</div>}
                    styles={{
                        bmBurgerButton: {
                            position: 'absolute',
                            width: 'auto',
                            height: 'auto',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)'
                        }
                    }}
                >
                    <a className="menu-item" href="/">Home</a>
                </Menu>
            </div>
            <div className="min-h-screen bg-gray-800 text-white hidden sm:flex flex-col justify-between">
                <div className="h-max">
                    <div className="flex flex-col items-center my-4">
                        <img src="/inventory.png" className="bg-white rounded-full p-2" alt="Logo" />
                        <h1 className="mx-4 my-2 text-xl">Empresa sin nombre</h1>
                    </div>

                    <hr className="text-gray-300" />
                    <nav className="flex flex-col justify-center items-center space-y-2 mt-2">
                        {menuItems.map((item) => (
                            <Link key={item.label} to={item.to} className={`flex flex-row items-center justify-center gap-2 w-full ${styleToCurrentPath(item.to)} hover:bg-gray-600 `}>
                                <div>{item.icon}</div>
                                <span className="py-1">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                <div>
                    <hr className="text-gray-300" />

                    <div className="flex flex-col justify-center items-center space-y-2 mt-2">
                        <Link to={"/profile"} className={`flex flex-row items-center justify-center gap-2 w-full ${styleToCurrentPath("/profile")} hover:bg-gray-600 `}>
                            <div><UserCircleIcon className="w-6 h-6" /></div>
                            <span className="py-1">Perfil</span>
                        </Link>

                        <form
                            className="w-full"
                            onSubmit={(e) => {
                                e.preventDefault();
                                mutate();
                            }}>
                            <button type="submit" className="flex flex-row items-center justify-center gap-2 w-full bg-gray-500 hover:bg-gray-600 hover:cursor-pointer">
                                <div><ArrowRightStartOnRectangleIcon className="w-6 h-6" /></div>
                                <span className="py-1">Cerrar sesión</span>
                            </button>
                        </form>


                    </div>
                </div>
            </div>
        </>
    )
}
