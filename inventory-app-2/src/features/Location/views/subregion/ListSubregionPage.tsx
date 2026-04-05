import { listAllSubregionsByRegionId } from "../../api/SubregionAPI";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ButtonLink } from "@/ui/ButtonLink";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { TableContainer } from "@/components/TableContainer";
import { TableRowContainer } from "@/components/TableRowContainer";
import { BaseTableCell } from "@/components/BaseTableCell";
import { listAllRegions } from "../../api/RegionAPI";
import { useEffect } from "react";
import { EntityListLayout } from "@/layout/entity/EntityListLayout";
import { FiltersFormContainer } from "@/components/FiltersFormContainer";
import { ButtonsGroupFilter } from "@/ui/filters/ButtonsGroupFilter";
import { EditSubregionButton } from "../../components/subregion/EditSubregionButton";

export const ListSubregionPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const regionIdstr = searchParams.get("regionId") ?? 1;
    const regionId = +regionIdstr;

    // Forzar el queryParam regionId cuando el componente carga si no existe en la URL
    useEffect(() => {
        if (!searchParams.get("regionId")) {
            const params = new URLSearchParams(searchParams);
            params.set("regionId", "1"); // Valor por defecto 1
            setSearchParams(params);
        }
    }, [searchParams, setSearchParams]);

    const { data, isError, isLoading } = useQuery({
        queryKey: ["subregions", "region", regionId],
        queryFn: () => listAllSubregionsByRegionId(regionId),
    });

    const { data: dataRegion, isError: isErrorRegion } = useQuery({
        queryKey: ["regions"],
        queryFn: listAllRegions,
    });

    return (
        <EntityListLayout>
            <EntityListLayout.Header
                title="Subregiones"
                actions={
                    <ButtonLink
                        icon={<PlusCircleIcon />}
                        size="large"
                        text="Nueva subregión"
                        to="/locations/subregions/new"
                        color="blue"
                        showIconOnMobile={false}
                        showTextOnMobile
                    />
                }
            ></EntityListLayout.Header>
            <EntityListLayout.Content>
                <FiltersFormContainer hiddenButton>
                    {!isErrorRegion && dataRegion && (
                        <ButtonsGroupFilter
                            label="Región"
                            group={dataRegion}
                            value={regionId.toString()}
                            onChange={(newRegionId: string) => {
                                const params = new URLSearchParams(
                                    searchParams,
                                );
                                params.set("regionId", newRegionId);
                                setSearchParams(params);
                            }}
                        />
                    )}
                </FiltersFormContainer>
                <TableContainer
                    headers={["ID", "Nombre", "Editar"]}
                    isError={isError}
                    isEmpty={!data?.length}
                    isLoading={isLoading}
                >
                    {data?.map((subregion) => (
                        <TableRowContainer key={subregion.id}>
                            <BaseTableCell data={subregion.id} />
                            <BaseTableCell data={subregion.name} />
                            <BaseTableCell
                                data={
                                    <EditSubregionButton
                                        subregionId={subregion.id}
                                    />
                                }
                                isCenter
                            />
                        </TableRowContainer>
                    ))}
                </TableContainer>
            </EntityListLayout.Content>
        </EntityListLayout>
    );
};
