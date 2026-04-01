import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { DeliveryOrderCommentForm } from "../../types"
import { useForm } from "react-hook-form"
import type { GeneralError } from "@/types/index"
import { toast } from "sonner"
import { cancelDeliveryOrder } from "../../api/DeliveryOrderAPI"
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout"
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline"
import { Button } from "@/ui/Button"
import { InputText } from "@/ui/fields/InputText"
import { useNavigate } from "react-router-dom"

type Props = {
    setCancelModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    deliveryOrderId: string,
}

export const CancelDeliveryOrderModal = ({ deliveryOrderId, setCancelModalOpen }: Props) => {

    const initialValues: DeliveryOrderCommentForm = {
        movementComment: ''
    }

    const { register, handleSubmit, setError, formState: { errors } } = useForm<DeliveryOrderCommentForm>({
        defaultValues: initialValues
    })

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Mutacion para guardar los cambios
    const { mutate } = useMutation({
        mutationFn: cancelDeliveryOrder,
        onError: (error: GeneralError) => {
            // Error de campo
            if (error.type === 'FIELD_ERROR') {
                Object.entries(error.fields).forEach(([field, message]) => {
                    setError(field as keyof DeliveryOrderCommentForm, {
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
            queryClient.removeQueries({ queryKey: ["deliveryOrder", deliveryOrderId] })
            toast.success(data)
            setCancelModalOpen(false)
            navigate(`/orders`)

        }
    })
    const handleForm = (formData: DeliveryOrderCommentForm) => {
        const data = {
            formData,
            deliveryOrderId
        }
        mutate(data)
    }

    return (
        <EntityFormLayout isCompact>
            <EntityFormLayout.Form
                styled={false}
                onSubmit={handleSubmit(handleForm)}
            >
                <EntityFormLayout.Inputs isCompact>
                    <InputText
                        id="movementComment"
                        label="Comentario"
                        type="text"
                        placeholder="Escriba un comentario"
                        errorMessage={errors.movementComment}
                        functionEnabled={register('movementComment')}
                    />
                </EntityFormLayout.Inputs>
                <EntityFormLayout.Actions>
                    <Button
                        icon={<ArrowUpCircleIcon />}
                        size="large"
                        text="Cancelar orden"
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
                        text="No cancelar"
                        color="gray"
                        onClick={() => setCancelModalOpen(false)}
                        showIconOnMobile={false}
                        showTextOnMobile
                        isLargeOnMobile
                    />
                </EntityFormLayout.Actions>

            </EntityFormLayout.Form>

        </EntityFormLayout>
    )
}
