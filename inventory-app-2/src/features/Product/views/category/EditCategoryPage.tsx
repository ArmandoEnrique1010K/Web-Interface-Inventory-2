import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom"
import { updateCategory } from "../../api/CategoryAPI";
import type { CategoryForm } from "../../types";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { GeneralError } from "types";
import { Button } from "@/ui/Button";
import { InputText } from "@/ui/fields/InputText";
import { ButtonLink } from "@/ui/ButtonLink";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";

type Props = {
    data: CategoryForm;
    categoryId: string;
}

export const EditCategoryPage = ({ data, categoryId }: Props) => {
    const navigate = useNavigate();

    const { register, handleSubmit, setError, formState: { errors } } = useForm<CategoryForm>({
        defaultValues: {
            name: data.name
        }
    })

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: updateCategory,
        onError: (error: GeneralError) => {
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
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["list-categories"] })
            queryClient.invalidateQueries({ queryKey: ["edit-category", categoryId] })
            toast.success(data)
            navigate("/products/categories")
        }
    })

    const handleForm = (formData: CategoryForm) => {
        const data = {
            formData,
            categoryId
        }
        mutate(data)
    }

    return (
        <EntityFormLayout>
            <EntityFormLayout.Title>{`Editar categoria #${categoryId}`}</EntityFormLayout.Title>
            <EntityFormLayout.Form onSubmit={handleSubmit(handleForm)}>
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
                    <Button icon={<ArrowUpCircleIcon />} size="large" text="Editar categoria" type="submit" color="green" />
                    <ButtonLink icon={<XCircleIcon />} size="large" text="Volver" color="gray" to="/products/categories" />
                </EntityFormLayout.Actions>
            </EntityFormLayout.Form>
        </EntityFormLayout>
    )
}
