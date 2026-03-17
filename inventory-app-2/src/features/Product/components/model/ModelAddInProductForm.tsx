import { useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { registerModelInProduct } from '../../api/ModelAPI';
import type { GeneralError } from '@/types/index'
import { toast } from 'sonner'
import { ListElementsContainer } from '@/views/ListElementsContainer'
import { BaseForm } from '@/components/BaseForm'
import { InputText } from '@/ui/fields/InputText'
import { InputDate } from '@/ui/fields/InputDate'
import { Button } from '@/ui/Button'
import { ButtonLink } from '@/ui/ButtonLink'
import { ArrowUpCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import type { ModelInProductForm } from '../../types';
import { UploadImage } from '@/ui/fields/UploadImage';

export const ModelAddInProductForm = () => {
    const { id } = useParams();
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const initialValues: ModelInProductForm = {
        name: '',
        // SELECCIONA LA FECHA DE HOY EN DIA (Valor por defecto), Tambien debe ser una fecha pasada o de hoy o ningun valor
        entryDate: new Date(new Date().setHours(12)).toISOString().split('T')[0], // 2026-03-11 -> String
        // La fecha de caducidad debe ser futura o ningun valor
        caducityDate: ''
    }


    const { register, handleSubmit, setError, control, formState: { errors } } = useForm<ModelInProductForm & { file: File }>({
        defaultValues: initialValues
    })
    const navigate = useNavigate();
    const location = useLocation();

    const { mutate } = useMutation({
        mutationFn: registerModelInProduct,
        onError: (error: GeneralError) => {
            console.log(error)
            // Error de campo
            if (error.type === 'FIELD_ERROR') {
                Object.entries(error.fields).forEach(([field, message]) => {
                    setError(field as keyof ModelInProductForm, {
                        type: 'server',
                        message: message as string,
                    })
                })

                console.log(error)
                toast.error(error.message)
                return
            }

            // Error general
            if (error.type === 'GENERAL_ERROR') {
                toast.error(error.message)
                return
            }
        },
        onSuccess: async (data) => {
            toast.success(data)
            navigate(`/products/${id}`)
        }
    })

    // EFECTO QUE SE EJECUTA SI HAY UNA IMAGEN QUE SE ESTA SUBIENDO
    return (
        <>
            <ListElementsContainer title={`Añadir nuevo modelo al producto ${location.pathname.split('/')[2]}`}>
                <BaseForm
                    onSubmit={handleSubmit((data) => {
                        mutate({
                            productId: id!,  // ← Add this line
                            data: data,
                            ...(file && { file })
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

                            <UploadImage id='file' label="Suba una imagen"
                                register={register('file')}
                                previewImage={preview}
                                setFile={setFile}
                                setPreview={setPreview}
                            />


                            {/* TODO: QUITAR EL TIPADO DE FILE */}
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
                            <Button icon={<ArrowUpCircleIcon />} size="large" text="Añadir modelo" type="submit" color="green" />
                            <ButtonLink icon={<XCircleIcon />} size="large" text="Cancelar" color="gray" to={`/products/${id}`} />
                        </>
                    }
                />
            </ListElementsContainer>

        </>
    )
}
