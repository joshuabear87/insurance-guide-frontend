import React from 'react';
import BackButton from '../components/BackButton';

const CookiePolicyPage = () => {
  return (
    <div className="container py-5">
      {/* Back button on top */}
      <div className="mb-3">
        <BackButton />
      </div>

      {/* Cookie Policy Card */}
      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: '800px', fontSize: '0.9rem' }}>
        <h2 className="text-center mb-4 text-blue">Cookie Policy</h2>
        <p className="text-muted text-end">Last updated: May 27, 2025</p>

        <section className="mb-4">
          <h5 className="text-blue">1. What Are Cookies?</h5>
          <p>
            Cookies are small text files placed on your device to help websites function effectively and provide useful analytics. They do not access information stored on your device or identify you personally unless you have provided your information.
          </p>
        </section>

        <section className="mb-4">
          <h5 className="text-blue">2. How We Use Cookies</h5>
          <p>We use cookies to:</p>
          <ul>
            <li>Maintain session integrity and authentication</li>
            <li>Remember user preferences like dark mode or facility selection</li>
            <li>Monitor usage and performance (via basic analytics)</li>
          </ul>
        </section>

        <section className="mb-4">
          <h5 className="text-blue">3. Types of Cookies We Use</h5>
          <ul>
            <li><strong>Essential Cookies:</strong> Required for secure login and core features</li>
            <li><strong>Preference Cookies:</strong> Store user settings like theme and facility</li>
            <li><strong>Analytics Cookies:</strong> Help us understand app usage patterns</li>
          </ul>
        </section>

        <section className="mb-4">
          <h5 className="text-blue">4. Managing Cookies</h5>
          <p>
            You can control or disable cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of the application.
          </p>
        </section>

        <section className="mb-4">
          <h5 className="text-blue">5. Third-Party Cookies</h5>
          <p>
            This application does not use third-party advertising cookies. If we integrate any third-party services in the future (e.g., analytics), we will update this policy accordingly.
          </p>
        </section>

        <section className="mb-0">
          <h5 className="text-blue">6. Changes to This Policy</h5>
          <p>
            We may update this Cookie Policy periodically. Continued use of the application after changes implies your acceptance.
          </p>
        </section>
      </div>
    </div>
  );
};

export default CookiePolicyPage;
