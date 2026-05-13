import { Title } from "@/components/Title";
import type React from "react";
import { Link } from "react-router-dom";

// COMPOSICION DE COMPONENTES
type Props = {
    children: React.ReactNode;
};

export const EntityDetailsLayout = ({ children }: Props) => {
    return <div className="sm:p-6 p-4 w-full">{children}</div>;
};

type HeaderProps = {
    title: string;
    textDetails?: React.ReactNode;
    actions?: React.ReactNode;
};

EntityDetailsLayout.Header = ({ title, textDetails, actions }: HeaderProps) => {
    return (
        <>
            <div className="flex flex-1 flex-col sm:flex-row justify-between sm:gap-4 gap-0">
                {textDetails ? (
                    <>
                        <div className="flex-5">
                            <Title>{title}</Title>
                        </div>
                        <div className="flex-4 sm:pb-6 pb-4">
                            {textDetails && (
                                <div className="text-xs">{textDetails}</div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <Title>{title}</Title>
                    </>
                )}
            </div>

            {actions && (
                <div className="flex flex-row mb-6 gap-4">{actions}</div>
            )}
        </>
    );
};

type ContentProps = {
    children: React.ReactNode;
    columns?: number;
};

EntityDetailsLayout.Content = ({ children, columns = 2 }: ContentProps) => {
    const gridCols = columns === 1 ? "md:grid-cols-1" : "md:grid-cols-8";

    return (
        <div className="flex flex-col justify-center items-center sm:pb-6 pb-4">
            <div
                className={`mx-auto grid grid-cols-1 ${gridCols} sm:gap-6 gap-4 w-full`}
            >
                {children}
            </div>
        </div>
    );
};

EntityDetailsLayout.Column = ({ children }: Props) => {
    //  bg-white rounded-2xl shadow-sm p-4
    return (
        <div className="flex flex-col sm:gap-6 gap-4 md:col-span-4">
            {children}
        </div>
    );
};

EntityDetailsLayout.Grid = ({ children }: Props) => {
    return <div className="flex flex-col ">{children}</div>;
};

EntityDetailsLayout.Summary = ({ children }: Props) => {
    return <div className="w-full mx-auto">{children}</div>;
};

EntityDetailsLayout.Counter = ({ children }: Props) => {
    return (
        <div
            className="
      flex flex-col sm:flex-row
      sm:justify-between
      gap-2 sm:gap-4
      items-start sm:items-center
      bg-white rounded-2xl shadow-sm p-4 min-h-24
    "
        >
            {children}
        </div>
    );
};

type CounterItemProps = {
    textSingular: string;
    textPlural: string;
    value: number | string;
    to: string;
};

EntityDetailsLayout.CounterItem = ({
    textSingular,
    textPlural,
    value,
    to,
}: CounterItemProps) => {
    return (
        <Link
            className="bg-white rounded-2xl shadow-sm p-4 h-full flex flex-row  sm:gap-6 gap-4 items-center hover:bg-blue-100"
            to={to}
        >
            <span className="sm:text-3xl text-2xl font-bold">{value}</span>
            <span className="text-sm text-gray-500">
                {value !== 1 ? textPlural : textSingular}
            </span>
        </Link>
    );
};
