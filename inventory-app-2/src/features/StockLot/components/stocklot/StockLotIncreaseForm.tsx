import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import type { StockLotAdjustmentForm } from "../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { increaseStockLot } from "../../api/StockLotAPI";
import type { GeneralError } from "@/types/index";
import { toast } from "sonner";
import { TitleContainer } from "@/components/TitleContainer";
import { BaseForm } from "@/components/BaseForm";
import { Button } from "@/ui/Button";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { ButtonLink } from "@/ui/ButtonLink";
import { InputText } from "@/ui/fields/InputText";

export const StockLotIncreaseForm = () => {

    const params = useParams();
    const stockLotId = params.id!;

    const navigate = useNavigate();

    const { register, handleSubmit, setError, formState: { errors } } = useForm<StockLotAdjustmentForm>({
        defaultValues: {
            quantity: '',
            comment: '',
        }
    })
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: increaseStockLot,
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
            queryClient.invalidateQueries({ queryKey: ["list-stocklots"] })
            toast.success(data)
            navigate("/stocklots")
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
        <>
            <TitleContainer title={`Agregar cantidad al lote de stock ${stockLotId}`}>

                <BaseForm
                    onSubmit={handleSubmit(handleForm)}
                    buttons={
                        <>
                            <Button icon={<ArrowUpCircleIcon />} size="large" text="Agregar cantidad" type="submit" color="green" />
                            <ButtonLink icon={<XCircleIcon />} size="large" text="Volver" color="gray" to="/stocklots" />
                        </>
                    }
                    inputs={
                        <>
                            <InputText
                                id="quantity"
                                label="Cantidad o unidades a incrementar"
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

                        </>


                    }
                />

            </TitleContainer>

        </>
    )
}
