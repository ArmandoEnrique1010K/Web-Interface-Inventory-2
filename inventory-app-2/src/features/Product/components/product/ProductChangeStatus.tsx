import { useMutation, useQueryClient } from "@tanstack/react-query"
import { changeStatusProduct } from "../../api/ProductAPI"
import type { GeneralError } from "@/types/index"
import { toast } from "sonner"
import { Button } from "@/ui/Button"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { XMarkIcon } from "@heroicons/react/24/outline"

export const ProductChangeStatus = ({ from, productId, value, size }: { from?: string, productId: string, value: string, size: 'small' | 'large' }) => {
    const { handleSubmit } = useForm();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: () => changeStatusProduct(productId),
        onError: (error: GeneralError) => {
            // Error general
            if (error.type === 'GENERAL_ERROR') {
                toast.error(error.message)
                return
            }
        },
        onSuccess: async (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ["list-products"] })

            if (from === 'product-details') {
                navigate('/products')
            }


        }
    })

    return (
        <form onSubmit={handleSubmit(() => mutate())} className="text-center">
            {/* TODO: AÑADIR UN ICONO PARA MOSTRAR CUANDO EL PRODUCTO ESTE ACTIVO */}
            <Button icon={size === 'large' && <XMarkIcon />} text={value} type="submit" size={size} color={value === 'Activo' ? 'green-outline' : 'red-outline'} />
        </form>
    )
}

