import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/UserAPI";
import type { GeneralError } from "@/types/index";
import { toast } from "sonner";
import { InputText } from "@/ui/fields/InputText";
import { Button } from "@/ui/Button";
import { ButtonLink } from "@/ui/ButtonLink";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { InputPassword } from "@/ui/fields/InputPassword";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";
import { SelectCheckboxGroup } from "@/ui/fields/SelectCheckboxGroup";
import type { UserRegisterForm } from "../schemas/requests";

export const RegisterUserPage = () => {
    const initialValues = {
        firstname: "",
        lastname: "",
        email: "",
        dni: undefined,
        password: "",
        operator: false,
        secretary: false,
        admin: false,
    };

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<UserRegisterForm>({
        defaultValues: initialValues,
    });
    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: registerUser,
        retry: false,
        onError: (error: unknown) => {
            const e = error as GeneralError;
            if (e.type === "FIELD_ERROR" && e.fields) {
                Object.entries(e.fields).forEach(([field, message]) => {
                    setError(field as keyof UserRegisterForm, {
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
            toast.success(data);
            navigate("/users");
        },
    });

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
        <EntityFormLayout>
            <EntityFormLayout.Header title="Registrar nuevo usuario"></EntityFormLayout.Header>
            <EntityFormLayout.Form
                styled
                onSubmit={handleSubmit((data) => mutate(data))}
            >
                <EntityFormLayout.Inputs>
                    <InputText
                        id="firstname"
                        label="Nombre"
                        placeholder="Nombres del usuario"
                        type="text"
                        errorMessage={errors.firstname}
                        functionEnabled={register("firstname")}
                    />
                    <InputText
                        id="lastname"
                        label="Apellidos"
                        placeholder="Apellidos del usuario"
                        type="text"
                        errorMessage={errors.lastname}
                        functionEnabled={register("lastname")}
                    />
                    <InputText
                        id="email"
                        label="Email"
                        placeholder="Correo del usuario"
                        type="text"
                        errorMessage={errors.email}
                        functionEnabled={register("email")}
                    />
                    <InputText
                        id="dni"
                        label="DNI"
                        placeholder="DNI del usuario"
                        type="number"
                        max={8}
                        errorMessage={errors.dni}
                        functionEnabled={register("dni")}
                    />

                    <InputPassword
                        id="password"
                        label="Contraseña"
                        placeholder="Contraseña"
                        errorMessage={errors.password}
                        functionEnabled={register("password")}
                    />

                    <SelectCheckboxGroup group={rolesGroup} label="Roles" />
                </EntityFormLayout.Inputs>
                <EntityFormLayout.Actions>
                    <Button
                        icon={<ArrowUpCircleIcon />}
                        size="large"
                        text="Registrar"
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
                        to="/users"
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
