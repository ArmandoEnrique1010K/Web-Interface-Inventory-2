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
        onError: (error: unknown) => {
            const e = error as GeneralError
            if (e.type === 'GENERAL_ERROR') {
                toast.error(e.message)
                return
            }
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            toast.success(data)
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
