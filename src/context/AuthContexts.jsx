import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        setUser(decoded);
      } catch (error) {
        console.error('Invalid access token:', error);
        logout();
      }
    } else {
      setUser(null);
    }
  }, [accessToken]);

  const login = ({ accessToken, refreshToken }) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  const contextValue = {
    accessToken,
    refreshToken,
    user,
    isAuthenticated: !!accessToken,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
