import { EntityListLayout } from '@/layout/entity/EntityListLayout'
import { Button } from '@/ui/Button'
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { listAllDeliveryLinesByDeliveryOrder } from '../../api/DeliveryLineAPI';
import { FiltersFormContainer } from '@/components/FiltersFormContainer';
import { TableContainer } from '@/components/TableContainer';
import { Paginator } from '@/components/Paginator';
import { SearchCounter } from '@/components/SearchCounter';
import type { DeliveryLineItem, LineStatusOptions, ModelDeliveryOrderItem, OrderStatusEnum } from '../../types';
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
import { PlusCircleIcon } from '@heroicons/react/24/outline';

type Props = {
    from?: 'pending' | 'my-orders'
    deliveryOrderStatus: OrderStatusEnum
}

export const ListDeliveryLineByDeliveryOrder = ({ from, deliveryOrderStatus }: Props) => {

    const [addDeliveryLineModalOpen, setAddDeliveryLineModalOpen] = useState(false);

    // KEY para almacenar los valores rellenados en los filtros
    const STORAGE_KEY = "deliveryLineFilters";
    const SELECTED_DELIVERY_ORDER_KEY = "currentDeliveryOrderId"


    const { id: deliveryOrderId } = useParams()

    const saved = sessionStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : null;

    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams?.get('page') ?? 0)
    const getEmptyForm = () => ({
        page: 0,
        minRequiredQuantity: '',
        maxRequiredQuantity: '',
        minLimitDate: '',
        maxLimitDate: '',
        lineStatus: '',
        location: '',
        subregionId: '',
        regionId: '',
        modelId: ''
    });

    const [form, setForm] = useState(() => {
        // Se utiliza una función para establecer los valores iniciales
        if (deliveryOrderId !== sessionStorage.getItem(SELECTED_DELIVERY_ORDER_KEY)) {
            return getEmptyForm();
        }

        return {
            // page: Number(searchParams.get('page') ?? parsed?.page ?? 0),
            page: page,
            minRequiredQuantity: searchParams.get('minRequiredQuantity') ?? parsed?.minRequiredQuantity ?? '',
            maxRequiredQuantity: searchParams.get('maxRequiredQuantity') ?? parsed?.maxRequiredQuantity ?? '',
            minLimitDate: searchParams.get('minLimitDate') ?? parsed?.minLimitDate ?? '',
            maxLimitDate: searchParams.get('maxLimitDate') ?? parsed?.maxLimitDate ?? '',
            lineStatus: searchParams.get('lineStatus') ?? parsed?.lineStatus ?? '',
            location: searchParams.get('location') ?? parsed?.location ?? '',
            subregionId: searchParams.get('subregionId') ?? parsed?.subregionId ?? '',
            regionId: searchParams.get('regionId') ?? parsed?.regionId ?? '',
            modelId: searchParams.get('modelId') ?? parsed?.modelId ?? ''
        }
    });

    useEffect(() => {
        const currentId = sessionStorage.getItem(SELECTED_DELIVERY_ORDER_KEY);

        if (currentId !== deliveryOrderId) {
            sessionStorage.removeItem(STORAGE_KEY);
            sessionStorage.setItem(SELECTED_DELIVERY_ORDER_KEY, deliveryOrderId!);

            // Limpiar los queryParams si ha cambiado de orden de entrega
            setSearchParams(new URLSearchParams(), { replace: true });
        }
    }, [deliveryOrderId]);

    const { data, isError } = useQuery({
        queryKey: ['deliveryLines', 'deliveryOrder', deliveryOrderId!,
            // {
            //     page, minRequiredQuantity, maxRequiredQuantity, minLimitDate, maxLimitDate, lineStatus,
            //     location, regionId, subregionId, modelId
            // }
            searchParams.toString()
        ],
        queryFn: () => listAllDeliveryLinesByDeliveryOrder(
            deliveryOrderId!,
            // {
            //     page: page,
            //     minRequiredQuantity: form.minRequiredQuantity,
            //     maxRequiredQuantity: form.maxRequiredQuantity,
            //     minLimitDate: form.minLimitDate,
            //     maxLimitDate: form.maxLimitDate,
            //     lineStatus: form.lineStatus as LineStatusEnum,
            //     location: form.location,
            //     subregionId: form.subregionId,
            //     regionId: form.regionId,
            //     modelId: form.modelId
            // }
            Object.fromEntries(searchParams)

        ),
    })



    useEffect(() => {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        const parsed = saved ? JSON.parse(saved) : null;

        const params = new URLSearchParams(searchParams.toString());

        // ✅ eliminar correctamente
        params.delete('currentModelId');

        // ⚠️ evaluar sobre params, no searchParams
        if (!params.toString() && parsed) {
            Object.entries(parsed).forEach(([key, value]) => {
                if (value !== '' && value !== null && value !== undefined) {
                    params.set(key, String(value));
                }
            });
        }

        if (params.toString() !== searchParams.toString()) {
            setSearchParams(params);
        }

    }, []);

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
        queryFn: () => listAllModelsByDeliveryOrder(deliveryOrderId!),
    })

    const modelsInDeliveryOrder = modelsByDeliveryOrderData?.map((model: ModelDeliveryOrderItem) => ({
        value: model.modelId, // OBS: DEBE SER EL ID DEL MODELO NO EL ID DE LA RELACION
        label: `${model.productName + " " + model.modelName}`
    }))



    const statusOptions: LineStatusOptions = [
      { value: "LINE_MISSING", label: "Perdido" },
      { value: "LINE_READY", label: "Listo" },
      { value: "LINE_PENDING", label: "Pendiente" },
      { value: "LINE_DELIVERED", label: "Entregado" },
      { value: "LINE_CANCELED", label: "Eliminado" },
      { value: "LINE_EXCEEDED", label: "Excedido" },
    ];

    useEffect(() => {
        if (!searchParams.toString() && parsed) {
            const params = new URLSearchParams();

            Object.entries(parsed).forEach(([key, value]) => {



                if (value) {
                    params.set(key, String(value));
                }
            });

            setSearchParams(params);
        }
    }, []);

    const buildParams = (form: {
        page: number;
        minRequiredQuantity: string;
        maxRequiredQuantity: string;
        minLimitDate: string;
        maxLimitDate: string;
        lineStatus: string;
        location: string;
        subregionId: string;
        regionId: string;
        modelId: string;
    }) => {
        const params = new URLSearchParams();

        Object.entries(form).forEach(([key, value]) => {

            if (key === 'page') return; // 🔥 clave

            if (value !== '' && value !== null && value !== undefined) {
                params.set(key, String(value));
            }
        });

        return params;
    };
    const getRoutePath = (deliveryLineId: number) => {
        if (from === 'pending') {
            return `/orders/pending/${deliveryOrderId}/line/${deliveryLineId}`
        }

        if (from === 'my-orders') {
            return `/orders/my-orders/${deliveryOrderId}/line/${deliveryLineId}`
        }
        return `/orders/${deliveryOrderId}/line/${deliveryLineId}`
    }


    return (
        <>
            <EntityListLayout isCompact>
                <EntityListLayout.Header actions={
                    (from !== 'pending' && from !== 'my-orders') &&
                    ['ORDER_CANCELED', 'ORDER_DELIVERED'].includes(deliveryOrderStatus) ||
                    (
                        <>
                            <Button
                                type={"submit"}
                                color={"blue"}
                                text="Nueva linea"
                                icon={<PlusCircleIcon />}
                                onClick={() => setAddDeliveryLineModalOpen(true)}
                                showTextOnMobile
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
                    )
                }>
                </EntityListLayout.Header>
                <EntityListLayout.Content>
                    <FiltersFormContainer onSubmit={(e) => {
                        e.preventDefault()
                        const params = buildParams(form);

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


                        // params.set('page', page.toString()); // resetear página al buscar

                        // setSearchParams(Object.fromEntries(params))
                        setSearchParams(params)

                        // estado
                        const newForm = {
                            ...form,
                        };
                        setForm(newForm);

                        // persistencia REAL (solo aquí)
                        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
                            lineStatus: form.lineStatus,
                            location: form.location,
                            maxLimitDate: form.maxLimitDate,
                            maxRequiredQuantity: form.maxRequiredQuantity,
                            minLimitDate: form.minLimitDate,
                            minRequiredQuantity: form.minRequiredQuantity,
                            modelId: form.modelId,
                            regionId: form.regionId,
                            subregionId: form.subregionId
                        }));

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
                        {/* TODO: EN ALGUNA FUTURA ACTUALIZACIÓN SE PODRIA OPTAR POR SOLAMENTE LISTAR LAS REGIONES Y SUBREGIONES QUE ESTEN ASOCIADAS A LA ORDEN DE ENTREGA MEDIANTE UNA PETICION A LA API REST */}

                        {/* CADA VEZ QUE CAMBIE DE REGIONID, SUBREGIONID DEBE SER REINICIADO, ESTABLECER EL VALOR NULL */}
                        <SelectOptionFilter
                            name='regionId'
                            label='Región'
                            options={regions}
                            onChange={(e) =>
                                setForm(prev => ({ ...prev, regionId: e.target.value, subregionId: '' }))
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

                                        const params = buildParams(form);
                                        params.set('page', page.toString());
                                        setSearchParams(params);

                                        setForm(prev => ({
                                            ...prev,
                                            page
                                        }))

                                        // if (form.minRequiredQuantity) params.set('minRequiredQuantity', form.minRequiredQuantity)
                                        // if (form.maxRequiredQuantity) params.set('maxRequiredQuantity', form.maxRequiredQuantity);
                                        // if (form.minLimitDate) params.set('minLimitDate', form.minLimitDate);
                                        // if (form.maxLimitDate) params.set('maxLimitDate', form.maxLimitDate);
                                        // if (form.lineStatus) params.set('lineStatus', form.lineStatus);
                                        // if (form.location) params.set('location', form.location);
                                        // if (form.subregionId) params.set('subregionId', String(form.subregionId));
                                        // if (form.regionId) params.set('regionId', String(form.regionId));
                                        // if (form.modelId) params.set('modelId', String(form.modelId));


                                    }}
                                />
                            ) : null
                        }
                    >
                        {
                            content?.map((deliveryLine: DeliveryLineItem) => {
                                return <TableRowContainer key={deliveryLine.id}>
                                    <BaseTableCell data={deliveryLine.id} />
                                    <BaseTableCell data={<>
                                        {/* TODO: SOLUCION TEMPORAL, ¿QUE DEBERIA MOSTRAR AQUI? */}
                                        <Link to={getRoutePath(deliveryLine.id)}>
                                            {deliveryLine.modelproductName}
                                        </Link>
                                    </>} />
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
