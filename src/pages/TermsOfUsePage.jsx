import React from 'react';
import BackButton from '../components/BackButton';

const TermsOfUsePage = () => {
  return (
    <div className="container py-5">
      <div className="mb-3">
        <BackButton />
      </div>

      <div className="card shadow p-4 mx-auto" style={{ maxWidth: '850px', fontSize: '0.95rem' }}>
        <h2 className="text-center text-blue mb-1 fw-bold">Terms of Use</h2>
        <p className="text-muted text-center mb-4" style={{ fontSize: '0.85rem' }}>
          Last updated: May 27, 2025
        </p>

        {/* 1. Acceptance */}
        <section className="mb-4">
          <h5 className="text-blue fw-semibold">1. Acceptance of Terms</h5>
          <p>By accessing or using this application, you agree to be bound by these Terms of Use. If you do not agree, do not use the application.</p>
        </section>

        {/* 2. License to Use */}
        <section className="mb-4">
          <h5 className="text-blue fw-semibold">2. License to Use</h5>
          <p>We grant you a limited, non-exclusive, non-transferable license to access and use the application solely for internal hospital or medical administrative purposes. You may not sublicense, resell, or reverse engineer any part of this service.</p>
        </section>

        {/* 3. User Responsibilities */}
        <section className="mb-4">
          <h5 className="text-blue fw-semibold">3. User Responsibilities</h5>
          <ul className="ps-3">
            <li>You must provide accurate and complete information during registration.</li>
            <li>You are responsible for maintaining the confidentiality of your credentials.</li>
            <li>You agree not to misuse the application, attempt unauthorized access, or interfere with system functionality.</li>
          </ul>
        </section>

        {/* 4. No PHI */}
        <section className="mb-4">
          <h5 className="text-blue fw-semibold">4. Prohibited Content</h5>
          <p className="text-danger fw-semibold">⚠️ This application is <u>not intended</u> for storing, transmitting, or displaying Protected Health Information (PHI). You agree not to enter any PHI into the system.</p>
        </section>

        {/* 5. Ownership */}
        <section className="mb-4">
          <h5 className="text-blue fw-semibold">5. Intellectual Property</h5>
          <p>All source code, logos, graphics, and database architecture are owned by the application developer and protected under copyright and intellectual property laws. Unauthorized use is strictly prohibited.</p>
        </section>

        {/* 6. Termination */}
        <section className="mb-4">
          <h5 className="text-blue fw-semibold">6. Suspension and Termination</h5>
          <p>We reserve the right to suspend or terminate your access to the application at our sole discretion for violation of these terms, misuse of the service, or threats to system security.</p>
        </section>

        {/* 7. Disclaimer */}
        <section className="mb-4">
          <h5 className="text-blue fw-semibold">7. Disclaimer of Warranty</h5>
          <p>This application is provided "as is" without warranties of any kind, express or implied. We do not guarantee that the application will be uninterrupted, error-free, or secure.</p>
        </section>

        {/* 8. Limitation of Liability */}
        <section className="mb-4">
          <h5 className="text-blue fw-semibold">8. Limitation of Liability</h5>
          <p>We are not liable for any damages, including indirect or consequential damages, arising from your use of the application. Your sole remedy for dissatisfaction is to stop using the service.</p>
        </section>

        {/* 9. Cookies & Tracking */}
        <section className="mb-4">
          <h5 className="text-blue fw-semibold">9. Cookies and Analytics</h5>
          <p>We may use cookies or similar technologies to enhance user experience and track usage. By using the app, you consent to the use of these cookies. <a href="/cookie-policy">Learn more in our Cookie Policy</a>.</p>
        </section>

        {/* 10. Governing Law */}
        <section className="mb-4">
          <h5 className="text-blue fw-semibold">10. Governing Law</h5>
          <p>These Terms are governed by the laws of the State of California, without regard to conflict of law principles.</p>
        </section>

        {/* 11. Changes to Terms */}
        <section className="mb-4">
          <h5 className="text-blue fw-semibold">11. Changes to These Terms</h5>
          <p>We may update these Terms at any time. Revisions will be posted on this page with a new effective date. Continued use of the application indicates acceptance of changes.</p>
        </section>

        {/* 12. Contact */}
        <section className="mb-0">
          <h5 className="text-blue fw-semibold">12. Contact</h5>
          <p>If you have questions about these Terms of Use, please contact your site administrator or email the developer at <a href="mailto:hokenhub@gmail.com">hokenhub@gmail.com</a>.</p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfUsePage;
