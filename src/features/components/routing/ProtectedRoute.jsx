import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const location = useLocation();
  const accessToken = localStorage.getItem('accessToken');

  // No token or malformed
  if (!accessToken || typeof accessToken !== 'string' || accessToken.split('.').length !== 3) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Decode & validate
  let decoded;
  try {
    decoded = jwtDecode(accessToken);
  } catch {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Expired
  if (decoded.exp && decoded.exp * 1000 < Date.now()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Admin gate
  if (adminOnly && decoded.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
