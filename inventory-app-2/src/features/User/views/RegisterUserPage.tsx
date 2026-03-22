import { useForm, type UseFormRegisterReturn } from "react-hook-form"
import type { UserRegisterForm } from "../types"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { registerUser } from "../api/UserAPI"
import type { GeneralError } from "@/types/index"
import { toast } from "sonner"
import { InputText } from "@/ui/fields/InputText"
import { Button } from "@/ui/Button"
import { ButtonLink } from "@/ui/ButtonLink"
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline"
import { InputPassword } from "@/ui/fields/InputPassword"
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout"
import { SelectCheckboxGroup } from "@/ui/fields/SelectCheckboxGroup"

export const RegisterUserPage = () => {

    const initialValues: UserRegisterForm = {
        firstname: '',
        lastname: '',
        email: '',
        dni: '',
        password: '',
        operator: false,
        secretary: false,
        admin: false
    }

    const { register, handleSubmit, setError, formState: { errors } } = useForm<UserRegisterForm>({
        defaultValues: initialValues
    })
    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: registerUser,
        onError: (error: GeneralError) => {
            if (error.type === 'FIELD_ERROR') {
                Object.entries(error.fields).forEach(([field, message]) => {
                    setError(field as keyof UserRegisterForm, {
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
            navigate('/users')
        }
    })


    const rolesGroup: { name: string, action: UseFormRegisterReturn }[] = [
        {
            name: 'Operador',
            action: register('operator')
        },
        {
            name: 'Secretario',
            action: register('secretary')
        },
        {
            name: 'Administrador',
            action: register('admin')
        }
    ]


    return (
        <EntityFormLayout>
            <EntityFormLayout.Header title="Registrar nuevo usuario"></EntityFormLayout.Header>
            <EntityFormLayout.Form styled onSubmit={handleSubmit((data) => mutate(data))}>
                <EntityFormLayout.Inputs>
                    <InputText
                        id="firstname"
                        label="Nombre"
                        placeholder="Nombres del usuario"
                        type="text"
                        errorMessage={errors.firstname}
                        functionEnabled={register('firstname')} />
                    <InputText
                        id="lastname"
                        label="Apellidos"
                        placeholder="Apellidos del usuario"
                        type="text"
                        errorMessage={errors.lastname}
                        functionEnabled={register('lastname')} />
                    <InputText
                        id="email"
                        label="Email"
                        placeholder="Correo del usuario"
                        type="text"
                        errorMessage={errors.email}
                        functionEnabled={register('email')} />
                    <InputText
                        id="dni"
                        label="DNI"
                        placeholder="DNI del usuario"
                        type="number"
                        max={8}
                        errorMessage={errors.dni}
                        functionEnabled={register('dni')}
                    />

                    <InputPassword
                        id="password"
                        label="Contraseña"
                        placeholder="Contraseña"
                        errorMessage={errors.password}
                        functionEnabled={register('password')} />


                    <SelectCheckboxGroup group={rolesGroup} label="Roles" />

                    {/* <label className="text-md font-bold">Roles</label>

                    <div className="flex flex-col gap-3 pt-2">
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

                    </div> */}

                </EntityFormLayout.Inputs>
                <EntityFormLayout.Actions>
                    <Button
                        icon={<ArrowUpCircleIcon />}
                        size="large"
                        text='Registrar'
                        type="submit"
                        color="green"
                        showIconOnMobile={false}
                        showTextOnMobile
                        isLargeOnMobile

                    />
                    <ButtonLink
                        icon={<XCircleIcon />}
                        size="large"
                        text="Cancelar"
                        color="gray"
                        to="/users"
                        showIconOnMobile={false}
                        showTextOnMobile
                        isLargeOnMobile
                    />

                </EntityFormLayout.Actions>
            </EntityFormLayout.Form>
        </EntityFormLayout>
    )
}