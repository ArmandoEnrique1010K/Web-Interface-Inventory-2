import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CategoryForm, TypeForm } from "../../../types";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { GeneralError } from "types";
import { Button } from "@/ui/Button";
import { InputText } from "@/ui/fields/InputText";
import { updateType } from "../../../api/TypeAPI";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";

type Props = {
    data: TypeForm;
    typeId: number;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const EditTypeModal = ({ data, typeId, setModalOpen }: Props) => {

    const { register, handleSubmit, setError, formState: { errors } } = useForm({
        defaultValues: {
            name: data.name
        }
    })

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: updateType,
        retry: false,
        onError: (error: unknown) => {
            const e = error as GeneralError
            if (e.type === 'FIELD_ERROR' && e.fields) {
                Object.entries(e.fields).forEach(([field, message]) => {
                    setError(field as keyof CategoryForm, {
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
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["types"] })
            queryClient.invalidateQueries({ queryKey: ["type", typeId] })
            toast.success(data)
            setModalOpen(false)
        }
    })

    const handleForm = (formData: CategoryForm) => {
        const data = {
            formData,
            typeId
        }
        mutate(data)
    }

    return (
        <EntityFormLayout isCompact>
            <EntityFormLayout.Form onSubmit={handleSubmit(handleForm)} >
                <EntityFormLayout.Inputs isCompact>
                    <InputText
                        id="name"
                        label="Nombre"
                        placeholder="Nombre del tipo"
                        type="text"
                        errorMessage={errors.name}
                        functionEnabled={register('name')} />
                </EntityFormLayout.Inputs>
                <EntityFormLayout.Actions isCompact>
                    <Button
                        icon={<ArrowUpCircleIcon />}
                        size="large"
                        text="Editar"
                        type="submit"
                        color="green"
                        showIconOnMobile={false}
                        showTextOnMobile
                        isLargeOnMobile
                        applyMinWidth
                    />
                    <Button
                        icon={<XCircleIcon />}
                        type="button"
                        size="large"
                        text="Volver"
                        color="gray"
                        onClick={() => setModalOpen(false)}
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
