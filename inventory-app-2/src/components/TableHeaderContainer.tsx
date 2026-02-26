

type Props = {
    headers: string[];
    isError: boolean
    children: React.ReactNode;
    isEmpty: boolean;
}

export const TableHeaderContainer = ({ headers, children, isError, isEmpty }: Props) => {

    if (isError) {
        return <h1>Ha ocurrido un error</h1>
    }

    if (isEmpty) {
        return <h1>No hay datos</h1>
    }

    return (
        <table className='w-full border-collapse border border-gray-300 overflow-hidden'>
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

    )
}
