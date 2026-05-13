import type React from "react";
import { TextMessage } from "./TextMessage";
import { Subtitle } from "./Subtitle";
import { BlueLoader } from "./BlueLoader/BlueLoader";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Button } from "@/ui/Button";

type Props = {
    title?: string;
    headers: string[];
    isError: boolean;
    isEmpty: boolean;
    isLoading: boolean;
    itemsCounter?: React.ReactNode;
    paginator?: React.ReactNode;
    children: React.ReactNode;
    showButton?: boolean;
    showData?: boolean;
};

export const TableContainer = ({
    title,
    itemsCounter,
    headers,
    isError,
    isEmpty,
    paginator,
    children,
    isLoading = false,
    showButton = false, // Mostrar el boton para expandir
    showData = true, // Mostrar la data por defecto
}: Props) => {
    // if (isError) {
    //     return <TextMessage text="Ha ocurrido un error" align="center" color="red" />
    // }

    // if (isEmpty) {
    //     return <TextMessage text="No hay datos" align="center" color="red" />
    // }

    const [showInfo, setShowInfo] = useState(showData);

    return (
        // NOTA: ES IMPOSIBLE AÑADIR UN STICKY
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 sm:p-6 p-4">
            <div className="flex justify-between gap-4">
                {title && (
                    <div
                        className={`${showButton && "hover:text-blue-600 hover:cursor-pointer"} ${showInfo ? "pb-4" : ""}`}
                        onClick={() => {
                            if (showButton === true) {
                                setShowInfo(!showInfo);
                                return;
                            }
                        }}
                    >
                        <Subtitle>{title}</Subtitle>
                    </div>
                )}

                {showButton && (
                    <div>
                        <Button
                            showIconOnMobile
                            type={"button"}
                            size="small"
                            icon={<ArrowDownCircleIcon />}
                            onClick={() => setShowInfo(!showInfo)}
                            color={"blue-outline"}
                        ></Button>
                    </div>
                )}
            </div>
            {showInfo && (
                <>
                    {isLoading && <BlueLoader />}

                    {!isLoading && isError && (
                        <TextMessage
                            text="Ha ocurrido un error"
                            align="center"
                            color="red"
                        />
                    )}

                    {!isLoading && !isError && isEmpty && (
                        <TextMessage
                            text="No hay datos"
                            align="center"
                            color="red"
                        />
                    )}

                    {!isLoading && !isError && !isEmpty && (
                        <>
                            {itemsCounter && (
                                <div className="pb-4">{itemsCounter}</div>
                            )}

                            <div className="overflow-x-auto">
                                <table className=" border-collapse border border-gray-300 overflow-hidden w-full ">
                                    <thead>
                                        <tr className="bg-slate-100 text-slate-700">
                                            {headers.map((header, index) => (
                                                <th
                                                    key={index}
                                                    className="border border-gray-300 px-4 py-3 text-left font-semibold"
                                                >
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>{children}</tbody>
                                </table>
                            </div>
                            {paginator && (
                                <div className="sm:pt-8 pt-4">{paginator}</div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};
