import { TitleContainer } from '@/components/TitleContainer'
import { Button } from '@/ui/Button'
import { useQuery } from '@tanstack/react-query'
import { listAllProducts } from '../../api/ProductAPI'
import { TableHeaderContainer } from '@/components/TableHeaderContainer'
import type { CategoryItem, ProductItem, TypeItem } from '../../types'
import { TableRowContainer } from '@/components/TableRowContainer'
import { BaseTableCell } from '@/components/BaseTableCell'
import { useState } from 'react'
import { listAllCategories } from '../../api/CategoryAPI'
import { listAllTypes } from '../../api/TypeAPI'
import { ProductChangeStatus } from './ProductChangeStatus'

export const ProductList = () => {
    const [inputValue, setInputValue] = useState('')
    const [categoryId, setCategoryId] = useState<string | undefined>()
    const [typeId, setTypeId] = useState<string | undefined>()
    const [status, setStatus] = useState<boolean | undefined>()

    // TODO: PENDIENTE EL MANEJO DE PAGINACIÓN
    const [page] = useState(0)

    const [searchValue, setSearchValue] = useState<{
        name: string;
        categoryId: string | undefined;
        typeId: string | undefined;
        status: boolean | undefined;
        page: number;
    }>({
        name: '',
        categoryId: undefined,
        typeId: undefined,
        status: undefined,
        page: 0,
    })


    const { data, isLoading, isError } = useQuery({
        queryKey: ['list-products', searchValue],

        // TODO: INVESTIGAR SOBRE LOS QUERYPARAMS
        queryFn: () => listAllProducts({
            page: page,
            name: searchValue.name,
            categoryId: searchValue.categoryId,
            typeId: searchValue.typeId,
            status: searchValue.status
        }),

        // TODO: DESHABILITA EL FUNCIONAMIENTO SI NO HAY PARAMETROS
        // enabled: !!searchValue

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
        // TODO: CORREGIR EL TIPADO
        if (product.categoryId == '1') {
            return `${product.typeName}`
        }

        if (product.categoryId != '1') {
            return `${product.typeName} de ${product.categoryName}`
        }

    }

    console.log(status)

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
            // TODO: CORREGIR LOS PARAMETROS
            searchParams={
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        setSearchValue({
                            name: inputValue,
                            categoryId: categoryId || undefined,
                            typeId: typeId || undefined,
                            status: status,
                            page: page
                        })
                    }}
                >
                    <input
                        name="name"
                        type="text"
                        value={inputValue}
                        placeholder="Buscar"
                        onChange={(e) => setInputValue(e.target.value)}
                    />


                    <select
                        name="categoryId"
                        value={categoryId || ''}
                        onChange={(e) => setCategoryId(e.target.value || undefined)}
                    >
                        <option value="">Seleccione una categoría</option>

                        {categories.map((category: { value: string; label: string }) => (
                            <option key={category.value} value={category.value}>
                                {category.label}
                            </option>
                        ))}
                    </select>

                    <select
                        name="typeId"
                        value={typeId || ''}
                        onChange={(e) => setTypeId(e.target.value || undefined)}
                    >
                        <option value="" >
                            Seleccione un tipo
                        </option>

                        {types?.map((type: { value: string; label: string }) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>

                    Activos

                    <select
                        name="status"
                        value={status === undefined ? "" : status ? "true" : "false"}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                                setStatus(undefined); // Sin filtro de estado
                            } else if (value === "true") {
                                setStatus(true); // true o false
                            } else if (value === "false") {
                                setStatus(false); // true o false
                            }
                        }}
                    >
                        <option value="">Todos los estados</option>
                        <option value="true">Activos</option>
                        <option value="false">Inactivos</option>
                    </select>





                    <button type="submit">Filtrar</button>
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
                                <Button
                                    size="small"
                                    text="Editar"
                                    type="link"
                                    to={`/products/edit/${product.id}`}
                                    color="blue"
                                />
                            } isCenter />
                        </TableRowContainer>
                    })
                }
            </TableHeaderContainer>
            <div>
                {/* TODO: QUEDA PENDIENTE EL PAGINADOR */}
                Pagina actual: {JSON.stringify(data?.page)}
            </div>

            <div>
                Total de paginas: {JSON.stringify(data?.totalPages)}
            </div>

            <div>
                Total de registros: {JSON.stringify(data?.totalElements)}
            </div>


        </TitleContainer>



    )
}

