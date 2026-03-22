import { useForm } from "react-hook-form";
import type { StockLotAdjustmentForm } from "../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { GeneralError } from "@/types/index";
import { toast } from "sonner";
import { Button } from "@/ui/Button";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { InputText } from "@/ui/fields/InputText";
import { recoveryStockLot } from "../../api/StockLotAPI";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";

type Props = {
    stockLotId: string,
    showModal: React.Dispatch<React.SetStateAction<boolean>>
}

export const RecoveryStockLotModal = ({ stockLotId, showModal }: Props) => {

    const { register, handleSubmit, setError, formState: { errors } } = useForm<StockLotAdjustmentForm>({
        defaultValues: {
            quantity: '',
            comment: '',
        }
    })
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: recoveryStockLot,
        onError: (error: GeneralError) => {
            // Error de campo
            if (error.type === 'FIELD_ERROR') {
                Object.entries(error.fields).forEach(([field, message]) => {
                    setError(field as keyof StockLotAdjustmentForm, {
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
            queryClient.invalidateQueries({ queryKey: ["stocklots"] })
            queryClient.invalidateQueries({ queryKey: ["stocklot", stockLotId] })
            toast.success(data)
            showModal(false)
        }
    })

    const handleForm = (formData: StockLotAdjustmentForm) => {
        const data = {
            formData,
            stockLotId
        }
        mutate(data)
    }

    return (
        <EntityFormLayout isCompact>
            <EntityFormLayout.Form onSubmit={handleSubmit(handleForm)}>
                <EntityFormLayout.Inputs isCompact>
                    <InputText
                        id="quantity"
                        label="Unidades a recuperar"
                        placeholder="Cantidad"
                        type="text"
                        errorMessage={errors.quantity}
                        functionEnabled={register('quantity')} />

                    <InputText
                        id="comment"
                        label="Comentario breve"
                        placeholder="Comentario..."
                        type="text"
                        errorMessage={errors.comment}
                        functionEnabled={register('comment')} />
                </EntityFormLayout.Inputs>
                <EntityFormLayout.Actions isCompact>
                    <Button
                        icon={<ArrowUpCircleIcon />}
                        size="large"
                        text="Recuperar"
                        type="submit"
                        color="green"
                        showIconOnMobile={false}
                        showTextOnMobile
                        isLargeOnMobile
                    />
                    <Button
                        icon={<XCircleIcon />}
                        size="large"
                        text="Volver"
                        color="gray"
                        type='button'
                        onClick={() => showModal(false)}
                        showIconOnMobile={false}
                        showTextOnMobile
                        isLargeOnMobile
                    />

                </EntityFormLayout.Actions>
            </EntityFormLayout.Form>

        </EntityFormLayout >
    )
}
