import { useQuery } from '@tanstack/react-query'
import { listAllCategories } from '../../api/CategoryAPI'
import type { CategoryItem } from '../../types'
import { ListElementsContainer } from '@/views/ListElementsContainer'
import { TableHeaderContainer } from '@/components/TableHeaderContainer'
import { TableRowContainer } from '@/components/TableRowContainer'
import { BaseTableCell } from '@/components/BaseTableCell'
import { ButtonLink } from '@/ui/ButtonLink'
import { PlusCircleIcon } from '@heroicons/react/24/outline'

export const CategoryList = () => {
    const { data, isError } = useQuery({
        queryKey: ['list-categories'],
        queryFn: listAllCategories
    })

    return (
        <ListElementsContainer
            title="Categorias"
            buttonsContainer={
                <ButtonLink
                    icon={<PlusCircleIcon />}
                    size="large"
                    text="Nueva categoria"
                    to="/products/categories/new"
                    color="blue"
                />
            }

            dataContainer={
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
                                    <ButtonLink
                                        size="small"
                                        text="Editar"
                                        to={`/products/categories/edit/${category.id}`}
                                        color="blue"
                                    />
                                } isCenter />
                            </TableRowContainer>
                        ))

                    }
                </TableHeaderContainer>
            }
        />
    )
}
