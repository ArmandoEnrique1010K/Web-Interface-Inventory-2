import { useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { registerModelInProduct, type ModelRequest } from '../../api/ModelAPI';
import type { GeneralError } from '@/types/index'
import { toast } from 'sonner'
import { TitleContainer } from '@/components/TitleContainer'
import { BaseForm } from '@/components/BaseForm'
import { InputText } from '@/ui/fields/InputText'
import { InputDate } from '@/ui/fields/InputDate'
import { Button } from '@/ui/Button'
import { ButtonLink } from '@/ui/ButtonLink'
import { ArrowUpCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export const ModelAddInProductForm = () => {
    const { id } = useParams();
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const initialValues: ModelRequest = {
        name: '',
        // SELECCIONA LA FECHA DE HOY EN DIA
        entryDate: new Date(new Date().setHours(12)).toISOString().split('T')[0],
        caducityDate: '' // new Date(new Date().setHours(12)).toISOString().split('T')[0],
    }

    const { register, handleSubmit, setError, control, formState: { errors } } = useForm<ModelRequest & { file: File }>({
        defaultValues: initialValues
    })
    const navigate = useNavigate();
    const location = useLocation();

    const { mutate } = useMutation({
        mutationFn: (data: ModelRequest) => registerModelInProduct(id!, data, file as File),
        onError: (error: GeneralError) => {
            console.log(error)
            // Error de campo
            if (error.type === 'FIELD_ERROR') {
                Object.entries(error.fields).forEach(([field, message]) => {
                    setError(field as keyof ModelRequest, {
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


    return (
        <>
            <TitleContainer title={`Añadir nuevo modelo al producto ${location.pathname.split('/')[2]}`}>
                <BaseForm
                    onSubmit={handleSubmit((data) => {

                        const formatDate = (date: Date | null) =>
                            date ? date.toISOString().split("T")[0] : null;

                        const payload: ModelRequest = {
                            ...data,
                            entryDate: formatDate(data.entryDate as unknown as Date),
                            caducityDate: formatDate(data.caducityDate as unknown as Date)
                        }

                        mutate(payload)
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


                            {/* TODO: CAMPO DE PRUEBA, ELIMINARLO */}
                            {/* <InputText
                                id="imageUrl"
                                label="URL de la imagen"
                                placeholder="URL de la imagen"
                                type="text"
                                errorMessage={errors.imageUrl}
                                functionEnabled={register('imageUrl')} /> */}
                            <input
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
                            )}

                            {/* TODO: QUITAR EL TIPADO DE FILE */}
                            <InputDate<ModelRequest & { file: File }>
                                id="entryDate"
                                label="Fecha de entrada del modelo"
                                name="entryDate"
                                control={control}
                                errorMessage={errors.entryDate?.message}
                            />

                            {/* TODO: PROBLEMA CON LA FECHA DE CADUCIDAD */}
                            <InputDate<ModelRequest & { file: File }>
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
            </TitleContainer>

        </>
    )
}
