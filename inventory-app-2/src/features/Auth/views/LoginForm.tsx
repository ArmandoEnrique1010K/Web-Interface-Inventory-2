import type { AuthLoginForm } from "../types"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { login } from "../api/AuthAPI"
import { toast } from "sonner"

export const LoginForm = () => {

    const initialValues: AuthLoginForm = {
        email: '',
        password: ''
    }

    const { register, handleSubmit, setError, formState: { errors } } = useForm<AuthLoginForm>({
        defaultValues: initialValues
    })

    const navigate = useNavigate()

    const { mutate } = useMutation({
        mutationFn: login,
        onError: (error: any) => {
            // toast.error(error.message)

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

            // 🔴 Error general
            if (error.type === 'GENERAL_ERROR') {
                toast.error(error.message)
            }


        },
        onSuccess: (data) => {
            toast.success(data)
            navigate('/dashboard')
        }
    })

    return (
        <div className="flex flex-col items-center space-y-8">
            <h1>LoginForm</h1>
            <form onSubmit={handleSubmit((data) => mutate(data))}>

                <input id="email" type="email" placeholder="email del usuario"
                    {...register('email')}
                />

                {errors.email?.message && (
                    <p className="text-red-500">{errors.email.message}</p>
                )}

                <input id="password" type="password" placeholder="contraseña del usuario"
                    {...register('password')}
                />

                {errors.password?.message && (
                    <p className="text-red-500">{errors.password.message}</p>
                )}

                <button type="submit">Iniciar sesión</button>

            </form>
        </div>
    )
}
{/* <InputText name="username" placeholder="Usuario" type="text"  /> */ }
