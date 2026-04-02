import type { RegionForm } from "../../types";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRegion } from "../../api/RegionAPI";
import type { GeneralError } from "@/types/index";
import { toast } from "sonner";
import { Button } from "@/ui/Button";
import { InputText } from "@/ui/fields/InputText";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";

type Props = {
    data: RegionForm;
    showModal: React.Dispatch<React.SetStateAction<boolean>>;
    regionId: string;
};

export const EditRegionModal = ({ data, regionId, showModal }: Props) => {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<RegionForm>({
        defaultValues: {
            name: data.name,
        },
    });

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: updateRegion,
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
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["regions"] });
            queryClient.invalidateQueries({ queryKey: ["region", regionId] });
            toast.success(data);
            showModal(false);
        },
    });

    const handleForm = (formData: RegionForm) => {
        const data = {
            formData,
            regionId,
        };
        mutate(data);
    };

    return (
        <EntityFormLayout isCompact>
            <EntityFormLayout.Form onSubmit={handleSubmit(handleForm)}>
                <EntityFormLayout.Inputs isCompact>
                    <InputText
                        id="name"
                        label="Nombre"
                        placeholder="Nombre de la región"
                        type="text"
                        errorMessage={errors.name}
                        functionEnabled={register("name")}
                    />
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
                        onClick={() => showModal(false)}
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
