import type { RegionForm } from "../../types";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { registerRegion } from "../../api/RegionAPI";
import type { GeneralError } from "@/types/index";
import { toast } from "sonner";
import { InputText } from "@/ui/fields/InputText";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { ButtonLink } from "@/ui/ButtonLink";
import { Button } from "@/ui/Button";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";

export const NewRegionPage = () => {
    const initialValues: RegionForm = {
        name: "",
    };
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<RegionForm>({
        defaultValues: initialValues,
    });

    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: registerRegion,
        retry: false,
        onError: (error: unknown) => {
            const e = error as GeneralError;
            if (e.type === "FIELD_ERROR" && e.fields) {
                Object.entries(e.fields).forEach(([field, message]) => {
                    setError(field as keyof RegionForm, {
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
        onSuccess: async (data) => {
            toast.success(data);
            navigate("/locations/regions");
        },
    });

    return (
        <EntityFormLayout>
            <EntityFormLayout.Header title="Añadir nueva región"></EntityFormLayout.Header>
            <EntityFormLayout.Form
                styled
                onSubmit={handleSubmit((data) => mutate(data))}
            >
                <EntityFormLayout.Inputs>
                    <InputText
                        id="name"
                        label="Nombre"
                        placeholder="Nombre de la región"
                        type="text"
                        errorMessage={errors.name}
                        functionEnabled={register("name")}
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
                        to="/locations/regions"
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
