import type { RegionForm } from '../../types'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { registerRegion } from '../../api/RegionAPI'
import type { GeneralError } from '@/types/index'
import { toast } from 'sonner'
import { TitleContainer } from '@/components/TitleContainer'
import { BaseForm } from '@/components/BaseForm'
import { InputText } from '@/ui/fields/InputText'
import { ArrowUpCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { ButtonLink } from '@/ui/ButtonLink'
import { Button } from '@/ui/Button'

export const RegionAddForm = () => {

    const initialValues: RegionForm = {
        name: '',
    }
    const { register, handleSubmit, setError, formState: { errors } } = useForm<RegionForm>({
        defaultValues: initialValues
    })

    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: registerRegion,
        onError: (error: GeneralError) => {
            if (error.type === 'FIELD_ERROR') {
                Object.entries(error.fields).forEach(([field, message]) => {
                    setError(field as keyof RegionForm, {
                        type: 'server',
                        message: message as string,
                    })
                })

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
            navigate('/locations/regions')
        }
    })


    return (
        <>
            <TitleContainer title="Añadir nueva región">
                <BaseForm
                    onSubmit={handleSubmit((data) => mutate(data))}
                    inputs={
                        <>
                            <InputText
                                id="name"
                                label="Nombre"
                                placeholder="Nombre de la región"
                                type="text"
                                errorMessage={errors.name}
                                functionEnabled={register('name')} />

                        </>
                    }
                    buttons={
                        <>
                            <Button icon={<ArrowUpCircleIcon />} size="large" text='Añadir región' type="submit" color="green" />
                            <ButtonLink icon={<XCircleIcon />} size="large" text="Cancelar" color="gray" to="/locations/regions" />
                        </>
                    }
                />
            </TitleContainer>
        </>
    )
}
