import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategory } from "../../api/CategoryAPI";
import type { CategoryForm } from "../../types";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { GeneralError } from "types";
import { Button } from "@/ui/Button";
import { InputText } from "@/ui/fields/InputText";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";

type Props = {
    data: CategoryForm;
    categoryId: string;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const EditCategoryModal = ({ data, categoryId, setModalOpen }: Props) => {

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
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            queryClient.invalidateQueries({ queryKey: ["category", categoryId] })
            toast.success(data)
            // navigate("/products/categories")
            setModalOpen(false)
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
        <EntityFormLayout isCompact>
            <EntityFormLayout.Form onSubmit={handleSubmit(handleForm)}>
                <EntityFormLayout.Inputs isCompact>
                    <InputText
                        id="name"
                        label="Nombre"
                        placeholder="Nombre de la categoria"
                        type="text"
                        errorMessage={errors.name}
                        functionEnabled={register('name')} />
                </EntityFormLayout.Inputs>
                <EntityFormLayout.Actions isCompact>
                    <Button
                        icon={<ArrowUpCircleIcon />}
                        size="large"
                        text="Editar"
                        type="submit"
                        color="green"
                        showIconOnMobile={false}
                        showTextOnMobile
                        isLargeOnMobile
                    />
                    <Button
                        icon={<XCircleIcon />}
                        type="button"
                        size="large"
                        text="Volver"
                        color="gray"
                        onClick={() => setModalOpen(false)}
                        showIconOnMobile={false}
                        showTextOnMobile
                        isLargeOnMobile
                    />
                </EntityFormLayout.Actions>
            </EntityFormLayout.Form>
        </EntityFormLayout>
    )
}
