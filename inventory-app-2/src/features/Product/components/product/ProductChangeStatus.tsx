import { useMutation, useQueryClient } from "@tanstack/react-query"
import { changeStatusProduct } from "../../api/ProductAPI"
import type { GeneralError } from "@/types/index"
import { toast } from "sonner"
import { Button } from "@/ui/Button"
import { useForm } from "react-hook-form"

export const ProductChangeStatus = ({ productId, value }: { productId: string, value: string }) => {
    const { handleSubmit } = useForm();

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
            queryClient.invalidateQueries({ queryKey: ["list-products"] })
            toast.success(data)
        }
    })


    // TODO: EN ALGUNA FUTURA ACTUALIZACION, PODRIA CAMBIAR EL DISEÑO DEL BOTON A UN BORDEADO SIN COLOR DE RELLENO
    return (
        // TODO: ¿PODRIA EXISTIR ALGUNA ALTERNATIVA EN LUGAR DE USAR UN OPERADOR ! EN TAILWIND PARA APLICAR UN ESTILO IMPORTANTE
        <form onSubmit={handleSubmit(() => mutate())} className="flex justify-center">
            <Button text={value} type="submit" size="small" isLarge={false} color={value === 'Activo' ? 'green' : 'red'} aditionalStyles="!py-1.5" />
        </form>
    )
}

