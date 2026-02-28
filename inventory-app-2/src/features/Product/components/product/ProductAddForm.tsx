import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { ProductCreateForm } from "../../types";
import { TextMessage } from "@/components/TextMessage";
import { useMutation } from "@tanstack/react-query";
import type { GeneralError } from "@/types/index";
import { registerProduct } from "../../api/ProductAPI";
import { toast } from "sonner";
import { TitleContainer } from "@/components/TitleContainer";
import { BaseForm } from "@/components/BaseForm";
import { InputText } from "@/ui/InputText";
import { Button } from "@/ui/Button";
import { InputDate } from "@/ui/InputDate";

export const ProductAddForm = () => {

    const initialValues: ProductCreateForm = {
        name: '',
        length: '',
        width: '',
        height: '',
        modelName: '',
        modelImageUrl: '',
        modelEntryDate: new Date(),
        modelCaducityDate: new Date(),
        categoryId: 0,
        typeId: 0,
    }
    const { register, handleSubmit, setError, control, formState: { errors } } = useForm<ProductCreateForm>({
        defaultValues: initialValues
    })

    const navigate = useNavigate();

    const { mutate, isPending } = useMutation({
        mutationFn: registerProduct,
        onError: (error: GeneralError) => {
            // toast.error(error.message)

            // Error de campo
            if (error.type === 'FIELD_ERROR') {
                Object.entries(error.fields).forEach(([field, message]) => {
                    setError(field as keyof ProductCreateForm, {
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
        onSuccess: async (data) => {
            toast.success(data)
            navigate('/products/categories')
            console.log(data)
        }
    })

    if (isPending) return <TextMessage text='Espere...' align='left' color='black' />


    return (
        <>
            <TitleContainer title="Añadir nuevo producto">
                <BaseForm
                    onSubmit={handleSubmit((data) => {
                        // TODO: DEPURACIÓN, ELIMINAR ESTO
                        console.log('Datos del formulario:', data);
                        mutate(data)
                    })}
                    inputs={
                        <>
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
                                placeholder="Medida del largo del producto en cm"
                                type="text"
                                errorMessage={errors.length}
                                functionEnabled={register('length')} />

                            <InputText
                                id="width"
                                label="Ancho (cm.)"
                                placeholder="Medida del ancho del producto en cm"
                                type="text"
                                errorMessage={errors.width}
                                functionEnabled={register('width')} />

                            <InputText
                                id="height"
                                label="Alto (cm.)"
                                placeholder="Medida de la altura del producto en cm"
                                type="text"
                                errorMessage={errors.height}
                                functionEnabled={register('height')} />

                            <InputText
                                id="modelName"
                                label="Nombre del modelo"
                                placeholder="Nombre del modelo"
                                type="text"
                                errorMessage={errors.modelName}
                                functionEnabled={register('modelName')} />

                            {/* TODO: CAMPO DE PRUEBA, ELIMINARLO */}
                            <InputText
                                id="modelImageUrl"
                                label="URL de la imagen"
                                placeholder="URL de la imagen"
                                type="text"
                                errorMessage={errors.modelImageUrl}
                                functionEnabled={register('modelImageUrl')} />


                            {/* TODO: AÑADIR 1 CAMPO PARA SUBIR UNA IMAGEN, 2 CAMPOS PARA FECHAS Y 2 CAMPOS PARA SELECCIONAR UN ID DE CATEGORIA Y TIPO */}

                            <InputDate<ProductCreateForm>
                                id="modelEntryDate"
                                label="Fecha de entrada del modelo"
                                name="modelEntryDate"
                                control={control}
                                errorMessage={errors.modelEntryDate?.message}
                            />
                            <InputDate<ProductCreateForm>
                                id="modelCaducityDate"
                                label="Fecha de caducidad del modelo"
                                name="modelCaducityDate"
                                control={control}
                                errorMessage={errors.modelCaducityDate?.message}
                            />
                            <InputText
                                id="categoryId"
                                label="ID de la categoria"
                                placeholder="ID de la categoria"
                                type="number"
                                errorMessage={errors.categoryId}
                                functionEnabled={register('categoryId')} />
                            <InputText
                                id="typeId"
                                label="ID del tipo"
                                placeholder="ID del tipo"
                                type="number"
                                errorMessage={errors.typeId}
                                functionEnabled={register('typeId')} />

                        </>
                    }
                    buttons={
                        <>
                            <Button size="large" text="Añadir producto" type="submit" color="green" />
                            <Button size="large" text="Cancelar" type="link" color="gray" to="/products" />
                        </>
                    }
                />
            </TitleContainer>

        </>
    )
}
