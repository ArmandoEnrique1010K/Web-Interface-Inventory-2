import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { GeneralError } from "@/types/index"
import { toast } from "sonner"
import { Button } from "@/ui/Button"
import { useForm } from "react-hook-form"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { changeStatusModel } from "../../api/ModelAPI"
import { useNavigate } from "react-router-dom"

export const ModelChangeStatus = ({ from, modelId, productId, value, size }: { from?: string, modelId: string, productId: string, value: string, size: 'small' | 'large' }) => {
    const { handleSubmit } = useForm();
    const queryClient = useQueryClient();

    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: () => changeStatusModel(modelId),
        onError: (error: GeneralError) => {
            // Error general
            if (error.type === 'GENERAL_ERROR') {
                toast.error(error.message)
                return
            }
        },
        onSuccess: async (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ['product-details', productId] })
            queryClient.invalidateQueries({ queryKey: ['models-in-product', productId] })
            queryClient.invalidateQueries({ queryKey: ['list-models'] })

            if (from === 'model-details') {
                navigate('/products/models')
            }


        }
    })

    return (
        <form onSubmit={handleSubmit(() => mutate())} className="text-center ">
            <Button icon={size === 'large' && <XMarkIcon />} text={value} type="submit" size={size} color={value === 'Activo' ? 'green-outline' : 'red-outline'} />
        </form>
    )
}

