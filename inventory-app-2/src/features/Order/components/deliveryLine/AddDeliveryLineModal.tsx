import React, { useEffect, useState } from 'react'
import type { DeliveryLineForm, ModelDeliveryOrderItem } from '../../types'
import { useForm, useWatch } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { registerDeliveryOrder } from '../../api/DeliveryLineAPI'
import { toast } from 'sonner'
import type { GeneralError } from '@/types/index'
import { EntityFormLayout } from '@/layout/entity/EntityFormLayout'
import { InputText } from '@/ui/fields/InputText'
import { InputDateTime } from '@/ui/fields/InputDateTime'
import { listAllModelsByDeliveryOrder } from '../../api/ModelDeliveryOrderAPI'
import { SelectOption } from '@/ui/fields/SelectOption'
import { listAllRegions } from '@/features/Location/api/RegionAPI'
import { listAllSubregionsByRegionId } from '@/features/Location/api/SubregionAPI'
import type { RegionItem, SubregionItem } from '@/features/Location/types'
import { SelectOptionFilter } from '@/ui/filters/SelectOptionFilter'
import { AsyncSelectField } from '@/ui/fields/AsyncSelectOption'
import { listFirstTenLocationsByKeyword } from '@/features/Location/api/LocationAPI'
import { ArrowUpCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { Button } from '@/ui/Button'

type Props = {
    setAddDeliveryLineModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    deliveryOrderId: string
}

// NOTA: LOS CAMPOS LIMITDATE, MODELID, REGIONID Y SUBREGIONID MANTIENEN EL VALOR SELECCIONADO EN EL SESSIONSTORAGE PARA SEGUIR GUARDANDO LINEAS DE ENTREGA
// CADA CAMBIO HECHO EN ESOS CAMPOS, SE VA A GUARDAR EN EL SESSIONSTORAGE
export const AddDeliveryLineModal = ({ setAddDeliveryLineModalOpen, deliveryOrderId }: Props) => {

    // KEY para almacenar los valores rellenados por el usuario del formulario
    const STORAGE_KEY = "deliveryLineDraft";

    const initialValues: DeliveryLineForm = {
        requiredQuantity: '',
        limitDate: '',
        locationId: '',
        modelId: ''
    }

    const saved = sessionStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : null;

    const { register, handleSubmit, setError, control, formState: { errors }, setValue } = useForm<DeliveryLineForm>({
        defaultValues: parsed || initialValues
    })
    const queryClient = useQueryClient();




    const { mutate } = useMutation({
        mutationFn: registerDeliveryOrder,
        onError: (error: GeneralError) => {
            console.log(error)
            // Error de campo
            if (error.type === 'FIELD_ERROR') {
                Object.entries(error.fields).forEach(([field, message]) => {
                    setError(field as keyof DeliveryLineForm, {
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
            setAddDeliveryLineModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["deliveryOrder", deliveryOrderId] })
        }
    })

    const { data: modelsDeliveryOrderData, /* isLoading: isModelsDeliveryOrderDataLoading */ } = useQuery({
        queryKey: ['models', 'deliveryOrder', deliveryOrderId],
        queryFn: () => listAllModelsByDeliveryOrder(deliveryOrderId!),
        enabled: !!deliveryOrderId,
    })

    const modelsByDeliveryOrder = modelsDeliveryOrderData?.map((model: ModelDeliveryOrderItem) => ({
        value: model.modelId, // OJO, debe ser modelId, porque si fuera id, toma el id de la relación modelo-orden de entrega
        label: model.productName + " " + model.modelName
    }))


    // Initialize state with saved values or defaults
    const getInitialRegionId = () => {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            return parsed.regionId || '0';
        }
        return '0';
    };

    const getInitialSubregionId = () => {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            return parsed.subregionId || '0';
        }
        return '0';
    };
    const [selectedRegionId, setSelectedRegionId] = useState(getInitialRegionId);
    const [selectedSubregionId, setSelectedSubregionId] = useState(getInitialSubregionId);

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
    })).concat({
        value: 0,
        label: 'Seleccione una subregión'
    }) || []

    useEffect(() => {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (!saved) return;

        const parsed = JSON.parse(saved);

        // react-hook-form
        Object.entries(parsed).forEach(([key, value]) => {
            setValue(key as keyof DeliveryLineForm, value as string);
        });
    }, []);

    // const limitDate = watch('limitDate') ? handleFormatDateTime(new Date(watch('limitDate'))) : '';
    const limitDate = useWatch({ control, name: 'limitDate' })
    // const locationId = useWatch({ control, name: 'locationId' });
    const modelId = useWatch({ control, name: 'modelId' });


    useEffect(() => {
        const dataToSave = {
            limitDate,
            modelId,
            regionId: selectedRegionId,
            subregionId: selectedSubregionId,
        };

        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }, [limitDate, modelId, selectedRegionId, selectedSubregionId]);

    return (
        <EntityFormLayout isCompact>
            <EntityFormLayout.Form styled={false} onSubmit={handleSubmit((data) => {
                mutate({
                    deliveryOrderId: deliveryOrderId,
                    formData: data
                })
            })}
            >
                <EntityFormLayout.Inputs isCompact>
                    <InputText
                        id='requiredQuantity'
                        label='Cantidad requerida'
                        placeholder='Cantidad'
                        type='text'
                        errorMessage={errors.requiredQuantity}
                        functionEnabled={register('requiredQuantity')}
                    />

                    <InputDateTime<DeliveryLineForm>
                        id={'limitDate'}
                        label={'Fecha limite de entrega'}
                        name={'limitDate'}
                        control={control}
                        errorMessage={errors.limitDate?.message}
                    />

                    <SelectOption
                        id="modelId"
                        label='Modelo de producto'
                        errorMessage={errors.modelId}
                        functionEnabled={register('modelId')}
                        options={modelsByDeliveryOrder}
                        textInNullOption='Seleccione un modelo'
                    ></SelectOption>

                    {/* CAMPO PARA SELECCIONAR UNA REGIÓN */}

                    <div className="flex flex-col w-full space-y-1">
                        <SelectOptionFilter
                            name='regionId'
                            label='Región'
                            options={regions}
                            onChange={(e) => {
                                setSelectedRegionId(e.target.value)
                                setSelectedSubregionId('0')
                            }}
                            value={selectedRegionId}
                        />
                        <div className="min-h-6">
                            <p className="text-red-700 text-sm">
                                {selectedRegionId === '0' && initialValues.locationId === '0' ? 'Seleccione una región' : ''}
                            </p>
                        </div>
                    </div>

                    {/* CAMPO PARA SELECCIONAR UNA SUBREGIÓN */}
                    <div className="flex flex-col space-y-1 w-full">
                        <SelectOptionFilter
                            name='subregionId'
                            label='Subregión'
                            options={subregions}
                            onChange={(e) => {
                                setSelectedSubregionId(e.target.value)
                            }}
                            value={selectedSubregionId}
                            disabled={selectedRegionId === '0'}
                        />
                        <div className="min-h-6">
                            <p className="text-red-700 text-sm">
                                {selectedSubregionId === '0' && initialValues.locationId === '0' ? 'Seleccione una subregión' : ''}
                            </p>
                        </div>
                    </div>


                    {/* TODO: URGENTE, CADA VEZ QUE CAMBIE EL VALOR DE LA SUBREGION, DEBE ESTABLECER LA UBICACION SELECCIONADA A 0 (ELIMINAR EL VALOR SELECCIONADO) */}

                    {/* CAMPO PARA BUSCAR UBICACIONES */}
                    <AsyncSelectField<DeliveryLineForm>
                        control={control}
                        label={'Ubicación'}
                        name={'locationId'}
                        errorMessage={errors.locationId?.message}
                        disabled={selectedSubregionId === '0'}
                        loadOptions={async (inputValue) => {
                            const data = await listFirstTenLocationsByKeyword({ name: inputValue }, selectedRegionId, selectedSubregionId);
                            return data.map((location: { id: number; name: string }) => ({
                                value: location.id,
                                label: location.name,
                            }));
                        }}

                    />



                </EntityFormLayout.Inputs>
                <EntityFormLayout.Actions>
                    <Button
                        icon={<ArrowUpCircleIcon />}
                        size="large"
                        text="Agregar"
                        type="submit"
                        color="green"
                        showIconOnMobile={false}
                        showTextOnMobile
                        isLargeOnMobile
                    />
                    <Button
                        type='button'
                        icon={<XCircleIcon />}
                        size="large"
                        text="Cancelar"
                        color="gray"
                        onClick={() => setAddDeliveryLineModalOpen(false)}
                        showIconOnMobile={false}
                        showTextOnMobile
                        isLargeOnMobile
                    />
                </EntityFormLayout.Actions>


            </EntityFormLayout.Form>
        </EntityFormLayout>
    )
}
