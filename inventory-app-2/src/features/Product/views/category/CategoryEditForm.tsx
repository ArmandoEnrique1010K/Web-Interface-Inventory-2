import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom"
import { updateCategory } from "../../api/CategoryAPI";
import type { CategoryForm } from "../../types";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { InputText } from "@/shared/ui/InputText";
import { Button } from "@/shared/ui/Button";
import { ListDataContainer } from "@/shared/components/ListDataContainer";
import { FormContainer } from "@/shared/components/FormContainer";

type Props = {
    data: CategoryForm;
    categoryId: string;
}

export const CategoryEditForm = ({ data, categoryId }: Props) => {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<CategoryForm>({
        defaultValues: {
            name: data.name
        }
    })

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: updateCategory,
        onError: (error) => {
            toast.error(error.message)
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
        <>
            <ListDataContainer title={`Editar categoria ${categoryId}`}>
                <FormContainer
                    onSubmit={handleSubmit(handleForm)}
                    buttons={
                        <>
                            <Button size="large" text="Editar categoria" type="submit" color="green" />
                            <Button size="large" text="Volver" type="link" color="gray" to="/products/categories" />
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
