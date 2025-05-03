// src/utils/auth.js
import { jwtDecode } from 'jwt-decode';

export const isAdmin = () => {
  try {
    const token = localStorage.getItem('accessToken');
    const decoded = jwtDecode(token);
    return decoded?.role === 'admin';
  } catch {
    return false;
  }
};
