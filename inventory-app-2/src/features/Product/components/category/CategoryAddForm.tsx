import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { registerCategory } from "../../api/CategoryAPI";
import { toast } from "sonner";
import type { CategoryForm } from "../../types";
import { InputText } from "@/ui/InputText";
import { Button } from "@/ui/Button";
import { TitleContainer } from "@/components/TitleContainer";
import { BaseForm } from "@/components/BaseForm";
import type { GeneralError } from "types";

export const CategoryAddForm = () => {

    const initialValues: CategoryForm = {
        name: '',
    }

    const { register, handleSubmit, setError, formState: { errors } } = useForm<CategoryForm>({
        defaultValues: initialValues
    })

    const navigate = useNavigate();


    const { mutate, isPending } = useMutation({
        mutationFn: registerCategory,
        onError: (error: GeneralError) => {
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
    if (isPending) return <h1>Espere</h1>


    return (
        <>
            <TitleContainer title="Añadir nueva categoria">
                <BaseForm
                    onSubmit={handleSubmit((data) => mutate(data))}
                    inputs={
                        <>
                            <InputText
                                id="name"
                                label="Nombre"
                                placeholder="Nombre de la categoria"
                                type="text"
                                errorMessage={errors.name}
                                functionEnabled={register('name')} />

                        </>
                    }
                    buttons={
                        <>
                            <Button size="large" text="Añadir categoria" type="submit" color="green" />
                            <Button size="large" text="Cancelar" type="link" color="gray" to="/products/categories" />
                        </>
                    }
                />
            </TitleContainer>
        </>
    )
}
