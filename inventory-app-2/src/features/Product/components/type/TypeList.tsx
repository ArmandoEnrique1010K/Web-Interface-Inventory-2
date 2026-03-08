import { useQuery } from '@tanstack/react-query'
import type { TypeItem } from '../../types'
import { TitleContainer } from '@/components/TitleContainer'
import { TableHeaderContainer } from '@/components/TableHeaderContainer'
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
        <TitleContainer
            title="Tipos"
            buttons={
                <ButtonLink
                    icon={<PlusCircleIcon />}
                    size="large"
                    text="Nuevo tipo"
                    to="/products/types/new"
                    color="blue"
                />
            }>

            <TableHeaderContainer
                headers={['ID', 'Nombre', 'Editar']}
                isError={isError}
                isEmpty={!data?.length}
            >
                {
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
            </TableHeaderContainer>
        </TitleContainer>
    )
}
