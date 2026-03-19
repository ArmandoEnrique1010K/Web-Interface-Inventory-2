import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { registerCategory } from "../../api/CategoryAPI";
import { toast } from "sonner";
import type { CategoryForm } from "../../types";
import { InputText } from "@/ui/fields/InputText";
import { Button } from "@/ui/Button";
import type { GeneralError } from "types";
import { ButtonLink } from "@/ui/ButtonLink";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";

export const NewCategoryPage = () => {

    const initialValues: CategoryForm = {
        name: '',
    }

    const { register, handleSubmit, setError, formState: { errors } } = useForm<CategoryForm>({
        defaultValues: initialValues
    })

    const navigate = useNavigate();


    const { mutate } = useMutation({
        mutationFn: registerCategory,
        onError: (error: GeneralError) => {
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
        <EntityFormLayout>
            <EntityFormLayout.Title>Añadir nueva categoria</EntityFormLayout.Title>
            <EntityFormLayout.Form onSubmit={handleSubmit((data) => mutate(data))}>
                <EntityFormLayout.Inputs>
                    <InputText
                        id="name"
                        label="Nombre"
                        placeholder="Nombre de la categoria"
                        type="text"
                        errorMessage={errors.name}
                        functionEnabled={register('name')} />
                </EntityFormLayout.Inputs>
                <EntityFormLayout.Actions>
                    <Button icon={<ArrowUpCircleIcon />} size="large" text='Añadir categoria' type="submit" color="green" />
                    <ButtonLink icon={<XCircleIcon />} size="large" text="Cancelar" color="gray" to="/products/categories" />
                </EntityFormLayout.Actions>
            </EntityFormLayout.Form>
        </EntityFormLayout>
    )
}
