import type { GeneralError } from "@/types/index";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { cancelDeliveryLine } from "../../api/DeliveryLineAPI";
import { Button } from "@/ui/Button";
import { useNavigate } from "react-router-dom";
import { useAuthRole } from "@/hooks/useAuthRole";

type Props = {
    deliveryLineId: number;
    deliveryOrderId: number;
};

export const CancelDeliveryLineButton = ({
    deliveryLineId,
    deliveryOrderId,
}: Props) => {
    const { handleSubmit } = useForm();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { userRole } = useAuthRole();

    const { mutate } = useMutation({
        mutationFn: () => cancelDeliveryLine(deliveryLineId),
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

            // Se tiene que eliminar el cache (cuando se trata de hacer un borrado logico)
            queryClient.removeQueries({
                queryKey: [
                    "deliveryLine",
                    deliveryLineId ? +deliveryLineId : 0,
                ],
            });
            queryClient.invalidateQueries({ queryKey: ["movements"] });
            queryClient.invalidateQueries({
                queryKey: ["dashboard", userRole],
            });
            toast.success(data);
            navigate(`/orders/${deliveryOrderId}`);
        },
    });

    return (
        <form onSubmit={handleSubmit(() => mutate())}>
            <Button
                text={"Eliminar"}
                type="submit"
                size={"small"}
                color={"red-outline"}
                showIconOnMobile={false}
                showTextOnMobile={true}
                isLargeOnMobile={false}
            />
        </form>
    );
};
