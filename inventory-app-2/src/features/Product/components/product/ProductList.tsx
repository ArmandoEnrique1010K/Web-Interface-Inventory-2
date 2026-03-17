import { ListElementsContainer } from '@/views/ListElementsContainer'
import { useQuery } from '@tanstack/react-query'
import { listAllProducts } from '../../api/ProductAPI'
import { TableHeaderContainer } from '@/components/TableHeaderContainer'
import type { CategoryItem, ProductItem, TypeItem } from '../../types'
import { TableRowContainer } from '@/components/TableRowContainer'
import { BaseTableCell } from '@/components/BaseTableCell'
import { listAllCategories } from '../../api/CategoryAPI'
import { listAllTypes } from '../../api/TypeAPI'
import { ProductChangeStatus } from './ProductChangeStatus'
import { Link, useSearchParams } from 'react-router-dom'
import { useEffectEvent, useState } from 'react'
import { Paginator } from '../../../../components/Paginator'
import { useMediaQuery } from 'react-responsive'
import { SearchCounter } from '@/components/SearchCounter'
import { FiltersFormContainer } from '@/components/FiltersFormContainer'
import { ButtonLink } from '@/ui/ButtonLink'
import { generateSizes } from '@/utils/generateSizes'
import { InputTextFilter } from '@/ui/filters/InputTextFilter'
import { SelectOptionFilter } from '@/ui/filters/SelectOptionFilter'
import { PlusCircleIcon } from '@heroicons/react/24/outline'

