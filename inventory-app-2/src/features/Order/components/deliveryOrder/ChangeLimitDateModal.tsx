import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { DeliveryOrderChangeLimitDateForm } from "../../types"
import { useForm } from "react-hook-form"
import { changeLimitDateDeliveryOrder } from "../../api/DeliveryOrderAPI"
import type { GeneralError } from "@/types/index"
import { toast } from "sonner"
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout"
import { InputDateTime } from "@/ui/fields/InputDateTime"
import { Button } from "@/ui/Button"
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline"
import { handleFormatDateTime } from "@/utils/handleFormatDateTime"

type Props = {
    setChangeLimitDateModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    deliveryOrderId: string
}

export const ChangeLimitDateModal = ({ setChangeLimitDateModalOpen, deliveryOrderId }: Props) => {
    const initialValues: DeliveryOrderChangeLimitDateForm = {
        limitDate: '',
    }

    const { handleSubmit, setError, control, formState: { errors } } = useForm<DeliveryOrderChangeLimitDateForm>({
        defaultValues: initialValues
    })
    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: (data: DeliveryOrderChangeLimitDateForm) => {
            if (!data.limitDate) {
                return changeLimitDateDeliveryOrder(deliveryOrderId, {
                    limitDate: ''
                })
            }

            return changeLimitDateDeliveryOrder(deliveryOrderId, {
                limitDate: handleFormatDateTime(new Date(data.limitDate))
            })
        }
        ,
        onError: (error: GeneralError) => {
            if (error.type === 'FIELD_ERROR') {
                Object.entries(error.fields).forEach(([field, message]) => {
                    setError(field as keyof DeliveryOrderChangeLimitDateForm, {
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
        onSuccess: async (data) => {
            toast.success(data)
            setChangeLimitDateModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["deliveryOrder", deliveryOrderId] })
        }
    })


    return (
        <EntityFormLayout isCompact>
            <EntityFormLayout.Form
                styled={false}
                onSubmit={handleSubmit((data) => {
                    mutate(data)
                })}
            >
                <EntityFormLayout.Inputs isCompact>
                    <InputDateTime<DeliveryOrderChangeLimitDateForm>
                        id='limitDate'
                        label='Nueva fecha limite de entrega'
                        name={'limitDate'}
                        control={control}
                        errorMessage={errors.limitDate?.message}
                    />
                </EntityFormLayout.Inputs>
                <EntityFormLayout.Actions>
                    <Button
                        icon={<ArrowUpCircleIcon />}
                        size="large"
                        text="Cambiar"
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
                        onClick={() => setChangeLimitDateModalOpen(false)}
                        showIconOnMobile={false}
                        showTextOnMobile
                        isLargeOnMobile
                    />
                </EntityFormLayout.Actions>

            </EntityFormLayout.Form>

        </EntityFormLayout>
    )
}

