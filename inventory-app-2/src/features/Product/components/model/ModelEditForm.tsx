import { useNavigate } from 'react-router-dom';
import type { ModelInProductForm, ModelItem } from '../../types';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateModel } from '../../api/ModelAPI';
import type { GeneralError } from '@/types/index';
import { toast } from 'sonner';
import { ListElementsContainer } from '@/views/ListElementsContainer';
import { BaseForm } from '@/components/BaseForm';
import { InputText } from '@/ui/fields/InputText';
import { InputDate } from '@/ui/fields/InputDate';
import { ArrowUpCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/ui/Button';
import { ButtonLink } from '@/ui/ButtonLink';
import { useState } from 'react';
import { UploadImage } from '@/ui/fields/UploadImage';

type Props = {
    data: ModelItem & { file: File };
    modelId: string;
    productId: string;
}

export const ModelEditForm = ({ data, modelId, productId }: Props) => {
    const navigate = useNavigate();

    const { register, handleSubmit, setError, control, formState: { errors } } = useForm<ModelInProductForm & { file: File }>({
        defaultValues: {
            name: data.name,
            entryDate: data.entryDate,
            caducityDate: data.caducityDate
        }
    })

    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(data.imageUrl)



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


    const handleForm = (formData: ModelInProductForm & { file: File }) => {
        const data = {
            data: formData,
            modelId,
            ...(file && { file }) // Only include file if it exists
        }
        mutate(data)
    }


    return (
        <>
            <ListElementsContainer title={`Editar modelo ${modelId}`}>
                <BaseForm
                    onSubmit={handleSubmit((data) => {
                        handleForm({
                            ...data,
                            file: file || data.file // Use new file or original file
                        })
                    })}
                    inputs={
                        <>
                            <InputText
                                id="name"
                                label="Nombre"
                                placeholder="Nombre del modelo"
                                type="text"
                                errorMessage={errors.name}
                                functionEnabled={register('name')} />


                            {/* <input
                                type="file"
                                accept="image/*"
                                {...register("file", {
                                    onChange: (e) => {
                                        const selectedFile = e.target.files?.[0]

                                        if (selectedFile) {
                                            setFile(selectedFile)
                                            setPreview(URL.createObjectURL(selectedFile))
                                        }
                                    }
                                })}
                            />
                            {preview && (
                                <img
                                    src={preview}
                                    alt="preview"
                                    className="w-40 mt-2 rounded"
                                />
                            )} */}
                            <UploadImage id='file' label="Reemplazo de la imagen"
                                register={register('file')}
                                previewImage={preview}
                                setFile={setFile}
                                setPreview={setPreview}
                            />


                            <InputDate<ModelInProductForm & { file: File }>
                                id="entryDate"
                                label="Fecha de entrada del modelo"
                                name="entryDate"
                                control={control}
                                errorMessage={errors.entryDate?.message}
                            />
                            <InputDate<ModelInProductForm & { file: File }>
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
            </ListElementsContainer>

        </>
    )
}
