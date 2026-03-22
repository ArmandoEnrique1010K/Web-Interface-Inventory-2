import { useQuery } from '@tanstack/react-query'
import { ListElementsContainer } from '@/views/ListElementsContainer'
import { TableContainer } from '@/components/TableContainer'
import { TableRowContainer } from '@/components/TableRowContainer'
import { BaseTableCell } from '@/components/BaseTableCell'
import { ButtonLink } from '@/ui/ButtonLink'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { listAllCompanies } from '../../api/CompanyAPI'
import type { CompanyItem } from '../../types'

export const CompanyList = () => {
    const { data, isError } = useQuery({
        queryKey: ['companies'],
        queryFn: listAllCompanies
    })

    return (
        <ListElementsContainer
            title="Empresas importadoras"
            buttons={
                <ButtonLink
                    icon={<PlusCircleIcon />}
                    size="large"
                    text="Nueva empresa"
                    to="/stocklots/companies/new"
                    color="blue"
                />
            }>

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
                                <ButtonLink
                                    size="small"
                                    text="Editar"
                                    to={`/stocklots/companies/edit/${company.id}`}
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
