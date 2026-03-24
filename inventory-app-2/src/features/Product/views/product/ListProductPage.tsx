import { useQuery } from '@tanstack/react-query'
import { listAllProducts } from '../../api/ProductAPI'
import { TableContainer } from '@/components/TableContainer'
import type { CategoryItem, ProductItem, TypeItem } from '../../types'
import { TableRowContainer } from '@/components/TableRowContainer'
import { BaseTableCell } from '@/components/BaseTableCell'
import { listAllCategories } from '../../api/CategoryAPI'
import { listAllTypes } from '../../api/TypeAPI'
import { Link, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { Paginator } from '../../../../components/Paginator'
import { useMediaQuery } from 'react-responsive'
import { SearchCounter } from '@/components/SearchCounter'
import { FiltersFormContainer } from '@/components/FiltersFormContainer'
import { ButtonLink } from '@/ui/ButtonLink'
import { generateSizes } from '@/utils/generateSizes'
import { InputTextFilter } from '@/ui/filters/InputTextFilter'
import { SelectOptionFilter } from '@/ui/filters/SelectOptionFilter'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { EntityListLayout } from '@/layout/entity/EntityListLayout'
import { StatusProductButton } from '../../components/product/StatusProductButton'
import { Button } from '@/ui/Button'
import { Modal } from '@/components/Modal'
import { LoaderProduct } from '../../components/product/LoaderProduct'
export const ListProductPage = () => {


    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);


    const [searchParams, setSearchParams] = useSearchParams()
    const page = Number(searchParams.get('page') ?? 0)
    const name = searchParams.get('name') ?? ''
    const categoryId = searchParams.get('categoryId') ?? undefined
    const typeId = searchParams.get('typeId') ?? undefined
    const statusParam = searchParams.get('status')
    const status =
        statusParam === null ?
            undefined :
            statusParam === 'true'

    const [form, setForm] = useState({
        page: page,
        name: name,
        categoryId: categoryId ?? '',
        typeId: typeId ?? '',
        status: status === undefined ? '' : String(status),
    })

    // No se recomienda usar un hook useEffectEvent ni useEffect en React 19
    // Problema: useEffectEvent NO reemplaza a useEffect para sincronizar estado.
    // Estás copiando estado derivado → anti-pattern

    // useEffectEvent(() => {
    //     setForm({
    //         page: page,
    //         name: name,
    //         categoryId: categoryId ?? '',
    //         typeId: typeId ?? '',
    //         status: status === undefined ? '' : String(status),
    //     })
    // })


    const { data, isError } = useQuery({
        queryKey: ['products', { name, categoryId, typeId, status, page }],

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
        queryKey: ['categories'],
        queryFn: listAllCategories
    })
    const { data: typesData } = useQuery({
        queryKey: ['types'],
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
        <EntityListLayout>
            <EntityListLayout.Header title='Productos'
                actions={
                    <ButtonLink
                        icon={<PlusCircleIcon />}
                        size="large"
                        text="Nuevo producto"
                        to="/products/new"
                        color="blue"
                        showIconOnMobile={false}
                        showTextOnMobile
                    />
                }></EntityListLayout.Header>
            <EntityListLayout.Content>

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
                        label='Nombre del producto'
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
                            label='Categoría'
                            options={categories}
                            onChange={(e) =>
                                setForm(prev => ({ ...prev, categoryId: e.target.value }))
                            }
                            textInNullOption="Todas las categorias"
                            value={form.categoryId}
                        />
                        <SelectOptionFilter
                            name='typeId'
                            label='Tipo'
                            options={types}
                            onChange={(e) =>
                                setForm(prev => ({ ...prev, typeId: e.target.value }))
                            }
                            textInNullOption="Todos los tipos"
                            value={form.typeId}
                        />
                        <SelectOptionFilter
                            name='status'
                            label='Estado'
                            options={statusOptions}
                            onChange={(e) =>
                                setForm(prev => ({ ...prev, status: e.target.value }))
                            }
                            value={form.status}
                        />

                    </div>

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

                                    if (form.name) params.set('name', form.name)
                                    if (form.categoryId) params.set('categoryId', form.categoryId)
                                    if (form.typeId) params.set('typeId', form.typeId)
                                    if (form.status !== '') params.set('status', form.status)

                                    params.set('page', page.toString())

                                    setSearchParams(params)

                                }}
                            />
                        ) : null
                    }>
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

                                <BaseTableCell isCenter data={
                                    <StatusProductButton size="small" productId={product.id.toString()} value={product.status ? 'Activo' : 'Inactivo'} />
                                } />

                                <BaseTableCell isCenter data={
                                    //* SOLAMENTE SI UN PRODUCTO ESTA ACTIVO, PUEDE SER EDITADO
                                    product.status === true ?
                                        <Button
                                            type='button'
                                            size="small"
                                            text="Editar"
                                            color="blue"
                                            onClick={() => {
                                                setEditModalOpen(true)
                                                setSelectedProduct(product.id.toString())
                                            }}
                                            showTextOnMobile
                                        /> : ''
                                } />
                            </TableRowContainer>

                        }
                        )
                    }
                    {
                        // Solamente debe renderizar la ventana modal cuando haya un producto seleccionado, de lo contrario no funcionara
                        editModalOpen && selectedProduct && <Modal
                            isOpen={editModalOpen}
                            onClose={() => {
                                setEditModalOpen(false)
                                setSelectedProduct(null)
                            }
                            }
                            size='lg'
                            title={`Editar producto #${selectedProduct}`}
                            locked
                        >
                            <LoaderProduct productId={selectedProduct} closeModal={setEditModalOpen} />
                        </Modal>

                    }

                </TableContainer>
            </EntityListLayout.Content>
        </EntityListLayout>
    )
}