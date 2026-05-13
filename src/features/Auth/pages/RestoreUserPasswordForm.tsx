import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { forgotUserPassword } from "../api/AuthAPI";
import { toast } from "sonner";
import { InputText } from "@/ui/fields/InputText";
import { useDispatch } from "react-redux";
import { updateSecretToken } from "@/reducers/authSlice";
import { AuthFormLayout } from "../layout/AuthFormLayout";
import type { GeneralError } from "@/types";
import type { AuthForgotUserPasswordForm } from "../schemas/requests";

export const RestoreUserPasswordForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const initialValues = {
        email: "",
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
        mutationFn: forgotUserPassword,
        retry: false,
        onError: (error: unknown) => {
            const e = error as GeneralError;
            if (e.type === "FIELD_ERROR" && e.fields) {
                Object.entries(e.fields).forEach(([field, message]) => {
                    setError(field as keyof AuthForgotUserPasswordForm, {
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
            toast.success(data?.data);
            dispatch(updateSecretToken({ secretToken: data!.requestId }));
            navigate("/validate-token");
        },
    });

    return (
        <AuthFormLayout>
            <AuthFormLayout.Header
                title="Reestablecer contraseña"
                helpText="Introduce tu correo electrónico y te enviaremos un token de 6 digitos para que puedas reestablecer tu contraseña."
            ></AuthFormLayout.Header>

            <AuthFormLayout.Form
                isPending={isPending}
                buttonText="Enviar un token"
                onSubmit={handleSubmit((data) => mutate(data))}
            >
                <InputText
                    id="email"
                    label="Correo"
                    placeholder="Introduce tu correo actual"
                    type="email"
                    errorMessage={errors.email}
                    functionEnabled={register("email")}
                />
            </AuthFormLayout.Form>
            <AuthFormLayout.Link
                text="Si recuerdas tu contraseña anterior"
                to="/"
                linkText="haz clic aqui para iniciar sesión"
            ></AuthFormLayout.Link>
        </AuthFormLayout>
    );
};
