type Props = {
    totalElements: number
    page: number
    size: number
    last: boolean
}

export const SearchCounter = ({ totalElements, page, size, last }: Props) => {
    return (
        <div className='text-sm'>Se han encontrado {totalElements} elementos ♦ Se obtuvierón los primeros {!last ? size * (page + 1) : totalElements} elementos ♦ Omitiendo {size * (page)} elementos</div>
    )
}
