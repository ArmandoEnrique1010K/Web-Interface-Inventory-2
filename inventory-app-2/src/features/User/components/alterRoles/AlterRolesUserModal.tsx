import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateUserRoles } from "../../api/UserAPI";
import type { GeneralError } from "@/types/index";
import { toast } from "sonner";
import { Button } from "@/ui/Button";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";
import type { RolesForm } from "../../schemas/requests";
import type { UserRolesDetails } from "../../schemas/items";
import { SelectOption } from "@/ui/fields/SelectOption";
import { listAllRoles } from "../../api/RoleAPI";
import { formatRole } from "@/utils/formatRole";

type Props = {
    data: UserRolesDetails;
    userId: number;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AlterRolesUserModal = ({ data, userId, setShowModal }: Props) => {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<RolesForm>({
        defaultValues: {
            // operator: data.operator,
            // secretary: data.secretary,
            // admin: data.admin,
            role: data.role,
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
                        message: message,
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
            setShowModal(false);
        },
    });
    const handleForm = (formData: RolesForm) => {
        const data = {
            formData,
            userId,
        };
        mutate(data);
    };

    const { data: roleData } = useQuery({
        queryKey: ["roles"],
        queryFn: listAllRoles,
    });

    // const rolesGroup: { name: string; action: UseFormRegisterReturn }[] = [
    //     {
    //         name: "Operador",
    //         action: register("operator"),
    //     },
    //     {
    //         name: "Secretario",
    //         action: register("secretary"),
    //     },
    //     {
    //         name: "Administrador",
    //         action: register("admin"),
    //     },
    // ];

    const roles =
        roleData?.map((role) => ({
            value: role.label.toString(),
            label: formatRole(role.label),
        })) || [];

    return (
        <EntityFormLayout isCompact>
            <EntityFormLayout.Header
                isCompact
                helpText="Tenga cuidado al alterar los roles de un usuario, podria acceder a cierta información confidencial, recuerde usted altera los roles bajo su propia responsabilidad. Por defecto los usuarios siempre van a tener el rol de 'Usuario'"
            ></EntityFormLayout.Header>
            <EntityFormLayout.Form onSubmit={handleSubmit(handleForm)}>
                <EntityFormLayout.Inputs isCompact>
                    {/* <SelectCheckboxGroup group={rolesGroup} label="Roles" /> */}
                    <SelectOption
                        id={"role"}
                        label={"Rol"}
                        errorMessage={errors.role}
                        functionEnabled={register("role")}
                        options={roles}
                        textInNullOption="Seleccione un rol"
                    />
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
                        onClick={() => setShowModal(false)}
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
