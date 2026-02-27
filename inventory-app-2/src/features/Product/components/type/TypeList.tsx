import { useQuery } from '@tanstack/react-query'
import type { TypeItem } from '../../types'
import { Button } from '@/ui/Button'
import { TitleContainer } from '@/components/TitleContainer'
import { TableHeaderContainer } from '@/components/TableHeaderContainer'
import { TableRowContainer } from '@/components/TableRowContainer'
import { BaseTableCell } from '@/components/BaseTableCell'
import { listAllTypes } from '../../api/TypeAPI'

export const TypeList = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['list-types'],
        queryFn: listAllTypes
    })

    return (
        <TitleContainer
            title="Tipos"
            buttons={
                <Button
                    size="large"
                    text="Nuevo tipo"
                    type="link"
                    to="/products/types/new"
                    color="blue"
                />
            }>

            <TableHeaderContainer
                headers={['ID', 'Nombre', 'Editar']}
                isError={isError}
                isEmpty={!data?.length}
                isLoading={isLoading}
            >
                {
                    data?.map((type: TypeItem) => (
                        <TableRowContainer key={type.id}>
                            <BaseTableCell data={type.id} />
                            <BaseTableCell data={type.name} />
                            <BaseTableCell data={
                                <Button
                                    size="small"
                                    text="Editar"
                                    type="link"
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
