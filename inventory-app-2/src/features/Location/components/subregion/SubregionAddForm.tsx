import type { RegionForm, RegionItem, SubregionForm } from '../../types'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { GeneralError } from '@/types/index'
import { toast } from 'sonner'
import { TitleContainer } from '@/components/TitleContainer'
import { BaseForm } from '@/components/BaseForm'
import { InputText } from '@/ui/fields/InputText'
import { ArrowUpCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { ButtonLink } from '@/ui/ButtonLink'
import { Button } from '@/ui/Button'
import { registerSubregion } from '../../api/SubregionAPI'
import { SelectOption } from '@/ui/fields/SelectOption'
import { listAllRegions } from '../../api/RegionAPI'

export const SubregionAddForm = () => {

    const initialValues: SubregionForm = {
        name: '',
        regionId: ''
    }
    const { register, handleSubmit, setError, formState: { errors } } = useForm<SubregionForm>({
        defaultValues: initialValues
    })

    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: registerSubregion,
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
            navigate('/locations/subregions')
        }
    })
    const { data: regionsData } = useQuery({
        queryKey: ['list-regions'],
        queryFn: listAllRegions
    })

    const regions = regionsData?.map((region: RegionItem) => ({
        value: region.id,
        label: region.name,
    })) || []


    return (
        <>
            <TitleContainer title="Añadir nueva subregión">
                <BaseForm
                    onSubmit={handleSubmit((data) => mutate(data))}
                    inputs={
                        <>
                            <InputText
                                id="name"
                                label="Nombre"
                                placeholder="Nombre de la subregión"
                                type="text"
                                errorMessage={errors.name}
                                functionEnabled={register('name')} />

                            <SelectOption id="regionId" label='Región'
                                errorMessage={errors.regionId}
                                functionEnabled={register('regionId')}
                                options={regions}
                                textInNullOption='Seleccione una región'
                            />
                        </>
                    }
                    buttons={
                        <>
                            <Button icon={<ArrowUpCircleIcon />} size="large" text='Añadir subregión' type="submit" color="green" />
                            <ButtonLink icon={<XCircleIcon />} size="large" text="Cancelar" color="gray" to="/locations/subregions" />
                        </>
                    }
                />
            </TitleContainer>
        </>
    )
}
