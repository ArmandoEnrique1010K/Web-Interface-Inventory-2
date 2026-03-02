import { Button } from "@/ui/Button"

type Props = {
    currentPage: number
    totalPages: number
    isFirst: boolean
    isLast: boolean
    onPageChange: (page: number) => void
}

export const Paginator = ({
    currentPage,
    totalPages,
    isFirst,
    isLast,
    onPageChange
}: Props) => {

    const goFirst = () => onPageChange(0)
    const goLast = () => onPageChange(totalPages - 1)
    const goPrev = () => onPageChange(currentPage - 1)
    const goNext = () => onPageChange(currentPage + 1)
    const goToPage = (page: number) => onPageChange(page);


    return (
        <div className="flex flex-col gap-2 mt-4 text-center">
            <div className="flex items-center gap-2 justify-center">
                <Button
                    text="Primera"
                    type="button"
                    color="blue"
                    disabled={isFirst}
                    onClick={goFirst}
                    size="small"
                    aditionalStyles="px-4"
                />
                <Button
                    text="Anterior"
                    type="button"
                    color="blue"
                    disabled={isFirst}
                    onClick={goPrev}
                    size="small"
                    aditionalStyles="px-4"
                />

                {
                    !(currentPage - 2 < 0) && (
                        <Button
                            text={(currentPage - 1).toString()}
                            type="button"
                            color="blue"
                            onClick={() => goToPage(currentPage - 2)}
                            size="small"
                            aditionalStyles="px-4"
                        />
                    )
                }
                {
                    !(currentPage - 1 < 0) && (
                        <Button
                            text={(currentPage).toString()}
                            type="button"
                            color="blue"
                            onClick={() => goToPage(currentPage - 1)}
                            size="small"
                            aditionalStyles="px-4"
                        />
                    )
                }
                <Button
                    text={(currentPage + 1).toString()}
                    type="button"
                    color="green"
                    disabled={true}
                    size="small"
                    aditionalStyles="px-4"
                />

                {
                    !(currentPage + 1 >= totalPages) && (
                        <Button
                            text={(currentPage + 2).toString()}
                            type="button"
                            color="blue"
                            onClick={() => goToPage(currentPage + 1)}
                            size="small"
                            aditionalStyles="px-4"
                        />
                    )
                }

                {
                    !(currentPage + 2 >= totalPages) && (
                        <Button
                            text={(currentPage + 3).toString()}
                            type="button"
                            color="blue"
                            onClick={() => goToPage(currentPage + 2)}
                            size="small"
                            aditionalStyles="px-4"
                        />
                    )
                }


                <Button
                    text="Siguiente"
                    type="button"
                    color="blue"
                    disabled={isLast}
                    onClick={goNext}
                    size="small"
                    aditionalStyles="px-4"
                />

                <Button
                    text="Última"
                    type="button"
                    color="blue"
                    disabled={isLast}
                    onClick={goLast}
                    size="small"
                    aditionalStyles="px-4"
                />
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

