import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { changeStatusCategory } from '../../api/CategoryAPI';
import type { GeneralError } from '@/types/index';
import { toast } from 'sonner';
import { Button } from '@/ui/Button';

export const StatusCategoryButton = ({ categoryId, text }: { categoryId: string, text: string }) => {
    const { handleSubmit } = useForm();
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: () => changeStatusCategory(categoryId),
        onError: (error: GeneralError) => {
            if (error.type === 'GENERAL_ERROR') {
                toast.error(error.message)
                return
            }
        },
        onSuccess: async (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ["categories"] })
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
