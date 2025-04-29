import React from 'react';
import { Routes, Route } from 'react-router-dom'; // ✅ Only import Routes and Route
import CreateBook from './pages/CreateBook';
import DeleteBook from './pages/DeleteBook';
import EditBook from './pages/EditBook';
import Home from './pages/Home';
import ShowBook from './pages/ShowBook';
import ProtectedRoute from './components/ProtectedRoute'; // ✅
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
// import MyAccount from './pages/MyAccount';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      {/* <Route path="/my-account" element={<ProtectedRoute><MyAccount /></ProtectedRoute>} /> */}
      <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/" element={<Home />} />
      <Route path="/books/details/:id" element={<ShowBook />} />
      <Route path="/books/create" element={<ProtectedRoute><CreateBook /></ProtectedRoute>} />
      <Route path="/books/edit/:id" element={<ProtectedRoute><EditBook /></ProtectedRoute>}/>
      <Route path="/books/delete/:id" element={<ProtectedRoute><DeleteBook /></ProtectedRoute>}/>
    </Routes>
  );
};

export default App;
