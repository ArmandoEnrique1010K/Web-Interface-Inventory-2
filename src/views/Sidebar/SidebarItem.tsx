import { logout } from "@/features/Auth/api/AuthAPI";
import { clearAuth } from "@/reducers/authSlice";
import type { GeneralError, MenuItem } from "@/types";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Props = {
    item: MenuItem;
    isMobile: boolean;
    setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SidebarItem = ({ isMobile, item, setShowMenu }: Props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const { mutate } = useMutation({
        mutationFn: logout,
        retry: false,
        onError: (error: unknown) => {
            const e = error as GeneralError;

            if (e.type === "GENERAL_ERROR") {
                toast.error(e.message);
                return;
            }
        },
        onSuccess: (data) => {
            // Redirigir al usuario a la página de login
            toast.success(data);
            navigate("/");
            // Limpiar la autenticación
            dispatch(clearAuth());
        },
    });

    const styleToCurrentPath = (to: string) => {
        if (to === "/") {
            return location.pathname === "/"
                ? "bg-blue-600 text-white"
                : "bg-slate-600";
        }

        return location.pathname.startsWith(to)
            ? "bg-blue-600 text-white"
            : "bg-slate-600";
    };

    const baseClass = `
        flex items-center justify-center gap-3 px-4 py-2 w-full 
        text-slate-300
        hover:bg-slate-800 hover:text-white
        transition-colors
        ${item.to ? styleToCurrentPath(item.to) : "bg-slate-600"}
    `;

    if (item.isForm) {
        return (
            <form
                key={item.label}
                className="w-full"
                onSubmit={(e) => {
                    e.preventDefault();
                    mutate();
                    if (isMobile) setShowMenu(false);
                }}
            >
                <button
                    type="submit"
                    className={`${baseClass} hover:cursor-pointer`}
                >
                    {item.icon && <div>{item.icon}</div>}
                    <span className="py-1 block sm:hidden lg:block">
                        {item.label}
                    </span>
                </button>
            </form>
        );
    }

    return (
        <Link
            key={item.label}
            to={item.to!}
            onClick={() => isMobile && setShowMenu(false)}
            className={baseClass}
        >
            {item.icon && <div>{item.icon}</div>}
            <span className="py-1 block sm:hidden lg:block">{item.label}</span>
        </Link>
    );
};
