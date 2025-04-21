import React from 'react';
import { Link } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';

const BackButton = ({ destination = '/' }) => {
  return (
    <div className="d-flex">
      <Link
        to={destination}
        className="btn btn-lg d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm"
        style={{
          backgroundColor: '#b28b51',        // scrollEdge
          color: 'white',
          transition: 'all 0.3s ease-in-out',
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#a2763d'; // slightly darker scrollEdge
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#b28b51';
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
        }}
      >
        <BsArrowLeft className="fs-4" />
        Back
      </Link>
    </div>
  );
};

export default BackButton;
