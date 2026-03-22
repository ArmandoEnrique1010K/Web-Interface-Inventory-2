import { useQuery } from '@tanstack/react-query'
import { TableContainer } from '@/components/TableContainer'
import { TableRowContainer } from '@/components/TableRowContainer'
import { BaseTableCell } from '@/components/BaseTableCell'
import { ButtonLink } from '@/ui/ButtonLink'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { listAllCompanies } from '../../api/CompanyAPI'
import type { CompanyItem } from '../../types'
import { EntityListLayout } from '@/layout/entity/EntityListLayout'
import { useState } from 'react'
import { Button } from '@/ui/Button'
import { Modal } from '@/components/Modal'
import { LoaderCompany } from '../../components/company/LoaderCompany'

export const ListCompanyPage = () => {
    const [showEditCompanyModal, setShowEditCompanyModal] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState('');


    const { data, isError } = useQuery({
        queryKey: ['companies'],
        queryFn: listAllCompanies
    })

    return (
        <EntityListLayout>
            <EntityListLayout.Header
                title="Empresas importadoras"
                actions={
                    <ButtonLink
                        icon={<PlusCircleIcon />}
                        size="large"
                        text="Nueva empresa"
                        to="/stocklots/companies/new"
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
                        data?.map((company: CompanyItem) => (
                            <TableRowContainer key={company.id}>
                                <BaseTableCell data={company.id} />
                                <BaseTableCell data={company.name} />
                                <BaseTableCell data={
                                    <Button
                                        type='button'
                                        size="small"
                                        text="Editar"
                                        color="blue"
                                        onClick={() => {
                                            setShowEditCompanyModal(true)
                                            setSelectedCompany(company.id.toString())
                                        }}
                                        showTextOnMobile
                                    />
                                } isCenter />
                            </TableRowContainer>
                        ))

                    }
                    {
                        showEditCompanyModal && selectedCompany && <Modal
                            isOpen={showEditCompanyModal}
                            onClose={() => {
                                setShowEditCompanyModal(false)
                                setSelectedCompany('')
                            }}
                            size='lg'
                            title={`Editar empresa importadora #${selectedCompany}`}
                        >
                            <LoaderCompany
                                companyId={selectedCompany}
                                showModal={setShowEditCompanyModal}
                            />
                        </Modal>
                    }

                </TableContainer>
            </EntityListLayout.Content>
        </EntityListLayout>
    )
}
