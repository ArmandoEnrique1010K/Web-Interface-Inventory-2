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

export const ListTypePage = () => {
    const { data, isError } = useQuery({
        queryFn: listAllTypes,
        retry: 1,
        queryKey: ["types"],
    });

    return (
        <EntityListLayout>
            <EntityListLayout.Header
                title="Tipos"
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
            <EntityListLayout.Content>
                <TableContainer
                    headers={["ID", "Nombre", "Editar", "Estado"]}
                    isError={isError}
                    isEmpty={!data?.length}
                >
                    {data?.map((type) => (
                        <TableRowContainer key={type.id}>
                            <BaseTableCell data={type.id} />
                            <BaseTableCell data={type.name} />
                            <BaseTableCell
                                isCenter
                                data={<EditTypeButton typeId={type.id} />}
                            />
                            <BaseTableCell
                                isCenter
                                data={
                                    <StatusTypeButton
                                        typeId={type.id}
                                        status={type.status}
                                    />
                                }
                            ></BaseTableCell>
                        </TableRowContainer>
                    ))}
                </TableContainer>
            </EntityListLayout.Content>
        </EntityListLayout>
    );
};
