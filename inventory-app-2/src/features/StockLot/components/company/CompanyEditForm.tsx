import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { BaseForm } from "@/components/BaseForm";
import type { GeneralError } from "types";
import { Button } from "@/ui/Button";
import { InputText } from "@/ui/fields/InputText";
import { ListElementsContainer } from "@/views/ListElementsContainer";
import { ButtonLink } from "@/ui/ButtonLink";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import type { CompanyForm } from "../../types";
import { updateCompany } from "../../api/CompanyAPI";

type Props = {
    data: CompanyForm;
    companyId: string;
}

export const CompanyEditForm = ({ data, companyId }: Props) => {
    const navigate = useNavigate();

    const { register, handleSubmit, setError, formState: { errors } } = useForm<CompanyForm>({
        defaultValues: {
            name: data.name
        }
    })

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: updateCompany,
        onError: (error: GeneralError) => {
            // Error de campo
            if (error.type === 'FIELD_ERROR') {
                Object.entries(error.fields).forEach(([field, message]) => {
                    setError(field as keyof CompanyForm, {
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
            queryClient.invalidateQueries({ queryKey: ["list-companies"] })
            queryClient.invalidateQueries({ queryKey: ["edit-company", companyId] })
            toast.success(data)
            navigate("/stocklots/companies")
        }
    })

    const handleForm = (formData: CompanyForm) => {
        const data = {
            formData,
            companyId
        }
        mutate(data)
    }

    return (
        <>
            <ListElementsContainer title={`Editar empresa importadora ${companyId}`}>
                <BaseForm
                    onSubmit={handleSubmit(handleForm)}
                    buttons={
                        <>
                            <Button icon={<ArrowUpCircleIcon />} size="large" text="Editar empresa" type="submit" color="green" />
                            <ButtonLink icon={<XCircleIcon />} size="large" text="Volver" color="gray" to="/stocklots/companies" />
                        </>
                    }
                    inputs={
                        <InputText
                            id="name"
                            label="Nombre"
                            placeholder="Nombre de la empresa"
                            type="text"
                            errorMessage={errors.name}
                            functionEnabled={register('name')} />
                    }
                />
            </ListElementsContainer>
        </>
    )
}
