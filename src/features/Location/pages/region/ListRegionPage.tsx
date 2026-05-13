import { useQuery } from "@tanstack/react-query";
import { listAllRegions } from "../../api/RegionAPI";
import { ButtonLink } from "@/ui/ButtonLink";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { TableContainer } from "@/components/TableContainer";
import { TableRowContainer } from "@/components/TableRowContainer";
import { BaseTableCell } from "@/components/BaseTableCell";
import { EntityListLayout } from "@/layout/entity/EntityListLayout";
import { EditRegionButton } from "../../components/region/EditRegionButton";
import { useAuthRole } from "@/hooks/useAuthRole";
import { ROLE_ADMIN } from "@/constants";

export const ListRegionPage = () => {
    const { data, isError, isLoading } = useQuery({
        queryKey: ["regions"],
        queryFn: listAllRegions,
    });
    const { hasPermission } = useAuthRole();

    const tableHeaders = hasPermission(ROLE_ADMIN)
        ? ["ID", "Nombre", "Editar"]
        : ["ID", "Nombre"];

    return (
        <EntityListLayout>
            <EntityListLayout.Header title="Regiones" />
            {hasPermission(ROLE_ADMIN) && (
                <EntityListLayout.Header
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
                    {data?.map((region) => (
                        <TableRowContainer key={region.id}>
                            <BaseTableCell data={region.id} />
                            <BaseTableCell data={region.name} />
                            {hasPermission(ROLE_ADMIN) && (
                                <BaseTableCell
                                    isCenter
                                    data={
                                        <EditRegionButton
                                            regionId={region.id}
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
