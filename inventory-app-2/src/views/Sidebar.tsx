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
import { DocumentTextIcon } from "@heroicons/react/24/outline";

const menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: <HomeIcon className="size-6" />, to: '/' },
    { label: 'Ordenes', icon: <ClipboardIcon className="size-6" />, to: '/orders' },
    { label: 'Productos', icon: <NewspaperIcon className="size-6" />, to: '/products' },
    { label: 'Lotes de stock', icon: <ArchiveBoxIcon className="size-6" />, to: '/stocklots' },
    { label: 'Movimientos', icon: <ArrowsRightLeftIcon className="size-6" />, to: '/movements' },
    { label: 'Usuarios', icon: <UserGroupIcon className="size-6" />, to: '/users' },
    { label: 'Ubicaciones', icon: <MapPinIcon className="size-6" />, to: '/locations' },
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
            return 'bg-blue-600 text-white';
        }

        // Color de fondo cuando no esta seleccionado
        return 'bg-slate-600';
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
                            zIndex: '0', // No olvidar añadir un indice de alejamiento
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
            <div className="min-h-screen bg-slate-900 text-slate-300 hidden sm:flex flex-col justify-between border-r border-slate-800">
                <div className="h-max">
                    <div className="flex flex-col items-center my-4 sm:px-1">
                        <Link to={"/"}><img src="/transportation.svg" className="bg-slate-100 rounded-2xl p-1 lg:w-32 w-16" alt="Logo" /></Link>
                        {/* whitespace-nowrap evita que el texto tenga saltos de linea */}
                        <h1 className="mx-4 my-2 text-xl whitespace-nowrap text-center lg:block hidden">Empresa sin nombre</h1>
                    </div>

                    <nav className="flex flex-col justify-center items-center space-y-1 mb-1">
                        {menuItems.map((item) => (
                            <Link key={item.label} to={item.to} className={`
                            flex items-center justify-center gap-3 px-4 py-2 w-full 
                            text-slate-300
                            hover:bg-slate-800 hover:text-white
                            transition-colors
                            ${styleToCurrentPath(item.to)}
                            `}>
                                <div>{item.icon}</div>
                                <span className="py-1 lg:block hidden">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                <div>

                    <div className="flex flex-col justify-center items-center space-y-1">
                        <Link to={"/credits"} className={`
                            flex items-center justify-center gap-3 px-4 py-2 w-full 
                            text-slate-300
                            hover:bg-slate-800 hover:text-white
                            transition-colors
                            ${styleToCurrentPath("/credits")}
                             `}>
                            <div><DocumentTextIcon className="size-6" /></div>
                            <span className="py-1 lg:block hidden">Creditos del autor</span>
                        </Link>

                        <Link to={"/profile"} className={`
                            flex items-center justify-center gap-3 px-4 py-2 w-full 
                            text-slate-300
                            hover:bg-slate-800 hover:text-white
                            transition-colors                            
                            ${styleToCurrentPath("/profile")}`}>
                            <div><UserCircleIcon className="size-6" /></div>
                            <span className="py-1 lg:block hidden">Perfil</span>
                        </Link>

                        <form
                            className="w-full"
                            onSubmit={(e) => {
                                e.preventDefault();
                                mutate();
                            }}>
                            <button type="submit" className="
                            flex items-center justify-center gap-3 px-4 py-2 w-full 
                            text-slate-300
                            hover:bg-slate-800 hover:text-white
                            transition-colors bg-slate-600
                            hover:cursor-pointer
                            ">
                                <div><ArrowRightStartOnRectangleIcon className="size-6" /></div>
                                <span className="py-1 lg:block hidden">Cerrar sesión</span>
                            </button>
                        </form>


                    </div>
                </div>
            </div>
        </>
    )
}
