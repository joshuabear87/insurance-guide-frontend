import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineAddBox } from 'react-icons/md';
import { FaBars } from 'react-icons/fa';

const NavBar = ({ showType, setShowType }) => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavToggle = () => setIsNavCollapsed(!isNavCollapsed);

  const buttonStyle = {
    width: '60px',
    height: '60px',
    backgroundColor: '#EBD8B7',
    color: 'black',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease-in-out',
  };

  const hoverStyle = {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
  };

  return (
    <nav className="navbar navbar-expand-lg shadow p-3 mb-2 font-japanese text-ink w-100" style={{ backgroundColor: '#EBD8B7', opacity: 0.9 }}>
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Logo */}
        <img
          src="/yomimono-logo.PNG"
          alt="Yomimono Logo"
          className="rounded-circle"
          style={{ height: '150px', width: '150px', objectFit: 'contain' }}
        />

        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={handleNavToggle}
          aria-controls="navbarNav"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
        >
          <FaBars color="black" />
        </button>

        {/* Collapsible content */}
        <div className={`collapse navbar-collapse ${isNavCollapsed ? '' : 'show'}`} id="navbarNav">
          <div className="ms-auto d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-3 mt-3 mt-lg-0">
            {/* Table View Button */}
            <button
              onClick={() => setShowType('table')}
              className={`btn rounded-circle d-flex align-items-center justify-content-center ${
                showType === 'table' ? 'btn-scrollEdge text-white' : 'btn-outline-scrollEdge'
              }`}
              style={buttonStyle}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
            >
              Table
            </button>

            {/* Card View Button */}
            <button
              onClick={() => setShowType('card')}
              className={`btn rounded-circle d-flex align-items-center justify-content-center ${
                showType === 'card' ? 'btn-scrollEdge text-white' : 'btn-outline-scrollEdge'
              }`}
              style={buttonStyle}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
            >
              Card
            </button>

            {/* New Book Button */}
            <Link
              to="/books/create"
              className="btn rounded-circle d-flex align-items-center justify-content-center"
              style={buttonStyle}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
            >
              <span className="me-1" style={{ fontSize: '0.8rem' }}>New</span>
              <MdOutlineAddBox size={30} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
