import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/ui/Button";
import { InputText } from "@/ui/fields/InputText";
import { updateType } from "../../../api/TypeAPI";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";
import type { GeneralError } from "@/types";
import type { TypeForm } from "@/features/Product/schemas/requests";

type Props = {
    data: TypeForm;
    typeId: number;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const EditTypeModal = ({ data, typeId, setShowModal }: Props) => {
    const initialValues = {
        name: data.name,
    };

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        defaultValues: initialValues,
    });

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: updateType,
        retry: false,
        onError: (error: unknown) => {
            const e = error as GeneralError;
            if (e.type === "FIELD_ERROR" && e.fields) {
                Object.entries(e.fields).forEach(([field, message]) => {
                    setError(field as keyof TypeForm, {
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
            queryClient.invalidateQueries({ queryKey: ["types"] });
            queryClient.invalidateQueries({ queryKey: ["type", typeId] });
            toast.success(data);
            setShowModal(false);
        },
    });

    const handleForm = (formData: TypeForm) => {
        const data = {
            formData,
            typeId,
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
                        placeholder="Nombre del tipo"
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
                        disabled={isPending}
                    />
                    <Button
                        icon={<XCircleIcon />}
                        type="button"
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
