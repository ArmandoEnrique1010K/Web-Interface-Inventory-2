import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useSearchParams, Link } from 'react-router-dom';
import { listAllDeliveryOrders } from "../../api/DeliveryOrderAPI"
import { EntityListLayout } from "@/layout/entity/EntityListLayout"
import { ButtonLink } from "@/ui/ButtonLink"
import { PlusCircleIcon } from "@heroicons/react/24/outline"
import { FiltersFormContainer } from "@/components/FiltersFormContainer"
import { InputTextFilter } from "@/ui/filters/InputTextFilter"
import { TableContainer } from "@/components/TableContainer"
import type { DeliveryOrderItem } from "../../types"
import { SearchCounter } from "@/components/SearchCounter"
import { Paginator } from "@/components/Paginator"
import { TableRowContainer } from "@/components/TableRowContainer"
import { BaseTableCell } from "@/components/BaseTableCell"
import { SelectOptionFilter } from "@/ui/filters/SelectOptionFilter"
import { handleApplyDeliveryOrderStatusStyle } from "@/utils/handleApplyDeliveryOrderStatusStyle";
import { InputDateTimeFilter } from "@/ui/filters/InputDateTimeFilter";
import { handleFormatDateTimeText } from "@/utils/handleFormatDateTimeText";

export const ListDeliveryOrderPage = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const page = Number(searchParams.get('page') ?? 0)
    const batch = searchParams.get('batch') ?? ''
    const startDate = searchParams.get('startDate') ?? ''
    const endDate = searchParams.get('endDate') ?? ''
    const userClientName = searchParams.get('userClientName') ?? ''
    const status = searchParams.get('status') ?? ''
    const [form, setForm] = useState({
        page: page,
        batch,
        startDate,
        endDate,
        userClientName,
        status: status === undefined ? '' : String(status),
    })



    const { data, isError } = useQuery({

        queryKey: ['deliveryOrders', { batch, startDate, endDate, userClientName, status, page }],

        queryFn: () => listAllDeliveryOrders({
            page: page,
            batch: batch,
            startDate: startDate,
            endDate: endDate,
            userClientName: userClientName,
            status: status as 'ORDER_READY' | 'ORDER_PENDING' | 'ORDER_DELIVERED' | 'ORDER_CANCELED' | ''
        }),
    })

    const content = data?.content || []

    const statusOptions = [
        { value: 'ORDER_READY', label: 'Listo' },
        { value: 'ORDER_PENDING', label: 'Pendiente' },
        { value: 'ORDER_DELIVERED', label: 'Entregado' },
        { value: 'ORDER_CANCELED', label: 'Eliminado' },
    ]

    return (
        <EntityListLayout>
            <EntityListLayout.Header
                title="Ordenes de entrega"
                actions={
                    <ButtonLink
                        icon={<PlusCircleIcon />}
                        size="large"
                        text="Nueva orden"
                        to="/orders/new"
                        color="blue"
                        showIconOnMobile={false}
                        showTextOnMobile
                    />
                }
            ></EntityListLayout.Header>
            <EntityListLayout.Content>
                <FiltersFormContainer onSubmit={
                    (e) => {
                        e.preventDefault()
                        const params = new URLSearchParams()

                        if (form.batch) params.set('batch', form.batch)
                        if (form.startDate) params.set('startDate', form.startDate)
                        if (form.endDate) params.set('endDate', form.endDate)
                        if (form.userClientName) params.set('userClientName', form.userClientName)
                        if (form.status) params.set('status', form.status)

                        setSearchParams(params)
                    }
                }>

                    <InputTextFilter
                        name='batch'
                        label='Código de orden de entrega'
                        placeholder='Buscar por código de orden de entrega'
                        type='text'
                        value={form.batch}
                        onChange={(e) =>
                            setForm(prev => ({ ...prev, batch: e.target.value }))
                        }
                    />

                    <InputDateTimeFilter
                        name="startDate"
                        label='Fecha minima de creación'
                        value={form.startDate}
                        onChange={(value) =>
                            setForm(prev => ({ ...prev, startDate: value }))
                        }
                    />

                    <InputDateTimeFilter
                        name="endDate"
                        label='Fecha maxima de creación'
                        value={form.endDate}
                        onChange={(value) =>
                            setForm(prev => ({ ...prev, endDate: value }))
                        }
                    />


                    {/* <InputDateFilter
                        name='startDate'
                        label='Fecha minima de creación'
                        value={form.startDate}
                        onChange={(e) =>
                            setForm(prev => ({ ...prev, startDate: e.target.value }))
                        }
                    />
                    <InputDateFilter
                        name='endDate'
                        label='Fecha maxima de creación'
                        value={form.endDate}
                        onChange={(e) =>
                            setForm(prev => ({ ...prev, endDate: e.target.value }))
                        }
                    /> */}
                    <InputTextFilter
                        name='userClientName'
                        label='Nombre del cliente'
                        placeholder='Buscar por nombre del cliente'
                        type='text'
                        value={form.userClientName}
                        onChange={(e) =>
                            setForm(prev => ({ ...prev, userClientName: e.target.value }))
                        }
                    />
                    <SelectOptionFilter
                        name='status'
                        label='Estado'
                        options={statusOptions}
                        onChange={(e) =>
                            setForm(prev => ({ ...prev, status: e.target.value }))
                        }
                        textInNullOption="Todos los estados"
                        value={form.status}
                    />
                </FiltersFormContainer>

                <TableContainer
                    headers={["ID", "# de factura", "Fecha limite", "Cliente", "Estado"]}
                    isError={isError}
                    isEmpty={!content?.length}
                    itemsCounter={
                        data && <SearchCounter
                            totalElements={data.totalElements}
                            page={data.page}
                            size={data.size}
                            last={data.last}
                        />
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

                                    if (form.batch) params.set('batch', form.batch)

                                    if (form.startDate) params.set('startDate', form.startDate)
                                    if (form.endDate) params.set('endDate', form.endDate)

                                    if (form.userClientName) params.set('userClientName', form.userClientName)
                                    if (form.status !== '') params.set('status', form.status)

                                    params.set('page', page.toString())

                                    setSearchParams(params)
                                }}
                            />
                        ) : null
                    }
                >
                    {
                        content.map((order: DeliveryOrderItem) => {
                            return <TableRowContainer key={order.id}>
                                <BaseTableCell data={order.id} />
                                <BaseTableCell data={
                                    <Link to={`/orders/${order.id}`} className='hover:text-blue-900'>{order.batch}</Link>
                                } />
                                <BaseTableCell data={
                                    order.limitDate ? (
                                        <span>
                                            <span>{handleFormatDateTimeText(new Date(order.limitDate)).date} {handleFormatDateTimeText(new Date(order.limitDate)).hour}</span>
                                        </span>
                                    ) : 'Sin fecha'
                                } />
                                <BaseTableCell data={
                                    <div className="text-sm">{order.userClientFullname}</div>
                                } />
                                <BaseTableCell isCenter data={
                                    <span className={`
                                        ${handleApplyDeliveryOrderStatusStyle(statusOptions.find(status => status.value === order.orderStatus)?.label as 'Listo' | "Pendiente" | "Entregado" | "Eliminado")}
                                        px-3 py-1 rounded-4xl `}>
                                        {statusOptions.find(status => status.value === order.orderStatus)?.label}
                                    </span>
                                } />
                            </TableRowContainer>
                        })
                    }
                </TableContainer>
            </EntityListLayout.Content>

        </EntityListLayout >
    )
}
