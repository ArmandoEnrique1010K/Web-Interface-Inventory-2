import { useQuery } from "@tanstack/react-query";
import { listAllCategories } from "../../api/CategoryAPI";
import { TableContainer } from "@/components/TableContainer";
import { TableRowContainer } from "@/components/TableRowContainer";
import { BaseTableCell } from "@/components/BaseTableCell";
import { ButtonLink } from "@/ui/ButtonLink";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { EntityListLayout } from "@/layout/entity/EntityListLayout";
import { StatusCategoryButton } from "../../components/category/StatusCategoryButton";
import { EditCategoryButton } from "../../components/category/EditCategoryButton";
import { ROLE_ADMIN } from "@/constants";
import { useAuthRole } from "@/hooks/useAuthRole";
import { StatusText } from "@/components/StatusText";

export const ListCategoryPage = () => {
    const { data, isError, isLoading } = useQuery({
        queryFn: listAllCategories,
        retry: 1,
        queryKey: ["categories"],
    });

    const { hasPermission } = useAuthRole();

    const tableHeaders = hasPermission(ROLE_ADMIN)
        ? ["ID", "Nombre", "Estado", "Editar"]
        : ["ID", "Nombre", "Estado"];

    return (
        <EntityListLayout>
            <EntityListLayout.Header title="Categorias" />
            {hasPermission(ROLE_ADMIN) && (
                <EntityListLayout.Header
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
                    {data?.map((category) => (
                        <TableRowContainer key={category.id}>
                            <BaseTableCell data={category.id} />
                            <BaseTableCell data={category.name} />

                            {/* Estado */}
                            <BaseTableCell
                                isCenter
                                data={
                                    hasPermission(ROLE_ADMIN) ? (
                                        <StatusCategoryButton
                                            categoryId={category.id}
                                            status={category.status}
                                        />
                                    ) : (
                                        <StatusText value={category.status} />
                                    )
                                }
                            />

                            {hasPermission(ROLE_ADMIN) && (
                                <BaseTableCell
                                    isCenter
                                    data={
                                        category.status ? (
                                            <EditCategoryButton
                                                categoryId={category.id}
                                            />
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
