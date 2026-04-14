import { ListUserPage } from "@/features/User/views/ListUserPage";
import { RegisterUserPage } from "@/features/User/views/RegisterUserPage";
import { Route, Routes } from "react-router-dom";

export default function UserRoutes() {
    return (
        <Routes>
            <Route index element={<ListUserPage />} />
            <Route path="new" element={<RegisterUserPage />} />
        </Routes>
    );
}
