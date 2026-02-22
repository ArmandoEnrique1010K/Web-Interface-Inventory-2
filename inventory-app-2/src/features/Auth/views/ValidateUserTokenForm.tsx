import { Link, useNavigate } from 'react-router-dom'
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
        <div className="flex flex-col items-center w-full align-center justify-center sm:p-10 p-6">
            <h1 className="text-4xl font-bold pb-8 w-full text-center">Introduce el token</h1>
            <form onSubmit={handleSubmit((data) => mutate(data))} className="w-full" autoComplete="off">
                <p className='pb-6 w-full'>
                    Introduce el token de 6 digitos que se envio a tu correo electrónico, para reestablecer tu contraseña.
                </p>

                <InputText
                    id="requestId"
                    type="hidden"
                    errorMessage={errors.requestId}
                    defaultValue={secretToken}
                    functionEnabled={register('requestId')}
                />

                <InputText
                    id="value"
                    label="Token"
                    placeholder="Introduce el token de 6 digitos"
                    type="number"
                    errorMessage={errors.value}
                    functionEnabled={register('value')} />


                <Button text="Validar el token" type="submit" color="bg-green-800 " hoverColor="hover:bg-green-700" />

                <hr className="my-8 border-gray-700" />

                <div className="text-center">
                    <span className="text-gray-700">Necesitas un nuevo token de 6 digitos, </span>
                    <Link to="/restore-password" className="text-green-700 cursor-pointer"> Haz clic aqui para obtenerlo</Link>
                </div>
            </form>
        </div>
    )
}
