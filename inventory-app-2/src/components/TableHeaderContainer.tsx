import { TextMessage } from "./TextMessage";


type Props = {
    headers: string[];
    isError: boolean
    children: React.ReactNode;
    isEmpty: boolean;
    isLoading: boolean;
}

export const TableHeaderContainer = ({ headers, children, isError, isEmpty, isLoading }: Props) => {

    if (isLoading) {
        return <TextMessage text="Cargando..." align="center" color="black" />
    }

    if (isError) {
        return <TextMessage text="Ha ocurrido un error" align="center" color="red" />
    }

    if (isEmpty) {
        return <TextMessage text="No hay datos" align="center" color="red" />
    }

    return (
        <div className='overflow-x-auto' >

            <table className=' border-collapse border border-gray-300 overflow-hidden w-full'>
                <thead>
                    <tr className='bg-gray-800 text-white'>
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
    )
}
