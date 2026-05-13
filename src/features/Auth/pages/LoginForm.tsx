import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { currentSession, login } from "../api/AuthAPI";
import { toast } from "sonner";
import { InputText } from "@/ui/fields/InputText";
import { useDispatch } from "react-redux";
import { setAuthenticated, setUserRoles } from "@/reducers/authSlice";
import { InputPassword } from "@/ui/fields/InputPassword";
import { AuthFormLayout } from "../layout/AuthFormLayout";
import type { GeneralError } from "@/types";
import type { AuthLoginForm } from "../schemas/requests";
import { useEffect } from "react";

export const LoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const initialValues = {
        email: "",
        password: "",
    };

    const { register, handleSubmit, setError } = useForm({
        defaultValues: initialValues,
    });

    useEffect(() => {
        console.log(import.meta.env.VITE_API_URL);
        console.log(import.meta.env.VITE_FRONTEND_DOMAIN);
    }, []);

    const { mutate, isPending } = useMutation({
        mutationFn: login,
        retry: false,
        onError: (error: unknown) => {
            const e = error as GeneralError;
            if (e.type === "FIELD_ERROR" && e.fields) {
                Object.entries(e.fields).forEach(([field, message]) => {
                    setError(field as keyof AuthLoginForm, {
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
        onSuccess: async (data) => {
            toast.success(data);
            const userDetails = await currentSession();
            dispatch(setUserRoles(userDetails.role));
            dispatch(setAuthenticated());
            navigate("/");
        },
    });

    return (
        <AuthFormLayout>
            <AuthFormLayout.Header title="Inicio de sesión"></AuthFormLayout.Header>
            <AuthFormLayout.Form
                isPending={isPending}
                buttonText="Iniciar sesión"
                onSubmit={handleSubmit((data) => mutate(data))}
            >
                <InputText
                    id="email"
                    label="Correo"
                    placeholder="Correo del usuario"
                    type="email"
                    functionEnabled={register("email")}
                />

                <InputPassword
                    id="password"
                    label="Contraseña"
                    placeholder="Contraseña del usuario"
                    functionEnabled={register("password")}
                />
            </AuthFormLayout.Form>
            <AuthFormLayout.Link
                text="¿Olvidastes tu contraseña?"
                to="/restore-password"
                linkText="haz clic aqui para cambiarla"
            ></AuthFormLayout.Link>
        </AuthFormLayout>
    );
};
