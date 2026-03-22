import { useQuery } from '@tanstack/react-query'
import { listAllRegions } from '../../api/RegionAPI'
import { ButtonLink } from '@/ui/ButtonLink'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { TableContainer } from '@/components/TableContainer'
import type { RegionItem } from '../../types'
import { TableRowContainer } from '@/components/TableRowContainer'
import { BaseTableCell } from '@/components/BaseTableCell'
import { EntityListLayout } from '@/layout/entity/EntityListLayout'
import { useState } from 'react'
import { Button } from '@/ui/Button'
import { Modal } from '@/components/Modal'
import { LoaderRegion } from '../../components/region/LoaderRegion'

export const ListRegionPage = () => {
    const [showEditRegionModal, setShowEditRegionModal] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState('');

    const { data, isError } = useQuery({
        queryKey: ['regions'],
        queryFn: listAllRegions
    })

    return (
        <EntityListLayout>
            <EntityListLayout.Header title='Regiones'
                actions={
                    <ButtonLink
                        icon={<PlusCircleIcon />}
                        size="large"
                        text="Nueva región"
                        to="/locations/regions/new"
                        color="blue"
                        showIconOnMobile={false}
                        showTextOnMobile
                    />
                }></EntityListLayout.Header>
            <EntityListLayout.Content>

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
                                <BaseTableCell isCenter data={
                                    <Button
                                        type='button'
                                        size="small"
                                        text="Editar"
                                        color="blue"
                                        onClick={() => {
                                            setShowEditRegionModal(true)
                                            setSelectedRegion(region.id.toString())
                                        }}
                                        showTextOnMobile
                                    />

                                } />
                            </TableRowContainer>
                        ))

                    }

                    {
                        showEditRegionModal && selectedRegion && <Modal
                            isOpen={showEditRegionModal}
                            onClose={() => {
                                setShowEditRegionModal(false)
                                setSelectedRegion('')
                            }}
                            size='lg'
                            title={`Editar region #${selectedRegion}`}
                        >
                            <LoaderRegion
                                regionId={selectedRegion}
                                showModal={setShowEditRegionModal}
                            />
                        </Modal>
                    }

                </TableContainer>

            </EntityListLayout.Content>
        </EntityListLayout>

    )
}

