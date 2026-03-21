import { useNavigate } from "react-router-dom";
import type { RegionItem, SubregionForm } from "../../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import type { GeneralError } from "@/types/index";
import { updateSubregion } from "../../api/SubregionAPI";
import { toast } from "sonner";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@/ui/Button";
import { ButtonLink } from "@/ui/ButtonLink";
import { InputText } from "@/ui/fields/InputText";
import { SelectOption } from "@/ui/fields/SelectOption";
import { listAllRegions } from "../../api/RegionAPI";
import { TextMessage } from "@/components/TextMessage";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";


type Props = {
    data: SubregionForm;
    subregionId: string;
}

export const EditSubregionPage = ({ data, subregionId }: Props) => {
    const navigate = useNavigate();

    const { register, handleSubmit, setError, formState: { errors } } = useForm<SubregionForm>({
        defaultValues: {
            name: data.name,
            regionId: data.regionId
        }
    })

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: updateSubregion,
        onError: (error: GeneralError) => {
            if (error.type === 'FIELD_ERROR') {
                Object.entries(error.fields).forEach(([field, message]) => {
                    setError(field as keyof SubregionForm, {
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
            queryClient.invalidateQueries({ queryKey: ["list-subregions"] })
            queryClient.invalidateQueries({ queryKey: ["edit-subregion", subregionId] })
            toast.success(data)
            // TODO: INVESTIGAR COMO SE PODRIA OBTENER EL ID DE LA REGION SELECCIONADA AL ENTRAR A ESTE COMPONENTE O CUANDO SE CAMBIA EL VALOR DEL FORMULARIO
            navigate(`/locations/subregions`)
        }
    })
    const handleForm = (formData: SubregionForm) => {
        const data = {
            formData,
            subregionId
        }
        mutate(data)
    }
    const { data: regionData, isLoading: regionLoading } = useQuery({
        queryKey: ['list-regions'],
        queryFn: listAllRegions
    })

    const regions = regionData?.map((region: RegionItem) => ({
        value: region.id,
        label: region.name,
    })) || []


    if (regionLoading) {
        return <TextMessage text="Cargando..." align="left" color="black" />
    }


    return (
        <EntityFormLayout>
            <EntityFormLayout.Header title={`Editar subregión ${subregionId}`}></EntityFormLayout.Header>
            <EntityFormLayout.Form
                onSubmit={handleSubmit(handleForm)}
            >
                <EntityFormLayout.Inputs>
                    <InputText
                        id="name"
                        label="Nombre"
                        placeholder="Nombre de la región"
                        type="text"
                        errorMessage={errors.name}
                        functionEnabled={register('name')} />


                    <SelectOption
                        id="regionId"
                        label="Región"
                        errorMessage={errors.regionId}
                        functionEnabled={register('regionId')}
                        options={regions}
                        textInNullOption="Seleccione un tipo"
                    />
                </EntityFormLayout.Inputs>

                <EntityFormLayout.Actions>
                    <Button icon={<ArrowUpCircleIcon />} size="large" text="Editar subregión" type="submit" color="green" />
                    <ButtonLink icon={<XCircleIcon />} size="large" text="Volver" color="gray" to="/locations/subregions" />

                </EntityFormLayout.Actions>
            </EntityFormLayout.Form>
        </EntityFormLayout>
    )
}
