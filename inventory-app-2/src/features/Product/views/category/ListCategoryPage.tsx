import { useQuery } from '@tanstack/react-query'
import { listAllCategories } from '../../api/CategoryAPI'
import { type CategoryItem } from '../../types'
import { TableContainer } from '@/components/TableContainer'
import { TableRowContainer } from '@/components/TableRowContainer'
import { BaseTableCell } from '@/components/BaseTableCell'
import { ButtonLink } from '@/ui/ButtonLink'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { EntityListLayout } from '@/layout/entity/EntityListLayout'
import { useState } from 'react'
import { Button } from '@/ui/Button'
import { Modal } from '@/components/Modal'
import { LoaderCategory } from '../../components/category/LoaderCategory'

export const ListCategoryPage = () => {

    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');

    const { data, isError } = useQuery<CategoryItem[]>({  // Cambiar a CategoryItem[]
        queryKey: ['categories'],
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
                        showIconOnMobile={false}
                        showTextOnMobile
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
                                    <Button
                                        type='button'
                                        size="small"
                                        text="Editar"
                                        color="blue"
                                        onClick={() => {
                                            setShowEditModal(true)
                                            setSelectedCategory(category.id.toString())
                                        }}
                                        showTextOnMobile
                                    />
                                } isCenter />
                            </TableRowContainer>
                        ))

                    }
                    {
                        // Solamente debe renderizar la ventana modal cuando haya un producto seleccionado, de lo contrario no funcionara
                        showEditModal && selectedCategory && <Modal
                            isOpen={showEditModal}
                            onClose={() => {
                                setShowEditModal(false)
                                setSelectedCategory('')
                            }}
                            size='lg'
                            title={`Editar categoria #${selectedCategory}`}
                            locked
                        >
                            <LoaderCategory
                                categoryId={selectedCategory}
                                setModalOpen={setShowEditModal}
                            />
                        </Modal>

                    }

                </TableContainer >
            </EntityListLayout.Content>
        </EntityListLayout>
    )
}
