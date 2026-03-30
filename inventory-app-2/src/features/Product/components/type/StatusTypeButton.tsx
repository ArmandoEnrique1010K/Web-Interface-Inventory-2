import type { GeneralError } from '@/types/index';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { changeStatusType } from '../../api/TypeAPI';
import { Button } from '@/ui/Button';

export const StatusTypeButton = ({ typeId, text }: { typeId: string, text: string }) => {
    const { handleSubmit } = useForm();
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: () => changeStatusType(typeId),
        onError: (error: GeneralError) => {
            if (error.type === 'GENERAL_ERROR') {
                toast.error(error.message)
                return
            }
        },
        onSuccess: async (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ["types"] })
        }
    })


    return (
        <form onSubmit={handleSubmit(() => mutate())} >
            <Button
                text={text}
                type="submit"
                size={'small'}
                color={text === 'Activo' ? 'green-outline' : 'red-outline'}
                showIconOnMobile={false}
                showTextOnMobile={true}
                isLargeOnMobile={false}
            />
        </form>
    )
}
