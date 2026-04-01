import type { GeneralError } from '@/types/index';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { cancelDeliveryLine } from '../../api/DeliveryLineAPI';
import { Button } from '@/ui/Button';
import { useNavigate } from 'react-router-dom';

type Props = {
    deliveryLineId: string,
    deliveryOrderId: string,
    deliveryLineStatus: string
}

export const CancelDeliveryLineButton = ({ deliveryLineId, deliveryOrderId, deliveryLineStatus }: Props) => {

    const { handleSubmit } = useForm();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: () => cancelDeliveryLine(deliveryLineId),
        onError: (error: GeneralError) => {
            if (error.type === 'GENERAL_ERROR') {
                toast.error(error.message)
                return
            }
        },
        onSuccess: async (data) => {
            queryClient.invalidateQueries({ queryKey: ['deliveryLines', 'deliveryOrder', deliveryOrderId] })

            // Se tiene que eliminar el cache (cuando se trata de hacer un borrado logico)
            queryClient.removeQueries({ queryKey: ["deliveryLine", deliveryLineId ? +deliveryLineId : 0] })
            toast.success(data)
            navigate(`/orders/${deliveryOrderId}`)
        }
    })

    return (
        <form onSubmit={handleSubmit(() => mutate())} >
            <Button
                text={'Eliminar'}
                type="submit"
                size={'small'}
                color={'red-outline'}
                showIconOnMobile={false}
                showTextOnMobile={true}
                isLargeOnMobile={false}
            />
        </form>
    )
}

