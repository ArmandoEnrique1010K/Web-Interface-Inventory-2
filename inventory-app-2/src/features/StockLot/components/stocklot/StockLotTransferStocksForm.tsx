import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listAllStockLotsByModelAndExcludeOne, transferStockLot } from "../../api/StockLotAPI";
import type { GeneralError } from "@/types/index";
import { toast } from "sonner";
import { ListElementsContainer } from "@/views/ListElementsContainer";
import { BaseForm } from "@/components/BaseForm";
import { Button } from "@/ui/Button";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { ButtonLink } from "@/ui/ButtonLink";
import { InputText } from "@/ui/fields/InputText";
import type { StockLotDetailsItem, StockLotTransferForm } from "../../types";
import { SelectOption } from "@/ui/fields/SelectOption";
import { TextMessage } from "@/components/TextMessage";

type Props = {
    data: StockLotDetailsItem,
    stockLotEmitterId: string
}

export const StockLotTransferStocksForm = ({ data, stockLotEmitterId }: Props) => {


    const navigate = useNavigate();

    const { register, handleSubmit, setError, formState: { errors } } = useForm<StockLotTransferForm>({
        defaultValues: {
            quantity: '',
            comment: '',
            stockLotReceiverId: ''
        }
    })
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: transferStockLot,
        onError: (error: GeneralError) => {
            // Error de campo
            if (error.type === 'FIELD_ERROR') {
                Object.entries(error.fields).forEach(([field, message]) => {
                    setError(field as keyof StockLotTransferForm, {
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
            queryClient.invalidateQueries({ queryKey: ['stocklot', stockLotEmitterId] })
            toast.success(data)
            navigate("/stocklots")
        }
    })

    const handleForm = (formData: StockLotTransferForm) => {
        const data = {
            stockLotEmitterId,
            formData
        }
        mutate(data)
    }

    // OBTENER LOS LOTES DE STOCK CORRESPONDIENTES AL MODELO
    const { data: stockLotsData } = useQuery({
        queryKey: ['stocklots', 'model', data.modelId],
        queryFn: () => listAllStockLotsByModelAndExcludeOne(stockLotEmitterId, data.companyId, data.modelId),
    })
    const stockLotsByModelAndCompany = stockLotsData?.map((stockLot: StockLotDetailsItem) => ({
        value: stockLot.id,
        label: stockLot.batch,
    })) || []

    // TODO: SE PODRIA MOSTRAR UN COMPONENTE PARA UN MENSAJE DE ERROR
    // Si no hay lotes de stock asociados, entonces no debe hacer nada
    if (stockLotsByModelAndCompany.length === 0) {
        // return (
        //     <div className="text-center py-8">
        //         <p className="text-gray-600 mb-4">No hay lotes de stock disponibles para transferir</p>
        //         <button onClick={() => navigate('/stocklots')}>
        //             Regresar
        //         </button>
        //     </div>
        // )

        return <TextMessage text='Ha ocurrido un error' align='left' color='red' />

    }

    return (
        <>
            <ListElementsContainer title={`Transferir 'x' unidades del lote de stock ${stockLotEmitterId} a otro lote de stock`}>
                <BaseForm
                    onSubmit={handleSubmit(handleForm)}
                    buttons={
                        <>
                            <Button icon={<ArrowUpCircleIcon />} size="large" text="Transferir" type="submit" color="green" />
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

                            {/* TODO: PODRIA SER MÁS INTUITIVO */}
                            {/* OBTENER LOS LOTES DE STOCK CUYO MODELO SEA EL MISMO DEL STOCK LOT EMITTER */}

                            <SelectOption
                                id="stockLotReceiverId"
                                label="Lote de stock receptor"
                                errorMessage={errors.stockLotReceiverId}
                                functionEnabled={register('stockLotReceiverId')}
                                options={stockLotsByModelAndCompany}
                                textInNullOption="Seleccione un código del lote de stock receptor"
                            />

                        </>
                    }
                />
            </ListElementsContainer>
        </>
    )
}
