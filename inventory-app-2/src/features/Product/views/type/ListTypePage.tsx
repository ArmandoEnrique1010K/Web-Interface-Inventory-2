import { useQuery } from '@tanstack/react-query'
import type { TypeItem } from '../../types'
import { TableContainer } from '@/components/TableContainer'
import { TableRowContainer } from '@/components/TableRowContainer'
import { BaseTableCell } from '@/components/BaseTableCell'
import { listAllTypes } from '../../api/TypeAPI'
import { ButtonLink } from '@/ui/ButtonLink'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { EntityListLayout } from '@/layout/entity/EntityListLayout'

export const ListTypePage = () => {
    const { data, isError } = useQuery({
        queryKey: ['list-types'],
        queryFn: listAllTypes
    })

    return (
        <EntityListLayout>

            <EntityListLayout.Header title='Tipos'
                actions={
                    <ButtonLink
                        icon={< PlusCircleIcon />}
                        size="large"
                        text="Nuevo tipo"
                        to="/products/types/new"
                        color="blue"
                    />
                }></EntityListLayout.Header>
            <EntityListLayout.Content>
                <TableContainer
                    headers={['ID', 'Nombre', 'Editar']}
                    isError={isError}
                    isEmpty={!data?.length}
                >
                    {
                        data?.map((type: TypeItem) => (
                            <TableRowContainer key={type.id}>
                                <BaseTableCell data={type.id} />
                                <BaseTableCell data={type.name} />
                                <BaseTableCell isCenter data={
                                    <ButtonLink
                                        size="small"
                                        text="Editar"
                                        to={`/products/types/edit/${type.id}`}
                                        color="blue"
                                    />
                                } />

                            </TableRowContainer>
                        ))
                    }
                </TableContainer>
            </EntityListLayout.Content>
        </EntityListLayout>
    )
}
