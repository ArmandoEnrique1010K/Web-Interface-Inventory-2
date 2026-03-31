import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DeliveryLineUpdateForm } from "../../types";
import { useForm } from "react-hook-form";
import { updateDeliveryLine } from "../../api/DeliveryLineAPI";
import type { GeneralError } from "@/types/index";
import { toast } from "sonner";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";
import { InputText } from "@/ui/fields/InputText";
import { InputDateTime } from "@/ui/fields/InputDateTime";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@/ui/Button";
import { handleFormatDateTimeWithoutT } from "@/utils/handleFormatDateTime";

type Props = {
    setEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    deliveryLineId: string,
    deliveryOrderId: string,
    limitDate: string,
    requiredQuantity: string
}

export const EditDeliveryLineModal = ({ setEditModalOpen, deliveryLineId, deliveryOrderId, limitDate, requiredQuantity }: Props) => {

    const initialValues: DeliveryLineUpdateForm = {
        requiredQuantity: requiredQuantity,
        limitDate: `${handleFormatDateTimeWithoutT(new Date(limitDate))}`,
        movementComment: ""
    }

    const { register, handleSubmit, setError, control, formState: { errors } } = useForm<DeliveryLineUpdateForm>({
        defaultValues: initialValues
    })

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: updateDeliveryLine,
        onError: (error: GeneralError) => {
            // Error de campo
            if (error.type === 'FIELD_ERROR') {
                Object.entries(error.fields).forEach(([field, message]) => {
                    setError(field as keyof DeliveryLineUpdateForm, {
                        type: 'server',
                        message: message as string,
                    })
                })

                toast.error(error.message)
                return
            }

            // Error general
            if (error.type === 'GENERAL_ERROR') {
                toast.error(error.message)
                return
            }
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['deliveryLines', 'deliveryOrder', deliveryOrderId] })
            queryClient.invalidateQueries({ queryKey: ["deliveryLine", deliveryLineId ? +deliveryLineId : 0] })
            toast.success(data)
            setEditModalOpen(false)
        }
    })

    const handleForm = (formData: DeliveryLineUpdateForm) => {
        const data = {
            formData,
            deliveryLineId
        }
        mutate(data)
    }

    return (
        <EntityFormLayout isCompact>
            <EntityFormLayout.Form onSubmit={handleSubmit(handleForm)}>
                <EntityFormLayout.Inputs isCompact>
                    <InputText
                        id="requiredQuantity"
                        label="Cantidad requerida"
                        placeholder="Cantidad"
                        type="text"
                        errorMessage={errors.requiredQuantity}
                        functionEnabled={register('requiredQuantity')} />
                    <InputDateTime<DeliveryLineUpdateForm>
                        id={"limitDate"}
                        label={"Fecha limite"}
                        name={"limitDate"}
                        control={control}
                        errorMessage={errors.limitDate?.message}
                    />
                    <InputText
                        id="movementComment"
                        label="Comentario"
                        placeholder="Escriba un comentario"
                        type="text"
                        errorMessage={errors.movementComment}
                        functionEnabled={register('movementComment')} />

                </EntityFormLayout.Inputs>
                <EntityFormLayout.Actions>
                    <Button
                        icon={<ArrowUpCircleIcon />}
                        size="large"
                        text="Agregar"
                        type="submit"
                        color="green"
                        showIconOnMobile={false}
                        showTextOnMobile
                        isLargeOnMobile
                    />
                    <Button
                        type='button'
                        icon={<XCircleIcon />}
                        size="large"
                        text="Cancelar"
                        color="gray"
                        onClick={() => setEditModalOpen(false)}
                        showIconOnMobile={false}
                        showTextOnMobile
                        isLargeOnMobile
                    />
                </EntityFormLayout.Actions>

            </EntityFormLayout.Form>
        </EntityFormLayout>
    )
}
