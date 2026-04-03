import { useQuery } from "@tanstack/react-query";
import { TableContainer } from "@/components/TableContainer";
import { TableRowContainer } from "@/components/TableRowContainer";
import { BaseTableCell } from "@/components/BaseTableCell";
import { ButtonLink } from "@/ui/ButtonLink";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { listAllCompanies } from "../../api/CompanyAPI";
import { EntityListLayout } from "@/layout/entity/EntityListLayout";
import { EditCompanyButton } from "../../components/company/EditCompanyButton";

export const ListCompanyPage = () => {
    const { data, isError } = useQuery({
        queryKey: ["companies"],
        queryFn: listAllCompanies,
    });

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
                }
            ></EntityListLayout.Header>
            <EntityListLayout.Content>
                <TableContainer
                    headers={["ID", "Nombre", "Editar"]}
                    isError={isError}
                    isEmpty={!data?.length}
                >
                    {data?.map((company) => (
                        <TableRowContainer key={company.id}>
                            <BaseTableCell data={company.id} />
                            <BaseTableCell data={company.name} />
                            <BaseTableCell
                                isCenter
                                data={
                                    <EditCompanyButton companyId={company.id} />
                                }
                            />
                        </TableRowContainer>
                    ))}
                </TableContainer>
            </EntityListLayout.Content>
        </EntityListLayout>
    );
};
