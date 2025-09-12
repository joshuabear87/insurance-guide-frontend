import BackButton from '../features/components/common/BackButton';

const PrivacyPolicyPage = () => {
  return (
    <div className="container py-5">
      <div className="mb-3">
        <BackButton />
      </div>

      <div className="card shadow p-4 mx-auto" style={{ maxWidth: '850px', fontSize: '0.95rem' }}>
        <h2 className="text-center text-blue mb-1 fw-bold">Privacy Policy</h2>
        <p className="text-muted text-center mb-4" style={{ fontSize: '0.85rem' }}>
          Last updated: May 27, 2025
        </p>

        {/* Intro */}
        <section className="mb-4">
          <h5 className="text-blue fw-semibold">1. Introduction</h5>
          <p>We value your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our application. By using the service, you consent to the practices described here.</p>
        </section>

        {/* Information We Collect */}
        <section className="mb-4">
          <h5 className="text-blue fw-semibold">2. Information We Collect</h5>
          <ul className="ps-3">
            <li><strong>Personal Information:</strong> Name, email, phone number, NPI, department, facility access, and role.</li>
            <li><strong>Usage Logs:</strong> Login activity, user actions, and IP address for auditing and security.</li>
            <li><strong>Device Info:</strong> Browser type, operating system, and other diagnostic data.</li>
          </ul>
          <p className="mt-2 text-danger fw-semibold">⚠️ No Protected Health Information (PHI) should be entered into this application.</p>
        </section>

        {/* Usage of Info */}
        <section className="mb-4">
          <h5 className="text-blue fw-semibold">3. How We Use Your Information</h5>
          <ul className="ps-3">
            <li>To authenticate and authorize users based on facility access</li>
            <li>To administer and manage accounts, permissions, and roles</li>
            <li>To monitor usage and performance for improvement</li>
            <li>To detect and respond to misuse or unauthorized activity</li>
            <li>To comply with legal and regulatory obligations</li>
          </ul>
        </section>

        {/* Data Security */}
        <section className="mb-4">
          <h5 className="text-blue fw-semibold">4. Data Security & Storage</h5>
          <p>We use secure third-party platforms such as <strong>MongoDB Atlas</strong>, <strong>Render</strong>, and <strong>Cloudinary</strong> to store data. All traffic is encrypted via HTTPS. Administrative actions are role-restricted and logged. While we apply industry best practices, no system can guarantee absolute security.</p>
        </section>

        {/* Retention */}
        <section className="mb-4">
          <h5 className="text-blue fw-semibold">5. Data Retention</h5>
          <p>We retain your information only as long as necessary to provide services and fulfill our legal obligations. You may request deletion of your account by contacting your facility administrator.</p>
        </section>

        {/* Sharing */}
        <section className="mb-4">
          <h5 className="text-blue fw-semibold">6. Sharing of Information</h5>
          <p>We do not sell or rent your data. Your information may be shared only in the following cases:</p>
          <ul className="ps-3">
            <li>With trusted vendors solely to deliver application functionality</li>
            <li>To comply with legal requests or prevent fraud</li>
            <li>To investigate abuse or security threats</li>
          </ul>
        </section>

        {/* Cookies */}
        <section className="mb-4">
          <h5 className="text-blue fw-semibold">7. Cookies and Session Storage</h5>
          <p>We may use cookies or local/session storage for login authentication and analytics. You can disable cookies in your browser settings, but this may affect app performance.</p>
        </section>

        {/* User Rights */}
        <section className="mb-4">
          <h5 className="text-blue fw-semibold">8. Your Rights</h5>
          <ul className="ps-3">
            <li>View the information we have about you</li>
            <li>Request updates or deletion of your account</li>
            <li>Withdraw consent for certain data usage</li>
          </ul>
          <p className="mt-2">To make any of these requests, contact your administrator.</p>
        </section>

        {/* Children's Privacy */}
        <section className="mb-4">
          <h5 className="text-blue fw-semibold">9. Children's Privacy</h5>
          <p>This application is intended for use by authorized professionals. We do not knowingly collect data from children under 13.</p>
        </section>

        {/* Changes */}
        <section className="mb-0">
          <h5 className="text-blue fw-semibold">10. Policy Updates</h5>
          <p>We may update this Privacy Policy periodically. Revisions will be noted above. Continued use of the app constitutes acceptance of the updated terms.</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
