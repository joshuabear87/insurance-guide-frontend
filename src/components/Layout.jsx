// ✅ Layout.jsx
import React, { useEffect, useRef, useState } from 'react';
import Navbar from './NavBar';
import Footer from './Footer';
import CookieConsentBanner from '../pages/CookieConsentBanner';

const Layout = ({ children }) => {
  const navbarRef = useRef(null);
  const [topPadding, setTopPadding] = useState(100);
  const [exportHandler, setExportHandler] = useState(null);
  const [exportHandlerBlueCard, setExportHandlerBlueCard] = useState(null);

  useEffect(() => {
    if (navbarRef.current) {
      const updatePadding = () => {
        const height = navbarRef.current.offsetHeight;
        setTopPadding(height + 80);
      };
      updatePadding();
      window.addEventListener('resize', updatePadding);
      return () => window.removeEventListener('resize', updatePadding);
    }
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100 mx-0 px-3">
      <div ref={navbarRef}>
        <Navbar onExport={exportHandler} onExportBlueCard={exportHandlerBlueCard} />
      </div>
      <CookieConsentBanner />
      <main
        className="flex-grow-1 container-fluid my-5"
        style={{ paddingTop: `${topPadding}px`, paddingBottom: '60px' }}
      >
        {React.cloneElement(children, {
          setExportHandler,
          setExportHandlerBlueCard,
        })}      </main>

      <Footer />
    </div>
  );
};

export default Layout;
