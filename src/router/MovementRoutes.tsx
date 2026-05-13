import { DetailMovementPage } from "@/features/Movement/pages/DetailMovementPage";
import { ListMovementPage } from "@/features/Movement/pages/ListMovementPage";
import { Navigate, Route, Routes } from "react-router-dom";

export default function MovementRoutes() {
    return (
        <Routes>
            <Route index element={<ListMovementPage />} />
            <Route path=":id" element={<DetailMovementPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
