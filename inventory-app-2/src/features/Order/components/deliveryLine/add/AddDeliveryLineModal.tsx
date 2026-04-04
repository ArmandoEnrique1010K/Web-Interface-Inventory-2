import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { registerDeliveryLine } from "../../../api/DeliveryLineAPI";
import { toast } from "sonner";
import type { GeneralError } from "@/types/index";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";
import { InputText } from "@/ui/fields/InputText";
import { InputDateTime } from "@/ui/fields/InputDateTime";
import { listAllModelsByDeliveryOrder } from "../../../api/ModelDeliveryOrderAPI";
import { SelectOption } from "@/ui/fields/SelectOption";
import { listAllRegions } from "@/features/Location/api/RegionAPI";
import { listAllSubregionsByRegionId } from "@/features/Location/api/SubregionAPI";
import { SelectOptionFilter } from "@/ui/filters/SelectOptionFilter";
import { AsyncSelectField, type Option } from "@/ui/fields/AsyncSelectOption";
import { listFirstTenLocationsByKeyword } from "@/features/Location/api/LocationAPI";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@/ui/Button";

type Props = {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    deliveryOrderId: number;
};

type DeliveryLineFormFields = {
    requiredQuantity: number;
    limitDate: string;
    modelId: number;
    locationId: Option | null;
};
// NOTA: LOS CAMPOS LIMITDATE, MODELID, REGIONID Y SUBREGIONID MANTIENEN EL VALOR SELECCIONADO EN EL SESSIONSTORAGE PARA SEGUIR GUARDANDO LINEAS DE ENTREGA
// CADA CAMBIO HECHO EN ESOS CAMPOS, SE VA A GUARDAR EN EL SESSIONSTORAGE
export const AddDeliveryLineModal = ({
    setShowModal,
    deliveryOrderId,
}: Props) => {
    // KEY para almacenar los valores rellenados por el usuario del formulario
    const STORAGE_KEY = "deliveryLineDraft";

    const initialValues = {
        locationId: null,
        requiredQuantity: undefined,
        limitDate: "",
        modelId: undefined,
    };

    const saved = sessionStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : null;

    const {
        register,
        handleSubmit,
        setError,
        control,
        formState: { errors },
        setValue,
        resetField,
    } = useForm<DeliveryLineFormFields>({
        defaultValues: parsed || initialValues,
    });
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: registerDeliveryLine,
        retry: false,
        onError: (error: unknown) => {
            const e = error as GeneralError;
            if (e.type === "FIELD_ERROR" && e.fields) {
                Object.entries(e.fields).forEach(([field, message]) => {
                    setError(field as keyof DeliveryLineFormFields, {
                        type: "server",
                        message: message,
                    });
                });

                toast.error(e.message);
                return;
            }

            if (e.type === "GENERAL_ERROR") {
                toast.error(e.message);
                return;
            }
        },
        onSuccess: (data) => {
            toast.success(data);
            setShowModal(false);
            queryClient.invalidateQueries({
                queryKey: ["deliveryOrder", deliveryOrderId],
            });
            queryClient.invalidateQueries({
                queryKey: ["deliveryLines", "deliveryOrder", deliveryOrderId!],
            });
        },
    });

    const {
        data: modelsDeliveryOrderData /* isLoading: isModelsDeliveryOrderDataLoading */,
    } = useQuery({
        queryKey: ["models", "deliveryOrder", deliveryOrderId],
        queryFn: () => listAllModelsByDeliveryOrder(deliveryOrderId!),
        enabled: !!deliveryOrderId,
    });

    const modelsByDeliveryOrder =
        modelsDeliveryOrderData?.map((model) => ({
            value: model.modelId.toString(), // OJO, debe ser modelId, porque si fuera id, toma el id de la relación modelo-orden de entrega
            label: model.productName + " " + model.modelName,
        })) || [];

    // Initialize state with saved values or defaults
    const getInitialRegionId = () => {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            return parsed.regionId || "";
        }
        return "";
    };

    const getInitialSubregionId = () => {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            return parsed.subregionId || "";
        }
        return "";
    };

    const [selectedRegionId, setSelectedRegionId] =
        useState(getInitialRegionId());
    const [selectedSubregionId, setSelectedSubregionId] = useState(
        getInitialSubregionId(),
    );

    console.log(typeof selectedSubregionId);
    console.log(selectedSubregionId); // ""

    const { data: regionsData } = useQuery({
        queryKey: ["regions"],
        queryFn: listAllRegions,
    });

    const { data: subregionsData } = useQuery({
        queryKey: ["subregions", "region", selectedRegionId],
        queryFn: () => listAllSubregionsByRegionId(selectedRegionId.toString()),
        enabled: !!selectedRegionId, // solo ejecuta si hay region
    });

    const regions =
        regionsData
            ?.map((region) => ({
                value: region.id.toString(),
                label: region.name,
            }))
            .concat({
                value: "",
                label: "Seleccione una región",
            }) || [];

    const subregions =
        subregionsData?.map((type) => ({
            value: type.id.toString(),
            label: type.name,
        })) || [];

    const subregionsList =
        subregions.concat({
            value: "",
            label: "Seleccione una subregión",
        }) || [];

    console.log(subregionsData);
    console.log(subregions);

    useEffect(() => {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (!saved) return;

        const parsed = JSON.parse(saved);

        // react-hook-form
        Object.entries(parsed).forEach(([key, value]) => {
            setValue(key as keyof DeliveryLineFormFields, value as string);
        });
    }, []);

    // const limitDate = watch('limitDate') ? handleFormatDateTime(new Date(watch('limitDate'))) : '';
    const limitDate = useWatch({ control, name: "limitDate" });
    // const locationId = useWatch({ control, name: 'locationId' });
    const modelId = useWatch({ control, name: "modelId" });

    useEffect(() => {
        const dataToSave = {
            limitDate,
            modelId,
            regionId: selectedRegionId,
            subregionId: selectedSubregionId,
        };

        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }, [limitDate, modelId, selectedRegionId, selectedSubregionId]);

    useEffect(() => {
        resetField("locationId");
    }, [selectedRegionId, selectedSubregionId]);

    return (
        <EntityFormLayout isCompact>
            <EntityFormLayout.Form
                styled={false}
                onSubmit={handleSubmit((data) => {
                    mutate({
                        deliveryOrderId: deliveryOrderId,
                        formData: {
                            ...data,
                            locationId: Number(data.locationId?.value),
                        },
                    });
                })}
            >
                <EntityFormLayout.Inputs isCompact>
                    <InputText
                        id="requiredQuantity"
                        label="Cantidad requerida"
                        placeholder="Cantidad"
                        type="number"
                        errorMessage={errors.requiredQuantity}
                        functionEnabled={register("requiredQuantity")}
                    />

                    <InputDateTime<DeliveryLineFormFields>
                        id={"limitDate"}
                        label={"Fecha limite de entrega"}
                        name={"limitDate"}
                        control={control}
                        errorMessage={errors.limitDate?.message}
                    />

                    <SelectOption
                        id="modelId"
                        label="Modelo de producto"
                        errorMessage={errors.modelId}
                        functionEnabled={register("modelId")}
                        options={modelsByDeliveryOrder}
                        textInNullOption="Seleccione un modelo"
                    ></SelectOption>

                    {/* CAMPO PARA SELECCIONAR UNA REGIÓN */}

                    <div className="flex flex-col w-full space-y-1">
                        <SelectOptionFilter
                            name="regionId"
                            label="Región"
                            options={regions}
                            onChange={(e) => {
                                setSelectedRegionId(e.target.value);
                                setSelectedSubregionId("");
                            }}
                            value={selectedRegionId}
                        />
                        <div className="min-h-6">
                            <p className="text-red-700 text-sm">
                                {selectedRegionId === "" &&
                                initialValues.locationId === ""
                                    ? "Seleccione una región"
                                    : ""}
                            </p>
                        </div>
                    </div>

                    {/* CAMPO PARA SELECCIONAR UNA SUBREGIÓN */}
                    <div className="flex flex-col space-y-1 w-full">
                        <SelectOptionFilter
                            name="subregionId"
                            label="Subregión"
                            options={subregionsList}
                            onChange={(e) => {
                                setSelectedSubregionId(e.target.value);
                            }}
                            value={selectedSubregionId}
                            disabled={selectedRegionId === ""}
                        />
                        <div className="min-h-6">
                            <p className="text-red-700 text-sm">
                                {selectedSubregionId === "" &&
                                initialValues.locationId === ""
                                    ? "Seleccione una subregión"
                                    : ""}
                            </p>
                        </div>
                    </div>

                    {/* CAMPO PARA BUSCAR UBICACIONES */}
                    <AsyncSelectField<DeliveryLineFormFields>
                        control={control}
                        label={"Ubicación"}
                        name={"locationId"}
                        errorMessage={errors.locationId?.message}
                        disabled={selectedSubregionId === ""}
                        loadOptions={async (inputValue) => {
                            const data = await listFirstTenLocationsByKeyword(
                                { name: inputValue },
                                selectedRegionId,
                                selectedSubregionId,
                            );
                            return data.map(
                                (location: { id: number; name: string }) => ({
                                    value: location.id,
                                    label: location.name,
                                }),
                            );
                        }}
                    />
                </EntityFormLayout.Inputs>
                <EntityFormLayout.Actions>
                    <Button
                        icon={<ArrowUpCircleIcon />}
                        size="large"
                        text="Agregar"
                        type="submit"
                        color="green"
                        showIconOnMobile={false}
                        showTextOnMobile
                        isLargeOnMobile
                        applyMinWidth
                    />
                    <Button
                        type="button"
                        icon={<XCircleIcon />}
                        size="large"
                        text="Cancelar"
                        color="gray"
                        onClick={() => setShowModal(false)}
                        showIconOnMobile={false}
                        showTextOnMobile
                        isLargeOnMobile
                        applyMinWidth
                    />
                </EntityFormLayout.Actions>
            </EntityFormLayout.Form>
        </EntityFormLayout>
    );
};
