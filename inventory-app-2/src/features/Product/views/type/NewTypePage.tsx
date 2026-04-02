import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { TypeForm } from "../../types";
import { InputText } from "@/ui/fields/InputText";
import { Button } from "@/ui/Button";
import type { GeneralError } from "types";
import { registerType } from "../../api/TypeAPI";
import { ButtonLink } from "@/ui/ButtonLink";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";

export const NewTypePage = () => {

    const initialValues = {
        name: '',
    }

    const { register, handleSubmit, setError, formState: { errors } } = useForm({
        defaultValues: initialValues
    })

    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: registerType,
        retry: false,
        onError: (error: GeneralError) => {
            const e = error as GeneralError
            if (e.type === 'FIELD_ERROR' && e.fields) {
                Object.entries(e.fields).forEach(([field, message]) => {
                    setError(field as keyof TypeForm, {
                        type: 'server',
                        message,
                    })
                })

                toast.error(e.message)
                return

            }
            if (e.type === 'GENERAL_ERROR') {
                toast.error(e.message)
                return
            }
        },
        onSuccess: async (data) => {
            toast.success(data)
            navigate('/products/types')
        }
    })

    return (
        <EntityFormLayout>
            <EntityFormLayout.Header title="Añadir nuevo tipo"></EntityFormLayout.Header>
            <EntityFormLayout.Form onSubmit={handleSubmit((data) => mutate(data))}>
                <EntityFormLayout.Inputs>
                    <InputText
                        id="name"
                        label="Nombre"
                        placeholder="Nombre del tipo"
                        type="text"
                        errorMessage={errors.name}
                        functionEnabled={register('name')} />
                </EntityFormLayout.Inputs>
                <EntityFormLayout.Actions>
                    <Button
                        icon={<ArrowUpCircleIcon />}
                        size="large"
                        text="Añadir"
                        type="submit"
                        color="green"
                        showIconOnMobile={false}
                        showTextOnMobile
                        isLargeOnMobile
                        applyMinWidth
                    />
                    <ButtonLink
                        icon={<XCircleIcon />}
                        size="large"
                        text="Cancelar"
                        color="gray"
                        to="/products/types"
                        showIconOnMobile={false}
                        showTextOnMobile
                        isLargeOnMobile
                        applyMinWidth
                    />
                </EntityFormLayout.Actions>
            </EntityFormLayout.Form>
        </EntityFormLayout>
    )
}
