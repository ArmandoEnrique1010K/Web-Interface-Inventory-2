import { useNavigate } from 'react-router-dom';
import type { RegionForm } from '../../types';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRegion } from '../../api/RegionAPI';
import type { GeneralError } from '@/types/index';
import { toast } from 'sonner';
import { Button } from '@/ui/Button';
import { ButtonLink } from '@/ui/ButtonLink';
import { InputText } from '@/ui/fields/InputText';
import { ArrowUpCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { EntityFormLayout } from '@/components/FormModalLayout';

type Props = {
    data: RegionForm;
    regionId: string;
}


export const EditRegionPage = ({ data, regionId }: Props) => {
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
        <EntityFormLayout>
            <EntityFormLayout.Header title={`Editar región ${regionId}`}></EntityFormLayout.Header>
            <EntityFormLayout.Form onSubmit={handleSubmit(handleForm)}>
                <EntityFormLayout.Inputs>
                    <InputText
                        id="name"
                        label="Nombre"
                        placeholder="Nombre de la región"
                        type="text"
                        errorMessage={errors.name}
                        functionEnabled={register('name')} />
                </EntityFormLayout.Inputs>
                <EntityFormLayout.Actions>
                    <Button icon={<ArrowUpCircleIcon />} size="large" text="Editar región" type="submit" color="green" />
                    <ButtonLink icon={<XCircleIcon />} size="large" text="Volver" color="gray" to="/locations/regions" />
                </EntityFormLayout.Actions>
            </EntityFormLayout.Form>
        </EntityFormLayout>
    )
}
