import React from 'react';
import Footer from './Footer';

const LayoutNoNav = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <main className="flex-grow-1 container-fluid" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default LayoutNoNav;
