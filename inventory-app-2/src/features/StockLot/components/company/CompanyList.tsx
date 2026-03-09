import { useQuery } from '@tanstack/react-query'
import { TitleContainer } from '@/components/TitleContainer'
import { TableHeaderContainer } from '@/components/TableHeaderContainer'
import { TableRowContainer } from '@/components/TableRowContainer'
import { BaseTableCell } from '@/components/BaseTableCell'
import { ButtonLink } from '@/ui/ButtonLink'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { listAllCompanies } from '../../api/CompanyAPI'
import type { CompanyItem } from '../../types'

export const CompanyList = () => {
    const { data, isError } = useQuery({
        queryKey: ['list-companies'],
        queryFn: listAllCompanies
    })

    return (
        <TitleContainer
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

            <TableHeaderContainer
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
            </TableHeaderContainer>
        </TitleContainer>
    )
}
