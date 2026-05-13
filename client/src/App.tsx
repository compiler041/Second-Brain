import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Tasks from './pages/Tasks';
import Notes from './pages/Notes';
import Tweets from './pages/Tweets';
import Videos from './pages/Videos';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';

const AuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const LandingRedirect = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <Landing />;
};

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/landing" element={<LandingRedirect />} />
            <Route
              path="/login"
              element={
                <AuthRedirect>
                  <Login />
                </AuthRedirect>
              }
            />
            <Route
              path="/signup"
              element={
                <AuthRedirect>
                  <Signup />
                </AuthRedirect>
              }
            />

            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Tasks />} />
              <Route path="/tasks" element={<Navigate to="/" replace />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/tweets" element={<Tweets />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<Navigate to="/landing" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
