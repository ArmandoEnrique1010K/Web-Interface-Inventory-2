import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { missingDeliveryLine } from "../../api/DeliveryLineAPI";
import { toast } from "sonner";
import type { GeneralError } from "@/types/index";
import { Button } from "@/ui/Button";

type Props = {
    deliveryLineId: number;
    deliveryOrderId: number;
};

export const MissingDeliveryLineButton = ({
    deliveryLineId,
    deliveryOrderId,
}: Props) => {
    const { handleSubmit } = useForm();
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: () => missingDeliveryLine(deliveryLineId),
        retry: false,
        onError: (error: unknown) => {
            const e = error as GeneralError;
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
            queryClient.invalidateQueries({ queryKey: ["movements"] });

            toast.success(data);
        },
    });

    return (
        <form onSubmit={handleSubmit(() => mutate())}>
            <Button
                text={"Reportar perdida"}
                type="submit"
                size={"small"}
                color={"blue-outline"}
                showIconOnMobile={false}
                showTextOnMobile={true}
                isLargeOnMobile={false}
            />
        </form>
    );
};
