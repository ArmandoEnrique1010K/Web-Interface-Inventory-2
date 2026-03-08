type CreditItemProps = {
    type: 'div' | 'li'
    url?: string
    children: React.ReactNode
}


export const CreditItem = ({ type, url, children }: CreditItemProps) => {
    return (
        <>
            {type === 'li' && <li className="ml-6 text-base">
                {
                    url ? <a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 underline">{children}</a> : children
                }
            </li>}
            {type === 'div' && <div className="text-base">{children}</div>}
        </>
    )
}
