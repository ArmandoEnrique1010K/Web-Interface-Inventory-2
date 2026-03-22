import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { GeneralError } from "@/types/index"
import { toast } from "sonner"
import { Button } from "@/ui/Button"
import { useForm } from "react-hook-form"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { changeStatusUser } from "../api/UserAPI"

export const UserChangeStatus = ({ userId, value, size }: { userId: string, value: string, size: 'small' | 'large' }) => {
    const { handleSubmit } = useForm();
    const queryClient = useQueryClient();


    const { mutate } = useMutation({
        mutationFn: () => changeStatusUser(userId),
        onError: (error: GeneralError) => {
            if (error.type === 'GENERAL_ERROR') {
                toast.error(error.message)
                return
            }
        },
        onSuccess: async (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ['edit-user', userId] })
            queryClient.invalidateQueries({ queryKey: ['list-users'] })
        }
    })

    return (
        <form onSubmit={handleSubmit(() => mutate())} className="text-center ">
            <Button icon={size === 'large' && <XMarkIcon />} text={value} type="submit" size={size} color={value === 'Activo' ? 'green-outline' : 'red-outline'} />
        </form>
    )
}

