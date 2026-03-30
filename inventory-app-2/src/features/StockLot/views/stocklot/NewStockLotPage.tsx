import { useForm } from 'react-hook-form'
import type { CompanyItem, StockLotReceiveForm } from '../../types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { registerStockLot } from '../../api/StockLotAPI'
import type { GeneralError } from '@/types/index'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { InputText } from '@/ui/fields/InputText'
import { SelectOption } from '@/ui/fields/SelectOption'
import { listAllCompanies } from '../../api/CompanyAPI'
import { Button } from '@/ui/Button'
import { ButtonLink } from '@/ui/ButtonLink'
import { ArrowUpCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { EntityFormLayout } from '@/layout/entity/EntityFormLayout'
import { AsyncSelectField } from '@/ui/fields/AsyncSelectOption'
import { listFirstTenModelsByKeyword } from '@/features/Product/api/ModelAPI'

export const NewStockLotPage = () => {

    const initialValues: StockLotReceiveForm = {
        quantity: '',
        comment: '',
        modelId: '',
        companyId: ''
    }

    const { register, handleSubmit, control, setError, formState: { errors } } = useForm<StockLotReceiveForm>({
        defaultValues: initialValues
    })

    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: registerStockLot,
        onError: (error: GeneralError) => {
            // Error de campo
            if (error.type === 'FIELD_ERROR') {
                Object.entries(error.fields).forEach(([field, message]) => {
                    setError(field as keyof StockLotReceiveForm, {
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
            navigate('/stocklots')
        }
    })

    const { data: companiesData } = useQuery({
        queryKey: ['companies'],
        queryFn: listAllCompanies
    })
    const companies = companiesData?.map((company: CompanyItem) => ({
        value: company.id,
        label: company.name,
    })) || []



    return (
        <EntityFormLayout>
            <EntityFormLayout.Header title="Registrar nuevo lote de stock"></EntityFormLayout.Header>
            <EntityFormLayout.Form styled

                onSubmit={handleSubmit((data) => mutate(data))}
            >
                <EntityFormLayout.Inputs>
                    {/* TODO: URGENTE, EN LA API REST SE PODRIA DEFINIR UN CAMPO PARA COLOCAR LA FECHA, QUE SEA LA FECHA DE HOY O ANTERIOR A ESA PARA REGISTRAR EL LOTE DE ENTREGA */}
                    <InputText
                        id="quantity"
                        label="Cantidad"
                        placeholder="Cantidad o unidades"
                        type="text"
                        errorMessage={errors.quantity}
                        functionEnabled={register('quantity')} />
                    <InputText
                        id="comment"
                        label="Breve comentario"
                        placeholder="Escriba algun breve comentario..."
                        type="text"
                        errorMessage={errors.comment}
                        functionEnabled={register('comment')} />

                    <SelectOption
                        id="companyId"
                        label="Empresa importadora"
                        errorMessage={errors.companyId}
                        functionEnabled={register('companyId')}
                        options={companies}
                        textInNullOption="Seleccione una empresa importadora"
                    />

                    <AsyncSelectField<StockLotReceiveForm>
                        label="ID del modelo"
                        name="modelId"
                        control={control}
                        errorMessage={errors.modelId?.message}
                        loadOptions={async (inputValue) => {
                            const data = await listFirstTenModelsByKeyword({ keyword: inputValue });
                            return data.map((model: { id: number; modelProductName: string }) => ({
                                value: model.id,
                                label: model.modelProductName,
                            }));
                        }}

                    />


                </EntityFormLayout.Inputs>

                <EntityFormLayout.Actions>
                    <Button icon={<ArrowUpCircleIcon />} size="large" text='Añadir' type="submit" color="green" />
                    <ButtonLink icon={<XCircleIcon />} size="large" text="Cancelar" color="gray" to="/stocklots" />

                </EntityFormLayout.Actions>
            </EntityFormLayout.Form>

        </EntityFormLayout >
    )
}
