import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GeneralRouter } from "@/router/GeneralRouter";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "@/store/store";

// Nota: no renombrar el archivo index.css
import "./index.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Importaciones de hojas de estilos necesarias para los componentes
// InputDateTime y InputDateTimeFilter
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

// InputDate y InputDateFilter
import "react-datepicker/dist/react-datepicker.css";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <Toaster
                    position="top-right"
                    duration={5000}
                    richColors
                    closeButton
                />
                <GeneralRouter />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </Provider>
    </StrictMode>,
);
