type Props = {
    totalElements: number
    page: number
    size: number
    last: boolean
}

export const SearchCounter = ({ totalElements, page, size, last }: Props) => {
    return (
        <div className='text-sm'>Se han encontrado {totalElements} elementos · Se listan los primeros {!last ? size * (page + 1) : totalElements} elementos, omitiendo {size * (page)} elementos</div>
    )
}
