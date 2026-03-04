import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { TypeForm } from "../../types";
import { InputText } from "@/ui/fields/InputText";
import { Button } from "@/ui/Button";
import { TitleContainer } from "@/components/TitleContainer";
import { BaseForm } from "@/components/BaseForm";
import type { GeneralError } from "types";
import { registerType } from "../../api/TypeAPI";
import { ButtonLink } from "@/ui/ButtonLink";

export const TypeAddForm = () => {

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
        <>
            <TitleContainer title="Añadir nuevo tipo">
                <BaseForm
                    onSubmit={handleSubmit((data) => mutate(data))}
                    inputs={
                        <>
                            <InputText
                                id="name"
                                label="Nombre"
                                placeholder="Nombre del tipo"
                                type="text"
                                errorMessage={errors.name}
                                functionEnabled={register('name')} />

                        </>
                    }
                    buttons={
                        <>
                            <Button size="large" text="Añadir tipo" type="submit" color="green" />
                            <ButtonLink size="large" text="Cancelar" color="gray" to="/products/types" />
                        </>
                    }
                />
            </TitleContainer>
        </>
    )
}
