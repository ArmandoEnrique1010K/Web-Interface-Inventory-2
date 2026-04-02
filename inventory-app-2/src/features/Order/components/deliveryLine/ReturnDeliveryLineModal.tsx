import React from "react";
import type { DeliveryLineAlterForm } from "../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { returnDeliveryLine } from "../../api/DeliveryLineAPI";
import type { GeneralError } from "@/types/index";
import { toast } from "sonner";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";
import { InputText } from "@/ui/fields/InputText";
import { Button } from "../../../../ui/Button";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

type Props = {
    setReturnModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    deliveryLineId: string;
    deliveryOrderId: string;
};

export const ReturnDeliveryLineModal = ({
    setReturnModalOpen,
    deliveryLineId,
    deliveryOrderId,
}: Props) => {
    const initialValues: DeliveryLineAlterForm = {
        quantity: "",
        movementComment: "",
    };

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<DeliveryLineAlterForm>({
        defaultValues: initialValues,
    });

    const queryClient = useQueryClient();

    // Mutacion para guardar los cambios
    const { mutate } = useMutation({
        mutationFn: returnDeliveryLine,
        retry: false,
        onError: (error: unknown) => {
            const e = error as GeneralError;
            if (e.type === "FIELD_ERROR" && e.fields) {
                Object.entries(e.fields).forEach(([field, message]) => {
                    setError(field as keyof DeliveryLineAlterForm, {
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
            queryClient.invalidateQueries({
                queryKey: ["deliveryLines", "deliveryOrder", deliveryOrderId],
            });
            queryClient.invalidateQueries({
                queryKey: [
                    "deliveryLine",
                    deliveryLineId ? +deliveryLineId : 0,
                ],
            });

            toast.success(data);
            setReturnModalOpen(false);
        },
    });
    const handleForm = (formData: DeliveryLineAlterForm) => {
        const data = {
            formData,
            deliveryLineId,
        };
        mutate(data);
    };

    return (
        <EntityFormLayout isCompact>
            <EntityFormLayout.Form onSubmit={handleSubmit(handleForm)}>
                <EntityFormLayout.Inputs isCompact>
                    <InputText
                        id="quantity"
                        label="Cantidad a retornar"
                        placeholder="Cantidad"
                        type="text"
                        errorMessage={errors.quantity}
                        functionEnabled={register("quantity")}
                    />
                    <InputText
                        id="movementComment"
                        label="Comentario breve"
                        placeholder="Escriba un comentario"
                        type="text"
                        errorMessage={errors.movementComment}
                        functionEnabled={register("movementComment")}
                    />
                </EntityFormLayout.Inputs>
                <EntityFormLayout.Actions>
                    <Button
                        icon={<ArrowUpCircleIcon />}
                        size="large"
                        text="Retornar"
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
                        onClick={() => setReturnModalOpen(false)}
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
