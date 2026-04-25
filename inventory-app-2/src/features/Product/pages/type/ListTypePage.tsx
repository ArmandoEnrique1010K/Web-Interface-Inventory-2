import { useQuery } from "@tanstack/react-query";
import { TableContainer } from "@/components/TableContainer";
import { TableRowContainer } from "@/components/TableRowContainer";
import { BaseTableCell } from "@/components/BaseTableCell";
import { listAllTypes } from "../../api/TypeAPI";
import { ButtonLink } from "@/ui/ButtonLink";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { EntityListLayout } from "@/layout/entity/EntityListLayout";
import { StatusTypeButton } from "../../components/type/StatusTypeButton";
import { EditTypeButton } from "../../components/type/EditTypeButton";
import { useAuthRole } from "@/hooks/useAuthRole";
import { ROLE_ADMIN } from "@/constants";
import { StatusText } from "@/components/StatusText";

export const ListTypePage = () => {
    const { data, isError, isLoading } = useQuery({
        queryFn: listAllTypes,
        retry: 1,
        queryKey: ["types"],
    });

    const { hasPermission } = useAuthRole();

    const tableHeaders = hasPermission(ROLE_ADMIN)
        ? ["ID", "Nombre", "Estado", "Editar"]
        : ["ID", "Nombre", "Estado"];

    return (
        <EntityListLayout>
            <EntityListLayout.Header title="Tipos" />
            {hasPermission(ROLE_ADMIN) && (
                <EntityListLayout.Header
                    actions={
                        <ButtonLink
                            icon={<PlusCircleIcon />}
                            size="large"
                            text="Nuevo tipo"
                            to="/products/types/new"
                            color="blue"
                            showIconOnMobile={false}
                            showTextOnMobile
                        />
                    }
                ></EntityListLayout.Header>
            )}
            <EntityListLayout.Content>
                <TableContainer
                    headers={tableHeaders}
                    isError={isError}
                    isEmpty={!data?.length}
                    isLoading={isLoading}
                >
                    {data?.map((type) => (
                        <TableRowContainer key={type.id}>
                            <BaseTableCell data={type.id} />
                            <BaseTableCell data={type.name} />

                            <BaseTableCell
                                isCenter
                                data={
                                    hasPermission(ROLE_ADMIN) ? (
                                        <StatusTypeButton
                                            typeId={type.id}
                                            status={type.status}
                                        />
                                    ) : (
                                        <StatusText value={type.status} />
                                    )
                                }
                            />

                            {hasPermission(ROLE_ADMIN) && (
                                <BaseTableCell
                                    isCenter
                                    data={
                                        type.status ? (
                                            <EditTypeButton typeId={type.id} />
                                        ) : (
                                            <span className="text-xs">...</span>
                                        )
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
