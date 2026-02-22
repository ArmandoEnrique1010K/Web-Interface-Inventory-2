import type { AuthForgotUserPasswordForm } from '../types'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { forgotUserPassword } from '../api/AuthAPI'
import { toast } from 'sonner'
import { InputText } from '@/shared/ui/InputText'
import { Button } from '@/shared/ui/Button'

export const ForgotUserPasswordForm = () => {

    const initialValues: AuthForgotUserPasswordForm = {
        email: '',
    }

    const { register, handleSubmit, setError, formState: { errors } } = useForm<AuthForgotUserPasswordForm>({
        defaultValues: initialValues
    })

    const navigate = useNavigate()

    const { mutate } = useMutation({
        mutationFn: forgotUserPassword,
        onError: (error: any) => {
            if (error.type === 'FIELD_ERROR') {
                Object.entries(error.fields).forEach(([field, message]) => {
                    setError(field as keyof AuthForgotUserPasswordForm, {
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
        onSuccess: (data) => {
            toast.success(data)
            navigate('/validate-token')
        }
    })



    return (
        <div className="flex flex-col items-center w-full align-center justify-center sm:p-10 p-6">
            <h1 className="text-4xl font-bold pb-8 w-full text-center">Reestablecer contraseña</h1>
            <form onSubmit={handleSubmit((data) => mutate(data))} className="w-full" autoComplete="off">
                <p className='pb-6 w-full'>
                    Introduce tu correo electrónico  y te enviaremos un token de 6 digitos para que puedas reestablecer tu contraseña.
                </p>

                <InputText
                    id="email"
                    label="Correo"
                    placeholder="Introduce tu correo actual"
                    type="email"
                    errorMessage={errors.email}
                    functionEnabled={register('email')} />


                <Button text="Enviar un token" type="submit" color="bg-green-800 " hoverColor="hover:bg-green-700" />

                <hr className="my-8 border-gray-700" />

                <div className="text-center">
                    <span className="text-gray-700">Si recuerdas tu contraseña anterior, </span>
                    <Link to="/" className="text-green-700 cursor-pointer"> Haz clic aqui para iniciar sesión</Link>
                </div>
            </form>
        </div>
    )
}