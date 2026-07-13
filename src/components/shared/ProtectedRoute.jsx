import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute - guards routes based on authentication and role.
 * 
 * @param {React.ReactNode} children - The component to render if authorized
 * @param {string[]} allowedRoles - Optional array of roles allowed to access (e.g. ['admin'], ['shopkeeper'], ['user'])
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  // While Firebase auth state is resolving, show nothing (AuthProvider already blocks via {!loading && children})
  if (loading) return null;

  // Not authenticated → redirect to portal
  if (!user) {
    return <Navigate to="/portal" state={{ from: location }} replace />;
  }

  // Role-based access control
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirect to the correct dashboard for their actual role
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'shopkeeper') return <Navigate to="/shopkeeper/dashboard" replace />;
    return <Navigate to="/user/dashboard" replace />;
  }

  return children;
}
