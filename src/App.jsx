import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import InsurancePlanMainPage from './pages/InsurancePlanMainPage';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import MyAccountPage from './pages/MyAccountPage';
import RegistrationPage from './pages/RegistrationPage';
import CreateInsurancePlan from './pages/CreateInsurancePlan';
import EditInsurancePlan from './pages/EditInsurancePlan';
import Layout from './components/Layout';
import LayoutNoNav from './components/LayoutNoNav';
import BlueCardPrefixesPage from './pages/BlueCardPrefixesPage';
import AllPortalLinksPage from './pages/AllPortalLinksPage';
import AllPhoneNumbersPage from './pages/AllPhoneNumbersPage';
import PrintableInsurancePlanPage from './pages/PrintableInsurancePlanPage';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LayoutNoNav><LoginPage /></LayoutNoNav>} />
      <Route path="/register" element={<LayoutNoNav><RegistrationPage /></LayoutNoNav>} />
      <Route path="/forgot-password" element={<LayoutNoNav><ForgotPasswordPage /></LayoutNoNav>} />
      <Route path="/account" element={<ProtectedRoute adminOnly={true}><Layout><MyAccountPage /></Layout></ProtectedRoute>} />
      
      <Route path="/" element={<Navigate to="/plans" />} />
      <Route path="/plans" element={<ProtectedRoute><Layout><InsurancePlanMainPage /></Layout></ProtectedRoute>} />
      <Route path="/plans/commercial" element={<ProtectedRoute><Layout><InsurancePlanMainPage /></Layout></ProtectedRoute>} />
      <Route path="/plans/medicare" element={<ProtectedRoute><Layout><InsurancePlanMainPage /></Layout></ProtectedRoute>} />
      <Route path="/plans/medi-cal" element={<ProtectedRoute><Layout><InsurancePlanMainPage /></Layout></ProtectedRoute>} />
      <Route path="/plans/bluecard-prefixes" element={<Layout><BlueCardPrefixesPage /></Layout>} />

      <Route path="/portal-links" element={<ProtectedRoute><Layout><AllPortalLinksPage /></Layout></ProtectedRoute>} />
      <Route path="/phone-numbers" element={<ProtectedRoute><Layout><AllPhoneNumbersPage /></Layout></ProtectedRoute>} />
      <Route path="/printable-page" element={<ProtectedRoute><LayoutNoNav><PrintableInsurancePlanPage /></LayoutNoNav></ProtectedRoute>} />

      <Route path="/books/create" element={<ProtectedRoute><CreateInsurancePlan /></ProtectedRoute>} />
      <Route path="/books/edit/:id" element={<ProtectedRoute><EditInsurancePlan /></ProtectedRoute>} />
    </Routes>
  );
};

export default App;
