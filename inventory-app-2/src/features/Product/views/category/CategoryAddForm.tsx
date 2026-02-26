import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { registerCategory } from "../../api/CategoryAPI";
import { toast } from "sonner";
import type { CategoryForm } from "../../types";
import { InputText } from "@/shared/ui/InputText";
import { Button } from "@/shared/ui/Button";

export const CategoryAddForm = () => {

    const initialValues: CategoryForm = {
        name: '',
    }

    const { register, handleSubmit, setError, formState: { errors } } = useForm<CategoryForm>({
        defaultValues: initialValues
    })

    const navigate = useNavigate();


    const { mutate } = useMutation({
        mutationFn: registerCategory,

        // TODO: SE PODRIA ESPECIFICAR EL TIPADO DE ERROR A: { type: string, message: string, fields: { [key: string]: string } }
        onError: (error: { type: string, message: string, fields: { [key: string]: string } }) => {
            // toast.error(error.message)

            // Error de campo
            if (error.type === 'FIELD_ERROR') {
                Object.entries(error.fields).forEach(([field, message]) => {
                    setError(field as keyof CategoryForm, {
                        type: 'server',
                        message: message as string,
                    })
                })

                toast.error(error.message)
                return
            }

            // Error general
            if (error.type === 'GENERAL_ERROR') {
                toast.error(error.message)
                return
            }
        },
        onSuccess: async (data) => {
            toast.success(data)
            navigate('/products/categories')
        }
    })


    return (
        <>
            <h1 className="text-4xl font-bold mb-6">Añadir nueva categoria</h1>
            <form onSubmit={handleSubmit((data) => mutate(data))} className="w-full" autoComplete="off" noValidate>
                <InputText
                    id="name"
                    label="Nombre"
                    placeholder="Nombre de la categoria"
                    type="text"
                    errorMessage={errors.name}
                    functionEnabled={register('name')} />

                <div className="flex flex-row gap-2 justify-center pt-6">
                    <Button size="large" text="Añadir categoria" type="submit" color="green" />
                    <Button size="large" text="Volver" type="link" color="gray" to="/products/categories" />

                </div>
            </form>

        </>
    )
}
