import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateLocation } from "../../api/LocationAPI";
import type { GeneralError } from "@/types/index";
import { toast } from "sonner";
import { Button } from "@/ui/Button";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { InputText } from "@/ui/fields/InputText";
import { listAllRegions } from "../../api/RegionAPI";
import { listAllSubregionsByRegionId } from "../../api/SubregionAPI";
import { useState } from "react";
import { SelectOptionFilter } from "@/ui/filters/SelectOptionFilter";
import { SelectOption } from "@/ui/fields/SelectOption";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";
import type { LocationForm } from "../../schemas/requests";
import type { LocationItem } from "../../schemas/items";

type Props = {
    data: LocationItem;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    locationId: number;
};

export const EditLocationModal = ({
    data,
    locationId,
    setShowModal,
}: Props) => {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: data.name,
            address: data.address,
            subregionId: data.subregionId,
        },
    });

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: updateLocation,
        retry: false,
        onError: (error: unknown) => {
            const e = error as GeneralError;
            if (e.type === "FIELD_ERROR" && e.fields) {
                Object.entries(e.fields).forEach(([field, message]) => {
                    setError(field as keyof LocationForm, {
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
            queryClient.invalidateQueries({ queryKey: ["locations"] });
            queryClient.invalidateQueries({
                queryKey: ["location", locationId],
            });
            toast.success(data);
            setShowModal(false);
        },
    });

    const handleForm = (formData: LocationForm) => {
        const data = {
            formData,
            locationId,
        };
        mutate(data);
    };

    // FACIL: SE OBTIENE EL ID DE LA SUBREGIÓN
    // console.log(data.subregionId)

    const [selectedRegionId, setSelectedRegionId] = useState(data.regionId);

    const { data: regionsData /*, isLoading: regionsLoading */ } = useQuery({
        queryKey: ["regions"],
        queryFn: listAllRegions,
    });

    const { data: subregionsData, isLoading: subregionsLoading } = useQuery({
        queryKey: ["subregions", "region", selectedRegionId],
        queryFn: () => listAllSubregionsByRegionId(selectedRegionId!),
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

    // Recordar que he desactivado esta condicion porque si una lista se esta cargando, se ocultara el formulario y sera reemplazado por el siguiente componente
    // if (regionsLoading || subregionsLoading) {
    //     return <TextMessage text="Cargando..." align="left" color="black" />
    // }

    return (
        <EntityFormLayout isCompact>
            <EntityFormLayout.Form onSubmit={handleSubmit(handleForm)}>
                <EntityFormLayout.Inputs isCompact>
                    <InputText
                        id="name"
                        label="Nombre"
                        placeholder="Nombre de la ubicación"
                        type="text"
                        errorMessage={errors.name}
                        functionEnabled={register("name")}
                    />

                    <InputText
                        id="address"
                        label="Dirección"
                        placeholder="Dirección o referencia"
                        type="text"
                        errorMessage={errors.address}
                        functionEnabled={register("address")}
                    />

                    <div className="flex flex-col space-y-1 w-full pt-2">
                        <SelectOptionFilter
                            name="regionId"
                            label="Región"
                            options={regions}
                            onChange={(e) =>
                                setSelectedRegionId(+e.target.value)
                            }
                            value={selectedRegionId!.toString()}
                        />
                        <div className="min-h-6">
                            <p className="text-red-700 text-sm">
                                {selectedRegionId === 0
                                    ? "Seleccione una región"
                                    : ""}
                            </p>
                        </div>
                    </div>

                    <SelectOption
                        id="subregionId"
                        label="Subregión"
                        errorMessage={errors.subregionId}
                        functionEnabled={register("subregionId")}
                        options={subregions}
                        textInNullOption={
                            subregionsLoading
                                ? "Cargando subregiones..."
                                : "Seleccione una subregión"
                        }
                        disabled={selectedRegionId === 0}
                    />

                    {/* <SelectOption id="subregionId" label='Subregión'
                            errorMessage={errors.subregionId}
                            functionEnabled={register('subregionId')}
                            options={subregions}
                            textInNullOption='Seleccione una subregión' /> */}
                </EntityFormLayout.Inputs>
                <EntityFormLayout.Actions isCompact>
                    <Button
                        icon={<ArrowUpCircleIcon />}
                        size="large"
                        text="Editar"
                        type="submit"
                        color="green"
                        showIconOnMobile={false}
                        showTextOnMobile
                        isLargeOnMobile
                        applyMinWidth
                    />
                    <Button
                        icon={<XCircleIcon />}
                        size="large"
                        text="Volver"
                        type="button"
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
