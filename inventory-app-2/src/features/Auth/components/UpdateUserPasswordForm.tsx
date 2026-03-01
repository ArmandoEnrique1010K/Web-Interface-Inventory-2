import { useForm } from 'react-hook-form'
import type { AuthUpdateUserPasswordForm } from '../types'
import { useMutation } from '@tanstack/react-query'
import { updateUserPassword } from '../api/AuthAPI'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { InputText } from '@/ui/InputText'
import { useDispatch, useSelector } from 'react-redux'
import { updateSecretToken } from '@/reducers/authSlice'
import type { RootState } from '@/store/store'
import { AuthFormContainer } from '@/features/Auth/views/AuthFormContainer'
import type { GeneralError } from 'types'

export const UpdateUserPasswordForm = () => {
    const secretToken = useSelector((state: RootState) => state.auth.secretToken)

    const initialValues: AuthUpdateUserPasswordForm = {
        newPassword: '',
        confirmNewPassword: ''
    }

    const { register, handleSubmit, setError, formState: { errors } } = useForm<AuthUpdateUserPasswordForm>({
        defaultValues: initialValues
    })

    const navigate = useNavigate()

    const dispatch = useDispatch()


    const { mutate } = useMutation({
        mutationFn: (data: AuthUpdateUserPasswordForm) => updateUserPassword({
            resetToken: secretToken,
            newPassword: data.newPassword,
            confirmNewPassword: data.confirmNewPassword
        }),
        onError: (error: GeneralError) => {

            // Error de campo
            if (error.type === 'FIELD_ERROR') {
                Object.entries(error.fields).forEach(([field, message]) => {
                    setError(field as keyof AuthUpdateUserPasswordForm, {
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
            dispatch(updateSecretToken({ secretToken: "" }))
            navigate('/')
        }
    })


    return (

        <AuthFormContainer
            title="Introduce tu nueva contraseña"
            onSubmit={handleSubmit((data) => mutate(data))}
            inputs={
                <>
                    <InputText
                        id="newPassword"
                        label="Nueva contraseña"
                        placeholder="Introduce tu nueva contraseña"
                        type="password"
                        errorMessage={errors.newPassword}
                        hasErrors={true}
                        functionEnabled={register('newPassword')} />
                    <InputText
                        id="confirmNewPassword"
                        label="Confirma la nueva contraseña"
                        placeholder="Confirma la nueva contraseña"
                        type="password"
                        errorMessage={errors.confirmNewPassword}
                        hasErrors={true}
                        functionEnabled={register('confirmNewPassword')} />
                </>
            }
            buttonText='Cambiar contraseña'
            secondaryLink={{
                text: 'Necesitas un nuevo token de 6 digitos, ',
                to: '/restore-password',
                linkText: 'Haz clic aqui para obtenerlo'
            }}
        />
    )
}
