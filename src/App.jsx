import React from 'react';
import { Routes, Route } from 'react-router-dom'; // ✅ Only import Routes and Route
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute'; // ✅
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
// import MyAccount from './pages/MyAccount';
import AdminDashboard from './pages/AdminDashboard';
import RegistrationPage from './pages/RegistrationPage';
import ViewInsurancePlan from './pages/ViewInsurancePlan';
import CreateInsurancePlan from './pages/CreateInsurancePlan';
import EditInsurancePlan from './pages/EditInsurancePlan';
import Layout from './components/Layout';
import LayoutNoNav from './components/LayoutNoNav';
import InsurancePlanFiltered from './pages/InsurancePlanFiltered';
import PrefixesPage from './pages/PrefixesPage'

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LayoutNoNav><LoginPage /></LayoutNoNav>} />
      <Route path="/register" element={<LayoutNoNav><RegistrationPage /></LayoutNoNav>} />
      <Route path="/forgot-password" element={<LayoutNoNav><ForgotPasswordPage /></LayoutNoNav>} />
      {/* <Route path="/my-account" element={<ProtectedRoute><MyAccount /></ProtectedRoute>} /> */}
      <Route path="/admin" element={<ProtectedRoute adminOnly={true}><LayoutNoNav><AdminDashboard /></LayoutNoNav></ProtectedRoute>} />
      
      <Route path="/" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
      <Route path="/plans" element={<Layout><InsurancePlanFiltered /></Layout>} />
      <Route path="/plans/commercial" element={<Layout><InsurancePlanFiltered filter="Commercial" /></Layout>} />
      <Route path="/plans/medicare" element={<Layout><InsurancePlanFiltered filter="Medicare" /></Layout>} />
      <Route path="/plans/medi-cal" element={<Layout><InsurancePlanFiltered filter="Medi-Cal"/></Layout>} />
      <Route path="/prefixes" element={<Layout><PrefixesPage /></Layout>} />

      <Route path="/books/details/:id" element={<ProtectedRoute><ViewInsurancePlan /></ProtectedRoute>} />
      <Route path="/books/create" element={<ProtectedRoute><CreateInsurancePlan /></ProtectedRoute>} />
      <Route path="/books/edit/:id" element={<ProtectedRoute><EditInsurancePlan /></ProtectedRoute>}/>
    </Routes>
  );
};

export default App;
