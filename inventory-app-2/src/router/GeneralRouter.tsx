

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthLayout } from '@/layout/AuthLayout'
import { LoginForm } from '@/features/Auth/views/LoginForm'
import { DashboardLayout } from '@/layout/DashboardLayout'

export const GeneralRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AuthLayout />}>
                    <Route index element={<LoginForm />} />
                </Route>

                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<h1>Dashboard</h1>} />
                </Route>
            </Routes>

        </BrowserRouter>
    )
}
