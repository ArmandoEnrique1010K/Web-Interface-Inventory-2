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

export const ListCategoryPage = () => {
    const { data, isError, isLoading } = useQuery({
        queryFn: listAllCategories,
        retry: 1,
        queryKey: ["categories"],
    });

    const { hasPermission } = useAuthRole();

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
                    headers={
                        hasPermission(ROLE_ADMIN)
                            ? ["ID", "Nombre", "Editar", "Estado"]
                            : ["ID", "Nombre"]
                    }
                    isError={isError}
                    isEmpty={!data?.length}
                    isLoading={isLoading}
                >
                    {data?.map((category) => (
                        <TableRowContainer key={category.id}>
                            <BaseTableCell data={category.id} />
                            <BaseTableCell data={category.name} />
                            {hasPermission(ROLE_ADMIN) && (
                                <>
                                    <BaseTableCell
                                        data={
                                            <EditCategoryButton
                                                categoryId={category.id}
                                            />
                                        }
                                        isCenter
                                    />
                                    <BaseTableCell
                                        isCenter
                                        data={
                                            <StatusCategoryButton
                                                categoryId={category.id}
                                                status={category.status}
                                            />
                                        }
                                    ></BaseTableCell>
                                </>
                            )}
                        </TableRowContainer>
                    ))}
                </TableContainer>
            </EntityListLayout.Content>
        </EntityListLayout>
    );
};
