import React from 'react';
import BackButton from '../components/BackButton';

const PrivacyPolicyPage = () => {
  return (
    <div className="container py-5">
      {/* Back button on top */}
      <div className="mb-3">
        <BackButton />
      </div>

      {/* Terms of Use Card */}
      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: '800px', fontSize: '0.9rem' }}>
        <h2 className="text-center mb-4 text-blue">Privacy Policy</h2>
        <p className="text-muted text-end">Last updated: May 3, 2025</p>

        <section className="mb-4">
          <h5 className="text-blue">1. Information We Collect</h5>
          <p>We collect minimal personal information such as name, email, and role to provide access control. No Protected Health Information (PHI) should be entered into the system.</p>
        </section>

        <section className="mb-4">
          <h5 className="text-blue">2. How We Use Information</h5>
          <p>Information is used to authenticate users, provide services, and improve the platform. We do not sell user data.</p>
        </section>

        <section className="mb-4">
          <h5 className="text-blue">3. Data Security</h5>
          <p>We implement industry-standard security measures to protect your information. However, no method of transmission is 100% secure.</p>
        </section>

        <section className="mb-4">
          <h5 className="text-blue">4. Sharing of Information</h5>
          <p>We do not share your personal data with third parties except as required to provide our services or by law.</p>
        </section>

        <section className="mb-4">
          <h5 className="text-blue">5. Cookies</h5>
          <p>We may use cookies for authentication and analytics purposes. You can disable cookies in your browser settings.</p>
        </section>

        <section className="mb-0">
          <h5 className="text-blue">6. Changes to This Policy</h5>
          <p>We may update this Privacy Policy occasionally. Continued use of the app implies your acceptance of any changes.</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
