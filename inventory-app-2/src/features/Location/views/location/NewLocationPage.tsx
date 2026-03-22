import { useForm } from "react-hook-form"
import type { LocationForm, RegionItem, SubregionItem } from "../../types"
import { useMutation, useQuery } from "@tanstack/react-query"
import { registerLocation } from "../../api/LocationAPI"
import type { GeneralError } from "@/types/index"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { InputText } from "@/ui/fields/InputText"
import { SelectOption } from "@/ui/fields/SelectOption"
import { SelectOptionFilter } from "@/ui/filters/SelectOptionFilter"
import { listAllRegions } from "../../api/RegionAPI"
import { listAllSubregionsByRegionId } from "../../api/SubregionAPI"
import { useState } from "react"
import { Button } from "@/ui/Button"
import { ButtonLink } from "@/ui/ButtonLink"
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline"
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout"

export const NewLocationPage = () => {

    const initialValues: LocationForm = {
        name: '',
        address: '',
        subregionId: ''
    }
    const { register, handleSubmit, setError, formState: { errors } } = useForm<LocationForm>({
        defaultValues: initialValues
    })

    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: registerLocation,
        onError: (error: GeneralError) => {
            if (error.type === 'FIELD_ERROR') {
                Object.entries(error.fields).forEach(([field, message]) => {
                    setError(field as keyof LocationForm, {
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
            navigate('/locations')
        }
    })

    const [selectedRegionId, setSelectedRegionId] = useState('0');

    const { data: regionsData } = useQuery({
        queryKey: ['regions'],
        queryFn: listAllRegions
    })

    const { data: subregionsData } = useQuery({
        queryKey: ['subregions', 'region', selectedRegionId],
        queryFn: () => listAllSubregionsByRegionId(selectedRegionId.toString()),
        enabled: !!selectedRegionId // solo ejecuta si hay region
    })

    const regions = regionsData?.map((region: RegionItem) => ({
        value: region.id,
        label: region.name,
    })).concat({
        value: 0,
        label: 'Seleccione una región'
    }) || []


    const subregions = subregionsData?.map((type: SubregionItem) => ({
        value: type.id,
        label: type.name,
    })) || []

    return (
        <EntityFormLayout>

            <EntityFormLayout.Header title="Añadir nueva ubicación"></EntityFormLayout.Header>
            <EntityFormLayout.Form styled
                onSubmit={handleSubmit((data) => mutate(data))}
            >
                <EntityFormLayout.Inputs>
                    <>
                        <InputText
                            id="name"
                            label="Nombre"
                            placeholder="Nombre de la ubicación"
                            type="text"
                            errorMessage={errors.name}
                            functionEnabled={register('name')} />

                        <InputText
                            id="address"
                            label="Dirección"
                            placeholder="Dirección o referencia"
                            type="text"
                            errorMessage={errors.address}
                            functionEnabled={register('address')} />

                        {/* ESTE CAMPO NO ESTA ASOCIADO AL FORMULARIO */}
                        {/* TODO: APLICAR ESTILOS A ESTE CAMPO */}
                        <div className="flex flex-col space-y-1 w-full pt-2">
                            <SelectOptionFilter
                                name='regionId'
                                label='Región'
                                options={regions}
                                onChange={(e) => setSelectedRegionId(e.target.value)}
                                value={selectedRegionId}
                            />
                            <div className="min-h-6">
                                <p className="text-red-700 text-sm">
                                    {selectedRegionId === '0' && initialValues.subregionId === '0' ? 'Seleccione una región' : ''}
                                </p>
                            </div>
                        </div>

                        <SelectOption id="subregionId" label='Subregión'
                            errorMessage={errors.subregionId}
                            functionEnabled={register('subregionId')}
                            options={subregions}
                            textInNullOption='Seleccione una subregión'
                            disabled={selectedRegionId === '0'}
                        />

                    </>
                </EntityFormLayout.Inputs>
                <EntityFormLayout.Actions>
                    <Button icon={<ArrowUpCircleIcon />}
                        size="large"
                        text='Añadir'
                        type="submit"
                        color="green"
                        showIconOnMobile={false}
                        showTextOnMobile
                        isLargeOnMobile
                    />
                    <ButtonLink
                        icon={<XCircleIcon />}
                        size="large"
                        text="Cancelar"
                        color="gray"
                        to="/locations"
                        showIconOnMobile={false}
                        showTextOnMobile
                        isLargeOnMobile
                    />
                </EntityFormLayout.Actions>
            </EntityFormLayout.Form>
        </EntityFormLayout >
    )
}
