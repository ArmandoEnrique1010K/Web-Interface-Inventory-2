import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { inactiveRelationModelToDeliveryOrder, registerRelationModelToDeliveryOrder } from '../../api/ModelDeliveryOrderAPI';
import type { GeneralError } from '@/types/index';
import { toast } from 'sonner';
import { Button } from '@/ui/Button';
import type { ModelDeliveryOrderItem } from '../../types';

type Props = {
    modelId: string,
    deliveryOrderId: string
    existingModels: ModelDeliveryOrderItem[] // Nuevo prop
    modelDeliveryOrderId?: number
}

export const AddModelDeliveryOrderButton = ({ modelId, deliveryOrderId, existingModels, modelDeliveryOrderId }: Props) => {
    const { handleSubmit } = useForm();
    const queryClient = useQueryClient();

    const isAlreadyAdded = existingModels.some(model => +model.modelId === Number(modelId))

    const { mutate: mutateRegister } = useMutation({
        mutationFn: () => registerRelationModelToDeliveryOrder(modelId, deliveryOrderId),
        onError: (error: GeneralError) => {
            // Error general
            if (error.type === 'GENERAL_ERROR') {
                toast.error(error.message)
                return
            }
        },
        onSuccess: async (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ['models', 'deliveryOrder', deliveryOrderId] })
        }
    })

    const { mutate: mutateInactive } = useMutation({
        mutationFn: () => inactiveRelationModelToDeliveryOrder(modelDeliveryOrderId!.toString()),
        onError: (error: GeneralError) => {
            // Error general
            if (error.type === 'GENERAL_ERROR') {
                toast.error(error.message)
                return
            }
        },
        onSuccess: async (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ['models', 'deliveryOrder', deliveryOrderId] })
        }
    })

    return (
        <>
            {
                isAlreadyAdded ? (
                    <form onSubmit={handleSubmit(() => mutateInactive())} >
                        <Button
                            text={"Añadir"}
                            type="submit"
                            size={"small"}
                            color={'green-outline'}
                            showTextOnMobile={true}
                            isLargeOnMobile={false}
                        />
                    </form>

                ) : (

                    <form onSubmit={handleSubmit(() => mutateRegister())} >
                        {/* TODO: AÑADIR UN ICONO PARA MOSTRAR CUANDO EL PRODUCTO ESTE ACTIVO */}
                        <Button
                            text={"Quitar"}
                            type="submit"
                            size={"small"}
                            color={'red-outline'}
                            showTextOnMobile={true}
                            isLargeOnMobile={false}
                        />
                    </form>


                )

            }
        </>


    )
}

