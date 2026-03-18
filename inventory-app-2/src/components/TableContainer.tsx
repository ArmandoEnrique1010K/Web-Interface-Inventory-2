import type React from "react";
import { TextMessage } from "./TextMessage";
import { Subtitle } from "./Subtitle";


type Props = {
    title?: string,
    headers: string[];
    isError: boolean
    isEmpty: boolean;
    itemsCounter?: React.ReactNode;
    paginator?: React.ReactNode;
    children: React.ReactNode;
}

export const TableContainer = ({ title, itemsCounter, headers, isError, isEmpty, paginator, children }: Props) => {

    // if (isError) {
    //     return <TextMessage text="Ha ocurrido un error" align="center" color="red" />
    // }

    // if (isEmpty) {
    //     return <TextMessage text="No hay datos" align="center" color="red" />
    // }

    return (
        // TODO: ES IMPOSIBLE AÑADIR UN STICKY
        // <div className="overflow-x-auto overflow-y-auto max-h-[500px] bg-white shadow-sm rounded-xl border border-gray-200 p-6">
        <div className='bg-white shadow-sm rounded-xl border border-gray-200 p-6'>

            {
                isError && <TextMessage text="Ha ocurrido un error" align="center" color="red" />
            }

            {
                isEmpty && <TextMessage text="No hay datos" align="center" color="red" />
            }

            {
                (!isError && !isEmpty) && <>

                    {title && <div className="pb-4"><Subtitle>{title}</Subtitle></div>}

                    {itemsCounter &&
                        <div className="pb-4">
                            {itemsCounter}
                        </div>}


                    <div className="overflow-x-auto">

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

                    </div>
                    {paginator &&
                        <div className="pt-8">
                            {paginator}
                        </div>
                    }


                </>
            }


        </div>
    )
}
