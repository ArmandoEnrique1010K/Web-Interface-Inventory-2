import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { InputText } from "@/ui/fields/InputText";
import { Button } from "@/ui/Button";
import { ListElementsContainer } from "@/views/ListElementsContainer";
import { BaseForm } from "@/components/BaseForm";
import type { GeneralError } from "types";
import { ButtonLink } from "@/ui/ButtonLink";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import type { CompanyForm } from "../../types";
import { registerCompany } from "../../api/CompanyAPI";

export const CompanyAddForm = () => {

    const initialValues: CompanyForm = {
        name: '',
    }

    const { register, handleSubmit, setError, formState: { errors } } = useForm<CompanyForm>({
        defaultValues: initialValues
    })

    const navigate = useNavigate();


    const { mutate } = useMutation({
        mutationFn: registerCompany,
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
        onSuccess: async (data) => {
            toast.success(data)
            navigate('/stocklots/companies')
        }
    })

    return (
        <>
            <ListElementsContainer title="Añadir nueva empresa importadora">
                <BaseForm
                    onSubmit={handleSubmit((data) => mutate(data))}
                    inputs={
                        <>
                            <InputText
                                id="name"
                                label="Nombre"
                                placeholder="Nombre de la empresa"
                                type="text"
                                errorMessage={errors.name}
                                functionEnabled={register('name')} />

                        </>
                    }
                    buttons={
                        <>
                            <Button icon={<ArrowUpCircleIcon />} size="large" text='Añadir' type="submit" color="green" />
                            <ButtonLink icon={<XCircleIcon />} size="large" text="Cancelar" color="gray" to="/stocklots/companies" />
                        </>
                    }
                />
            </ListElementsContainer>
        </>
    )
}
