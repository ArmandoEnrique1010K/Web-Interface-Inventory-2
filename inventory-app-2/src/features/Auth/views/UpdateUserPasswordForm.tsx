import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { updateUserPassword } from "../api/AuthAPI";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateSecretToken } from "@/reducers/authSlice";
import type { RootState } from "@/store/store";
import { InputPassword } from "@/ui/fields/InputPassword";
import { AuthFormLayout } from "../layout/AuthFormLayout";
import type { GeneralError } from "@/types";
import type { AuthUpdateUserPasswordForm } from "../schemas/requests";

export const UpdateUserPasswordForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const secretToken = useSelector(
        (state: RootState) => state.auth.secretToken,
    );

    const initialValues = {
        newPassword: "",
        confirmNewPassword: "",
    };

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        defaultValues: initialValues,
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (data: AuthUpdateUserPasswordForm) =>
            updateUserPassword({
                resetToken: secretToken,
                newPassword: data.newPassword,
                confirmNewPassword: data.confirmNewPassword,
            }),
        retry: false,
        onError: (error: unknown) => {
            const e = error as GeneralError;
            if (e.type === "FIELD_ERROR" && e.fields) {
                Object.entries(e.fields).forEach(([field, message]) => {
                    setError(field as keyof AuthUpdateUserPasswordForm, {
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
            dispatch(updateSecretToken({ secretToken: "" }));
            navigate("/");
        },
    });

    return (
        <AuthFormLayout>
            <AuthFormLayout.Header title="Introduce tu nueva contraseña"></AuthFormLayout.Header>
            <AuthFormLayout.Form
                isPending={isPending}
                buttonText="Cambiar contraseña"
                onSubmit={handleSubmit((data) => mutate(data))}
            >
                <InputPassword
                    id="newPassword"
                    label="Nueva contraseña"
                    placeholder="Introduce tu nueva contraseña"
                    errorMessage={errors.newPassword}
                    functionEnabled={register("newPassword")}
                />

                <InputPassword
                    id="confirmNewPassword"
                    label="Confirma la nueva contraseña"
                    placeholder="Confirma la nueva contraseña"
                    errorMessage={errors.confirmNewPassword}
                    functionEnabled={register("confirmNewPassword")}
                />
            </AuthFormLayout.Form>
            <AuthFormLayout.Link
                text="Necesitas un nuevo token de 6 digitos"
                to="/restore-password"
                linkText="haz clic aqui para obtenerlo"
            ></AuthFormLayout.Link>
        </AuthFormLayout>
    );
};
