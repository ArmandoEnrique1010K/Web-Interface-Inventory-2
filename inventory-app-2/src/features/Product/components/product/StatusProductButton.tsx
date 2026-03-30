import { useMutation, useQueryClient } from "@tanstack/react-query"
import { changeStatusProduct } from "../../api/ProductAPI"
import type { GeneralError } from "@/types/index"
import { toast } from "sonner"
import { Button } from "@/ui/Button"
import { useNavigate, useParams } from "react-router-dom"
import { useState } from "react"
import { Modal } from "@/components/Modal"

export const StatusProductButton = ({ from, productId, size, isActive }: { from?: string, productId: string, size: 'small' | 'large', isActive: boolean }) => {

    const [confirmationModal, setConfirmationModal] = useState(false);
    const { modelId } = useParams()

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: () => changeStatusProduct(productId),
        onError: (error: GeneralError) => {
            // Error general
            if (error.type === 'GENERAL_ERROR') {
                toast.error(error.message)
                return
            }
        },
        onSuccess: async (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ["products"] })
            queryClient.invalidateQueries({ queryKey: ['product', productId], })

            // OPCIONALMENTE SI HAY UN modelId en la URL actual, lo debe invalidar
            if (modelId) {
                queryClient.invalidateQueries({ queryKey: ['model', modelId ? +modelId : 0] })
            }

            if (from === 'product-details') {
                navigate('/products')
            }


        }
    })
    const handleClick = () => {
        if (isActive) {
            setConfirmationModal(true)
        } else {
            mutate()
        }
    }
    // MOSTRAR UNA VENTANA MODAL QUE INDIQUE QUE TODOS LOS MODELOS DEL PRODUCTO SE DESATIVARAN SI SE CAMBIA EL ESTADO A FALSE
    return (

        <>
            <Button
                type="button"
                text={isActive ? "Activo" : "Inactivo"}
                onClick={handleClick}
                size={size}
                color={isActive ? 'green-outline' : 'red-outline'}
                showIconOnMobile={false}
                showTextOnMobile={true}
                isLargeOnMobile={false}
            />

            {isActive && confirmationModal && (
                <Modal
                    isOpen={confirmationModal}
                    size="lg"
                    onClose={() => setConfirmationModal(false)}
                    title={`¿Desactivar producto #${productId}?`}
                >
                    <div className="pb-6">
                        Al desactivar un producto, también se van a desactivar los modelos incluidos en el producto. Recuerda que para activar un modelo debes activar el producto. ¿Desea continuar?
                    </div>

                    <div className="flex flex-row gap-2">
                        <Button
                            type="button"
                            text="Sí"
                            onClick={() => {
                                mutate()
                                setConfirmationModal(false)
                            }}
                            size={'large'}
                            isLarge
                            color="green"
                            showTextOnMobile={true}
                        />

                        <Button
                            type="button"
                            text="No"
                            onClick={() => setConfirmationModal(false)}
                            size={'large'}
                            isLarge
                            color="gray"
                            showTextOnMobile={true}
                        />
                    </div>
                </Modal>
            )}
        </>
    )
}

