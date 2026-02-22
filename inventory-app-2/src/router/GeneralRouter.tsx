

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthLayout } from '@/layout/AuthLayout'
import { LoginForm } from '@/features/Auth/views/LoginForm'
import { DashboardLayout } from '@/layout/DashboardLayout'
import { ForgotUserPasswordForm } from '@/features/Auth/views/ForgotUserPasswordForm'
import { ValidateUserTokenForm } from '@/features/Auth/views/ValidateUserTokenForm'
import { UpdateUserPasswordForm } from '@/features/Auth/views/UpdateUserPasswordForm'

export const GeneralRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AuthLayout />}>
                    <Route index element={<LoginForm />} />
                    <Route path="/restore-password" element={<ForgotUserPasswordForm />} />
                    <Route path="/validate-token" element={<ValidateUserTokenForm />} />
                    <Route path="/update-password" element={<UpdateUserPasswordForm />} />
                </Route>

                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<h1>Dashboard</h1>} />
                </Route>
            </Routes>

        </BrowserRouter>
    )
}
