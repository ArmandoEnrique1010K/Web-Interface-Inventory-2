import { useQuery } from '@tanstack/react-query'
import { listAllCategories } from '../../api/CategoryAPI'
import type { CategoryItem } from '../../types'
import { TableContainer } from '@/components/TableContainer'
import { TableRowContainer } from '@/components/TableRowContainer'
import { BaseTableCell } from '@/components/BaseTableCell'
import { ButtonLink } from '@/ui/ButtonLink'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { EntityListLayout } from '@/layout/entity/EntityListLayout'

export const ListCategoryPage = () => {
    const { data, isError } = useQuery({
        queryKey: ['list-categories'],
        queryFn: listAllCategories
    })

    return (
        <EntityListLayout>
            <EntityListLayout.Header title='Categorias'
                actions={
                    <ButtonLink
                        icon={<PlusCircleIcon />}
                        size="large"
                        text="Nueva categoria"
                        to="/products/categories/new"
                        color="blue"
                    />
                }></EntityListLayout.Header>
            <EntityListLayout.Content>
                <TableContainer
                    headers={['ID', 'Nombre', 'Editar']}
                    isError={isError}
                    isEmpty={!data?.length
                    }
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
                </TableContainer >
            </EntityListLayout.Content>
        </EntityListLayout>
    )
}
