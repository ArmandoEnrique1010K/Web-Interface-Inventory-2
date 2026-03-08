import { useNavigate } from "react-router-dom";
import type { UserProfileForm } from "../types";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { GeneralError } from "@/types/index";
import { toast } from "sonner";
import { TitleContainer } from "@/components/TitleContainer";
import { BaseForm } from "@/components/BaseForm";
import { InputText } from "@/ui/fields/InputText";
import { Button } from "@/ui/Button";
import { ButtonLink } from "@/ui/ButtonLink";
import { updateUserProfile } from "../api/ProfileAPI";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

export const UpdateProfileForm = ({ data }: { data: UserProfileForm }) => {

    const initialValues: UserProfileForm = {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        dni: data.dni
    }

    const { register, handleSubmit, setError, formState: { errors } } = useForm<UserProfileForm>({
        defaultValues: initialValues
    })

    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: updateUserProfile,
        onError: (error: GeneralError) => {
            // Error de campo
            if (error.type === 'FIELD_ERROR') {
                Object.entries(error.fields).forEach(([field, message]) => {
                    setError(field as keyof UserProfileForm, {
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
            queryClient.invalidateQueries({ queryKey: ["profile"] })
            toast.success(data)
            navigate('/profile')
        }
    })


    return (
        <>
            <TitleContainer title="Actualizar perfil">
                <BaseForm
                    onSubmit={handleSubmit((data) => mutate(data))}
                    inputs={
                        <>
                            <InputText
                                id="firstname"
                                label="Nombre"
                                placeholder="Primer y segundo nombre del usuario"
                                type="text"
                                errorMessage={errors.firstname}
                                functionEnabled={register('firstname')} />
                            <InputText
                                id="firstname"
                                label="Apellido"
                                placeholder="Apellido del usuario"
                                type="text"
                                errorMessage={errors.lastname}
                                functionEnabled={register('lastname')} />
                            <InputText
                                id="dni"
                                label="DNI"
                                placeholder="DNI del usuario"
                                type="number"
                                errorMessage={errors.dni}
                                functionEnabled={register('dni')} />
                            <InputText
                                id="email"
                                label="Email"
                                placeholder="Email del usuario"
                                type="email"
                                errorMessage={errors.email}
                                functionEnabled={register('email')} />

                        </>
                    }
                    buttons={
                        <>
                            <Button icon={<ArrowUpCircleIcon />} size="large" text='Actualizar perfil' type="submit" color="green" />
                            <ButtonLink icon={<XCircleIcon />} size="large" text="Cancelar" color="gray" to="/profile" />
                        </>
                    }
                />
            </TitleContainer>

        </>
    )
}

