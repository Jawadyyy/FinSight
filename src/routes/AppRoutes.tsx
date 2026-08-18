import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import OAuthCallbackPage from "../features/auth/pages/OAuthCallbackPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";

// The route table.
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      {/* Anything unknown goes back to the home page. */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
