

type Props = {
    headers: string[];
    children: React.ReactNode;
}

export const TableHeaderContainer = ({ headers, children }: Props) => {
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
