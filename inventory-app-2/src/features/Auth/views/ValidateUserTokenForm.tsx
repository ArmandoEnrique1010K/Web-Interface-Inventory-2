import { useNavigate } from 'react-router-dom'
import type { AuthValidateUserTokenForm } from '../types'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { validateUserToken } from '../api/AuthAPI'
import { toast } from 'sonner'
import { InputText } from '@/shared/ui/InputText'
import { Button } from '@/shared/ui/Button'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { updateSecretToken } from '@/reducers/authSlice'
import { AuthForm } from '../components/AuthForm'

export const ValidateUserTokenForm = () => {
    const secretToken = useSelector((state: RootState) => state.auth.secretToken)

    const initialValues: AuthValidateUserTokenForm = {
        requestId: secretToken,
        value: '',
    }

    const { register, handleSubmit, setError, formState: { errors } } = useForm<AuthValidateUserTokenForm>({
        defaultValues: initialValues
    })

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const { mutate } = useMutation({
        mutationFn: validateUserToken,
        onError: (error: any) => {
            if (error.type === 'FIELD_ERROR') {
                Object.entries(error.fields).forEach(([field, message]) => {
                    setError(field as keyof AuthValidateUserTokenForm, {
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
            toast.success(data?.data);
            dispatch(updateSecretToken({ secretToken: data!.resetToken }))
            navigate('/update-password')
        }
    })



    return (
        <AuthForm
            title="Introduce el token"
            onSubmit={handleSubmit((data) => mutate(data))}
            helpText='Introduce el token de 6 digitos que se envio a tu correo electrónico, para reestablecer tu contraseña.'
            children={
                <>
                    <InputText
                        id="requestId"
                        type="hidden"
                        errorMessage={errors.requestId}
                        defaultValue={secretToken}
                        functionEnabled={register('requestId')}
                    />

                    {/* TODO: EN ALGUNA FUTURA ACTUALIZACION, SE PODRIA UTILIZAR CHACKRA UI PARA LIMITAR A 6 DIGITOS */}
                    <InputText
                        id="value"
                        label="Token"
                        placeholder="Introduce el token de 6 digitos"
                        type="number"
                        errorMessage={errors.value}
                        functionEnabled={register('value')} />

                    <Button text="Validar token" type="submit" aditionalStyles="mt-4 w-full bg-green-800 hover:bg-green-700" />
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
