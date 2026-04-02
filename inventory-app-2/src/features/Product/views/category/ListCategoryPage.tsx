import { useQuery } from '@tanstack/react-query'
import { listAllCategories } from '../../api/CategoryAPI'
import { TableContainer } from '@/components/TableContainer'
import { TableRowContainer } from '@/components/TableRowContainer'
import { BaseTableCell } from '@/components/BaseTableCell'
import { ButtonLink } from '@/ui/ButtonLink'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { EntityListLayout } from '@/layout/entity/EntityListLayout'
import { StatusCategoryButton } from '../../components/category/StatusCategoryButton';
import { EditCategoryButton } from '../../components/category/EditCategoryButton'

export const ListCategoryPage = () => {

    const { data, isError } = useQuery({
        queryFn: listAllCategories,
        retry: 1,
        queryKey: ['categories'],
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
                        showIconOnMobile={false}
                        showTextOnMobile
                    />
                }></EntityListLayout.Header>
            <EntityListLayout.Content>
                <TableContainer
                    headers={['ID', 'Nombre', 'Editar', 'Estado']}
                    isError={isError}
                    isEmpty={!data?.length}
                >
                    {
                        data?.map((category) => (
                            <TableRowContainer key={category.id}>
                                <BaseTableCell data={category.id} />
                                <BaseTableCell data={category.name} />
                                <BaseTableCell data={
                                    <EditCategoryButton categoryId={category.id}/>
                                } isCenter />
                                <BaseTableCell isCenter data={
                                    <StatusCategoryButton
                                        categoryId={category.id}
                                        status={category.status}
                                    />
                                }></BaseTableCell>
                            </TableRowContainer>
                        ))
                    }
                </TableContainer >
            </EntityListLayout.Content>
        </EntityListLayout>
    )
}
