import { useQuery } from "@tanstack/react-query";
import { TableContainer } from "@/components/TableContainer";
import { TableRowContainer } from "@/components/TableRowContainer";
import { BaseTableCell } from "@/components/BaseTableCell";
import { ButtonLink } from "@/ui/ButtonLink";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { listAllCompanies } from "../../api/CompanyAPI";
import { EntityListLayout } from "@/layout/entity/EntityListLayout";
import { EditCompanyButton } from "../../components/company/EditCompanyButton";
import { useAuthRole } from "@/hooks/useAuthRole";
import { ROLE_ADMIN } from "@/constants";

export const ListCompanyPage = () => {
    const { data, isError, isLoading } = useQuery({
        queryKey: ["companies"],
        queryFn: listAllCompanies,
    });

    const { hasPermission } = useAuthRole();

    const tableHeaders = hasPermission(ROLE_ADMIN)
        ? ["ID", "Nombre", "Editar"]
        : ["ID", "Nombre"];

    return (
        <EntityListLayout>
            <EntityListLayout.Header title="Empresas importadoras" />
            {hasPermission(ROLE_ADMIN) && (
                <EntityListLayout.Header
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
                    }
                />
            )}

            <EntityListLayout.Content>
                <TableContainer
                    headers={tableHeaders}
                    isError={isError}
                    isEmpty={!data?.length}
                    isLoading={isLoading}
                >
                    {data?.map((company) => (
                        <TableRowContainer key={company.id}>
                            <BaseTableCell data={company.id} />
                            <BaseTableCell data={company.name} />
                            {hasPermission(ROLE_ADMIN) && (
                                <BaseTableCell
                                    isCenter
                                    data={
                                        <EditCompanyButton
                                            companyId={company.id}
                                        />
                                    }
                                />
                            )}
                        </TableRowContainer>
                    ))}
                </TableContainer>
            </EntityListLayout.Content>
        </EntityListLayout>
    );
};
