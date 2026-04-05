import type { MenuItem } from "@/types";
import {
    ArchiveBoxIcon,
    ArrowRightStartOnRectangleIcon,
    ArrowsRightLeftIcon,
    Bars3Icon,
    ClipboardIcon,
    DocumentTextIcon,
    HomeIcon,
    MapPinIcon,
    NewspaperIcon,
    UserCircleIcon,
    UserGroupIcon,
    XMarkIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { pushRotate as Menu } from "react-burger-menu";
import { Link } from "react-router-dom";
import { SidebarItem } from "./SidebarItem";
import { useMediaQuery } from "react-responsive";

const menuItems: MenuItem[] = [
    { label: "Dashboard", icon: <HomeIcon className="size-6" />, to: "/" },
    {
        label: "Ordenes",
        icon: <ClipboardIcon className="size-6" />,
        to: "/orders",
    },
    {
        label: "Productos",
        icon: <NewspaperIcon className="size-6" />,
        to: "/products",
    },
    {
        label: "Lotes de stock",
        icon: <ArchiveBoxIcon className="size-6" />,
        to: "/stocklots",
    },
    {
        label: "Movimientos",
        icon: <ArrowsRightLeftIcon className="size-6" />,
        to: "/movements",
    },
    {
        label: "Usuarios",
        icon: <UserGroupIcon className="size-6" />,
        to: "/users",
    },
    {
        label: "Ubicaciones",
        icon: <MapPinIcon className="size-6" />,
        to: "/locations",
    },

    {
        label: "Creditos del autor",
        icon: <DocumentTextIcon className="size-6" />,
        to: "/credits",
    },
    {
        label: "Perfil",
        icon: <UserCircleIcon className="size-6" />,
        to: "/profile",
    },

    {
        label: "Cerrar sesión",
        icon: <ArrowRightStartOnRectangleIcon className="size-6" />,
        isForm: true,
    },
];

export const SidebarMenuView = () => {
    const [showMenu, setShowMenu] = useState(false);

    const isMobile = useMediaQuery({ query: "(max-width: 640px)" });

    const isMenuOpen = isMobile && showMenu;

    // CAMBIAR EL ATRIBUTO STYLE DEL ELEMENTO BODY CUANDO SE TENGA UNA VISTA DE MOVIL
    useEffect(() => {
        if (showMenu && isMobile) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [showMenu, isMobile]);
    return (
        <>
            {/* VISTA DE MOVIL: REACT BURGER MENU */}
            <div
                id="outer-container"
                className="sticky top-0 z-20 sm:hidden block h-16  bg-slate-900 items-center 
                justify-center"
            >
                <Menu
                    pageWrapId="page-wrap"
                    outerContainerId="outer-container"
                    isOpen={isMenuOpen}
                    customBurgerIcon={
                        <div className=" text-white font-bold">
                            <Bars3Icon className="size-10" />
                        </div>
                    }
                    width={"100%"}
                    onOpen={() => setShowMenu(true)}
                    onClose={() => setShowMenu(false)}
                    styles={{
                        bmBurgerButton: {
                            position: "fixed",
                            zIndex: "1000", // No olvidar añadir un indice de alejamiento
                            width: "auto",
                            height: "auto",
                            left: "50%",
                            top: "1rem",
                            transform: "translate(-50%)",
                        },
                    }}
                >
                    <div className="min-h-screen bg-slate-900 flex flex-col overflow-y-auto">
                        {menuItems.map((item) => (
                            <SidebarItem
                                key={item.label}
                                item={{
                                    label: item.label,
                                    icon: item.icon,
                                    to: item.to,
                                    isForm: item.isForm,
                                }}
                                isMobile={true}
                                setShowMenu={setShowMenu}
                            />
                        ))}

                        <button
                            className="flex items-center justify-center gap-3 px-4 py-2 w-full 
                            text-slate-300 bg-slate-600
                            hover:bg-slate-800 hover:text-white
                            transition-colors hover:cursor-pointer"
                            onClick={() => setShowMenu(false)}
                        >
                            <div>
                                <XMarkIcon className="size-6" />{" "}
                            </div>
                            <span className="py-1 block sm:hidden lg:block">
                                Cerrar menú
                            </span>
                        </button>
                    </div>
                </Menu>
            </div>

            {/* VISTA DE ESCRITORIO */}

            <div className="min-h-screen bg-slate-900 text-slate-300 hidden sm:flex flex-col justify-between border-r border-slate-800">
                <div className="h-max">
                    <div className="flex flex-col items-center my-4 sm:px-1">
                        <Link to={"/"}>
                            <img
                                src="/transportation.svg"
                                className="bg-slate-100 rounded-2xl p-1 lg:w-32 w-16"
                                alt="Logo"
                            />
                        </Link>
                        {/* whitespace-nowrap evita que el texto tenga saltos de linea */}
                        <h1 className="mx-4 my-2 text-xl whitespace-nowrap text-center lg:block hidden">
                            Empresa sin nombre
                        </h1>
                    </div>

                    <nav className="flex flex-col justify-center items-center space-y-1 mb-1">
                        {/* FILTRAR DE MENU ITEMS ESOS ELEMENTOS */}
                        {menuItems
                            .filter((item) =>
                                [
                                    "Dashboard",
                                    "Ordenes",
                                    "Productos",
                                    "Lotes de stock",
                                    "Movimientos",
                                    "Usuarios",
                                    "Ubicaciones",
                                ].includes(item.label),
                            )
                            .map((menuItem) => (
                                <SidebarItem
                                    key={menuItem.label}
                                    setShowMenu={setShowMenu}
                                    item={{
                                        label: menuItem.label,
                                        icon: menuItem.icon,
                                        to: menuItem.to,
                                        isForm: menuItem.isForm,
                                    }}
                                    isMobile={false}
                                />
                            ))}
                    </nav>
                </div>

                <div>
                    <div className="flex flex-col justify-center items-center space-y-1">
                        {menuItems
                            .filter((item) =>
                                [
                                    "Creditos del autor",
                                    "Perfil",
                                    "Cerrar sesión",
                                ].includes(item.label),
                            )
                            .map((menuItem) => (
                                <SidebarItem
                                    key={menuItem.label}
                                    setShowMenu={setShowMenu}
                                    item={{
                                        label: menuItem.label,
                                        icon: menuItem.icon,
                                        to: menuItem.to,
                                        isForm: menuItem.isForm,
                                    }}
                                    isMobile={false}
                                />
                            ))}
                    </div>
                </div>
            </div>
        </>
    );
};
