import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { GeneralError } from "@/types/index"
import { toast } from "sonner"
import { Button } from "@/ui/Button"
import { useForm } from "react-hook-form"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { changeStatusLocation } from "../../api/LocationAPI"

export const LocationChangeStatus = ({ locationId, value, size }: { locationId: string, value: string, size: 'small' | 'large' }) => {
    const { handleSubmit } = useForm();
    const queryClient = useQueryClient();


    const { mutate } = useMutation({
        mutationFn: () => changeStatusLocation(locationId),
        onError: (error: GeneralError) => {
            // Error general
            if (error.type === 'GENERAL_ERROR') {
                toast.error(error.message)
                return
            }
        },
        onSuccess: async (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ['edit-location', locationId] })
            queryClient.invalidateQueries({ queryKey: ['list-locations'] })
        }
    })

    return (
        <form onSubmit={handleSubmit(() => mutate())} className="text-center ">
            <Button icon={size === 'large' && <XMarkIcon />} text={value} type="submit" size={size} color={value === 'Activo' ? 'green' : 'red'} />
        </form>
    )
}

