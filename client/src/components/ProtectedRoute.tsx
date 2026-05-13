import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen"><div className="spinner" /></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/landing" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
