import { useForm } from 'react-hook-form'
import type { AuthUpdateUserPasswordForm } from '../types'
import { useMutation } from '@tanstack/react-query'
import { updateUserPassword } from '../api/AuthAPI'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { InputText } from '@/shared/ui/InputText'
import { Button } from '@/shared/ui/Button'
import { useDispatch, useSelector } from 'react-redux'
import { updateSecretToken } from '@/reducers/authSlice'
import type { RootState } from '@/store/store'
import { AuthForm } from '../components/AuthForm'

export const UpdateUserPasswordForm = () => {
    const secretToken = useSelector((state: RootState) => state.auth.secretToken)

    const initialValues: AuthUpdateUserPasswordForm = {
        resetToken: secretToken,
        newPassword: '',
        confirmNewPassword: ''
    }

    const { register, handleSubmit, setError, formState: { errors } } = useForm<AuthUpdateUserPasswordForm>({
        defaultValues: initialValues
    })

    const navigate = useNavigate()

    const dispatch = useDispatch()


    const { mutate } = useMutation({
        mutationFn: updateUserPassword,
        onError: (error: any) => {

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

        <AuthForm
            title="Introduce tu nueva contraseña"
            onSubmit={handleSubmit((data) => mutate(data))}
            children={
                <>
                    <InputText
                        id="resetToken"
                        type="hidden"
                        errorMessage={errors.resetToken}
                        functionEnabled={register('resetToken')} />

                    <InputText
                        id="newPassword"
                        label="Nueva contraseña"
                        placeholder="Introduce tu nueva contraseña"
                        type="password"
                        errorMessage={errors.newPassword}
                        functionEnabled={register('newPassword')} />
                    <InputText
                        id="confirmNewPassword"
                        label="Confirma la nueva contraseña"
                        placeholder="Confirma la nueva contraseña"
                        type="password"
                        errorMessage={errors.confirmNewPassword}
                        functionEnabled={register('confirmNewPassword')} />


                    <Button size="large" text="Cambiar contraseña" type="submit" aditionalStyles="mt-4 w-full bg-green-800 hover:bg-green-700" />
                </>
            }
            secondaryLink={{
                text: 'Necesitas un nuevo token de 6 digitos, ',
                to: '/restore-password',
                linkText: 'Haz clic aqui para obtenerlo'
            }}
        />
    )
}
