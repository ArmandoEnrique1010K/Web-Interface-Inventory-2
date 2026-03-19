import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { TypeForm } from "../../types";
import { InputText } from "@/ui/fields/InputText";
import { Button } from "@/ui/Button";
import type { GeneralError } from "types";
import { registerType } from "../../api/TypeAPI";
import { ButtonLink } from "@/ui/ButtonLink";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";

export const NewTypePage = () => {

    const initialValues: TypeForm = {
        name: '',
    }

    const { register, handleSubmit, setError, formState: { errors } } = useForm<TypeForm>({
        defaultValues: initialValues
    })

    const navigate = useNavigate();


    const { mutate } = useMutation({
        mutationFn: registerType,
        onError: (error: GeneralError) => {
            // Error de campo
            if (error.type === 'FIELD_ERROR') {
                Object.entries(error.fields).forEach(([field, message]) => {
                    setError(field as keyof TypeForm, {
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
            navigate('/products/types')
        }
    })

    return (
        <EntityFormLayout>
            <EntityFormLayout.Title>Añadir nuevo tipo</EntityFormLayout.Title>
            <EntityFormLayout.Form onSubmit={handleSubmit((data) => mutate(data))}>
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
                    <Button icon={<ArrowUpCircleIcon />} size="large" text="Añadir tipo" type="submit" color="green" />
                    <ButtonLink icon={<XCircleIcon />} size="large" text="Cancelar" color="gray" to="/products/types" />
                </EntityFormLayout.Actions>
            </EntityFormLayout.Form>
        </EntityFormLayout>
    )
}
