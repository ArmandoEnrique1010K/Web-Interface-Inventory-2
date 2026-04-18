import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { listAllLocations } from "../../api/LocationAPI";
import { listAllRegions } from "../../api/RegionAPI";
import { listAllSubregionsByRegionId } from "../../api/SubregionAPI";
import { ButtonLink } from "@/ui/ButtonLink";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { FiltersFormContainer } from "@/components/FiltersFormContainer";
import { InputTextFilter } from "@/ui/filters/InputTextFilter";
import { SelectOptionFilter } from "@/ui/filters/SelectOptionFilter";
import { SearchCounter } from "@/components/SearchCounter";
import { TableContainer } from "@/components/TableContainer";
import { TableRowContainer } from "@/components/TableRowContainer";
import { BaseTableCell } from "@/components/BaseTableCell";
import { Paginator } from "@/components/Paginator";
import { StatusLocationButton } from "../../components/location/StatusLocationButton";
import { EntityListLayout } from "@/layout/entity/EntityListLayout";
import { EditLocationButton } from "../../components/location/EditLocationButton";
import { useAuthRole } from "@/hooks/useAuthRole";
import { ROLE_ADMIN } from "@/constants";
import { StatusText } from "@/components/StatusText";

export const ListLocationPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page") ?? 0);
    const name = searchParams.get("name") ?? "";
    const regionId = searchParams.get("regionId") ?? undefined;
    const subregionId = searchParams.get("subregionId") ?? undefined;
    const statusParam = searchParams.get("status");
    const status = statusParam === null ? undefined : statusParam === "true";

    const [form, setForm] = useState({
        page: page,
        name: name,
        regionId: regionId ?? "",
        subregionId: subregionId ?? "",
        status: status === undefined ? "" : String(status),
    });

    // useEffectEvent(() => {
    //     setForm({
    //         page: page,
    //         name: name,
    //         regionId: regionId ?? "",
    //         subregionId: subregionId ?? "",
    //         status: status === undefined ? "" : String(status),
    //     });
    // });

    const { data, isError, isLoading } = useQuery({
        queryKey: ["locations", { name, regionId, subregionId, status, page }],

        queryFn: () =>
            listAllLocations({
                page: page,
                name: name,
                regionId: regionId,
                subregionId: subregionId,
                status: status,
            }),
    });

    const content = data?.content || [];

    const { data: regionsData } = useQuery({
        queryKey: ["regions"],
        queryFn: listAllRegions,
    });
    const { data: subregionsData } = useQuery({
        queryKey: ["subregions", "region", +form.regionId],
        queryFn: () => listAllSubregionsByRegionId(+form.regionId!),
        enabled: !!form.regionId, // solo ejecuta si hay region
    });

    const regions =
        regionsData?.map((region) => ({
            value: region.id.toString(),
            label: region.name,
        })) || [];

    const subregions =
        subregionsData?.map((type) => ({
            value: type.id.toString(),
            label: type.name,
        })) || [];

    const statusOptions = [
        { value: "", label: "Todos los estados" },
        { value: "true", label: "Activos" },
        { value: "false", label: "Inactivos" },
    ];

    const { hasPermission } = useAuthRole();

    const tableHeaders = hasPermission(ROLE_ADMIN)
        ? ["ID", "Nombre", "Ubicación", "Subregión", "Estado", "Editar"]
        : ["ID", "Nombre", "Ubicación", "Subregión", "Estado"];

    return (
        <EntityListLayout>
            <EntityListLayout.Header title="Ubicaciones" />

            {hasPermission(ROLE_ADMIN) && (
                <EntityListLayout.Header
                    actions={
                        <ButtonLink
                            icon={<PlusCircleIcon />}
                            size="large"
                            text="Nueva ubicación"
                            to="/locations/new"
                            color="blue"
                            showIconOnMobile={false}
                            showTextOnMobile
                        />
                    }
                ></EntityListLayout.Header>
            )}
            <EntityListLayout.Content>
                <FiltersFormContainer
                    onSubmit={(e) => {
                        e.preventDefault();

                        const params = new URLSearchParams();

                        if (form.name) params.set("name", form.name);
                        if (form.regionId)
                            params.set("regionId", form.regionId);
                        if (form.subregionId)
                            params.set("subregionId", form.subregionId);
                        if (form.status !== "")
                            params.set("status", form.status);

                        setSearchParams(params);
                    }}
                >
                    <InputTextFilter
                        name="name"
                        label="Nombre de la ubicación:"
                        placeholder="Buscar ubicaciones por nombre"
                        type="text"
                        value={form.name}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                    />

                    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                        <SelectOptionFilter
                            name="regionId"
                            label="Región:"
                            options={regions}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    regionId: e.target.value,
                                    subregionId: "", // reset
                                }))
                            }
                            textInNullOption="Todas las regiones"
                            value={form.regionId}
                        />

                        {/* LUEGO DE SELECCIONAR UNA REGION DEBE LISTAR TODAS LAS SUBREGIONES ASOCIADAS A ESA REGION */}
                        <SelectOptionFilter
                            name="subregionId"
                            label="Subregión:"
                            options={subregions}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    subregionId: e.target.value,
                                }))
                            }
                            textInNullOption="Todas las subregiones asociadas"
                            value={form.subregionId}
                        />
                    </div>
                    <SelectOptionFilter
                        name="status"
                        label="Estado:"
                        options={statusOptions}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                status: e.target.value,
                            }))
                        }
                        value={form.status}
                    />
                </FiltersFormContainer>

                <TableContainer
                    headers={tableHeaders}
                    isError={isError}
                    isEmpty={!content?.length}
                    isLoading={isLoading}
                    itemsCounter={
                        data && (
                            <SearchCounter
                                totalElements={data.totalElements}
                                page={data.page}
                                size={data.size}
                                last={data.last}
                            />
                        )
                    }
                    paginator={
                        content?.length && data ? (
                            <Paginator
                                currentPage={data?.page}
                                totalPages={data?.totalPages}
                                isFirst={data?.first}
                                isLast={data?.last}
                                onPageChange={(page) => {
                                    setForm((prev) => ({
                                        ...prev,
                                        page,
                                    }));
                                    const params = new URLSearchParams();

                                    if (form.name)
                                        params.set("name", form.name);
                                    if (form.regionId)
                                        params.set("regionId", form.regionId);
                                    if (form.subregionId)
                                        params.set(
                                            "subregionId",
                                            form.subregionId,
                                        );
                                    if (form.status !== "")
                                        params.set("status", form.status);

                                    params.set("page", page.toString());

                                    setSearchParams(params);
                                }}
                            />
                        ) : null
                    }
                >
                    {content?.map((location) => {
                        return (
                            <TableRowContainer key={location.id}>
                                <BaseTableCell data={location.id} />
                                <BaseTableCell
                                    data={
                                        <div className="flex flex-col gap-1">
                                            {location.name}
                                        </div>
                                    }
                                />
                                <BaseTableCell data={location.address} />
                                <BaseTableCell data={location.subregionName} />

                                <BaseTableCell
                                    isCenter
                                    data={
                                        hasPermission(ROLE_ADMIN) ? (
                                            <StatusLocationButton
                                                locationId={location.id}
                                                locationStatus={location.status}
                                            />
                                        ) : (
                                            <StatusText
                                                value={location.status}
                                            />
                                        )
                                    }
                                />
                                {hasPermission(ROLE_ADMIN) && (
                                    <BaseTableCell
                                        isCenter
                                        data={
                                            location.status ? (
                                                <EditLocationButton
                                                    locationId={location.id}
                                                />
                                            ) : (
                                                <span className="text-xs">
                                                    ...
                                                </span>
                                            )
                                        }
                                    />
                                )}
                            </TableRowContainer>
                        );
                    })}
                </TableContainer>
            </EntityListLayout.Content>
        </EntityListLayout>
    );
};
