import React from "react";
import { Link } from "react-router-dom";

type Props = {
    to: string;
    children: React.ReactNode;
};
// Sirve para mostrar un texto que a su vez es un enlace hacia otra pagina
export const LinkText = ({ to, children }: Props) => {
    return (
        <Link to={to} className="hover:text-blue-500 hover:underline">
            {children}
        </Link>
    );
};
