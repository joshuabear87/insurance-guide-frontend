import React from 'react';
import Footer from './Footer';
import CookieConsentBanner from '../pages/CookieConsentBanner';

const LayoutNoNav = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <CookieConsentBanner />
      <main className="flex-grow-1 container-fluid" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default LayoutNoNav;
