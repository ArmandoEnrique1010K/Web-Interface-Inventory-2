
type Props = {
    currentPage: number
    totalPages: number
    totalElements: number
    size: number
    isFirst: boolean
    isLast: boolean
    onPageChange: (page: number) => void
}

export const Paginator = ({
    currentPage,
    totalPages,
    totalElements,
    size,
    isFirst,
    isLast,
    onPageChange
}: Props) => {

    const goFirst = () => onPageChange(0)
    const goLast = () => onPageChange(totalPages - 1)
    const goPrev = () => onPageChange(currentPage - 1)
    const goNext = () => onPageChange(currentPage + 1)


    return (
        <div className="flex flex-col gap-2 mt-4 text-center">
            <div className="text-sm">
                En total hay {totalElements} elementos · {totalPages === 1 ? 'Existe 1 página' : 'Existen ' + totalPages + ' páginas'} · {size} elementos por página
            </div>

            <div className="flex items-center gap-2 font-bold justify-center">
                <button
                    disabled={isFirst}
                    onClick={goFirst}
                    className="px-2 py-1 border disabled:opacity-40"
                >
                    Primera
                </button>

                <button
                    disabled={isFirst}
                    onClick={goPrev}
                    className="px-2 py-1 border disabled:opacity-40"
                >
                    Anterior
                </button>

                <span className="px-3">
                    {currentPage + 1} / {totalPages}
                </span>

                <button
                    disabled={isLast}
                    onClick={goNext}
                    className="px-2 py-1 border disabled:opacity-40"
                >
                    Siguiente
                </button>

                <button
                    disabled={isLast}
                    onClick={goLast}
                    className="px-2 py-1 border disabled:opacity-40"
                >
                    Última
                </button>
            </div>
        </div>
    )
}// <div>
//     {/* TODO: QUEDA PENDIENTE EL PAGINADOR */}
//     Pagina actual: {JSON.stringify(data?.page)}
// </div>

// <div>
//     Total de paginas: {JSON.stringify(data?.totalPages)}
// </div>

// <div>
//     Total de registros: {JSON.stringify(data?.totalElements)}
// </div>
// <div>
//     {JSON.stringify(data?.first) === 'true' ? 'Es la primera pagina' : 'No es la primera pagina'}
// </div>
// <div>
//     {JSON.stringify(data?.last) === 'true' ? 'Es la ultima pagina' : 'No es la ultima pagina'}
// </div>

// <div>
//     Cada pagina contiene {JSON.stringify(data?.size)} elementos
// </div>

