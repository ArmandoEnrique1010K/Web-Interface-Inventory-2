import type React from "react";
import { TextMessage } from "./TextMessage";


type Props = {
    headers: string[];
    isError: boolean
    children: React.ReactNode;
    isEmpty: boolean;
    itemsCounter?: React.ReactNode;
    paginator?: React.ReactNode;
}

export const TableHeaderContainer = ({ itemsCounter, headers, children, isError, isEmpty, paginator }: Props) => {

    if (isError) {
        return <TextMessage text="Ha ocurrido un error" align="center" color="red" />
    }

    if (isEmpty) {
        return <TextMessage text="No hay datos" align="center" color="red" />
    }

    return (
        // TODO: ES IMPOSIBLE AÑADIR UN STICKY
        // <div className="overflow-x-auto overflow-y-auto max-h-[500px] bg-white shadow-sm rounded-xl border border-gray-200 p-6">
        <div className='overflow-x-auto bg-white shadow-sm rounded-xl border border-gray-200 p-6'>
            {itemsCounter &&
                <div className="pb-4">
                    {itemsCounter}
                </div>}
            <table className=' border-collapse border border-gray-300 overflow-hidden w-full '>
                <thead>
                    <tr className='bg-slate-100 text-slate-700'>
                        {headers.map((header, index) => (
                            <th key={index} className='border border-gray-300 px-4 py-3 text-left font-semibold'>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {children}
                </tbody>
            </table>
            {paginator &&
                <div className="pt-6">
                    {paginator}
                </div>
            }
        </div>
    )
}
