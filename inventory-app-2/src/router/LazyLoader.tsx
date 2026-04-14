import { GeneralLoadingView } from "@/views/GeneralLoadingView";
import React, { Suspense } from "react";

type Props = {
    children: React.ReactNode;
};

export const LazyLoader = ({ children }: Props) => {
    return <Suspense fallback={<GeneralLoadingView />}>{children}</Suspense>;
};
