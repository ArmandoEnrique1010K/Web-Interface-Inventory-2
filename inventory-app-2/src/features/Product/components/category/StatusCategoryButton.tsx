import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { changeStatusCategory } from '../../api/CategoryAPI';
import type { GeneralError } from '@/types/index';
import { toast } from 'sonner';
import { Button } from '@/ui/Button';

type Props = {
    categoryId: number,
    status: boolean
}

export const StatusCategoryButton = ({ categoryId, status }: Props) => {
    const { handleSubmit } = useForm();
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: () => changeStatusCategory(categoryId),
        retry: false,
        onError: (error: unknown) => {
            const e = error as GeneralError
            if (e.type === 'GENERAL_ERROR') {
                toast.error(e.message)
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
                text={status ? 'Activo' : 'Inactivo'}
                type="submit"
                size={'small'}
                color={status ? 'green-outline' : 'red-outline'}
                showIconOnMobile={false}
                showTextOnMobile={true}
                isLargeOnMobile={false}
            />
        </form>
    )
}
