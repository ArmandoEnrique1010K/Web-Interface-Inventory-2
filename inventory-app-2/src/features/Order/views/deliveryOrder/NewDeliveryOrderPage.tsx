import type { DeliveryOrderForm } from '../../types'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import type { GeneralError } from '@/types/index'
import { registerDeliveryOrder } from '../../api/DeliveryOrderAPI'
import { toast } from 'sonner'
import { listFirstTenUsersByKeyword } from '@/features/User/api/UserAPI'
import { EntityFormLayout } from '@/layout/entity/EntityFormLayout'
import { Button } from '@/ui/Button'
import { ButtonLink } from '@/ui/ButtonLink'
import { ArrowUpCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { InputDateTime } from '@/ui/fields/InputDateTime'
import { AsyncSelectField } from '@/ui/fields/AsyncSelectOption'

export const NewDeliveryOrderPage = () => {
    const initialValues: DeliveryOrderForm = {
        limitDate: '',
        userIdClient: ''
    }

    // NOTA: NO SE UTILIZA LA FUNCIÓN DE register
    const { handleSubmit, setError, control, formState: { errors } } = useForm<DeliveryOrderForm>({
        defaultValues: initialValues
    })
    const navigate = useNavigate();
    const { mutate } = useMutation({
        mutationFn: registerDeliveryOrder,
        onError: (error: GeneralError) => {
            console.log(error)
            if (error.type === 'FIELD_ERROR') {
                Object.entries(error.fields).forEach(([field, message]) => {
                    setError(field as keyof DeliveryOrderForm, {
                        type: 'server',
                        message: message as string,
                    })
                })

                console.log(error)
                toast.error(error.message)
                return
            }

            if (error.type === 'GENERAL_ERROR') {
                toast.error(error.message)
                return
            }
        },
        onSuccess: async (data) => {
            toast.success(data)
            navigate('/orders')
        }
    })



    return (
        <EntityFormLayout>
            <EntityFormLayout.Header title='Agregar nueva orden de entrega'></EntityFormLayout.Header>
            <EntityFormLayout.Form styled onSubmit={
                handleSubmit((data) => {
                    mutate(data)
                })
            }>

                <EntityFormLayout.Inputs>

                    <InputDateTime<DeliveryOrderForm>
                        id="limitDate"
                        label="Fecha limite de entrega"
                        name="limitDate"
                        control={control}
                        errorMessage={errors.limitDate?.message}
                    />


                    {/* INPUT PARA FILTRAR */}
                    {/* SELECT CON RESULTADOS */}

                    {/* <div className="flex flex-col gap-2">
                        <label>Buscar cliente</label>
                        <input
                            type="text"
                            placeholder="Escribe el nombre..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="border rounded-lg p-2"
                        />
                    </div>

                    <SelectOption
                        id="userIdClient"
                        label='Cliente'
                        errorMessage={errors.userIdClient}
                        functionEnabled={register('userIdClient')}
                        options={options}
                        textInNullOption={
                            isLoading
                                ? 'Buscando...'
                                : options.length === 0
                                    ? 'Sin resultados'
                                    : 'Seleccione un cliente'
                        }
                    /> */}
                    <AsyncSelectField<DeliveryOrderForm>
                        label="Cliente"
                        name="userIdClient"
                        control={control}
                        errorMessage={errors.userIdClient?.message}
                        loadOptions={async (inputValue) => {
                            const data = await listFirstTenUsersByKeyword({ name: inputValue });
                            return data.map((user: { id: number; fullName: string }) => ({
                                value: user.id,
                                label: user.fullName,
                            }));
                        }}
                    />






                </EntityFormLayout.Inputs>
                <EntityFormLayout.Actions>
                    <Button icon={<ArrowUpCircleIcon />} size="large" text='Añadir' type="submit" color="green" showIconOnMobile={false}
                        showTextOnMobile
                        isLargeOnMobile
                    />
                    <ButtonLink icon={<XCircleIcon />} size="large" text="Cancelar" color="gray" to="/orders" showIconOnMobile={false}
                        showTextOnMobile
                        isLargeOnMobile
                    />

                </EntityFormLayout.Actions>

            </EntityFormLayout.Form>

        </EntityFormLayout>
    )
}
