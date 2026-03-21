import { Button } from "@/ui/Button"
import { useMediaQuery } from 'react-responsive'

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

    // Se ocultaran algunos botones en dispositivos moviles
    const isMobile = useMediaQuery({ query: '(max-width: 639.99px)' })

    //* En dispositivos moviles no se mostraran los botones de las paginas x - 2, x - 1, x + 1, x + 2, donde x es la pagina actual
    return (
        <div className="flex flex-col gap-2 text-center">
            <div className="flex items-center gap-2 justify-center">
                <Button
                    text="◄◄"
                    type="button"
                    color="blue"
                    disabled={isFirst}
                    onClick={goFirst}
                    size="small"
                    aditionalStyles="px-2"
                    showTextOnMobile
                />
                <Button
                    text="◄"
                    type="button"
                    color="blue"
                    disabled={isFirst}
                    onClick={goPrev}
                    size="small"
                    aditionalStyles="px-2"
                    showTextOnMobile
                />

                {
                    !isMobile && (
                        <>

                            {
                                !(currentPage - 2 < 0) && (
                                    <Button
                                        text={(currentPage - 1).toString()}
                                        type="button"
                                        color="blue"
                                        onClick={() => goToPage(currentPage - 2)}
                                        size="small"
                                        aditionalStyles="px-2"
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
                                        aditionalStyles="px-2"
                                    />
                                )
                            }
                        </>

                    )
                }

                <Button
                    text={(currentPage + 1).toString()}
                    type="button"
                    color="none"
                    size="small"
                    aditionalStyles="px-2"
                    showTextOnMobile
                />

                {
                    !isMobile && (
                        <>
                            {
                                !(currentPage + 1 >= totalPages) && (
                                    <Button
                                        text={(currentPage + 2).toString()}
                                        type="button"
                                        color="blue"
                                        onClick={() => goToPage(currentPage + 1)}
                                        size="small"
                                        aditionalStyles="px-2"
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
                                        aditionalStyles="px-2"
                                    />
                                )
                            }
                        </>

                    )
                }



                <Button
                    text="►"
                    type="button"
                    color="blue"
                    disabled={isLast}
                    onClick={goNext}
                    size="small"
                    aditionalStyles="px-2"
                    showTextOnMobile
                />

                <Button
                    text="►►"
                    type="button"
                    color="blue"
                    disabled={isLast}
                    onClick={goLast}
                    size="small"
                    aditionalStyles="px-2"
                    showTextOnMobile
                />
            </div>
        </div>
    )
}

