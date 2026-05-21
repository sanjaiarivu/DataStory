import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AuthPage from '../pages/AuthPage';
import ChatPage from '../pages/ChatPage';
import DashboardPage from '../pages/DashboardPage';
import FilesPage from '../pages/FilesPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/files"
        element={
          <ProtectedRoute>
            <FilesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
