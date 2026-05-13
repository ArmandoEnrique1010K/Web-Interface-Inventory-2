import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
    inactiveRelationModelToDeliveryOrder,
    registerRelationModelToDeliveryOrder,
} from "../../api/ModelDeliveryOrderAPI";
import type { GeneralError } from "@/types/index";
import { toast } from "sonner";
import { Button } from "@/ui/Button";
import type { ModelDeliveryOrderItem } from "../../schemas/items";
import { useAuthRole } from "@/hooks/useAuthRole";

type Props = {
    modelId: number;
    deliveryOrderId: number;
    existingModels: ModelDeliveryOrderItem[]; // Nuevo prop
    modelDeliveryOrderId?: number;
};

export const NewModelInDeliveryOrderButton = ({
    modelId,
    deliveryOrderId,
    existingModels,
    modelDeliveryOrderId,
}: Props) => {
    const { handleSubmit } = useForm();
    const queryClient = useQueryClient();
    const { userRole } = useAuthRole();

    const isAlreadyAdded = existingModels.some(
        (model) => +model.modelId === Number(modelId),
    );

    const { mutate: mutateRegister } = useMutation({
        mutationFn: () =>
            registerRelationModelToDeliveryOrder(modelId, deliveryOrderId),
        retry: false,
        onError: (error: unknown) => {
            const e = error as GeneralError;
            if (e.type === "GENERAL_ERROR") {
                toast.error(e.message);
                return;
            }
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({
                queryKey: ["models", "deliveryOrder", deliveryOrderId],
            });
            queryClient.invalidateQueries({
                queryKey: ["dashboard", userRole],
            });
        },
    });

    const { mutate: mutateInactive } = useMutation({
        mutationFn: () =>
            inactiveRelationModelToDeliveryOrder(modelDeliveryOrderId!),
        retry: false,
        onError: (error: unknown) => {
            const e = error as GeneralError;
            if (e.type === "GENERAL_ERROR") {
                toast.error(e.message);
                return;
            }
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({
                queryKey: ["models", "deliveryOrder", deliveryOrderId],
            });
        },
    });

    return (
        <>
            {!isAlreadyAdded ? (
                <form onSubmit={handleSubmit(() => mutateRegister())}>
                    <Button
                        text={"Añadir"}
                        type="submit"
                        size={"small"}
                        color={"green-outline"}
                        showTextOnMobile={true}
                        isLargeOnMobile={false}
                    />
                </form>
            ) : (
                <form onSubmit={handleSubmit(() => mutateInactive())}>
                    <Button
                        text={"Quitar"}
                        type="submit"
                        size={"small"}
                        color={"red-outline"}
                        showTextOnMobile={true}
                        isLargeOnMobile={false}
                    />
                </form>
            )}
        </>
    );
};
