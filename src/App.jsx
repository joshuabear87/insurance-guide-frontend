import React, { useContext, useEffect, useState } from 'react';
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
import RequestUpdateForm from './components/RequestUpdateForm';
import TermsOfUsePage from './pages/TermsOfUsePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { FacilityContext } from './context/FacilityContext';
import CookiePolicyPage from './pages/CookiePolicyPage';

const App = () => {
  const [showPHIModal, setShowPHIModal] = useState(false);
  const { facilityTheme } = useContext(FacilityContext);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', facilityTheme.primaryColor || '#005b7f');
  }, [facilityTheme]);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('phiWarningDismissed');
    if (!dismissed) setShowPHIModal(true);
  }, []);

  const handleDismissPHI = () => {
    setShowPHIModal(false);
    sessionStorage.setItem('phiWarningDismissed', 'true');
  };

  return (
    <>
{showPHIModal && (
  <div
    className="modal show d-block"
    tabIndex="-1"
    style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content shadow-lg">
        <div className="modal-header bg-dark-blue text-white">
          <h5 className="modal-title">⚠️ Important Notice</h5>
        </div>
        <div className="modal-body">
          <p>
            <strong>Please do not enter any Protected Health Information (PHI)</strong> into this application.
            This tool is intended for operational use only and should not include patient identifiers or sensitive medical data.
          </p>
          <p>
            If you encounter any PHI, <strong>report it immediately to your administrator</strong> for removal.
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-login" onClick={handleDismissPHI}>
            I Understand
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      <Routes>
        <Route path="/login" element={<LayoutNoNav><LoginPage /></LayoutNoNav>} />
        <Route path="/register" element={<LayoutNoNav><RegistrationPage /></LayoutNoNav>} />
        <Route path="/forgot-password" element={<LayoutNoNav><ForgotPasswordPage /></LayoutNoNav>} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/terms" element={<TermsOfUsePage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/cookie-policy" element={<CookiePolicyPage />} />
        <Route path="/account" element={<ProtectedRoute><Layout><MyAccountPage /></Layout></ProtectedRoute>} />
        
        <Route path="/" element={<Navigate to="/plans" />} />
        <Route path="/plans" element={<ProtectedRoute><Layout><InsurancePlanMainPage /></Layout></ProtectedRoute>} />
        <Route path="/plans/commercial" element={<ProtectedRoute><Layout><InsurancePlanMainPage /></Layout></ProtectedRoute>} />
        <Route path="/plans/medicare" element={<ProtectedRoute><Layout><InsurancePlanMainPage /></Layout></ProtectedRoute>} />
        <Route path="/plans/medi-cal" element={<ProtectedRoute><Layout><InsurancePlanMainPage /></Layout></ProtectedRoute>} />
        <Route path="/plans/bluecard-prefixes" element={<Layout><BlueCardPrefixesPage /></Layout>} />

        <Route path="/portal-links" element={<ProtectedRoute><Layout><AllPortalLinksPage /></Layout></ProtectedRoute>} />
        <Route path="/phone-numbers" element={<ProtectedRoute><Layout><AllPhoneNumbersPage /></Layout></ProtectedRoute>} />
        <Route path="/request-update" element={<ProtectedRoute><Layout><RequestUpdateForm /></Layout></ProtectedRoute>} />

        <Route path="/books/create" element={<ProtectedRoute><CreateInsurancePlan /></ProtectedRoute>} />
        <Route path="/books/edit/:id" element={<ProtectedRoute><EditInsurancePlan /></ProtectedRoute>} />
      </Routes>
    </>
  );
};

export default App;
