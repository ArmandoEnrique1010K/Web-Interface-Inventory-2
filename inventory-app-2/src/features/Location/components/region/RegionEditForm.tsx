import { useNavigate } from 'react-router-dom';
import type { RegionForm } from '../../types';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRegion } from '../../api/RegionAPI';
import type { GeneralError } from '@/types/index';
import { toast } from 'sonner';
import { BaseForm } from '@/components/BaseForm';
import { TitleContainer } from '@/components/TitleContainer';
import { Button } from '@/ui/Button';
import { ButtonLink } from '@/ui/ButtonLink';
import { InputText } from '@/ui/fields/InputText';
import { ArrowUpCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

type Props = {
    data: RegionForm;
    regionId: string;
}


export const RegionEditForm = ({ data, regionId }: Props) => {
    const navigate = useNavigate();

    const { register, handleSubmit, setError, formState: { errors } } = useForm<RegionForm>({
        defaultValues: {
            name: data.name
        }
    })

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: updateRegion,
        onError: (error: GeneralError) => {
            if (error.type === 'FIELD_ERROR') {
                Object.entries(error.fields).forEach(([field, message]) => {
                    setError(field as keyof RegionForm, {
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
            queryClient.invalidateQueries({ queryKey: ["list-regions"] })
            queryClient.invalidateQueries({ queryKey: ["edit-region", regionId] })
            toast.success(data)
            navigate("/locations/regions")
        }
    })

    const handleForm = (formData: RegionForm) => {
        const data = {
            formData,
            regionId
        }
        mutate(data)
    }

    return (
        <TitleContainer title={`Editar región ${regionId}`}>
            <BaseForm
                onSubmit={handleSubmit(handleForm)}
                buttons={
                    <>
                        <Button icon={<ArrowUpCircleIcon />} size="large" text="Editar región" type="submit" color="green" />
                        <ButtonLink icon={<XCircleIcon />} size="large" text="Volver" color="gray" to="/locations/regions" />
                    </>
                }
                inputs={
                    <InputText
                        id="name"
                        label="Nombre"
                        placeholder="Nombre de la región"
                        type="text"
                        errorMessage={errors.name}
                        functionEnabled={register('name')} />

                }
            />
        </TitleContainer>
    )
}
