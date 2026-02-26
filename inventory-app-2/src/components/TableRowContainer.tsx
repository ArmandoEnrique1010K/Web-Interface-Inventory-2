
type Props = {
    children: React.ReactNode;
}

export const TableRowContainer = ({ children }: Props) => {
    return (
        <tr className='bg-white hover:bg-blue-100 transition-colors'>
            {children}
        </tr>
    )
}
