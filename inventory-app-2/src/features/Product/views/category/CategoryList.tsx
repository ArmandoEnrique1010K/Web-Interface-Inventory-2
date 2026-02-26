import { useQuery } from '@tanstack/react-query'
import { listAllCategories } from '../../api/CategoryAPI'
import type { CategoryItem } from '../../types'
import { Button } from '@/shared/ui/Button'
import { ListDataContainer } from '@/shared/components/ListDataContainer'
import { TableHeaderContainer } from '@/shared/components/TableHeaderContainer'
import { TableRow } from '@/shared/components/TableRow'
import { TableDataCell } from '@/shared/components/TableDataCell'

export const CategoryList = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['list-categories'],
        queryFn: listAllCategories
    })

    if (isLoading) {
        return <h1>Cargando...</h1>
    }

    return (
        <ListDataContainer
            title="Categorias"
            buttons={
                <Button
                    size="large"
                    text="Nueva categoria"
                    type="link"
                    to="/products/categories/new"
                    color="blue"
                />
            }>

            <TableHeaderContainer
                headers={['ID', 'Nombre', 'Editar']}
                children={
                    data?.map((category: CategoryItem) => (
                        <TableRow key={category.id}>
                            <TableDataCell data={category.id} />
                            <TableDataCell data={category.name} />
                            <TableDataCell data={
                                <Button
                                    size="small"
                                    text="Editar"
                                    type="link"
                                    to={`/products/categories/edit/${category.id}`}
                                    color="blue"
                                />
                            } isCenter />
                        </TableRow>
                    ))
                }
            />
        </ListDataContainer>
    )
}
