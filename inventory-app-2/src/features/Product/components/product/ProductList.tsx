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
export const ProductList = () => {

    // TODO: PENDIENTE EL MANEJO DE PAGINACIÓN
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
            page,
            name,
            categoryId: categoryId ?? '',
            typeId: typeId ?? '',
            status: status === undefined ? '' : String(status),
        })
    })


    const { data, isLoading, isError } = useQuery({
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
                    onSubmit={(e) => {
                        e.preventDefault()

                        const params = new URLSearchParams()

                        if (form.name) params.set('name', form.name)
                        if (form.categoryId) params.set('categoryId', form.categoryId)
                        if (form.typeId) params.set('typeId', form.typeId)
                        if (form.status !== '') params.set('status', form.status)

                        if (form.page) params.set('page', form.page.toString())

                        setSearchParams(params)
                    }}
                >
                    {/* <input
                        name="name"
                        type="text"
                        value={form.name}
                        placeholder="Buscar"
                        onChange={(e) =>
                            setForm(prev => ({ ...prev, name: e.target.value }))
                        }
                    /> */}

                    <InputText
                        id='name'
                        name='name'
                        label='Nombre del producto:'
                        hasErrors={false}
                        placeholder='Buscar productos por nombre'
                        type='text'
                        onChange={(e) =>
                            setForm(prev => ({ ...prev, name: e.target.value }))
                        }
                    />

                    <div className='flex flex-row gap-4'>
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
                        />

                    </div>
                    {/* <select
                        name="categoryId"
                        value={form.categoryId}
                        onChange={(e) =>
                            setForm(prev => ({ ...prev, categoryId: e.target.value }))
                        }
                    >
                        <option value="">Seleccione una categoría</option>

                        {categories.map((category: { value: string; label: string }) => (
                            <option key={category.value} value={category.value}>
                                {category.label}
                            </option>
                        ))}
                    </select> */}



                    {/* <select
                        name="typeId"
                        value={form.typeId}
                        onChange={(e) =>
                            setForm(prev => ({ ...prev, typeId: e.target.value }))
                        }
                    >
                        <option value="" >
                            Seleccione un tipo
                        </option>

                        {types?.map((type: { value: string; label: string }) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select> */}


                    {/* <select
                        name="status"
                        value={form.status}
                        onChange={(e) =>
                            setForm(prev => ({ ...prev, status: e.target.value }))
                        }
                    >
                        <option value="">Todos los estados</option>
                        <option value="true">Activos</option>
                        <option value="false">Inactivos</option>
                    </select> */}





                    <Button text="Filtrar" type="submit" color='green' size='large' aditionalStyles='my-4' />
                </form>}
        >

            <TableHeaderContainer
                headers={['ID', 'Nombre', 'Característica', 'Medidas', 'Estado', 'Editar']}
                isError={isError}
                isLoading={isLoading}
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
                            <BaseTableCell data={`${product.length} cm. x ${product.width} cm. x ${product.height} cm.`} />

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
                                    /> : 'No se puede editar'
                            } isCenter />
                        </TableRowContainer>
                    })
                }
            </TableHeaderContainer>

            {
                // TODO: PROBAR LA NAVEGACION ENTRE PÁGINAS
                data && (
                    <Paginator
                        currentPage={data?.page}
                        totalPages={data?.totalPages}
                        totalElements={data?.totalElements}
                        size={data?.size}
                        isFirst={data?.first}
                        isLast={data?.last}
                        onPageChange={(page) => console.log(page)}
                    />
                )
            }
        </TitleContainer>



    )
}

