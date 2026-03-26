import { FiltersFormContainer } from '@/components/FiltersFormContainer'
import { Paginator } from '@/components/Paginator'
import { SearchCounter } from '@/components/SearchCounter'
import { TableContainer } from '@/components/TableContainer'
import { searchActiveModelsByName } from '@/features/Product/api/ModelAPI'
import { EntityListLayout } from '@/layout/entity/EntityListLayout'
import { InputTextFilter } from '@/ui/filters/InputTextFilter'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import type { SetURLSearchParams } from 'react-router-dom'

type Props = {
    setAddModelDeliveryOrderModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    deliveryOrderId: string,
    searchParams: URLSearchParams,
    setSearchParams: SetURLSearchParams
}

export const NewModelDeliveryOrderModal = ({
    deliveryOrderId,
    setAddModelDeliveryOrderModalOpen,
    searchParams,
    setSearchParams
}: Props) => {

    const page = Number(searchParams.get('page') ?? 0)
    const keyword = searchParams.get('keyword') ?? ''

    const [form, setForm] = useState({
        page: page,
        keyword: keyword,
    })

    const { data, isError } = useQuery({
        queryKey: ['products', { keyword, page }],

        queryFn: () => searchActiveModelsByName({
            page: page,
            keyword: keyword,
        }),
    })

    const content = data?.content || []


    return (
        <EntityListLayout>
            <EntityListLayout.Header
                title='Añada modelos a la orden de entrega'
            ></EntityListLayout.Header>
            <EntityListLayout.Content>
                <FiltersFormContainer onSubmit={
                    (e) => {
                        e.preventDefault()
                        const params = new URLSearchParams()
                        if (form.keyword) params.set('keyword', form.keyword)
                        setSearchParams(params)
                    }
                }>
                    <InputTextFilter
                        name='keyword'
                        label='Nombre del producto o modelo'
                        placeholder='Buscar  por nombre'
                        type='text'
                        value={form.keyword}
                        onChange={(e) =>
                            setForm(prev => ({ ...prev, keyword: e.target.value }))
                        }
                    />

                </FiltersFormContainer>
                <TableContainer
                    headers={['ID', 'Nombre', 'Característica', 'Medidas', 'Estado', 'Editar']}
                    isError={isError}
                    isEmpty={!content?.length}
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

                                    if (form.keyword) params.set('keyword', form.keyword)
                                    params.set('page', page.toString())

                                    setSearchParams(params)

                                }}
                            />
                        ) : null
                    }
                >

                </TableContainer>
            </EntityListLayout.Content>
        </EntityListLayout>
    )
}
