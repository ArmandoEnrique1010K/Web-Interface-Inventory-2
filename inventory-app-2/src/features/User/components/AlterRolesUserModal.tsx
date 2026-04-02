import type { RolesForm, UserRolesDetails } from "../types";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserRoles } from "../api/UserAPI";
import type { GeneralError } from "@/types/index";
import { toast } from "sonner";
import { Button } from "@/ui/Button";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";
import { SelectCheckboxGroup } from "@/ui/fields/SelectCheckboxGroup";

type Props = {
    data: UserRolesDetails;
    userId: string;
    showModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AlterRolesUserModal = ({ data, userId, showModal }: Props) => {
    const { register, handleSubmit, setError } = useForm<RolesForm>({
        defaultValues: {
            operator: data.operator,
            secretary: data.secretary,
            admin: data.admin,
        },
    });

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: updateUserRoles,
        retry: false,
        onError: (error: unknown) => {
            const e = error as GeneralError;
            if (e.type === "FIELD_ERROR" && e.fields) {
                Object.entries(e.fields).forEach(([field, message]) => {
                    setError(field as keyof RolesForm, {
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
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["roles", userId] });
            toast.success(data);
            showModal(false);
        },
    });
    const handleForm = (formData: RolesForm) => {
        const data = {
            formData,
            userId,
        };
        mutate(data);
    };

    const rolesGroup: { name: string; action: UseFormRegisterReturn }[] = [
        {
            name: "Operador",
            action: register("operator"),
        },
        {
            name: "Secretario",
            action: register("secretary"),
        },
        {
            name: "Administrador",
            action: register("admin"),
        },
    ];

    return (
        <EntityFormLayout isCompact>
            <EntityFormLayout.Header
                isCompact
                helpText="Tenga cuidado al alterar los roles de un usuario, podria acceder a cierta información confidencial, recuerde usted altera los roles bajo su propia responsabilidad. Por defecto los usuarios siempre van a tener el rol de 'Usuario'"
            ></EntityFormLayout.Header>
            <EntityFormLayout.Form onSubmit={handleSubmit(handleForm)}>
                <EntityFormLayout.Inputs isCompact>
                    <SelectCheckboxGroup group={rolesGroup} label="Roles" />
                </EntityFormLayout.Inputs>
                <EntityFormLayout.Actions isCompact>
                    <Button
                        icon={<ArrowUpCircleIcon />}
                        size="large"
                        text="Alterar"
                        type="submit"
                        color="green"
                        showIconOnMobile={false}
                        showTextOnMobile={true}
                        isLargeOnMobile={true}
                        applyMinWidth
                    />
                    <Button
                        type="button"
                        icon={<XCircleIcon />}
                        size="large"
                        text="Volver"
                        color="gray"
                        onClick={() => showModal(false)}
                        showIconOnMobile={false}
                        showTextOnMobile={true}
                        isLargeOnMobile={true}
                        applyMinWidth
                    />
                </EntityFormLayout.Actions>
            </EntityFormLayout.Form>
        </EntityFormLayout>
    );
};
