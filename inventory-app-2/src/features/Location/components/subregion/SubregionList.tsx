import { listAllSubregionsByRegionId } from '../../api/SubregionAPI'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { TitleContainer } from '@/components/TitleContainer'
import { ButtonLink } from '@/ui/ButtonLink'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { TableHeaderContainer } from '@/components/TableHeaderContainer'
import type { RegionItem, SubregionItem } from '../../types'
import { TableRowContainer } from '@/components/TableRowContainer'
import { BaseTableCell } from '@/components/BaseTableCell'
import { listAllRegions } from '../../api/RegionAPI'
import { Button } from '@/ui/Button'

export const SubregionList = () => {

    const [searchParams, setSearchParams] = useSearchParams()
    const regionId = searchParams.get('regionId') ?? 1

    const { data, isError } = useQuery({
        queryKey: ['list-subregions-by-region', regionId],
        queryFn: () => listAllSubregionsByRegionId(regionId.toString())
    })

    const { data: dataRegion, isError: isErrorRegion } = useQuery({
        queryKey: ['list-regions'],
        queryFn: listAllRegions
    })


    return (
        <TitleContainer
            title="Subregiones agrupadas por región"
            buttons={
                <ButtonLink
                    icon={<PlusCircleIcon />}
                    size="large"
                    text="Nueva subregión"
                    to="/locations/subregions/add"
                    color="blue"
                />
            }
            searchParams={
                <div className='flex flex-row gap-2 py-4'>
                    {
                        !isErrorRegion && dataRegion?.map((region: RegionItem) => (
                            <Button key={region.id} size='large' text={region.name} type={'button'} color={'blue'} onClick={
                                () => {
                                    const params = new URLSearchParams();
                                    params.set('regionId', region.id.toString())

                                    setSearchParams(params)
                                }
                            }
                                aditionalStyles={searchParams.get('regionId') === region.id.toString() ? 'bg-gray-800' : ''}
                            />
                        ))
                    }
                </div>
            }
        >
            <TableHeaderContainer
                headers={['ID', 'Nombre', 'Editar']}
                isError={isError}
                isEmpty={!data?.length}
            >
                {
                    data?.map((subregion: SubregionItem) => (
                        <TableRowContainer key={subregion.id}>
                            <BaseTableCell data={subregion.id} />
                            <BaseTableCell data={subregion.name} />
                            <BaseTableCell data={
                                <ButtonLink
                                    size="small"
                                    text="Editar"
                                    to={`/locations/subregions/edit/${subregion.id}`}
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
