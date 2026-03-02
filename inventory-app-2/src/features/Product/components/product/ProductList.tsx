import { TitleContainer } from '@/components/TitleContainer'
import { Button } from '@/ui/Button'
import { useQuery } from '@tanstack/react-query'
import { listAllProducts } from '../../api/ProductAPI'
import { TableHeaderContainer } from '@/components/TableHeaderContainer'
import type { CategoryItem, ProductItem, TypeItem } from '../../types'
import { TableRowContainer } from '@/components/TableRowContainer'
import { BaseTableCell } from '@/components/BaseTableCell'
import { listAllCategories } from '../../api/CategoryAPI'
import { listAllTypes } from '../../api/TypeAPI'
import { ProductChangeStatus } from './ProductChangeStatus'
import { useSearchParams } from 'react-router-dom'
import { useEffectEvent, useState } from 'react'
import { InputText } from '@/ui/InputText'
import { SelectOption } from '@/ui/SelectOption'
import { Paginator } from './Paginator'
import { useMediaQuery } from 'react-responsive'

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


    const generateSizes = (product: ProductItem) => {
        const sizes: string[] = []

        if (Number(product.length) > 0) {
            sizes.push(`${product.length} cm. (L)`)
        }

        if (Number(product.width) > 0) {
            sizes.push(`${product.width} cm. (An)`)
        }

        if (Number(product.height) > 0) {
            sizes.push(`${product.height} cm. (Al)`)
        }

        if (sizes.length === 0) {
            return <span className="text-xs">—</span>
        }

        return (
            <div className="text-xs">
                {sizes.join(' x ')}
            </div>
        )
    }


    const statusOptions = [
        { value: '', label: 'Todos los estados' },
        { value: 'true', label: 'Activos' },
        { value: 'false', label: 'Inactivos' },
    ]

    const isSmallScreen = useMediaQuery({ query: '(max-width: 479px)' })



    return (
        <TitleContainer
            title="Productos"
            buttons={
                <Button
                    size="large"
                    text="Nuevo producto"
                    type="link"
                    to="/products/new"
                    color="blue"
                />
            }
            searchParams={
                <form
                    className='border border-gray-700 rounded-xl px-4 py-2 mb-8'
                    autoComplete="off" noValidate
                    onSubmit={(e) => {
                        e.preventDefault()

                        const params = new URLSearchParams()

                        if (form.name) params.set('name', form.name)
                        if (form.categoryId) params.set('categoryId', form.categoryId)
                        if (form.typeId) params.set('typeId', form.typeId)
                        if (form.status !== '') params.set('status', form.status)


                        setSearchParams(params)
                    }}
                >
                    <InputText
                        id='name'
                        name='name'
                        label='Nombre del producto:'
                        hasErrors={false}
                        placeholder='Buscar productos por nombre'
                        type='text'
                        value={form.name}
                        onChange={(e) =>
                            setForm(prev => ({ ...prev, name: e.target.value }))
                        }
                    />

                    <div className={`flex ${isSmallScreen ? 'flex-col' : 'flex-row gap-4'}`}>
                        <SelectOption
                            id='categoryId'
                            name='categoryId'
                            label='Categoría:'
                            hasErrors={false}
                            options={categories}
                            onChange={(e) =>
                                setForm(prev => ({ ...prev, categoryId: e.target.value }))
                            }
                            nullOption={true}
                            textInNullOption="Todas las categorias"
                            value={form.categoryId}
                        />
                        <SelectOption
                            id='typeId'
                            name='typeId'
                            label='Tipo:'
                            hasErrors={false}
                            options={types}
                            onChange={(e) =>
                                setForm(prev => ({ ...prev, typeId: e.target.value }))
                            }
                            nullOption={true}
                            textInNullOption="Todos los tipos"
                            value={form.typeId}
                        />
                        <SelectOption
                            id='status'
                            name='status'
                            label='Estado:'
                            hasErrors={false}
                            options={statusOptions}
                            onChange={(e) =>
                                setForm(prev => ({ ...prev, status: e.target.value }))
                            }
                            nullOption={false}
                            value={form.status}
                        />

                    </div>
                    <div className='flex justify-end'>
                        <Button text="Filtrar" type="submit" color='green' size='large' aditionalStyles='mt-6 mb-2' />

                    </div>
                </form>}
        >
            {
                data && <div className='text-sm pb-2 '>Se han encontrado {data?.totalElements} elementos ♦ Se obtuvierón los primeros {!data!.last ? data!.size * (data!.page + 1) : data!.totalElements} elementos ♦ Omitiendo {data!.size * (data!.page)} elementos</div>

            }

            <TableHeaderContainer
                headers={['ID', 'Nombre', 'Característica', 'Medidas', 'Estado', 'Editar']}
                isError={isError}
                isEmpty={!content?.length}
            >
                {
                    content?.map((product: ProductItem) => {
                        return <TableRowContainer key={product.id}>
                            <BaseTableCell data={product.id} />
                            <BaseTableCell data={
                                <div className='flex flex-col gap-1'>
                                    <p>{product.name}</p>
                                    <p className='text-xs'>{product.quantityModels === 1 ? '1 modelo' : `${product.quantityModels} modelos`}</p>
                                </div>
                            } />
                            <BaseTableCell data={
                                generateCaracterist(product)

                            } />
                            <BaseTableCell data={generateSizes(product)} />

                            <BaseTableCell data={
                                <ProductChangeStatus productId={product.id.toString()} value={product.status ? 'Activo' : 'Inactivo'} />
                            } />

                            <BaseTableCell data={
                                //* SOLAMENTE SI UN PRODUCTO ESTA ACTIVO, PUEDE SER EDITADO
                                product.status === true ?
                                    <Button
                                        size="small"
                                        text="Editar"
                                        type="link"
                                        to={`/products/edit/${product.id}`}
                                        color="blue"
                                    /> : ''
                            } isCenter />
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
        </TitleContainer>



    )
}

