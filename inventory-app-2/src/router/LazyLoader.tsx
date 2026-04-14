import { GeneralLoadingView } from "@/views/GeneralLoadingView";
import React, { Suspense } from "react";

type Props = {
    children: React.ReactNode;
};

// // Componente auxiliar para mostrar un loading mientras se carga el componente
// const Lazy = ({ children }: { children: React.ReactNode }) => (
//     <Suspense fallback={<GeneralLoadingView />}>{children}</Suspense>
// );

// // Función auxiliar para renderizar el componente auxiliar dentro de un componente
// const lazyLoad = (
//     Component: React.LazyExoticComponent<React.ComponentType>,
// ) => (
//     <Lazy>
//         <Component />
//     </Lazy>
// );

export const LazyLoader = ({ children }: Props) => {
    return <Suspense fallback={<GeneralLoadingView />}>{children}</Suspense>;
};
