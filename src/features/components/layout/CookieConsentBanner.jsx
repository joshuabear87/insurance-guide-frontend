import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const CookieConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
      // Allow animation after mounting
      setTimeout(() => setAnimateIn(true), 100);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setAnimateIn(false);
    setTimeout(() => setShowBanner(false), 300); // allow animation to complete
  };

  if (!showBanner) return null;

  return (
    <div
      className={`position-fixed bottom-0 start-0 end-0 px-3 py-3 transition-all ${
        animateIn ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{
        backgroundColor: '#005b7f',
        color: 'white',
        fontSize: '0.9rem',
        zIndex: 1055,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.3)',
        transition: 'transform 0.4s ease-in-out',
      }}
    >
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        <span>
          We use cookies to improve your experience. Read our{' '}
          <Link to="/cookies" style={{ color: '#ffdd57', textDecoration: 'underline' }}>
            Cookie Policy
          </Link>
          .
        </span>
        <button
          onClick={handleAccept}
          className="btn btn-light btn-sm text-dark px-3 fw-semibold"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
