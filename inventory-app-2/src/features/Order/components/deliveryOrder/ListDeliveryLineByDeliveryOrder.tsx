import { EntityListLayout } from '@/layout/entity/EntityListLayout'
import { Button } from '@/ui/Button'
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom';
import { listAllDeliveryLinesByDeliveryOrder } from '../../api/DeliveryLineAPI';
import { FiltersFormContainer } from '@/components/FiltersFormContainer';
import { TableContainer } from '@/components/TableContainer';
import { Paginator } from '@/components/Paginator';
import { SearchCounter } from '@/components/SearchCounter';
import type { DeliveryLineItem, LineStatusEnum, ModelDeliveryOrderItem } from '../../types';
import { TableRowContainer } from '@/components/TableRowContainer';
import { BaseTableCell } from '@/components/BaseTableCell';
import { Modal } from '@/components/Modal';
import { InputTextFilter } from '@/ui/filters/InputTextFilter';
import { InputDateTimeFilter } from '@/ui/filters/InputDateTimeFilter';
import { SelectOptionFilter } from '@/ui/filters/SelectOptionFilter';
import { listAllRegions } from '@/features/Location/api/RegionAPI';
import { listAllSubregionsByRegionId } from '@/features/Location/api/SubregionAPI';
import { listAllModelsByDeliveryOrder } from '../../api/ModelDeliveryOrderAPI';
import type { RegionItem, SubregionItem } from '@/features/Location/types';
import { AddDeliveryLineModal } from '../deliveryLine/AddDeliveryLineModal';

