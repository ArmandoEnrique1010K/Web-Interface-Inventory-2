import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom"
import type { CategoryForm, TypeForm } from "../../types";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { GeneralError } from "types";
import { Button } from "@/ui/Button";
import { InputText } from "@/ui/fields/InputText";
import { updateType } from "../../api/TypeAPI";
import { ButtonLink } from "@/ui/ButtonLink";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";

type Props = {
    data: CategoryForm;
    typeId: string;
}

export const EditTypePage = ({ data, typeId }: Props) => {
    const navigate = useNavigate();

    const { register, handleSubmit, setError, formState: { errors } } = useForm<TypeForm>({
        defaultValues: {
            name: data.name
        }
    })

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: updateType,
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
            queryClient.invalidateQueries({ queryKey: ["list-types"] })
            queryClient.invalidateQueries({ queryKey: ["edit-type", typeId] })
            toast.success(data)
            navigate("/products/types")
        }
    })

    const handleForm = (formData: CategoryForm) => {
        const data = {
            formData,
            typeId
        }
        mutate(data)
    }

    return (
        <EntityFormLayout>
            <EntityFormLayout.Header title={`Editar tipo #${typeId}`}></EntityFormLayout.Header>
            <EntityFormLayout.Form onSubmit={handleSubmit(handleForm)}>
                <EntityFormLayout.Inputs>
                    <InputText
                        id="name"
                        label="Nombre"
                        placeholder="Nombre del tipo"
                        type="text"
                        errorMessage={errors.name}
                        functionEnabled={register('name')} />
                </EntityFormLayout.Inputs>
                <EntityFormLayout.Actions>
                    <Button icon={<ArrowUpCircleIcon />} size="large" text="Editar tipo" type="submit" color="green" />
                    <ButtonLink icon={<XCircleIcon />} size="large" text="Volver" color="gray" to="/products/types" />

                </EntityFormLayout.Actions>
            </EntityFormLayout.Form>
        </EntityFormLayout>
    )
}
