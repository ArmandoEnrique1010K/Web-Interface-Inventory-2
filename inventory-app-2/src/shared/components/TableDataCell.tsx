type Props = {
    data: React.ReactNode | string,
    isCenter?: boolean
}

export const TableDataCell = ({ data, isCenter }: Props) => {
    return (
        <td className={`
            border border-gray-300 px-4 py-3
            ${isCenter ? 'text-center' : ''}
        `}>
            {data}
        </td>
    )
}