export const ProductList = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const page = Number(searchParams.get('page') ?? 0)
    const name = searchParams.get('name') ?? ''
    const categoryId = searchParams.get('categoryId') ?? undefined
    const typeId = searchParams.get('typeId') ?? undefined
    const statusParam = searchParams.get('status')
    const status =
        statusParam === null
            ? undefined
            : statusParam === 'true'

    const [form, setForm] = useState({
        page: page,
        name: name,
        categoryId: categoryId ?? '',
        typeId: typeId ?? '',
        status: status === undefined ? '' : String(status),
    })


    // En React 19 se utiliza el hook useEffectEvent en lugar del clasico useEffect

    useEffectEvent(() => {
        setForm({
            page: page,
            name: name,
            categoryId: categoryId ?? '',
            typeId: typeId ?? '',
            status: status === undefined ? '' : String(status),
        })
    })


    const { data, isError } = useQuery({
        queryKey: ['list-products', { name, categoryId, typeId, status, page }],

        queryFn: () => listAllProducts({
            page: page,
            name: name,
            categoryId: categoryId,
            typeId: typeId,
            status: status
        }),
    })

    const content = data?.content || []
    // OBTENER LAS CARACTERISTICAS Y LOS TIPOS
    const { data: categoriesData } = useQuery({
        queryKey: ['list-categories'],
        queryFn: listAllCategories
    })
    const { data: typesData } = useQuery({
        queryKey: ['list-types'],
        queryFn: listAllTypes
    })

    const categories = categoriesData?.map((category: CategoryItem) => ({
        value: category.id,
        label: category.name,
    })) || []


    const types = typesData?.map((type: TypeItem) => ({
        value: type.id,
        label: type.name,
    })) || []

    const generateCaracterist = (product: ProductItem) => {
        if (+product.categoryId === 1) {
            return `${product.typeName}`
        }

        if (+product.categoryId !== 1) {
            return `${product.typeName} de ${product.categoryName}`
        }

    }


    const statusOptions = [
        { value: '', label: 'Todos los estados' },
        { value: 'true', label: 'Activos' },
        { value: 'false', label: 'Inactivos' },
    ]

    const isSmallScreen = useMediaQuery({ query: '(max-width: 920px)' })

    return (
        <ListElementsContainer
            title="Productos"
            buttonsContainer={
                <ButtonLink
                    icon={<PlusCircleIcon />}
                    size="large"
                    text="Nuevo producto"
                    to="/products/new"
                    color="blue"
                />
            }
            searchParamsContainer={
                <FiltersFormContainer onSubmit={
                    (e) => {
                        e.preventDefault()

                        const params = new URLSearchParams()

                        if (form.name) params.set('name', form.name)
                        if (form.categoryId) params.set('categoryId', form.categoryId)
                        if (form.typeId) params.set('typeId', form.typeId)
                        if (form.status !== '') params.set('status', form.status)

                        setSearchParams(params)
                    }
                }>
                    <InputTextFilter
                        name='name'
                        label='Nombre del producto:'
                        placeholder='Buscar productos por nombre'
                        type='text'
                        value={form.name}
                        onChange={(e) =>
                            setForm(prev => ({ ...prev, name: e.target.value }))
                        }
                    />

                    <div className={`flex ${isSmallScreen ? 'flex-col space-y-4' : 'flex-row space-x-4'}`}>
                        <SelectOptionFilter
                            name='categoryId'
                            label='Categoría:'
                            options={categories}
                            onChange={(e) =>
                                setForm(prev => ({ ...prev, categoryId: e.target.value }))
                            }
                            textInNullOption="Todas las categorias"
                            value={form.categoryId}
                        />
                        <SelectOptionFilter
                            name='typeId'
                            label='Tipo:'
                            options={types}
                            onChange={(e) =>
                                setForm(prev => ({ ...prev, typeId: e.target.value }))
                            }
                            textInNullOption="Todos los tipos"
                            value={form.typeId}
                        />
                        <SelectOptionFilter
                            name='status'
                            label='Estado:'
                            options={statusOptions}
                            onChange={(e) =>
                                setForm(prev => ({ ...prev, status: e.target.value }))
                            }
                            value={form.status}
                        />

                    </div>

                </FiltersFormContainer>
            }

            dataContainer={
                <TableHeaderContainer
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

                                    if (form.name) params.set('name', form.name)
                                    if (form.categoryId) params.set('categoryId', form.categoryId)
                                    if (form.typeId) params.set('typeId', form.typeId)
                                    if (form.status !== '') params.set('status', form.status)

                                    params.set('page', page.toString())

                                    setSearchParams(params)

                                }}
                            />
                        ) : null

                    }

                >

                    {
                        content?.map((product: ProductItem) => {
                            return <TableRowContainer key={product.id}>
                                <BaseTableCell data={product.id} />
                                <BaseTableCell data={
                                    <div className='flex flex-col gap-1'>
                                        {/* TODO: EL ENLACE SE PODRIA AÑADIR EN OTRA PARTE O SE PUEDE HACER MÁS RESALTADO COMO EN EL NOMBRE DEL PRODUCTO*/}
                                        <Link to={`/products/${product.id}`} className='hover:text-blue-500 hover:underline'>{product.name}</Link>
                                        <p className='text-xs'>{product.quantityModels === 1 ? '1 modelo' : `${product.quantityModels} modelos`}</p>
                                    </div>
                                } />
                                <BaseTableCell data={
                                    <div className='text-sm'>
                                        {generateCaracterist(product)}

                                    </div>
                                } />
                                <BaseTableCell data={
                                    <div className='text-sm'>
                                        {generateSizes(product)}
                                    </div>
                                } />

                                <BaseTableCell data={
                                    <ProductChangeStatus size="small" productId={product.id.toString()} value={product.status ? 'Activo' : 'Inactivo'} />
                                } />

                                <BaseTableCell isCenter data={
                                    //* SOLAMENTE SI UN PRODUCTO ESTA ACTIVO, PUEDE SER EDITADO
                                    product.status === true ?
                                        <ButtonLink
                                            size="small"
                                            text="Editar"
                                            to={`/products/edit/${product.id}`}
                                            color="blue"

                                        /> : ''
                                } />
                            </TableRowContainer>
                        })
                    }
                </TableHeaderContainer>

            }
        />
    )
}

