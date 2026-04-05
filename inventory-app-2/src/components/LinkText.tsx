import React from "react";
import { Link } from "react-router-dom";

type Props = {
    to: string;
    children: React.ReactNode;
    target?: "_blank";
    rel?: "noopener noreferrer";
};
// Sirve para mostrar un texto que a su vez es un enlace hacia otra pagina
export const LinkText = ({ to, children, target, rel }: Props) => {
    return (
        <Link
            to={to}
            target={target}
            rel={rel}
            className="hover:text-blue-500 hover:underline"
        >
            {children}
        </Link>
    );
};
