import { ListUserPage } from "@/features/User/pages/ListUserPage";
import { RegisterUserPage } from "@/features/User/pages/RegisterUserPage";
import { Navigate, Route, Routes } from "react-router-dom";

export default function UserRoutes() {
    return (
        <Routes>
            <Route index element={<ListUserPage />} />
            <Route path="new" element={<RegisterUserPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
