import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { CategoryItem, ProductCreateForm, TypeItem } from "../../types";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { GeneralError } from "@/types/index";
import { registerProduct } from "../../api/ProductAPI";
import { toast } from "sonner";
import { BaseForm } from "@/components/BaseForm";
import { InputText } from "@/ui/fields/InputText";
import { Button } from "@/ui/Button";
import { InputDate } from "@/ui/fields/InputDate";
import { SelectOption } from "@/ui/fields/SelectOption";
import { listAllCategories } from "../../api/CategoryAPI";
import { listAllTypes } from "../../api/TypeAPI";
import { ButtonLink } from "@/ui/ButtonLink";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { UploadImage } from "@/ui/fields/UploadImage";
import { Subtitle } from "@/components/Subtitle";

export const ProductAddForm = () => {
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)

    const initialValues: ProductCreateForm = {
        name: '',
        length: '',
        width: '',
        height: '',
        modelName: '',
        // SELECCIONA LA FECHA DE HOY EN DIA
        modelEntryDate: new Date(new Date().setHours(12)).toISOString().split('T')[0],
        modelCaducityDate: '', //new Date(new Date().setHours(12)).toISOString().split('T')[0],
        categoryId: '',
        typeId: '',
    }
    const { register, handleSubmit, setError, control, formState: { errors } } = useForm<ProductCreateForm & { file: File }>({
        defaultValues: initialValues
    })

    const navigate = useNavigate();

    const { mutate, isPending } = useMutation({
        mutationFn: registerProduct,
        onError: (error: GeneralError) => {
            console.log(error)
            // Error de campo
            if (error.type === 'FIELD_ERROR') {
                Object.entries(error.fields).forEach(([field, message]) => {
                    setError(field as keyof ProductCreateForm, {
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
            navigate('/products')
        }
    })

    // TODO: EN ALGUNA FUTURA ACTUALIZACION SE PUEDE HACER QUE SE MUESTRE UNA NOTIFICACION MIENTRAS SE SUBE LA IMAGEN
    const { data: categoriesData } = useQuery({
        queryKey: ['list-categories'],
        queryFn: listAllCategories
    })
    const { data: typesData } = useQuery({
        queryKey: ['list-types'],
        queryFn: listAllTypes
    })

    const categories = categoriesData?.map((category: CategoryItem) => ({
        value: category.id,
        label: category.name,
    })) || []


    const types = typesData?.map((type: TypeItem) => ({
        value: type.id,
        label: type.name,
    })) || []


    return (
        <BaseForm
            title="Añadir nuevo producto"
            onSubmit={handleSubmit((data) => {

                mutate({
                    data: data,
                    ...(file && { file })
                })
            })}
            inputsFields={
                <>
                    <div className="pb-2">
                        <Subtitle>Producto</Subtitle>
                    </div>
                    <InputText
                        id="name"
                        label="Nombre"
                        placeholder="Nombre del producto"
                        type="text"
                        errorMessage={errors.name}
                        functionEnabled={register('name')} />

                    <InputText
                        id="length"
                        label="Largo (cm.)"
                        placeholder="Medida del largo"
                        type="number"
                        errorMessage={errors.length}
                        functionEnabled={register('length')} />

                    <InputText
                        id="width"
                        label="Ancho (cm.)"
                        placeholder="Medida del ancho"
                        type="number"
                        errorMessage={errors.width}
                        functionEnabled={register('width')} />

                    <InputText
                        id="height"
                        label="Alto (cm.)"
                        placeholder="Medida de la altura"
                        type="number"
                        errorMessage={errors.height}
                        functionEnabled={register('height')} />

                    <hr className="my-6 border-slate-200" />
                    <div className="pb-2">
                        <Subtitle>Primer modelo</Subtitle>
                    </div>

                    <InputText
                        id="modelName"
                        label="Nombre"
                        placeholder="Nombre del modelo"
                        type="text"
                        errorMessage={errors.modelName}
                        functionEnabled={register('modelName')} />

                    {/** NOTA: SI NO SUBE UNA FECHA DE ENTRADA, SE ESTABLECERA LA FECHA DE HOY DIA */}
                    <InputDate<ProductCreateForm & { file: File }>
                        id="modelEntryDate"
                        label="Fecha de entrada"
                        name="modelEntryDate"
                        control={control}
                        errorMessage={errors.modelEntryDate?.message}
                    />
                    <InputDate<ProductCreateForm & { file: File }>
                        id="modelCaducityDate"
                        label="Fecha de caducidad"
                        name="modelCaducityDate"
                        control={control}
                        errorMessage={errors.modelCaducityDate?.message}
                    />

                    <SelectOption
                        id="categoryId"
                        label="Categoria"
                        errorMessage={errors.categoryId}
                        functionEnabled={register('categoryId')}
                        options={categories}
                        textInNullOption="Seleccione una categoria"
                    />

                    <SelectOption
                        id="typeId"
                        label="Tipo"
                        errorMessage={errors.typeId}
                        functionEnabled={register('typeId')}
                        options={types}
                        textInNullOption="Seleccione un tipo"
                    />
                    {/* INPUT DE TIPO IMAGE ANTES DE SEPARARLO EN UN COMPONENTE APARTE */}

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

                    {/* Componente para cargar la imagen, contiene el boton y la previsualizacion de la imagen */}
                    <UploadImage id='file' label="Imagen"
                        register={register('file')}
                        previewImage={preview}
                        setFile={setFile}
                        setPreview={setPreview}

                    />

                </>
            }
            buttons={
                <>
                    <Button icon={<ArrowUpCircleIcon />} disabled={isPending} size="large" text="Añadir producto" type="submit" color="green" />
                    <ButtonLink icon={<XCircleIcon />} size="large" text="Cancelar" color="gray" to="/products" />
                </>
            }
        />

    )
}
