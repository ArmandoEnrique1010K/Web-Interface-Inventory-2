import { useQuery } from '@tanstack/react-query'
import { listAllRegions } from '../../api/RegionAPI'
import { ListElementsContainer } from '@/views/ListElementsContainer'
import { ButtonLink } from '@/ui/ButtonLink'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { TableContainer } from '@/components/TableContainer'
import type { RegionItem } from '../../types'
import { TableRowContainer } from '@/components/TableRowContainer'
import { BaseTableCell } from '@/components/BaseTableCell'

export const RegionList = () => {
    const { data, isError } = useQuery({
        queryKey: ['list-regions'],
        queryFn: listAllRegions
    })

    return (
        <ListElementsContainer
            title="Regiones"
            buttons={
                <ButtonLink
                    icon={<PlusCircleIcon />}
                    size="large"
                    text="Nueva región"
                    to="/locations/regions/new"
                    color="blue"
                />
            }>

            <TableContainer
                headers={['ID', 'Nombre', 'Editar']}
                isError={isError}
                isEmpty={!data?.length}
            >
                {
                    data?.map((region: RegionItem) => (
                        <TableRowContainer key={region.id}>
                            <BaseTableCell data={region.id} />
                            <BaseTableCell data={region.name} />
                            <BaseTableCell data={
                                <ButtonLink
                                    size="small"
                                    text="Editar"
                                    to={`/locations/regions/edit/${region.id}`}
                                    color="blue"
                                />
                            } isCenter />
                        </TableRowContainer>
                    ))

                }
            </TableContainer>
        </ListElementsContainer>
    )
}

