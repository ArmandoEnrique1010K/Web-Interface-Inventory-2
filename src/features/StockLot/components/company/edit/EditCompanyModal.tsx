import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/ui/Button";
import { InputText } from "@/ui/fields/InputText";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { updateCompany } from "../../../api/CompanyAPI";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";
import type { GeneralError } from "@/types";
import type { CompanyForm } from "@/features/StockLot/schemas/requests";

type Props = {
    data: CompanyForm;
    companyId: number;
    showModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const EditCompanyModal = ({ data, companyId, showModal }: Props) => {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: data.name,
        },
    });

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: updateCompany,
        retry: false,
        onError: (error: unknown) => {
            const e = error as GeneralError;
            if (e.type === "FIELD_ERROR" && e.fields) {
                Object.entries(e.fields).forEach(([field, message]) => {
                    setError(field as keyof CompanyForm, {
                        type: "server",
                        message: message as string,
                    });
                });

                toast.error(e.message);
                return;
            }

            if (e.type === "GENERAL_ERROR") {
                toast.error(e.message);
                return;
            }
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["companies"] });
            queryClient.invalidateQueries({ queryKey: ["company", companyId] });
            toast.success(data);
            showModal(false);
        },
    });

    const handleForm = (formData: CompanyForm) => {
        const data = {
            formData,
            companyId,
        };
        mutate(data);
    };

    return (
        <EntityFormLayout isCompact>
            <EntityFormLayout.Form onSubmit={handleSubmit(handleForm)}>
                <EntityFormLayout.Inputs isCompact>
                    <InputText
                        id="name"
                        label="Nombre"
                        placeholder="Nombre de la empresa"
                        type="text"
                        errorMessage={errors.name}
                        functionEnabled={register("name")}
                    />
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
                        size="large"
                        text="Volver"
                        type="button"
                        color="gray"
                        onClick={() => showModal(false)}
                        showIconOnMobile={false}
                        showTextOnMobile
                        isLargeOnMobile
                        applyMinWidth
                    />
                </EntityFormLayout.Actions>
            </EntityFormLayout.Form>
        </EntityFormLayout>
    );
};
