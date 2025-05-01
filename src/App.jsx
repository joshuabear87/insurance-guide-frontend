import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AdminDashboard from './pages/AdminDashboard';
import RegistrationPage from './pages/RegistrationPage';
import CreateInsurancePlan from './pages/CreateInsurancePlan';
import EditInsurancePlan from './pages/EditInsurancePlan';
import Layout from './components/Layout';
import LayoutNoNav from './components/LayoutNoNav';
import PrefixesPage from './pages/PrefixesPage';
import BlueCardPrefixesPage from './pages/BlueCardPrefixesPage';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LayoutNoNav><LoginPage /></LayoutNoNav>} />
      <Route path="/register" element={<LayoutNoNav><RegistrationPage /></LayoutNoNav>} />
      <Route path="/forgot-password" element={<LayoutNoNav><ForgotPasswordPage /></LayoutNoNav>} />
      <Route path="/admin" element={<ProtectedRoute adminOnly={true}><LayoutNoNav><AdminDashboard /></LayoutNoNav></ProtectedRoute>} />
      
      <Route path="/" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
      <Route path="/plans" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
      <Route path="/plans/commercial" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
      <Route path="/plans/medicare" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
      <Route path="/plans/medi-cal" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
      <Route path="/plans/bluecard-prefixes" element={<Layout><BlueCardPrefixesPage /></Layout>} />
      <Route path="/prefixes" element={<Layout><PrefixesPage /></Layout>} />

      <Route path="/books/create" element={<ProtectedRoute><CreateInsurancePlan /></ProtectedRoute>} />
      <Route path="/books/edit/:id" element={<ProtectedRoute><EditInsurancePlan /></ProtectedRoute>} />
    </Routes>
  );
};

export default App;
