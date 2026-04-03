import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { sendDeliveryLine } from "../../api/DeliveryLineAPI";
import { toast } from "sonner";
import type { GeneralError } from "@/types/index";
import { Button } from "@/ui/Button";

type Props = {
    deliveryLineId: string;
    deliveryOrderId: string;
    deliveryLineStatus: string;
};

export const SendDeliveryLineButton = ({
    deliveryLineId,
    deliveryOrderId,
    deliveryLineStatus,
}: Props) => {
    const { handleSubmit } = useForm();
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: () => sendDeliveryLine(deliveryLineId),
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
            toast.success(data);
        },
    });

    return (
        <form onSubmit={handleSubmit(() => mutate())}>
            <Button
                text={"Entregar"}
                type="submit"
                size={"small"}
                color={"green-outline"}
                showIconOnMobile={false}
                showTextOnMobile={true}
                isLargeOnMobile={false}
            />
        </form>
    );
};
