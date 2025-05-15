import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-light text-center py-3 fixed-bottom shadow-lg border-top mt-5">
      <div>
        <small className="d-block">
          &copy; {new Date().getFullYear()} Joshua Atendido Bear, <em>Hoken Hub</em>. All rights reserved.
        </small>
        <small className="d-block mt-1">
          <Link to="/terms" className="text-dark mx-2 text-decoration-none">Terms of Use</Link>
          |
          <Link to="/privacy" className="text-dark mx-2 text-decoration-none">Privacy Policy</Link>
        </small>
      </div>
    </footer>
  );
};

export default Footer;
