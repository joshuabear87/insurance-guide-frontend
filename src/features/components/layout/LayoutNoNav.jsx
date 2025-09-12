import Footer from '../layout/Footer';
import CookieConsentBanner from '../../../features/components/layout/CookieConsentBanner';

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
