import { TitleContainer } from '@/components/TitleContainer'
import { useQuery } from '@tanstack/react-query'
import { TableHeaderContainer } from '@/components/TableHeaderContainer'
import type { CategoryItem, ModelItem, TypeItem } from '../../types'
import { TableRowContainer } from '@/components/TableRowContainer'
import { BaseTableCell } from '@/components/BaseTableCell'
import { listAllCategories } from '../../api/CategoryAPI'
import { listAllTypes } from '../../api/TypeAPI'
import { Link, useSearchParams } from 'react-router-dom'
import { useEffectEvent, useState } from 'react'
import { Paginator } from '../../../../components/Paginator'
import { useMediaQuery } from 'react-responsive'
import { SearchCounter } from '@/components/SearchCounter'
import { FiltersFormContainer } from '@/components/FiltersFormContainer'
import { ButtonLink } from '@/ui/ButtonLink'
import { InputTextFilter } from '@/ui/filters/InputTextFilter'
import { SelectOptionFilter } from '@/ui/filters/SelectOptionFilter'
import { listAllModels } from '../../api/ModelAPI'
import { ProductChangeStatus } from '../product/ProductChangeStatus'
import { InputDateFilter } from '@/ui/filters/InputDateFilter'

export const ModelList = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const page = Number(searchParams.get('page') ?? 0)
    const keyword = searchParams.get('keyword') ?? ''
    const minStock = searchParams.get('minStock') ?? ''
    const maxStock = searchParams.get('maxStock') ?? ''
    const minEntryDate = searchParams.get('minEntryDate') ?? ''
    const maxEntryDate = searchParams.get('maxEntryDate') ?? ''
    const categoryId = searchParams.get('categoryId') ?? undefined
    const typeId = searchParams.get('typeId') ?? undefined
    const statusParam = searchParams.get('status')
    const status =
        statusParam === null
            ? undefined
            : statusParam === 'true'

    const [form, setForm] = useState({
        page: page,
        keyword: keyword,
        minStock: minStock,
        maxStock: maxStock,
        minEntryDate: minEntryDate,
        maxEntryDate: maxEntryDate,
        categoryId: categoryId ?? '',
        typeId: typeId ?? '',
        status: status === undefined ? '' : String(status),
    })


    // En React 19 se utiliza el hook useEffectEvent en lugar del clasico useEffect

    useEffectEvent(() => {
        setForm({
            page: page,
            keyword: keyword,
            minStock: minStock,
            maxStock: maxStock,
            minEntryDate: minEntryDate,
            maxEntryDate: maxEntryDate,
            categoryId: categoryId ?? '',
            typeId: typeId ?? '',
            status: status === undefined ? '' : String(status),
        })
    })


    const { data, isError } = useQuery({
        queryKey: ['list-models', { keyword, minStock, maxStock, minEntryDate, maxEntryDate, categoryId, typeId, status, page }],

        queryFn: () => listAllModels({
            page: page,
            keyword: keyword,
            minStock: minStock,
            maxStock: maxStock,
            minEntryDate: minEntryDate,
            maxEntryDate: maxEntryDate,
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

    const statusOptions = [
        { value: '', label: 'Todos los estados' },
        { value: 'true', label: 'Activos' },
        { value: 'false', label: 'Inactivos' },
    ]

    const isSmallScreen = useMediaQuery({ query: '(max-width: 479px)' })

    // TODO: AÑADIR EN LA API REST, EN LA RESPUESTA DE OBTENER TODOS LOS MODELOS, EL NOMBRE DEL PRODUCTO EN UN CAMPO SEPARADO
    return (
        <TitleContainer
            title="Modelos"
            searchParams={
                <FiltersFormContainer onSubmit={
                    (e) => {
                        e.preventDefault()

                        const params = new URLSearchParams()

                        if (form.keyword) params.set('keyword', form.keyword)
                        if (form.minStock) params.set('minStock', form.minStock.toString())
                        if (form.maxStock) params.set('maxStock', form.maxStock.toString())
                        if (form.minEntryDate) params.set('minEntryDate', form.minEntryDate)
                        if (form.maxEntryDate) params.set('maxEntryDate', form.maxEntryDate)
                        if (form.categoryId) params.set('categoryId', form.categoryId)
                        if (form.typeId) params.set('typeId', form.typeId)
                        if (form.status !== '') params.set('status', form.status)

                        setSearchParams(params)
                    }
                }>
                    <div>
                        <InputTextFilter
                            name='keyword'
                            label='Nombre del modelo o producto:'
                            placeholder='Buscar modelos por nombre y/o nombre del producto'
                            type='text'
                            value={form.keyword}
                            onChange={(e) =>
                                setForm(prev => ({ ...prev, keyword: e.target.value }))
                            }
                        />
                    </div>
                    {/* TODO: CONTINUAR APLICANDO ESTILOS AL FORMULARIO DE FILTROS */}
                    <div className={`flex flex-row gap-4`}>
                        <div className='flex-row w-full'>
                            <InputTextFilter
                                name='minStock'
                                label='Stock mínimo:'
                                placeholder='Stock mínimo'
                                type='number'
                                value={form.minStock.toString()}
                                onChange={(e) =>
                                    setForm(prev => ({ ...prev, minStock: e.target.value }))
                                }
                            />

                        </div>
                        <div className='flex-row w-full'>
                            <InputTextFilter
                                name='maxStock'
                                label='Stock máximo:'
                                placeholder='Stock máximo'
                                type='number'
                                value={form.maxStock.toString()}
                                onChange={(e) =>
                                    setForm(prev => ({ ...prev, maxStock: e.target.value }))
                                }
                            />

                        </div>
                    </div>


                    {/* TODO: AÑADIR LOS CAMPOS DE FECHA LIMITE MINIMA Y MAXIMA */}
                    <div className={`flex flex-row gap-4`}>
                        <div className='flex-row w-full'>

                            <InputDateFilter
                                name='minEntryDate'
                                label='Fecha minima de entrada:'
                                value={form.minEntryDate}
                                onChange={(e) =>
                                    setForm(prev => ({ ...prev, minEntryDate: e.target.value }))
                                }
                            />
                        </div>
                        <div className='flex-row w-full'>
                            <InputDateFilter
                                name='maxEntryDate'
                                label='Fecha máxima de entrada:'
                                value={form.maxEntryDate}
                                onChange={(e) =>
                                    setForm(prev => ({ ...prev, maxEntryDate: e.target.value }))
                                }
                            />
                        </div>
                    </div>



                    <div className={`flex ${isSmallScreen ? 'flex-col gap-2' : 'flex-row gap-4'}`}>
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
        >
            {
                data && <SearchCounter totalElements={data.totalElements} page={data.page} size={data.size} last={data.last} />
            }

            <TableHeaderContainer
                headers={['ID', 'Nombre', 'Cantidad disponible', 'Fechas', 'Estado', 'Editar']}
                isError={isError}
                isEmpty={!content?.length}
            >
                {
                    content?.map((model: ModelItem) => {
                        return <TableRowContainer key={model.id}>
                            <BaseTableCell data={model.id} />
                            <BaseTableCell data={
                                <div className='flex flex-col gap-1'>
                                    {/* TODO: EL ENLACE SE PODRIA AÑADIR EN OTRA PARTE */}
                                    <Link to={`/products/${model.id}`} className='hover:text-blue-900'>
                                        <div>{model.name}</div>
                                        <div className='text-sm text-gray-500'>{model.productName}</div>
                                        <div className='text-sm text-gray-500'>{model.categoryName} - {model.typeName}</div>
                                    </Link>
                                </div>
                            } />
                            <BaseTableCell data={model.totalQuantityAvailable} />

                            <BaseTableCell data={<div className='flex flex-col text-sm'>
                                <div>Entrada: {model.entryDate}</div>
                                <div>Caducidad: {model.caducityDate}</div>
                            </div>} />

                            <BaseTableCell data={
                                <ProductChangeStatus size="small" productId={model.id.toString()} value={model.status ? 'Activo' : 'Inactivo'} />
                            } />

                            <BaseTableCell isCenter data={
                                //* SOLAMENTE SI UN PRODUCTO ESTA ACTIVO, PUEDE SER EDITADO
                                model.status === true ?
                                    <ButtonLink
                                        size="small"
                                        text="Editar"
                                        to={`/models/edit/${model.id}`}
                                        color="blue"
                                    /> : ''
                            } />
                        </TableRowContainer>
                    })
                }
            </TableHeaderContainer>

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

                            if (form.keyword) params.set('keyword', form.keyword)

                            if (form.minStock) params.set('minStock', form.minStock.toString())
                            if (form.maxStock) params.set('maxStock', form.maxStock.toString())
                            if (form.minEntryDate) params.set('minEntryDate', form.minEntryDate)
                            if (form.maxEntryDate) params.set('maxEntryDate', form.maxEntryDate)

                            if (form.categoryId) params.set('categoryId', form.categoryId)
                            if (form.typeId) params.set('typeId', form.typeId)
                            if (form.status !== '') params.set('status', form.status)

                            params.set('page', page.toString())

                            setSearchParams(params)

                        }}
                    />
                ) : null
            }
        </TitleContainer>



    )
}

