import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { registerCategory } from "../../api/CategoryAPI";
import { toast } from "sonner";
import type { CategoryForm } from "../../types";
import { FormContainer } from "@/shared/components/FormContainer";
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

    const dispatch = useDispatch();

    const { mutate } = useMutation({
        mutationFn: registerCategory,
        onError: (error: any) => {
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
        <div>
            <FormContainer
                title="Añadir nueva categoria"
                onSubmit={handleSubmit((data) => mutate(data))}
                children={
                    <>
                        <InputText
                            id="name"
                            label="Nombre"
                            placeholder="Nombre de la categoria"
                            type="text"
                            errorMessage={errors.name}
                            functionEnabled={register('name')} />
                        <Button text="Añadir categoria" type="submit" aditionalStyles="bg-green-800 hover:bg-green-700" />

                    </>
                }
            >
            </FormContainer>

            <Button text="Volver" type="link" aditionalStyles="bg-gray-600 hover:bg-gray-700" to="/products/categories" />
        </div>
    )
}
