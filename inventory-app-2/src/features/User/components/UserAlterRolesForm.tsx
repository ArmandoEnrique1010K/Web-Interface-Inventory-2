import { useNavigate } from "react-router-dom";
import type { RolesForm, UserRolesDetails } from "../types";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserRoles } from "../api/UserAPI";
import type { GeneralError } from "@/types/index";
import { toast } from "sonner";
import { BaseForm } from "@/components/BaseForm";
import { Button } from "@/ui/Button";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { ButtonLink } from "@/ui/ButtonLink";

type Props = {
    data: UserRolesDetails
    userId: string;
}


export const UserAlterRolesForm = ({ data, userId }: Props) => {
    const navigate = useNavigate();

    const { register, handleSubmit, setError } = useForm<RolesForm>({
        defaultValues: {
            operator: data.operator,
            secretary: data.secretary,
            admin: data.admin
        }
    })

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: updateUserRoles,
        onError: (error: GeneralError) => {
            if (error.type === 'FIELD_ERROR') {
                Object.entries(error.fields).forEach(([field, message]) => {
                    setError(field as keyof RolesForm, {
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
            queryClient.invalidateQueries({ queryKey: ["list-users"] })
            queryClient.invalidateQueries({ queryKey: ["edit-roles", userId] })
            toast.success(data)
            navigate("/users")
        }
    })
    const handleForm = (formData: RolesForm) => {
        const data = {
            formData,
            userId
        }
        mutate(data)
    }


    return (
        <BaseForm
            title={`Alterar roles del usuario #${userId}`}
            onSubmit={handleSubmit(handleForm)}
            buttons={
                <>
                    <Button icon={<ArrowUpCircleIcon />} size="large" text="Alterar roles" type="submit" color="green" />
                    <ButtonLink icon={<XCircleIcon />} size="large" text="Volver" color="gray" to="/users" />
                </>
            }
            helpText={
                "Tenga cuidado al alterar los roles de un usuario, podria acceder a información confidencial; recuerde que lo altera bajo su propia responsabilidad. Por defecto los usuarios siempre van a tener el rol de 'Usuario'"
            }
            inputsFields={
                <>
                    <label className="text-md font-bold">Roles</label>

                    {/* Campos de tipo checkbox para los roles */}
                    <div className="flex flex-col gap-3 pt-2">
                        {/* TODO: SEPARAR ESTE CAMPO EN UN COMPONENTE APARTE */}
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...register("operator")}
                                className="w-4 h-4"
                            />
                            Operador
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...register("secretary")}
                                className="w-4 h-4"
                            />
                            Secretario
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...register("admin")}
                                className="w-4 h-4"
                            />
                            Administrador
                        </label>

                    </div>
                </>
            }
        />
    )
}
