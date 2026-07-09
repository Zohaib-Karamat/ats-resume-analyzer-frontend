import { Routes, Route, Navigate } from "react-router-dom";
import { AuthLayout } from "../components/layout/AuthLayout";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { NotFound } from "../pages/NotFound";
import { Login } from "../features/auth/pages/Login";
import { Register } from "../features/auth/pages/Register";
import { VerifyEmail } from "../features/auth/pages/VerifyEmail";
import { ForgotPassword } from "../features/auth/pages/ForgotPassword";
import { ResetPassword } from "../features/auth/pages/ResetPassword";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { ResumesPage } from "../features/resumes/pages/ResumesPage";
import { JobDescriptionsPage } from "../features/job-descriptions/pages/JobDescriptionsPage";
import { NewAnalysisPage } from "../features/analysis/pages/NewAnalysisPage";
import { AnalysisResultPage } from "../features/analysis/pages/AnalysisResultPage";
import { HistoryPage } from "../features/analysis/pages/HistoryPage";
import { ProfilePage } from "../features/profile/pages/ProfilePage";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/resumes" element={<ResumesPage />} />
          <Route path="/job-descriptions" element={<JobDescriptionsPage />} />
          <Route path="/analysis" element={<NewAnalysisPage />} />
          <Route path="/analysis/:id" element={<AnalysisResultPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route element={<DashboardLayout />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
