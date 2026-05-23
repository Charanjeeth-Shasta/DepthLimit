import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Setup from './pages/Setup';
import Interview from './pages/Interview';
import DetailedReport from './pages/DetailedReport';
import SummaryReport from './pages/SummaryReport';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/setup" element={<ProtectedRoute><Setup /></ProtectedRoute>} />
      <Route path="/interview/:sessionId" element={<ProtectedRoute><Interview /></ProtectedRoute>} />
      <Route path="/report/:sessionId/detailed" element={<ProtectedRoute><DetailedReport /></ProtectedRoute>} />
      <Route path="/report/:sessionId/summary" element={<ProtectedRoute><SummaryReport /></ProtectedRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}