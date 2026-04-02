import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategory } from "../../../api/CategoryAPI";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/ui/Button";
import { InputText } from "@/ui/fields/InputText";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";
import type { GeneralError } from "@/types";
import type { CategoryForm } from "@/features/Product/schemas/requests";

type Props = {
    data: CategoryForm;
    categoryId: number;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const EditCategoryModal = ({
    data,
    categoryId,
    setShowModal,
}: Props) => {
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

    const { mutate } = useMutation({
        mutationFn: updateCategory,
        retry: false,
        onError: (error: unknown) => {
            const e = error as GeneralError;
            if (e.type === "FIELD_ERROR" && e.fields) {
                Object.entries(e.fields).forEach(([field, message]) => {
                    setError(field as keyof CategoryForm, {
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
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({
                queryKey: ["category", categoryId],
            });
            toast.success(data);
            setShowModal(false);
        },
    });

    const handleForm = (formData: CategoryForm) => {
        const data = {
            formData,
            categoryId,
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
                        placeholder="Nombre de la categoria"
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
