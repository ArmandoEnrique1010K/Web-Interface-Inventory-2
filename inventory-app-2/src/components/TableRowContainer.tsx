
type Props = {
    children: React.ReactNode;
}

export const TableRowContainer = ({ children }: Props) => {
    return (
        <tr className='bg-white hover:bg-slate-50 transition-colors'>
            {children}
        </tr>
    )
}
