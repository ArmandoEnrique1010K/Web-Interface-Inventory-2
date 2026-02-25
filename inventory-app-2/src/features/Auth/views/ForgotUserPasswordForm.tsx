import type { AuthForgotUserPasswordForm } from '../types'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { forgotUserPassword } from '../api/AuthAPI'
import { toast } from 'sonner'
import { InputText } from '@/shared/ui/InputText'
import { Button } from '@/shared/ui/Button'
import { useDispatch } from 'react-redux'
import { updateSecretToken } from '@/reducers/authSlice'
import { AuthForm } from '../components/AuthForm'

export const ForgotUserPasswordForm = () => {

    const initialValues: AuthForgotUserPasswordForm = {
        email: '',
    }

    const { register, handleSubmit, setError, formState: { errors } } = useForm<AuthForgotUserPasswordForm>({
        defaultValues: initialValues
    })

    const navigate = useNavigate()

    const dispatch = useDispatch()

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
            toast.success(data?.data)
            dispatch(updateSecretToken({ secretToken: data!.requestId }))
            navigate('/validate-token')
        }
    })

    return (
        <AuthForm
            title="Reestablecer contraseña"
            onSubmit={handleSubmit((data) => mutate(data))}
            helpText='Introduce tu correo electrónico y te enviaremos un token de 6 digitos para que puedas reestablecer tu contraseña.'
            children={
                <>
                    <InputText
                        id="email"
                        label="Correo"
                        placeholder="Introduce tu correo actual"
                        type="email"
                        errorMessage={errors.email}
                        functionEnabled={register('email')} />


                    <Button text="Enviar un token" type="submit" aditionalStyles="mt-4 w-full bg-green-800 hover:bg-green-700" />
                </>
            }
            secondaryLink={{
                text: 'Si recuerdas tu contraseña anterior, ',
                to: '/',
                linkText: 'Haz clic aqui para iniciar sesión'
            }}
        />
    )
}