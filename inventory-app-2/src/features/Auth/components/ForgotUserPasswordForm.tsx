import type { AuthForgotUserPasswordForm } from '../types'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { forgotUserPassword } from '../api/AuthAPI'
import { toast } from 'sonner'
import { InputText } from '@/ui/InputText'
import { useDispatch } from 'react-redux'
import { updateSecretToken } from '@/reducers/authSlice'
import { AuthFormContainer } from '@/features/Auth/views/AuthFormContainer'
import type { GeneralError } from 'types'

export const ForgotUserPasswordForm = () => {

    const initialValues: AuthForgotUserPasswordForm = {
        email: '',
    }

    const { register, handleSubmit, setError, formState: { errors } } = useForm<AuthForgotUserPasswordForm>({
        defaultValues: initialValues
    })

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const { mutate, isPending } = useMutation({
        mutationFn: forgotUserPassword,
        onError: (error: GeneralError) => {
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
            // requestAnimationFrame(() => {
            //     navigate('/validate-token')
            // })
            navigate('/validate-token')
        }
    })

    return (
        <AuthFormContainer
            title="Reestablecer contraseña"
            onSubmit={handleSubmit((data) => mutate(data))}
            isPending={isPending}
            helpText='Introduce tu correo electrónico y te enviaremos un token de 6 digitos para que puedas reestablecer tu contraseña.'
            inputs={
                <>
                    <InputText
                        id="email"
                        label="Correo"
                        placeholder="Introduce tu correo actual"
                        type="email"
                        hasErrors={true}
                        errorMessage={errors.email}
                        functionEnabled={register('email')} />
                </>
            }
            buttonText='Enviar un token'
            secondaryLink={
                {
                    text: 'Si recuerdas tu contraseña anterior, ',
                    to: '/',
                    linkText: 'Haz clic aqui para iniciar sesión'
                }
            }
        />
    )
}