import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { sendDeliveryOrder } from "../../api/DeliveryOrderAPI";
import type { GeneralError } from "@/types/index";
import { toast } from "sonner";
import { Button } from "@/ui/Button";

type Props = {
    deliveryOrderId: string
}

export const SendDeliveryOrderButton = ({ deliveryOrderId }: Props) => {
    const { handleSubmit } = useForm();
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: () => sendDeliveryOrder(deliveryOrderId),
        onError: (error: GeneralError) => {
            if (error.type === 'GENERAL_ERROR') {
                toast.error(error.message)
                return
            }
        },
        onSuccess: async (data) => {
            queryClient.invalidateQueries({ queryKey: ['deliveryOrder', deliveryOrderId] })
            toast.success(data)
        }
    })

    return (
        <form onSubmit={handleSubmit(() => mutate())} >
            <Button
                text={'Entregar orden'}
                type="submit"
                size={'small'}
                color={'green-outline'}
                showIconOnMobile={false}
                showTextOnMobile={true}
                isLargeOnMobile={false}
            />
        </form>
    )
}
