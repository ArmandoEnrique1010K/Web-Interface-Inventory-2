import { EntityListLayout } from "@/layout/entity/EntityListLayout";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { listAllDeliveryLinesByDeliveryOrder } from "../../api/DeliveryLineAPI";
import { FiltersFormContainer } from "@/components/FiltersFormContainer";
import { TableContainer } from "@/components/TableContainer";
import { Paginator } from "@/components/Paginator";
import { SearchCounter } from "@/components/SearchCounter";
import { TableRowContainer } from "@/components/TableRowContainer";
import { BaseTableCell } from "@/components/BaseTableCell";
import { InputTextFilter } from "@/ui/filters/InputTextFilter";
import { InputDateTimeFilter } from "@/ui/filters/InputDateTimeFilter";
import { SelectOptionFilter } from "@/ui/filters/SelectOptionFilter";
import { listAllRegionsByDeliveryOrder } from "@/features/Location/api/RegionAPI";
import { listAllSubregionsByDeliveryOrderAndRegion } from "@/features/Location/api/SubregionAPI";
import { listAllModelsByDeliveryOrder } from "../../api/ModelDeliveryOrderAPI";
import type { DeliveryOrderItem } from "../../schemas/items";
import { deliveryLineStatusOptions } from "../../data/deliveryLineStatusOptions";
import { AddDeliveryLineButton } from "../../components/deliveryLine/AddDeliveryLineButton";
import { handleFormatDateTimeWithoutT } from "@/utils/handleFormatDateTime";
import { DeliveryLineStatus } from "../../components/deliveryLine/DeliveryLineStatus";
import { AllocateDeliveryLineButton } from "../../components/deliveryLine/AllocateDeliveryLineButton";
import { LinkText } from "@/components/LinkText";
import { SendDeliveryLineButton } from "../../components/deliveryLine/SendDeliveryLineButton";
import { ROLE_ADMIN, ROLE_OPERATOR } from "@/constants";
import { useAuthRole } from "@/hooks/useAuthRole";

type Props = {
    deliveryOrderStatus: DeliveryOrderItem["orderStatus"];
};

