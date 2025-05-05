import React from 'react';
import BackButton from '../components/BackButton';

const TermsOfUsePage = () => {
  return (
    <div className="container py-5 d-flex justify-content-center">
      <BackButton />
      <div className="card shadow-sm p-4" style={{ maxWidth: '800px', width: '100%', fontSize: '0.9rem' }}>
        <h2 className="text-center mb-4 text-blue">Terms of Use</h2>
        <p className="text-muted text-end">Last updated: May 3, 2025</p>

        <section className="mb-4">
          <h5 className="text-blue">1. Acceptance of Terms</h5>
          <p>By accessing or using this application, you agree to be bound by these Terms of Use. If you do not agree, please do not use the app.</p>
        </section>

        <section className="mb-4">
          <h5 className="text-blue">2. Use of the Application</h5>
          <p>You agree to use the application only for lawful purposes and in accordance with all applicable laws and regulations. You may not use the app to upload or transmit Protected Health Information (PHI).</p>
        </section>

        <section className="mb-4">
          <h5 className="text-blue">3. User Accounts</h5>
          <p>To access certain features, you may need to register an account. You are responsible for maintaining the confidentiality of your account credentials.</p>
        </section>

        <section className="mb-4">
          <h5 className="text-blue">4. Intellectual Property</h5>
          <p>All content, software, and functionality are the property of the application developer unless otherwise stated. Unauthorized use may violate copyright or trademark laws.</p>
        </section>

        <section className="mb-4">
          <h5 className="text-blue">5. Termination</h5>
          <p>We reserve the right to suspend or terminate access at our sole discretion without notice if we believe you have violated these terms.</p>
        </section>

        <section className="mb-0">
          <h5 className="text-blue">6. Modifications</h5>
          <p>We may revise these Terms of Use from time to time. Continued use of the app means you accept any changes.</p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfUsePage;
