import { useQuery } from '@tanstack/react-query'
import type { TypeItem } from '../../types'
import { TableContainer } from '@/components/TableContainer'
import { TableRowContainer } from '@/components/TableRowContainer'
import { BaseTableCell } from '@/components/BaseTableCell'
import { listAllTypes } from '../../api/TypeAPI'
import { ButtonLink } from '@/ui/ButtonLink'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { EntityListLayout } from '@/layout/entity/EntityListLayout'
import { useState } from 'react'
import { Button } from '@/ui/Button'
import { Modal } from '@/components/Modal'
import { LoaderType } from '../../components/type/LoaderType'

export const ListTypePage = () => {

    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedType, setSelectedType] = useState('');

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
                        data?.map((type: TypeItem) => (
                            <TableRowContainer key={type.id}>
                                <BaseTableCell data={type.id} />
                                <BaseTableCell data={type.name} />
                                <BaseTableCell isCenter data={
                                    <Button
                                        type='button'
                                        size="small"
                                        text="Editar"
                                        color="blue"
                                        onClick={() => {
                                            setShowEditModal(true)
                                            setSelectedType(type.id.toString())
                                        }}
                                        showTextOnMobile
                                    />
                                } />
                            </TableRowContainer>
                        ))
                    }
                    {
                        // Solamente debe renderizar la ventana modal cuando haya un producto seleccionado, de lo contrario no funcionara
                        showEditModal && selectedType && <Modal
                            isOpen={showEditModal}
                            onClose={() => {
                                setShowEditModal(false)
                                setSelectedType('')
                            }}
                            size='lg'
                            title={`Editar tipo #${selectedType}`}
                        >
                            <LoaderType
                                typeId={selectedType}
                                setModalOpen={setShowEditModal}
                            />
                        </Modal>

                    }


                </TableContainer>
            </EntityListLayout.Content>
        </EntityListLayout>
    )
}
