import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// The route table — the one place that maps every URL to its page. Each page
// lives in its own feature under features/<name>/pages, so this file doubles as
// an index of every main view in the app.
import HomePage from "@/features/landing/pages/HomePage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
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
