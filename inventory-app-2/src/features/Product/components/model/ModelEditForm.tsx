import { useNavigate } from 'react-router-dom';
import type { ModelInProductForm } from '../../types';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateModel } from '../../api/ModelAPI';
import type { GeneralError } from '@/types/index';
import { toast } from 'sonner';
import { TitleContainer } from '@/components/TitleContainer';
import { BaseForm } from '@/components/BaseForm';
import { InputText } from '@/ui/fields/InputText';
import { InputDate } from '@/ui/fields/InputDate';
import { ArrowUpCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/ui/Button';
import { ButtonLink } from '@/ui/ButtonLink';

type Props = {
    data: ModelInProductForm;
    modelId: string;
    productId: string;
}

export const ModelEditForm = ({ data, modelId, productId }: Props) => {
    const navigate = useNavigate();

    const { register, handleSubmit, setError, control, formState: { errors } } = useForm<ModelInProductForm>({
        defaultValues: {
            name: data.name,
            imageUrl: data.imageUrl,
            entryDate: data.entryDate,
            caducityDate: data.caducityDate
        }
    })

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: updateModel,
        onError: (error: GeneralError) => {
            // Error de campo
            if (error.type === 'FIELD_ERROR') {
                Object.entries(error.fields).forEach(([field, message]) => {
                    setError(field as keyof ModelInProductForm, {
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
            queryClient.invalidateQueries({ queryKey: ["list-models"] })
            queryClient.invalidateQueries({ queryKey: ["edit-model", modelId] })
            toast.success(data)
            navigate(`/products/${productId}?modelId=${modelId}`)
        }
    })

    const handleForm = (formData: ModelInProductForm) => {
        const data = {
            formData,
            modelId
        }
        mutate(data)
    }


    return (
        <>
            <TitleContainer title={`Editar modelo ${modelId}`}>
                <BaseForm
                    onSubmit={handleSubmit(handleForm)}
                    inputs={
                        <>
                            <InputText
                                id="name"
                                label="Nombre"
                                placeholder="Nombre del modelo"
                                type="text"
                                errorMessage={errors.name}
                                functionEnabled={register('name')} />
                            <InputText
                                id="imageUrl"
                                label="Imagen"
                                placeholder="Imagen del modelo"
                                type="text"
                                errorMessage={errors.imageUrl}
                                functionEnabled={register('imageUrl')} />
                            <InputDate<ModelInProductForm>
                                id="entryDate"
                                label="Fecha de entrada del modelo"
                                name="entryDate"
                                control={control}
                                errorMessage={errors.entryDate?.message}
                            />
                            <InputDate<ModelInProductForm>
                                id="caducityDate"
                                label="Fecha de caducidad del modelo"
                                name="caducityDate"
                                control={control}
                                errorMessage={errors.caducityDate?.message}
                            />


                        </>
                    }
                    buttons={
                        <>
                            <Button icon={<ArrowUpCircleIcon />} size="large" text="Editar modelo" type="submit" color="green" />
                            <ButtonLink icon={<XCircleIcon />} size="large" text="Cancelar" color="gray" to={`/products/${productId}`} />
                        </>
                    }

                />
            </TitleContainer>

        </>
    )
}
