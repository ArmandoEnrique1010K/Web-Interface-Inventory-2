import type { AuthLoginForm } from "../types"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { currentSession, login } from "../api/AuthAPI"
import { toast } from "sonner"
import { InputText } from "@/ui/fields/InputText"
import { AuthFormContainer } from "@/features/Auth/views/AuthFormContainer"
import { useDispatch } from "react-redux"
import { setAuthenticated, setUserRoles } from '@/reducers/authSlice';
import type { GeneralError } from "types"
import { InputPassword } from "@/ui/fields/InputPassword"

export const LoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const initialValues: AuthLoginForm = {
        email: '',
        password: ''
    }

    const { register, handleSubmit, setError } = useForm<AuthLoginForm>({
        defaultValues: initialValues
    })


    const { mutate, isPending } = useMutation({
        mutationFn: login,
        onError: (error: GeneralError) => {
            // Error de campo
            if (error.type === 'FIELD_ERROR') {
                Object.entries(error.fields).forEach(([field, message]) => {
                    setError(field as keyof AuthLoginForm, {
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
            const userProfile = await currentSession()
            dispatch(setUserRoles(userProfile.data.roles))
            dispatch(setAuthenticated())
            navigate('/')
        }
    })

    return (
        <AuthFormContainer
            title="Inicio de sesión"
            onSubmit={handleSubmit((data) => mutate(data))}
            isPending={isPending}
            inputsFields={
                <>
                    <InputText
                        id="email"
                        label="Correo"
                        placeholder="Correo del usuario"
                        type="email"
                        functionEnabled={register('email')} />

                    <InputPassword
                        id="password"
                        label="Contraseña"
                        placeholder="Contraseña del usuario"
                        functionEnabled={register('password')} />
                </>
            }
            buttonText="Iniciar sesión"
            secondaryLink={{
                text: '¿Olvidastes tu contraseña?,',
                to: '/restore-password',
                linkText: 'haz clic aqui para cambiarla'
            }}
        />
    )
}
