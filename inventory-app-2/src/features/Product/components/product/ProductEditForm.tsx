import { useNavigate } from 'react-router-dom';
import type { CategoryItem, ProductUpdateForm, TypeItem } from '../../types';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { updateProduct } from '../../api/ProductAPI';
import type { GeneralError } from '@/types/index';
import { toast } from 'sonner';
import { BaseForm } from '@/components/BaseForm';
import { Button } from '@/ui/Button';
import { InputText } from '@/ui/fields/InputText';
import { SelectOption } from '@/ui/fields/SelectOption';
import { listAllCategories } from '../../api/CategoryAPI';
import { listAllTypes } from '../../api/TypeAPI';
import { ButtonLink } from '@/ui/ButtonLink';
import { ArrowUpCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { TextMessage } from '@/components/TextMessage';

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

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
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
    const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
        queryKey: ['list-categories'],
        queryFn: listAllCategories
    })
    const { data: typesData, isLoading: typesLoading } = useQuery({
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

    // NO OLVIDAR esperar a que se cargue la lista para mostrarla en la vista del usuario
    if (categoriesLoading || typesLoading) {
        return <TextMessage text="Cargando..." align="left" color="black" />
    }

    return (
        <>
            <BaseForm
                title={`Editar producto #${productId}`}
                onSubmit={handleSubmit(handleForm)}
                inputsFields={
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
                        <Button icon={<ArrowUpCircleIcon />} size="large" text="Editar producto" type="submit" color="green" />
                        <ButtonLink icon={<XCircleIcon />} size="large" text="Cancelar" color="gray" to="/products" />
                    </>
                }

            />
        </>
    )
}

