import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken || typeof accessToken !== 'string' || accessToken.split('.').length !== 3) {
    return <Navigate to="/login" replace />;
  }

  let decoded;
  try {
    decoded = jwtDecode(accessToken);
  } catch (error) {
    return <Navigate to="/login" replace />;
  }

  if (decoded.exp && decoded.exp * 1000 < Date.now()) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && decoded.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
