import { useQuery } from "@tanstack/react-query"
import { useEffectEvent, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { listAllMovements } from "../api/MovementAPI"
import { useMediaQuery } from "react-responsive"
import { ListElementsContainer } from "@/views/ListElementsContainer"
import { FiltersFormContainer } from "@/components/FiltersFormContainer"
import { InputTextFilter } from "@/ui/filters/InputTextFilter"
import { SearchCounter } from "@/components/SearchCounter"
import { TableContainer } from "@/components/TableContainer"
import { TableRowContainer } from "@/components/TableRowContainer"
import type { MovementItem } from "../types"
import { BaseTableCell } from "@/components/BaseTableCell"
import { handleFormatDateTime } from "@/utils/handleFormatDateTime"
import { Paginator } from "@/components/Paginator"

export const MovementList = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const page = Number(searchParams.get('page') ?? 0)
    const minQuantity = searchParams.get('minQuantity') ?? ''
    const maxQuantity = searchParams.get('maxQuantity') ?? ''
    const minCreatedAt = searchParams.get('minCreatedAt') ?? ''
    const maxCreatedAt = searchParams.get('maxCreatedAt') ?? ''
    const movementType = searchParams.get('movementType') ?? ''
    const username = searchParams.get('username') ?? ''
    const keyword = searchParams.get('keyword') ?? ''
    const deliveryLineId = searchParams.get('deliveryLineId') ?? undefined
    const modelId = searchParams.get('modelId') ?? undefined
    const userId = searchParams.get('userId') ?? undefined
    const stockLotReceiverId = searchParams.get('stockLotReceiverId') ?? undefined

    const [form, setForm] = useState({
        page: page,
        minQuantity: minQuantity,
        maxQuantity: maxQuantity,
        minCreatedAt: minCreatedAt,
        maxCreatedAt: maxCreatedAt,
        movementType: movementType,
        username: username,
        keyword: keyword,
        deliveryLineId: deliveryLineId ?? '',
        modelId: modelId ?? '',
        userId: userId ?? '',
        stockLotReceiverId: stockLotReceiverId ?? ''
    })


    // En React 19 se utiliza el hook useEffectEvent en lugar del clasico useEffect

    useEffectEvent(() => {
        setForm({
            page: page,
            minQuantity: minQuantity,
            maxQuantity: maxQuantity,
            minCreatedAt: minCreatedAt,
            maxCreatedAt: maxCreatedAt,
            movementType: movementType,
            username: username,
            keyword: keyword,
            deliveryLineId: deliveryLineId ?? '',
            modelId: modelId ?? '',
            userId: userId ?? '',
            stockLotReceiverId: stockLotReceiverId ?? ''
        })
    })


    const { data, isError } = useQuery({
        queryKey: ['movements', {
            minQuantity, maxQuantity, minCreatedAt, maxCreatedAt, movementType,
            username, keyword, deliveryLineId, modelId, userId, stockLotReceiverId, page
        }],

        queryFn: () => listAllMovements({
            page: page,
            minQuantity: minQuantity,
            maxQuantity: maxQuantity,
            minCreatedAt: minCreatedAt,
            maxCreatedAt: maxCreatedAt,
            movementType: movementType,
            username: username,
            keyword: keyword,
            deliveryLineId: deliveryLineId,
            modelId: modelId,
            userId: userId,
            stockLotReceiverId: stockLotReceiverId
        }),
    })


    // TODO: CONTINUAR AQUI LUEGO DE COMPLETAR EL MODULO ORDER
    const content = data?.content || []
    // console.log(data)

    const isSmallScreen = useMediaQuery({ query: '(max-width: 479px)' })

    return (
        <ListElementsContainer
            title="Movimientos"
            searchParams={
                <FiltersFormContainer onSubmit={
                    (e) => {
                        e.preventDefault()

                        const params = new URLSearchParams()

                        if (form.minQuantity) params.set('minQuantity', form.minQuantity)
                        if (form.maxQuantity) params.set('maxQuantity', form.maxQuantity)
                        if (form.minCreatedAt) params.set('minCreatedAt', form.minCreatedAt)
                        if (form.maxCreatedAt) params.set('maxCreatedAt', form.maxCreatedAt)
                        if (form.movementType) params.set('movementType', form.movementType)
                        if (form.username) params.set('username', form.username)
                        if (form.keyword) params.set('keyword', form.keyword)
                        if (form.deliveryLineId) params.set('deliveryLineId', form.deliveryLineId)
                        if (form.modelId) params.set('modelId', form.modelId)
                        if (form.userId) params.set('userId', form.userId)
                        if (form.stockLotReceiverId) params.set('stockLotReceiverId', form.stockLotReceiverId)

                        setSearchParams(params)
                    }
                }>
                    <InputTextFilter
                        name='minQuantity'
                        label='Cantidad minima tomada:'
                        placeholder='Cantidad minima tomada'
                        type='text'
                        value={form.minQuantity}
                        onChange={(e) =>
                            setForm(prev => ({ ...prev, minQuantity: e.target.value }))
                        }
                    />
                    <InputTextFilter
                        name='maxQuantity'
                        label='Cantidad maxima tomada:'
                        placeholder='Cantidad maxima tomada'
                        type='text'
                        value={form.maxQuantity}
                        onChange={(e) =>
                            setForm(prev => ({ ...prev, maxQuantity: e.target.value }))
                        }
                    />

                    <div className={`flex ${isSmallScreen ? 'flex-col gap-2' : 'flex-row gap-4'}`}>

                    </div>

                </FiltersFormContainer>
            }
        >
            {
                data && <SearchCounter totalElements={data.totalElements} page={data.page} size={data.size} last={data.last} />
            }

            <TableContainer
                headers={['ID', 'Movimiento', 'Fecha', 'Cantidad', 'Usuario', 'ID de modelo']}
                isError={isError}
                isEmpty={!content?.length}
            >
                {
                    content?.map((movement: MovementItem) => {
                        return <TableRowContainer key={movement.id}>
                            <BaseTableCell data={movement.id} />

                            <BaseTableCell data={movement.movementType} />
                            <BaseTableCell data={
                                handleFormatDateTime(new Date(movement.createdAt))
                            } />
                            <BaseTableCell data={
                                movement.quantity
                            } />
                            <BaseTableCell data={<div className='text-sm'>{movement.userName}</div>} />
                            <BaseTableCell data={
                                movement.modelId
                            } />


                        </TableRowContainer>
                    })
                }
            </TableContainer>

            {
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

                            if (form.minQuantity) params.set('minQuantity', form.minQuantity)
                            if (form.maxQuantity) params.set('maxQuantity', form.maxQuantity)
                            if (form.minCreatedAt) params.set('minCreatedAt', form.minCreatedAt)
                            if (form.maxCreatedAt) params.set('maxCreatedAt', form.maxCreatedAt)
                            if (form.movementType) params.set('movementType', form.movementType)
                            if (form.username) params.set('username', form.username)
                            if (form.keyword) params.set('keyword', form.keyword)
                            if (form.deliveryLineId) params.set('deliveryLineId', form.deliveryLineId)
                            if (form.modelId) params.set('modelId', form.modelId)
                            if (form.userId) params.set('userId', form.userId)
                            if (form.stockLotReceiverId) params.set('stockLotReceiverId', form.stockLotReceiverId)


                            params.set('page', page.toString())

                            setSearchParams(params)

                        }}
                    />
                ) : null
            }
        </ListElementsContainer>



    )
}

