import { useNavigate } from 'react-router-dom';
import type { CategoryItem, ProductUpdateForm, TypeItem } from '../../types';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { updateProduct } from '../../api/ProductAPI';
import type { GeneralError } from '@/types/index';
import { toast } from 'sonner';
import { TextMessage } from '@/components/TextMessage';
import { BaseForm } from '@/components/BaseForm';
import { TitleContainer } from '@/components/TitleContainer';
import { Button } from '@/ui/Button';
import { InputText } from '@/ui/InputText';
import { SelectOption } from '@/ui/SelectOption';
import { listAllCategories } from '../../api/CategoryAPI';
import { listAllTypes } from '../../api/TypeAPI';

type Props = {
    data: ProductUpdateForm;
    productId: string;
}

export const ProductEditForm = ({ data, productId }: Props) => {
    const navigate = useNavigate();

    const { register, handleSubmit, setError, formState: { errors } } = useForm<ProductUpdateForm>({
        defaultValues: {
            name: data.name,
            length: data.length,
            width: data.width,
            height: data.height,
            categoryId: data.categoryId,
            typeId: data.typeId,
        }
    })
    console.log(data.categoryId);

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: updateProduct,
        onError: (error: GeneralError) => {
            // Error de campo
            if (error.type === 'FIELD_ERROR') {
                Object.entries(error.fields).forEach(([field, message]) => {
                    setError(field as keyof ProductUpdateForm, {
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
            queryClient.invalidateQueries({ queryKey: ["list-products"] })
            queryClient.invalidateQueries({ queryKey: ["edit-product", productId] })
            toast.success(data)
            navigate("/products")
        }
    })

    const handleForm = (formData: ProductUpdateForm) => {
        const data = {
            formData,
            productId
        }
        mutate(data)
    }
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


    if (isPending) return <TextMessage text='Espere...' align='left' color='black' />

    return (
        <>
            <TitleContainer title={`Editar producto ${productId}`}>
                <BaseForm
                    onSubmit={handleSubmit(handleForm)}
                    inputs={
                        <>
                            <InputText
                                id="name"
                                label="Nombre"
                                placeholder="Nombre de la categoria"
                                type="text"
                                hasErrors={true}
                                errorMessage={errors.name}
                                functionEnabled={register('name')} />


                            <InputText
                                id="length"
                                label="Largo (cm.)"
                                placeholder="Medida del largo del producto en cm"
                                type="number"
                                hasErrors={true}
                                errorMessage={errors.length}
                                functionEnabled={register('length')} />

                            <InputText
                                id="width"
                                label="Ancho (cm.)"
                                placeholder="Medida del ancho del producto en cm"
                                type="number"
                                hasErrors={true}
                                errorMessage={errors.width}
                                functionEnabled={register('width')} />

                            <InputText
                                id="height"
                                label="Alto (cm.)"
                                placeholder="Medida de la altura del producto en cm"
                                type="number"
                                hasErrors={true}
                                errorMessage={errors.height}
                                functionEnabled={register('height')} />
                            <SelectOption
                                id="categoryId"
                                label="Categoria"
                                errorMessage={errors.categoryId}
                                functionEnabled={register('categoryId')}
                                options={categories}
                                hasErrors={true}
                                nullOption={true}
                                textInNullOption="Seleccione una categoria"
                            />

                            <SelectOption
                                id="typeId"
                                label="Tipo"
                                errorMessage={errors.typeId}
                                functionEnabled={register('typeId')}
                                options={types}
                                hasErrors={true}
                                nullOption={true}
                                textInNullOption="Seleccione un tipo"
                            />

                        </>
                    }
                    buttons={
                        <>
                            <Button size="large" text="Editar producto" type="submit" color="green" />
                            <Button size="large" text="Cancelar" type="link" color="gray" to="/products" />
                        </>
                    }

                />
            </TitleContainer>
        </>
    )
}

