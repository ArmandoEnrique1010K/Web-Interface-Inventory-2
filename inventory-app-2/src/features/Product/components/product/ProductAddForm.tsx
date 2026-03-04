import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { CategoryItem, ProductCreateForm, TypeItem } from "../../types";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { GeneralError } from "@/types/index";
import { registerProduct } from "../../api/ProductAPI";
import { toast } from "sonner";
import { TitleContainer } from "@/components/TitleContainer";
import { BaseForm } from "@/components/BaseForm";
import { InputText } from "@/ui/fields/InputText";
import { Button } from "@/ui/Button";
import { InputDate } from "@/ui/fields/InputDate";
import { SelectOption } from "@/ui/fields/SelectOption";
import { listAllCategories } from "../../api/CategoryAPI";
import { listAllTypes } from "../../api/TypeAPI";
import { ButtonLink } from "@/ui/ButtonLink";

export const ProductAddForm = () => {

    const initialValues: ProductCreateForm = {
        name: '',
        length: '0',
        width: '0',
        height: '0',
        modelName: '',
        modelImageUrl: '',
        // SELECCIONA LA FECHA DE HOY EN DIA
        modelEntryDate: new Date(new Date().setHours(12)).toISOString().split('T')[0],
        modelCaducityDate: new Date(new Date().setHours(12)).toISOString().split('T')[0],
        categoryId: '',
        typeId: '',
    }
    const { register, handleSubmit, setError, control, formState: { errors } } = useForm<ProductCreateForm>({
        defaultValues: initialValues
    })

    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: registerProduct,
        onError: (error: GeneralError) => {
            // toast.error(error.message)
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
        <>
            <TitleContainer title="Añadir nuevo producto">
                <BaseForm
                    onSubmit={handleSubmit((data) => {
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
                                type="number"
                                errorMessage={errors.length}
                                functionEnabled={register('length')} />

                            <InputText
                                id="width"
                                label="Ancho (cm.)"
                                placeholder="Medida del ancho del producto en cm"
                                type="number"
                                errorMessage={errors.width}
                                functionEnabled={register('width')} />

                            <InputText
                                id="height"
                                label="Alto (cm.)"
                                placeholder="Medida de la altura del producto en cm"
                                type="number"
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

                        </>
                    }
                    buttons={
                        <>
                            <Button size="large" text="Añadir producto" type="submit" color="green" />
                            <ButtonLink size="large" text="Cancelar" color="gray" to="/products" />
                        </>
                    }
                />
            </TitleContainer>

        </>
    )
}
