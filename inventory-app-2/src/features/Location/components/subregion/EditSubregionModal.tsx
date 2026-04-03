import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import type { GeneralError } from "@/types/index";
import { updateSubregion } from "../../api/SubregionAPI";
import { toast } from "sonner";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@/ui/Button";
import { InputText } from "@/ui/fields/InputText";
import { SelectOption } from "@/ui/fields/SelectOption";
import { listAllRegions } from "../../api/RegionAPI";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";
import type { SubregionForm } from "../../schemas/requests";

type Props = {
    data: SubregionForm;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    subregionId: number;
};

export const EditSubregionModal = ({
    data,
    subregionId,
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
            regionId: data.regionId,
        },
    });

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: updateSubregion,
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
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["subregions"] });
            queryClient.invalidateQueries({
                queryKey: ["subregion", subregionId],
            });
            toast.success(data);
            setShowModal(false);
        },
    });
    const handleForm = (formData: SubregionForm) => {
        const data = {
            formData,
            subregionId,
        };
        mutate(data);
    };
    const { data: regionData } = useQuery({
        queryKey: ["regions"],
        queryFn: listAllRegions,
    });

    const regions =
        regionData?.map((region) => ({
            value: region.id.toString(),
            label: region.name,
        })) || [];

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

                    <SelectOption
                        id="regionId"
                        label="Región"
                        errorMessage={errors.regionId}
                        functionEnabled={register("regionId")}
                        options={regions}
                        textInNullOption="Seleccione un tipo"
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
                        type="button"
                        icon={<XCircleIcon />}
                        size="large"
                        text="Volver"
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
