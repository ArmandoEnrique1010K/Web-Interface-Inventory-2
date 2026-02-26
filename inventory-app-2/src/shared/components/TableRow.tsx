
type Props = {
    children: React.ReactNode;
}

export const TableRow = ({ children }: Props) => {
    return (
        <tr className='bg-white hover:bg-blue-100 transition-colors'>
            {children}
        </tr>
    )
}
