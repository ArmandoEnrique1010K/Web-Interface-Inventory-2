import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { registerCategory } from "../../api/CategoryAPI";
import { toast } from "sonner";
import type { CategoryForm } from "../../types";
import { InputText } from "@/shared/ui/InputText";
import { Button } from "@/shared/ui/Button";
import { ListDataContainer } from "@/shared/components/ListDataContainer";
import { FormContainer } from "@/shared/components/FormContainer";

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
            <ListDataContainer title="Añadir nueva categoria">
                <FormContainer
                    onSubmit={handleSubmit((data) => mutate(data))}
                    buttons={
                        <>
                            <Button size="large" text="Añadir categoria" type="submit" color="green" />
                            <Button size="large" text="Cancelar" type="link" color="gray" to="/products/categories" />
                        </>
                    }
                >
                    <InputText
                        id="name"
                        label="Nombre"
                        placeholder="Nombre de la categoria"
                        type="text"
                        errorMessage={errors.name}
                        functionEnabled={register('name')} />
                </FormContainer>

            </ListDataContainer>

        </>
    )
}
