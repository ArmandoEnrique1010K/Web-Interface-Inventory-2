import { LoaderProfile } from "@/features/Profile/components/LoaderProfile";
import { UserProfilePage } from "@/features/Profile/pages/UserProfilePage";
import { Navigate, Route, Routes } from "react-router-dom";

export default function ProfileRoutes() {
    return (
        <Routes>
            <Route index element={<UserProfilePage />} />
            <Route path="update" element={<LoaderProfile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
