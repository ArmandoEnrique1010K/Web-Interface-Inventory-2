import { useQuery } from '@tanstack/react-query'
import { listAllCategories } from '../../api/CategoryAPI'
import type { CategoryItem } from '../../types'
import { Button } from '@/ui/Button'
import { TitleContainer } from '@/components/TitleContainer'
import { TableHeaderContainer } from '@/components/TableHeaderContainer'
import { TableRowContainer } from '@/components/TableRowContainer'
import { BaseTableCell } from '@/components/BaseTableCell'

export const CategoryList = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['list-categories'],
        queryFn: listAllCategories
    })

    if (isLoading) {
        return <h1>Cargando...</h1>
    }

    return (
        <TitleContainer
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
                isError={isError}
                isEmpty={!data?.length}
            >
                {
                    data?.map((category: CategoryItem) => (
                        <TableRowContainer key={category.id}>
                            <BaseTableCell data={category.id} />
                            <BaseTableCell data={category.name} />
                            <BaseTableCell data={
                                <Button
                                    size="small"
                                    text="Editar"
                                    type="link"
                                    to={`/products/categories/edit/${category.id}`}
                                    color="blue"
                                />
                            } isCenter />
                        </TableRowContainer>
                    ))

                }
            </TableHeaderContainer>
        </TitleContainer>
    )
}