export const ListDeliveryLineByDeliveryOrder = () => {

    const [addDeliveryLineModalOpen, setAddDeliveryLineModalOpen] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get('page') ?? 0)

    // const location = useLocation();
    // const path = location.pathname;

    const minRequiredQuantity = searchParams.get('minRequiredQuantity') ?? ''
    const maxRequiredQuantity = searchParams.get('maxRequiredQuantity') ?? ''
    const minLimitDate = searchParams.get('minLimitDate') ?? ''
    const maxLimitDate = searchParams.get('maxLimitDate') ?? ''
    const lineStatus = searchParams.get('lineStatus') ?? ''
    const location = searchParams.get('location') ?? ''
    const subregionId = searchParams.get('subregionId') ?? undefined
    const regionId = searchParams.get('regionId') ?? undefined
    const modelId = searchParams.get('modelId') ?? undefined


    // TODO: URGENTE, CADA VEZ QUE SE RENDERICE ESTA VISTA, LOS QUERY PARAMS SE PIERDEN?
    // SI O SI SE PIERDE EL QUERYPARAM DE "currentModelId", QUE REPRESENTA EL MODELO SELECCIONADO DE LA VISTA ANTERIOR
    // PERO NO DEBE PERDERSE LOS QUERYPARAMS DE LOS FILTROS AL RECARGAR LA PAGINA
    useEffect(() => {
        setSearchParams({});
    }, [])

    const { id: deliveryOrderId } = useParams()

    const [form, setForm] = useState({
        page: page,
        minRequiredQuantity,
        maxRequiredQuantity,
        minLimitDate,
        maxLimitDate,
        lineStatus: lineStatus === undefined ? '' : String(lineStatus),
        location,
        subregionId: subregionId ?? '',
        regionId: regionId ?? '',
        modelId: modelId ?? ''
    })
    const { data, isError } = useQuery({
        queryKey: ['deliveryLines', 'deliveryOrder', deliveryOrderId!,
            {
                page, minRequiredQuantity, maxRequiredQuantity, minLimitDate, maxLimitDate, lineStatus,
                location, regionId, subregionId, modelId
            }
        ],

        queryFn: () => listAllDeliveryLinesByDeliveryOrder(
            deliveryOrderId!,
            {
                page: page,
                minRequiredQuantity,
                maxRequiredQuantity,
                minLimitDate,
                maxLimitDate,
                lineStatus: lineStatus as LineStatusEnum,
                location,
                subregionId,
                regionId,
                modelId
            }),
    })

    const content = data?.content || []

    // OBTENER SUBREGIONES, REGIONES
    const { data: regionsData } = useQuery({
        queryKey: ['regions'],
        queryFn: listAllRegions
    })

    const regions = regionsData?.map((region: RegionItem) => ({
        value: region.id,
        label: region.name
    })) || []

    const { data: subregionData } = useQuery({
        queryKey: ['subregions', 'region', form.regionId],
        queryFn: () => listAllSubregionsByRegionId(form.regionId), // Debe listar las subregiones por una region seleccionada
        enabled: !!form.regionId // solo ejecuta si hay region

    })


    const subregions = subregionData?.map((subregion: SubregionItem) => ({
        value: subregion.id,
        label: subregion.name
    })) || []

    const { data: modelsByDeliveryOrderData } = useQuery({
        queryKey: ['models', 'deliveryOrder', deliveryOrderId],
        queryFn: () => listAllModelsByDeliveryOrder(deliveryOrderId!)
    })

    const modelsInDeliveryOrder = modelsByDeliveryOrderData?.map((model: ModelDeliveryOrderItem) => ({
        value: model.id,
        label: `${model.productName + " " + model.modelName}`
    }))



    const statusOptions = [
        { value: 'LINE_MISSING', label: 'Perdido' },
        { value: 'LINE_READY', label: 'Listo' },
        { value: 'LINE_PENDING', label: 'Pendiente' },
        { value: 'LINE_DELIVERED', label: 'Entregado' },
        { value: 'LINE_CANCELED', label: 'Eliminado' },
        { value: 'LINE_EXCEEDED', label: 'Excedido' },
    ]



    return (
        <>
            <EntityListLayout isCompact>
                <EntityListLayout.Header actions={
                    <>
                        <Button
                            type={"submit"}
                            color={"blue"}
                            text="Nueva linea"
                            onClick={() => setAddDeliveryLineModalOpen(true)}
                        >
                        </Button>
                        {addDeliveryLineModalOpen && <Modal
                            isOpen={addDeliveryLineModalOpen}
                            onClose={() => {
                                setAddDeliveryLineModalOpen(false)
                            }}
                            size='lg'
                            title={`Agregar nueva linea de entrega a la orden de entrega #${deliveryOrderId}`}
                            locked
                        >
                            <AddDeliveryLineModal
                                setAddDeliveryLineModalOpen={setAddDeliveryLineModalOpen}
                                deliveryOrderId={deliveryOrderId!.toString()}
                            />
                        </Modal>}
                    </>
                }>
                </EntityListLayout.Header>
                <EntityListLayout.Content>
                    <FiltersFormContainer onSubmit={(e) => {
                        e.preventDefault()
                        const params = new URLSearchParams()


                        if (form.minRequiredQuantity) {
                            params.set('minRequiredQuantity', form.minRequiredQuantity)
                        }

                        if (form.maxRequiredQuantity) {
                            params.set('maxRequiredQuantity', form.maxRequiredQuantity)
                        }
                        if (form.minLimitDate) {
                            params.set('minLimitDate', form.minLimitDate)
                        }
                        if (form.maxLimitDate) {
                            params.set('maxLimitDate', form.maxLimitDate)
                        }
                        if (form.lineStatus) {
                            params.set('lineStatus', form.lineStatus)
                        }
                        if (form.location) {
                            params.set('location', form.location)
                        }
                        // if (form.regionId) {
                        //     params.set('regionId', form.regionId)

                        //     if (form.subregionId) {
                        //         params.set('subregionId', form.subregionId)
                        //     }

                        // }

                        // REGION + SUBREGION (aquí está la clave)
                        if (form.regionId) {
                            params.set('regionId', form.regionId);

                            // validar subregion contra las subregiones cargadas
                            const isValidSubregion = subregionData?.some(
                                (sub: SubregionItem) => String(sub.id) === String(form.subregionId)
                            );

                            if (form.subregionId && isValidSubregion) {
                                params.set('subregionId', form.subregionId);
                            }
                            // si no es válida → simplemente no se agrega
                        }

                        if (form.modelId) {
                            params.set('modelId', form.modelId)
                        }


                        // setSearchParams(Object.fromEntries(params))
                        setSearchParams(params)

                    }}>
                        <InputTextFilter
                            name='minRequiredQuantity'
                            label='Cantidad minima'
                            placeholder='Cantidad'
                            type='text'
                            value={form.minRequiredQuantity}
                            onChange={(e) => setForm(prev => ({ ...prev, minRequiredQuantity: e.target.value }))}
                        />
                        <InputTextFilter
                            name='maxRequiredQuantity'
                            label='Cantidad maxima'
                            placeholder='Cantidad'
                            type='text'
                            value={form.maxRequiredQuantity}
                            onChange={(e) => setForm(prev => ({ ...prev, maxRequiredQuantity: e.target.value }))}
                        />

                        <InputDateTimeFilter
                            name={'minLimitDate'}
                            label={'Fecha limite minima'}
                            value={form.minLimitDate}
                            onChange={
                                (value) => setForm(prev => ({
                                    ...prev,
                                    minLimitDate: value
                                }))
                            } />
                        <InputDateTimeFilter
                            name={'maxLimitDate'}
                            label={'Fecha limite maxima'}
                            value={form.maxLimitDate}
                            onChange={
                                (value) => setForm(prev => ({
                                    ...prev,
                                    maxLimitDate: value
                                }))
                            } />
                        <SelectOptionFilter
                            name='status'
                            label='Estado'
                            options={statusOptions}
                            onChange={(e) =>
                                setForm(prev => ({ ...prev, lineStatus: e.target.value }))
                            }
                            textInNullOption="Todos los estados"
                            value={form.lineStatus}
                        />
                        <InputTextFilter
                            name='location'
                            label='Ubicación'
                            placeholder='ubicación'
                            type='text'
                            value={form.location}
                            onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                        />

                        {/* CADA VEZ QUE CAMBIE DE REGIONID, SUBREGIONID DEBE SER REINICIADO, ESTABLECER EL VALOR NULL */}
                        <SelectOptionFilter
                            name='regionId'
                            label='Región'
                            options={regions}
                            onChange={(e) =>
                                setForm(prev => ({ ...prev, regionId: e.target.value }))
                            }

                            textInNullOption="Todas las regiones"
                            value={form.regionId}
                        />

                        {/* SI NO HA SELECCIONADO UNA REGION, ESTE CAMPO SE DEBE LIMPIAR QUE NO HAYA NINGUNA SUBREGION SELECCIONADA */}
                        <SelectOptionFilter
                            name='subregionId'
                            label='Subregión:'
                            options={subregions}
                            onChange={(e) =>
                                setForm(prev => ({ ...prev, subregionId: e.target.value }))
                            }
                            textInNullOption="Todas las subregiones asociadas"
                            value={form.subregionId}
                        />

                        <SelectOptionFilter
                            name='modelId'
                            label='Modelo de la orden de entrega'
                            options={modelsInDeliveryOrder}
                            onChange={(e) =>
                                setForm(prev => ({ ...prev, modelId: e.target.value }))
                            }
                            textInNullOption="Todos los modelos"
                            value={form.modelId}
                        />





                    </FiltersFormContainer>

                    <TableContainer
                        headers={['ID', 'Nombre', 'Ubicación', 'Cantidad', 'fecha limite', 'estado', 'operaciones']}
                        isError={isError}
                        isEmpty={!content.length}
                        itemsCounter={
                            data && <SearchCounter totalElements={data.totalElements} page={data.page} size={data.size} last={data.last} />
                        }
                        paginator={
                            (content?.length && data) ? (
                                <Paginator
                                    currentPage={data?.page}
                                    totalPages={data?.totalPages}
                                    isFirst={data?.first}
                                    isLast={data?.last}
                                    onPageChange={(page) => {
                                        setForm(prev => ({
                                            ...prev,
                                            page
                                        }))
                                        const params = new URLSearchParams()

                                        if (form.minRequiredQuantity) params.set('minRequiredQuantity', form.minRequiredQuantity)
                                        if (form.maxRequiredQuantity) params.set('maxRequiredQuantity', form.maxRequiredQuantity);
                                        if (form.minLimitDate) params.set('minLimitDate', form.minLimitDate);
                                        if (form.maxLimitDate) params.set('maxLimitDate', form.maxLimitDate);
                                        if (form.lineStatus) params.set('lineStatus', form.lineStatus);
                                        if (form.location) params.set('location', form.location);
                                        if (form.subregionId) params.set('subregionId', String(form.subregionId));
                                        if (form.regionId) params.set('regionId', String(form.regionId));
                                        if (form.modelId) params.set('modelId', String(form.modelId));

                                        params.set('page', page.toString())

                                        setSearchParams(params)

                                    }}
                                />
                            ) : null
                        }
                    >
                        {
                            content?.map((deliveryLine: DeliveryLineItem) => {
                                return <TableRowContainer key={deliveryLine.id}>
                                    <BaseTableCell data={deliveryLine.id} />
                                    <BaseTableCell data={deliveryLine.modelproductName} />
                                    <BaseTableCell data={deliveryLine.locationName} />
                                    <BaseTableCell data={
                                        <div>
                                            {deliveryLine.deliveredQuantity} de {deliveryLine.requiredQuantity}
                                        </div>
                                    } />
                                    <BaseTableCell data={deliveryLine.limitDate} />
                                    <BaseTableCell data={deliveryLine.lineStatus} />
                                    <BaseTableCell data={'Operaciones'} />


                                </TableRowContainer>
                            })
                        }

                    </TableContainer>
                </EntityListLayout.Content>

            </EntityListLayout>

        </>
    )
}
