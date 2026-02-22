import type { AuthLoginForm } from "../types"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { login } from "../api/AuthAPI"
import { toast } from "sonner"
import { InputText } from "@/shared/ui/InputText"
import { Button } from "@/shared/ui/Button"

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
        onSuccess: (data) => {
            toast.success(data)
            navigate('/dashboard')
        }
    })

    return (
        <div className="flex flex-col items-center w-full align-center justify-center sm:p-10 p-6">
            <h1 className="text-4xl font-bold pb-8 w-full text-center">Inicio de sesión</h1>
            <form onSubmit={handleSubmit((data) => mutate(data))} className="w-full" autoComplete="off">
                <InputText
                    id="email"
                    label="Correo"
                    placeholder="Correo del usuario"
                    type="email"
                    errorMessage={errors.email}
                    functionEnabled={register('email')} />

                <InputText
                    id="password"
                    label="Contraseña"
                    placeholder="Contraseña del usuario"
                    type="password"
                    errorMessage={errors.password}
                    functionEnabled={register('password')} />

                <Button text="Iniciar sesión" type="submit" color="bg-green-800 " hoverColor="hover:bg-green-700" />

                <hr className="my-8 border-gray-700" />

                <div className="text-center">
                    <span className="text-gray-700">¿Olvidastes tu contraseña?</span>
                    <Link to="/restore-password" className="text-green-700 cursor-pointer"> Haz clic aqui para cambiarla</Link>
                </div>

            </form>
        </div>
    )
}
