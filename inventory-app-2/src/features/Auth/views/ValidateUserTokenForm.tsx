import { useNavigate } from 'react-router-dom'
import type { AuthValidateUserTokenForm } from '../types'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { validateUserToken } from '../api/AuthAPI'
import { toast } from 'sonner'
import { InputText } from '@/ui/fields/InputText'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { updateSecretToken } from '@/reducers/authSlice'
import type { GeneralError } from 'types'
import { AuthFormLayout } from '../layout/AuthFormLayout'

export const ValidateUserTokenForm = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const secretToken = useSelector((state: RootState) => state.auth.secretToken)

    const initialValues: AuthValidateUserTokenForm = {
        value: '',
    }

    const { register, handleSubmit, setError, formState: { errors } } = useForm<AuthValidateUserTokenForm>({
        defaultValues: initialValues
    })


    const { mutate, isPending } = useMutation({
        mutationFn: (data: AuthValidateUserTokenForm) => validateUserToken({
            requestId: secretToken,
            value: data.value
        }),
        onError: (error: GeneralError) => {
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

        <AuthFormLayout>
            <AuthFormLayout.Header title="Introduce el token">
            </AuthFormLayout.Header>
            <AuthFormLayout.Form
                isPending={isPending}
                buttonText="Validar token"
                onSubmit={handleSubmit((data) => mutate(data))}
            >
                {/*  NO SE PERMITE EL USO DE INPUT DE TIPO HIDDEN */}
                {/* <InputText
                   id="requestId"
                   type="hidden"
                   errorMessage={errors.requestId}
                   defaultValue={secretToken}
                   functionEnabled={register('requestId')}
               /> */}

                <InputText
                    id="value"
                    label="Token"
                    placeholder="Introduce el token de 6 digitos"
                    type="number"
                    errorMessage={errors.value}
                    functionEnabled={register('value')}
                    // Se limita a 6 digitos
                    max={6} />
            </AuthFormLayout.Form>
            <AuthFormLayout.Link
                text='Necesitas un nuevo token de 6 digitos'
                to='/restore-password'
                linkText='haz clic aqui para obtenerlo'
            ></AuthFormLayout.Link>
        </AuthFormLayout>


    )
}