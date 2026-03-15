import type { LocationForm, LocationItem, RegionItem, SubregionItem } from '../../types'
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { updateLocation } from '../../api/LocationAPI';
import type { GeneralError } from '@/types/index';
import { toast } from 'sonner';
import { TitleContainer } from '@/components/TitleContainer';
import { BaseForm } from '@/components/BaseForm';
import { Button } from '@/ui/Button';
import { ButtonLink } from '@/ui/ButtonLink';
import { ArrowUpCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { InputText } from '@/ui/fields/InputText';
import { listAllRegions } from '../../api/RegionAPI';
import { listAllSubregionsByRegionId } from '../../api/SubregionAPI';
import { useState } from 'react';
import { SelectOptionFilter } from '@/ui/filters/SelectOptionFilter';
import { SelectOption } from '@/ui/fields/SelectOption';
import { TextMessage } from '@/components/TextMessage';

type Props = {
    data: LocationItem
    locationId: string;
}

export const LocationEditForm = ({ data, locationId }: Props) => {

    const navigate = useNavigate();

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
            queryClient.invalidateQueries({ queryKey: ["list-locations"] })
            queryClient.invalidateQueries({ queryKey: ["edit-location", locationId] })
            toast.success(data)
            navigate("/locations")
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

    const { data: regionsData, isLoading: regionsLoading } = useQuery({
        queryKey: ['list-regions'],
        queryFn: listAllRegions
    })

    const { data: subregionsData, isLoading: subregionsLoading } = useQuery({
        queryKey: ['list-subregions-by-region', selectedRegionId],
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


    if (regionsLoading || subregionsLoading) {
        return <TextMessage text="Cargando..." align="left" color="black" />
    }


    return (
        <TitleContainer title={`Editar ubicación ${locationId}`}>
            <BaseForm
                onSubmit={handleSubmit(handleForm)}
                buttons={
                    <>
                        <Button icon={<ArrowUpCircleIcon />} size="large" text="Editar ubicación" type="submit" color="green" />
                        <ButtonLink icon={<XCircleIcon />} size="large" text="Volver" color="gray" to="/locations" />
                    </>
                }
                inputs={
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
                            textInNullOption='Seleccione una subregión'
                            disabled={selectedRegionId === '0'}
                        />


                        {/* <SelectOption id="subregionId" label='Subregión'
                            errorMessage={errors.subregionId}
                            functionEnabled={register('subregionId')}
                            options={subregions}
                            textInNullOption='Seleccione una subregión' /> */}

                    </>
                }
            />
        </TitleContainer>
    )
}
