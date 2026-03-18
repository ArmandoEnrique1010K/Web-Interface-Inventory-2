import { useQuery } from '@tanstack/react-query'
import type { TypeItem } from '../../types'
import { ListElementsContainer } from '@/views/ListElementsContainer'
import { TableContainer } from '@/components/TableContainer'
import { TableRowContainer } from '@/components/TableRowContainer'
import { BaseTableCell } from '@/components/BaseTableCell'
import { listAllTypes } from '../../api/TypeAPI'
import { ButtonLink } from '@/ui/ButtonLink'
import { PlusCircleIcon } from '@heroicons/react/24/outline'

export const TypeList = () => {
    const { data, isError } = useQuery({
        queryKey: ['list-types'],
        queryFn: listAllTypes
    })

    return (
        <ListElementsContainer
            title="Tipos"
            buttonsContainer={
                <ButtonLink
                    icon={<PlusCircleIcon />}
                    size="large"
                    text="Nuevo tipo"
                    to="/products/types/new"
                    color="blue"
                />
            }
            dataContainer={
                <TableContainer
                    headers={['ID', 'Nombre', 'Editar']}
                    isError={isError}
                    isEmpty={!data?.length}
                    tableRows={
                        data?.map((type: TypeItem) => (
                            <TableRowContainer key={type.id}>
                                <BaseTableCell data={type.id} />
                                <BaseTableCell data={type.name} />
                                <BaseTableCell data={
                                    <ButtonLink
                                        size="small"
                                        text="Editar"
                                        to={`/products/types/edit/${type.id}`}
                                        color="blue"
                                    />
                                } isCenter />
                            </TableRowContainer>
                        ))

                    }
                />
            }
        />
    )
}
