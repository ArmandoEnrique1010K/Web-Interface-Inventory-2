import type { LocationForm, LocationItem, RegionItem, SubregionItem } from '../../types'
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { updateLocation } from '../../api/LocationAPI';
import type { GeneralError } from '@/types/index';
import { toast } from 'sonner';
import { Button } from '@/ui/Button';
import { ArrowUpCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { InputText } from '@/ui/fields/InputText';
import { listAllRegions } from '../../api/RegionAPI';
import { listAllSubregionsByRegionId } from '../../api/SubregionAPI';
import { useState } from 'react';
import { SelectOptionFilter } from '@/ui/filters/SelectOptionFilter';
import { SelectOption } from '@/ui/fields/SelectOption';
import { EntityFormLayout } from '@/layout/entity/EntityFormLayout';

type Props = {
    data: LocationItem
    showModal: React.Dispatch<React.SetStateAction<boolean>>
    locationId: string;
}

export const EditLocationModal = ({ data, locationId, showModal }: Props) => {


    const { register, handleSubmit, setError, formState: { errors } } = useForm<LocationForm>({
        defaultValues: {
            name: data.name,
            address: data.address,
            subregionId: data.subregionId
        }
    })

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: updateLocation,
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

            // Error general
            if (error.type === 'GENERAL_ERROR') {
                toast.error(error.message)
                return
            }
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["locations"] })
            queryClient.invalidateQueries({ queryKey: ["location", locationId] })
            toast.success(data)
            showModal(false)
        }
    })

    const handleForm = (formData: LocationForm) => {
        const data = {
            formData,
            locationId
        }
        mutate(data)
    }


    // FACIL: SE OBTIENE EL ID DE LA SUBREGIÓN
    // console.log(data.subregionId)


    const [selectedRegionId, setSelectedRegionId] = useState<string>(data.regionId);

    const { data: regionsData /*, isLoading: regionsLoading */ } = useQuery({
        queryKey: ['regions'],
        queryFn: listAllRegions
    })

    const { data: subregionsData, isLoading: subregionsLoading } = useQuery({
        queryKey: ['subregions', 'region', selectedRegionId],
        queryFn: () => listAllSubregionsByRegionId(selectedRegionId!),
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


    // Recordar que he desactivado esta condicion porque si una lista se esta cargando, se ocultara el formulario y sera reemplazado por el siguiente componente
    // if (regionsLoading || subregionsLoading) {
    //     return <TextMessage text="Cargando..." align="left" color="black" />
    // }


    return (
        <EntityFormLayout isCompact>
            <EntityFormLayout.Form
                onSubmit={handleSubmit(handleForm)}
            >
                <EntityFormLayout.Inputs isCompact>
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

                    <div className="flex flex-col space-y-1 w-full pt-2">
                        <SelectOptionFilter
                            name='regionId'
                            label='Región'
                            options={regions}
                            onChange={(e) => setSelectedRegionId(e.target.value)}
                            value={selectedRegionId!}
                        />
                        <div className="min-h-6">
                            <p className="text-red-700 text-sm">
                                {selectedRegionId === '0' ? 'Seleccione una región' : ''}
                            </p>
                        </div>
                    </div>

                    <SelectOption id="subregionId" label='Subregión'
                        errorMessage={errors.subregionId}
                        functionEnabled={register('subregionId')}
                        options={subregions}
                        textInNullOption={
                            subregionsLoading
                                ? 'Cargando subregiones...'
                                : 'Seleccione una subregión'
                        }
                        disabled={selectedRegionId === '0'}
                    />


                    {/* <SelectOption id="subregionId" label='Subregión'
                            errorMessage={errors.subregionId}
                            functionEnabled={register('subregionId')}
                            options={subregions}
                            textInNullOption='Seleccione una subregión' /> */}

                </EntityFormLayout.Inputs>
                <EntityFormLayout.Actions isCompact>
                    <Button
                        icon={<ArrowUpCircleIcon />}
                        size="large"
                        text="Editar"
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
                        type='button'
                        color="gray"
                        onClick={() => showModal(false)}
                        showIconOnMobile={false}
                        showTextOnMobile
                        isLargeOnMobile
                    />
                </EntityFormLayout.Actions>
            </EntityFormLayout.Form>
        </EntityFormLayout>
    )
}
