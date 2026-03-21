import type { RegionForm, RegionItem, SubregionForm } from '../../types'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { GeneralError } from '@/types/index'
import { toast } from 'sonner'
import { InputText } from '@/ui/fields/InputText'
import { ArrowUpCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { ButtonLink } from '@/ui/ButtonLink'
import { Button } from '@/ui/Button'
import { registerSubregion } from '../../api/SubregionAPI'
import { SelectOption } from '@/ui/fields/SelectOption'
import { listAllRegions } from '../../api/RegionAPI'
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";

export const NewSubregionPage = () => {

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

        // Dato: onSucess tiene un segundo parametro que es el objeto que pasastes a la funcion mutate
        onSuccess: async (data, variables) => {
            toast.success(data)
            navigate(`/locations/subregions?regionId=${variables.regionId}`)
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
        <EntityFormLayout>
            <EntityFormLayout.Header title="Añadir nueva subregión"></EntityFormLayout.Header>
            <EntityFormLayout.Form onSubmit={handleSubmit((data) => {
                mutate(data)
            })}>


                <EntityFormLayout.Inputs>
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

                </EntityFormLayout.Inputs>
                <EntityFormLayout.Actions>
                    <Button icon={<ArrowUpCircleIcon />} size="large" text='Añadir subregión' type="submit" color="green" />
                    <ButtonLink icon={<XCircleIcon />} size="large" text="Cancelar" color="gray" to="/locations/subregions" />

                </EntityFormLayout.Actions>
            </EntityFormLayout.Form>
        </EntityFormLayout >
    )
}
