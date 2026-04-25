import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { GeneralError } from "@/types/index";
import { toast } from "sonner";
import { InputText } from "@/ui/fields/InputText";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { ButtonLink } from "@/ui/ButtonLink";
import { Button } from "@/ui/Button";
import { registerSubregion } from "../../api/SubregionAPI";
import { SelectOption } from "@/ui/fields/SelectOption";
import { listAllRegions } from "../../api/RegionAPI";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";
import type { SubregionForm } from "../../schemas/requests";

export const NewSubregionPage = () => {
    const initialValues = {
        name: "",
        regionId: undefined,
    };

    // Asegurarse de que el tipo de 'regionId' en el estado inicial sea 'number | undefined' para evitar errores de tipo al utilizar 'useForm' con 'SubregionForm'.
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<SubregionForm>({
        defaultValues: initialValues,
    });

    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: registerSubregion,
        retry: false,
        onError: (error: unknown) => {
            const e = error as GeneralError;
            if (e.type === "FIELD_ERROR" && e.fields) {
                Object.entries(e.fields).forEach(([field, message]) => {
                    setError(field as keyof SubregionForm, {
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

        // Dato: onSucess tiene un segundo parametro que es el objeto que pasastes a la funcion mutate
        onSuccess: (data, variables) => {
            toast.success(data);
            navigate(`/locations/subregions?regionId=${variables.regionId}`);
        },
    });
    const { data: regionsData } = useQuery({
        queryKey: ["regions"],
        queryFn: listAllRegions,
    });

    const regions =
        regionsData?.map((region) => ({
            value: region.id.toString(),
            label: region.name,
        })) || [];

    return (
        <EntityFormLayout>
            <EntityFormLayout.Header title="Añadir nueva subregión"></EntityFormLayout.Header>
            <EntityFormLayout.Form
                styled
                onSubmit={handleSubmit((data) => {
                    mutate(data);
                })}
            >
                <EntityFormLayout.Inputs>
                    <InputText
                        id="name"
                        label="Nombre"
                        placeholder="Nombre de la subregión"
                        type="text"
                        errorMessage={errors.name}
                        functionEnabled={register("name")}
                    />

                    <SelectOption
                        id="regionId"
                        label="Región"
                        errorMessage={errors.regionId}
                        functionEnabled={register("regionId")}
                        options={regions}
                        textInNullOption="Seleccione una región"
                    />
                </EntityFormLayout.Inputs>
                <EntityFormLayout.Actions>
                    <Button
                        icon={<ArrowUpCircleIcon />}
                        size="large"
                        text="Añadir"
                        type="submit"
                        color="green"
                        showIconOnMobile={false}
                        showTextOnMobile
                        isLargeOnMobile
                        applyMinWidth
                    />
                    <ButtonLink
                        icon={<XCircleIcon />}
                        size="large"
                        text="Cancelar"
                        color="gray"
                        to="/locations/subregions"
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
