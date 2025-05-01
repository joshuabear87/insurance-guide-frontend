import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-light text-center py-3 border-top mt-5">
      <div className="container">
        <small className="text-muted">
          &copy; {new Date().getFullYear()} <strong>Hoken Hub</strong> — a <em>Wakai Kuma LLC</em> production
        </small>
      </div>
    </footer>
  );
};

export default Footer;