export const ListDeliveryLineByDeliveryOrder = ({
    deliveryOrderStatus,
}: Props) => {
    const { pathname } = useLocation();

    const { hasPermission } = useAuthRole();

    const from = pathname.includes("pending")
        ? "pending"
        : pathname.includes("my-orders")
          ? "my-orders"
          : null;

    // KEY para almacenar los valores rellenados en los filtros
    const STORAGE_KEY = "deliveryLineFilters";
    const SELECTED_DELIVERY_ORDER_KEY = "currentDeliveryOrderId";

    const { id: deliveryOrderIdstr } = useParams();
    const deliveryOrderId = +deliveryOrderIdstr!;

    const saved = sessionStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : null;

    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams?.get("page") ?? 0);
    const getEmptyForm = () => ({
        page: 0,
        minRequiredQuantity: "",
        maxRequiredQuantity: "",
        minLimitDate: "",
        maxLimitDate: "",
        lineStatus: "",
        location: "",
        subregionId: "",
        regionId: "",
        modelId: "",
        direction: "",
        sortBy: "",
    });

    const [form, setForm] = useState(() => {
        // Se utiliza una función para establecer los valores iniciales
        if (
            deliveryOrderId.toString() !==
            sessionStorage.getItem(SELECTED_DELIVERY_ORDER_KEY)
        ) {
            return getEmptyForm();
        }
        const directionParam = searchParams.get("direction");
        const sortByParam = searchParams.get("sortBy");

        return {
            // page: Number(searchParams.get('page') ?? parsed?.page ?? 0),
            page: page,
            minRequiredQuantity:
                searchParams.get("minRequiredQuantity") ??
                parsed?.minRequiredQuantity ??
                "",
            maxRequiredQuantity:
                searchParams.get("maxRequiredQuantity") ??
                parsed?.maxRequiredQuantity ??
                "",
            minLimitDate:
                searchParams.get("minLimitDate") ?? parsed?.minLimitDate ?? "",
            maxLimitDate:
                searchParams.get("maxLimitDate") ?? parsed?.maxLimitDate ?? "",
            lineStatus:
                searchParams.get("lineStatus") ?? parsed?.lineStatus ?? "",
            location: searchParams.get("location") ?? parsed?.location ?? "",
            subregionId:
                searchParams.get("subregionId") ?? parsed?.subregionId ?? "",
            regionId: searchParams.get("regionId") ?? parsed?.regionId ?? "",
            modelId: searchParams.get("modelId") ?? parsed?.modelId ?? "",
            direction:
                directionParam === "asc" || directionParam === "desc"
                    ? directionParam
                    : "",
            sortBy:
                sortByParam === "id" ||
                sortByParam === "requiredQuantity" ||
                sortByParam === "pendingQuantity" ||
                sortByParam === "limitDate" ||
                sortByParam === "lineStatus" ||
                sortByParam === "locationName" ||
                sortByParam === "modelName" ||
                sortByParam === "productName"
                    ? sortByParam
                    : "",
        };
    });

    useEffect(() => {
        const currentId = sessionStorage.getItem(SELECTED_DELIVERY_ORDER_KEY);

        if (currentId?.toString() !== deliveryOrderId.toString()) {
            sessionStorage.removeItem(STORAGE_KEY);
            sessionStorage.setItem(
                SELECTED_DELIVERY_ORDER_KEY,
                deliveryOrderId.toString(),
            );

            // Limpiar los queryParams si ha cambiado de orden de entrega
            setSearchParams(new URLSearchParams(), { replace: true });
        }
    }, [deliveryOrderId]);

    const { data, isError, isLoading } = useQuery({
        queryKey: [
            "deliveryLines",
            "deliveryOrder",
            deliveryOrderId!,
            // {
            //     page, minRequiredQuantity, maxRequiredQuantity, minLimitDate, maxLimitDate, lineStatus,
            //     location, regionId, subregionId, modelId
            // }
            searchParams.toString(),
        ],
        queryFn: () =>
            listAllDeliveryLinesByDeliveryOrder(
                deliveryOrderId!,
                // {
                //     page: page,
                //     minRequiredQuantity: form.minRequiredQuantity,
                //     maxRequiredQuantity: form.maxRequiredQuantity,
                //     minLimitDate: form.minLimitDate,
                //     maxLimitDate: form.maxLimitDate,
                //     lineStatus: form.lineStatus as LineStatusEnum,
                //     location: form.location,
                //     subregionId: form.subregionId,
                //     regionId: form.regionId,
                //     modelId: form.modelId
                // }
                Object.fromEntries(searchParams),
            ),
    });

    useEffect(() => {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        const parsed = saved ? JSON.parse(saved) : null;

        const params = new URLSearchParams(searchParams.toString());

        // ✅ eliminar correctamente
        params.delete("currentModelId");

        // ⚠️ evaluar sobre params, no searchParams
        if (!params.toString() && parsed) {
            Object.entries(parsed).forEach(([key, value]) => {
                if (value !== "" && value !== null && value !== undefined) {
                    params.set(key, String(value));
                }
            });
        }

        if (params.toString() !== searchParams.toString()) {
            setSearchParams(params);
        }
    }, []);

    const content = data?.content || [];

    // OBTENER SUBREGIONES, REGIONES
    const { data: regionsData } = useQuery({
        queryKey: ["regions", "deliveryOrder", deliveryOrderId],
        // queryFn: listAllRegions,
        queryFn: () => listAllRegionsByDeliveryOrder(deliveryOrderId),
    });

    const regions =
        regionsData?.map((region) => ({
            value: region.id.toString(),
            label: region.name,
        })) || [];

    const { data: subregionData } = useQuery({
        queryKey: [
            "subregions",
            "deliveryOrder",
            deliveryOrderId,
            "region",
            form.regionId,
        ],
        queryFn: () =>
            listAllSubregionsByDeliveryOrderAndRegion(
                deliveryOrderId,
                form.regionId,
            ), // Debe listar las subregiones por una region seleccionada
        enabled: !!form.regionId, // solo ejecuta si hay region
    });

    const subregions =
        subregionData?.map((subregion) => ({
            value: subregion.id.toString(),
            label: subregion.name,
        })) || [];

    const { data: modelsByDeliveryOrderData } = useQuery({
        queryKey: ["models", "deliveryOrder", deliveryOrderId],
        queryFn: () => listAllModelsByDeliveryOrder(deliveryOrderId!),
    });

    const modelsInDeliveryOrder =
        modelsByDeliveryOrderData?.map((model) => ({
            value: model.modelId.toString(), // OBS: DEBE SER EL ID DEL MODELO NO EL ID DE LA RELACION
            label: `${model.productName + " " + model.modelName}`,
        })) || [];

    const statusOptions = useMemo(() => deliveryLineStatusOptions, []);

    useEffect(() => {
        if (!searchParams.toString() && parsed) {
            const params = new URLSearchParams();

            Object.entries(parsed).forEach(([key, value]) => {
                if (value) {
                    params.set(key, String(value));
                }
            });

            setSearchParams(params);
        }
    }, []);

    const buildParams = (form: {
        page: number;
        minRequiredQuantity: string;
        maxRequiredQuantity: string;
        minLimitDate: string;
        maxLimitDate: string;
        lineStatus: string;
        location: string;
        subregionId: string;
        regionId: string;
        modelId: string;
        direction: string;
        sortBy: string;
    }) => {
        const params = new URLSearchParams();

        Object.entries(form).forEach(([key, value]) => {
            if (key === "page") return; // 🔥 clave

            if (value !== "" && value !== null && value !== undefined) {
                params.set(key, String(value));
            }
        });

        return params;
    };
    const getRoutePath = (deliveryLineId: number) => {
        if (from === "pending") {
            return `/orders/pending/${deliveryOrderId}/line/${deliveryLineId}`;
        }

        if (from === "my-orders") {
            return `/orders/my-orders/${deliveryOrderId}/line/${deliveryLineId}`;
        }
        return `/orders/${deliveryOrderId}/line/${deliveryLineId}`;
    };

    // Evalua si el usuario tiene el rol de admin para definir las cabeceras de la tabla
    // Como minimo debe tener el rol de OPERADOR para mostrar "Operaciones"
    const tableHeaders = hasPermission(ROLE_OPERATOR)
        ? [
              "ID",
              "Ubicación",
              "Nombre",
              "Cantidad",
              "Fecha limite",
              "Estado",
              "Operaciones",
          ]
        : ["ID", "Ubicación", "Nombre", "Cantidad", "Fecha limite", "Estado"];

    return (
        <>
            <EntityListLayout isCompact>
                {!pathname.includes("my-orders") &&
                    !pathname.includes("pending") &&
                    hasPermission(ROLE_ADMIN) && (
                        <EntityListLayout.Header
                            actions={
                                (from !== "pending" &&
                                    from !== "my-orders" &&
                                    [
                                        "ORDER_CANCELED",
                                        "ORDER_DELIVERED",
                                    ].includes(deliveryOrderStatus)) || (
                                    <AddDeliveryLineButton
                                        deliveryOrderId={deliveryOrderId}
                                    />
                                )
                            }
                        />
                    )}

                <EntityListLayout.Content>
                    <FiltersFormContainer
                        onSubmit={(e) => {
                            e.preventDefault();
                            const params = buildParams(form);

                            if (form.minRequiredQuantity) {
                                params.set(
                                    "minRequiredQuantity",
                                    form.minRequiredQuantity,
                                );
                            }

                            if (form.maxRequiredQuantity) {
                                params.set(
                                    "maxRequiredQuantity",
                                    form.maxRequiredQuantity,
                                );
                            }
                            if (form.minLimitDate) {
                                params.set("minLimitDate", form.minLimitDate);
                            }
                            if (form.maxLimitDate) {
                                params.set("maxLimitDate", form.maxLimitDate);
                            }
                            if (form.lineStatus) {
                                params.set("lineStatus", form.lineStatus);
                            }
                            if (form.location) {
                                params.set("location", form.location);
                            }
                            // if (form.regionId) {
                            //     params.set('regionId', form.regionId)

                            //     if (form.subregionId) {
                            //         params.set('subregionId', form.subregionId)
                            //     }

                            // }

                            // REGION + SUBREGION (aquí está la clave)
                            if (form.regionId) {
                                params.set("regionId", form.regionId);

                                // validar subregion contra las subregiones cargadas
                                const isValidSubregion = subregionData?.some(
                                    (sub) =>
                                        String(sub.id) ===
                                        String(form.subregionId),
                                );

                                if (form.subregionId && isValidSubregion) {
                                    params.set("subregionId", form.subregionId);
                                }
                                // si no es válida → simplemente no se agrega
                            }

                            if (form.modelId) {
                                params.set("modelId", form.modelId);
                            }
                            if (form.sortBy) params.set("sortBy", form.sortBy);
                            if (form.direction)
                                params.set("direction", form.direction);

                            // params.set('page', page.toString()); // resetear página al buscar

                            // setSearchParams(Object.fromEntries(params))
                            setSearchParams(params);

                            // estado
                            const newForm = {
                                ...form,
                            };
                            setForm(newForm);

                            // persistencia REAL (solo aquí)
                            sessionStorage.setItem(
                                STORAGE_KEY,
                                JSON.stringify({
                                    lineStatus: form.lineStatus,
                                    location: form.location,
                                    maxLimitDate: form.maxLimitDate,
                                    maxRequiredQuantity:
                                        form.maxRequiredQuantity,
                                    minLimitDate: form.minLimitDate,
                                    minRequiredQuantity:
                                        form.minRequiredQuantity,
                                    modelId: form.modelId,
                                    regionId: form.regionId,
                                    subregionId: form.subregionId,
                                }),
                            );
                        }}
                    >
                        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                            <InputTextFilter
                                name="minRequiredQuantity"
                                label="Cantidad minima"
                                placeholder="Ej: 999"
                                type="number"
                                value={form.minRequiredQuantity}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        minRequiredQuantity: e.target.value,
                                    }))
                                }
                            />
                            <InputTextFilter
                                name="maxRequiredQuantity"
                                label="Cantidad maxima"
                                placeholder="Ej: 999999"
                                type="number"
                                value={form.maxRequiredQuantity}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        maxRequiredQuantity: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                            <InputDateTimeFilter
                                name={"minLimitDate"}
                                label={"Fecha limite minima"}
                                value={form.minLimitDate}
                                onChange={(value) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        minLimitDate: value,
                                    }))
                                }
                            />
                            <InputDateTimeFilter
                                name={"maxLimitDate"}
                                label={"Fecha limite maxima"}
                                value={form.maxLimitDate}
                                onChange={(value) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        maxLimitDate: value,
                                    }))
                                }
                            />
                        </div>
                        <InputTextFilter
                            name="location"
                            label="Ubicación"
                            placeholder="Ej: Lima"
                            type="text"
                            value={form.location}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    location: e.target.value,
                                }))
                            }
                        />

                        {/* CADA VEZ QUE CAMBIE DE REGIONID, SUBREGIONID DEBE SER REINICIADO, ESTABLECER EL VALOR NULL */}
                        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                            <SelectOptionFilter
                                name="regionId"
                                label="Región"
                                options={regions}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        regionId: e.target.value,
                                        subregionId: "",
                                    }))
                                }
                                textInNullOption="Todas las regiones"
                                value={form.regionId}
                            />

                            {/* SI NO HA SELECCIONADO UNA REGION, ESTE CAMPO SE DEBE LIMPIAR QUE NO HAYA NINGUNA SUBREGION SELECCIONADA */}
                            <SelectOptionFilter
                                name="subregionId"
                                label="Subregión"
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
                            name="modelId"
                            label="Modelo de la orden de entrega"
                            options={modelsInDeliveryOrder}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    modelId: e.target.value,
                                }))
                            }
                            textInNullOption="Todos los modelos"
                            value={form.modelId}
                        />

                        <SelectOptionFilter
                            name="status"
                            label="Estado"
                            options={statusOptions}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    lineStatus: e.target.value,
                                }))
                            }
                            textInNullOption="Todos los estados"
                            value={form.lineStatus}
                        />

                        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                            <SelectOptionFilter
                                name="sortBy"
                                label="Ordenar por"
                                value={form.sortBy}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        sortBy: e.target.value,
                                    }))
                                }
                                options={[
                                    { value: "id", label: "ID" },
                                    {
                                        value: "requiredQuantity",
                                        label: "Cantidad requerida",
                                    },
                                    {
                                        value: "pendingQuantity",
                                        label: "Cantidad pendiente",
                                    },
                                    {
                                        value: "limitDate",
                                        label: "Fecha limite",
                                    },
                                    {
                                        value: "lineStatus",
                                        label: "Estado",
                                    },
                                    {
                                        value: "locationName",
                                        label: "Ubicación",
                                    },
                                    {
                                        value: "modelName",
                                        label: "Nombre del modelo",
                                    },
                                    {
                                        value: "productName",
                                        label: "Nombre del producto",
                                    },
                                ]}
                            />

                            <SelectOptionFilter
                                name="direction"
                                label="Dirección"
                                value={form.direction}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        direction: e.target.value,
                                    }))
                                }
                                options={[
                                    { value: "desc", label: "Descendente" },
                                    { value: "asc", label: "Ascendente" },
                                ]}
                            />
                        </div>
                    </FiltersFormContainer>

                    <TableContainer
                        headers={tableHeaders}
                        isLoading={isLoading}
                        isError={isError}
                        isEmpty={!content.length}
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
                                        const params = buildParams(form);
                                        params.set("page", page.toString());
                                        setSearchParams(params);

                                        setForm((prev) => ({
                                            ...prev,
                                            page,
                                        }));

                                        // if (form.minRequiredQuantity) params.set('minRequiredQuantity', form.minRequiredQuantity)
                                        // if (form.maxRequiredQuantity) params.set('maxRequiredQuantity', form.maxRequiredQuantity);
                                        // if (form.minLimitDate) params.set('minLimitDate', form.minLimitDate);
                                        // if (form.maxLimitDate) params.set('maxLimitDate', form.maxLimitDate);
                                        // if (form.lineStatus) params.set('lineStatus', form.lineStatus);
                                        // if (form.location) params.set('location', form.location);
                                        // if (form.subregionId) params.set('subregionId', String(form.subregionId));
                                        // if (form.regionId) params.set('regionId', String(form.regionId));
                                        // if (form.modelId) params.set('modelId', String(form.modelId));
                                    }}
                                />
                            ) : null
                        }
                    >
                        {content?.map((deliveryLine) => {
                            return (
                                <TableRowContainer key={deliveryLine.id}>
                                    <BaseTableCell data={deliveryLine.id} />
                                    <BaseTableCell
                                        data={
                                            <>
                                                <LinkText
                                                    to={getRoutePath(
                                                        deliveryLine.id,
                                                    )}
                                                >
                                                    {deliveryLine.locationName}
                                                </LinkText>
                                            </>
                                        }
                                    />
                                    <BaseTableCell
                                        data={deliveryLine.modelproductName}
                                    />
                                    <BaseTableCell
                                        data={
                                            <div className="text-lg">
                                                {deliveryLine.deliveredQuantity}{" "}
                                                /{" "}
                                                {deliveryLine.requiredQuantity}
                                            </div>
                                        }
                                    />
                                    <BaseTableCell
                                        data={
                                            deliveryLine.limitDate
                                                ? handleFormatDateTimeWithoutT(
                                                      new Date(
                                                          deliveryLine.limitDate,
                                                      ),
                                                  )
                                                : "Sin prioridad"
                                        }
                                    />
                                    <BaseTableCell
                                        isCenter
                                        data={
                                            <DeliveryLineStatus
                                                deliveryLineStatus={
                                                    deliveryLine.lineStatus
                                                }
                                            />
                                        }
                                    />
                                    {hasPermission(ROLE_OPERATOR) && (
                                        <BaseTableCell
                                            data={
                                                <div className="flex flex-col gap-2 justify-center items-center">
                                                    <AllocateDeliveryLineButton
                                                        deliveryLineId={
                                                            deliveryLine.id
                                                        }
                                                        deliveryOrderId={
                                                            deliveryOrderId
                                                        }
                                                        modelId={
                                                            deliveryLine.modelId
                                                        }
                                                    />

                                                    {hasPermission(
                                                        ROLE_ADMIN,
                                                    ) && (
                                                        <SendDeliveryLineButton
                                                            deliveryLineId={
                                                                deliveryLine.id
                                                            }
                                                            deliveryOrderId={
                                                                deliveryOrderId
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            }
                                        />
                                    )}
                                </TableRowContainer>
                            );
                        })}
                    </TableContainer>
                </EntityListLayout.Content>
            </EntityListLayout>
        </>
    );
};
