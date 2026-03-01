import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom"
import type { CategoryForm, TypeForm } from "../../types";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { BaseForm } from "@/components/BaseForm";
import type { GeneralError } from "types";
import { Button } from "@/ui/Button";
import { InputText } from "@/ui/InputText";
import { TitleContainer } from "@/components/TitleContainer";
import { updateType } from "../../api/TypeAPI";
import { TextMessage } from "@/components/TextMessage";

type Props = {
    data: CategoryForm;
    typeId: string;
}

export const TypeEditForm = ({ data, typeId }: Props) => {
    const navigate = useNavigate();

    const { register, handleSubmit, setError, formState: { errors } } = useForm<TypeForm>({
        defaultValues: {
            name: data.name
        }
    })

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
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

    if (isPending) return <TextMessage text='Espere...' align='left' color='black' />

    return (
        <>
            <TitleContainer title={`Editar tipo ${typeId}`}>
                <BaseForm
                    onSubmit={handleSubmit(handleForm)}
                    buttons={
                        <>
                            <Button size="large" text="Editar tipo" type="submit" color="green" />
                            <Button size="large" text="Volver" type="link" color="gray" to="/products/types" />
                        </>
                    }
                    inputs={
                        <InputText
                            id="name"
                            label="Nombre"
                            placeholder="Nombre del tipo"
                            type="text"
                            hasErrors={true}
                            errorMessage={errors.name}
                            functionEnabled={register('name')} />

                    }
                />
            </TitleContainer>
        </>
    )
}
