import React from 'react';
import { Link } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';

const BackButton = ({ destination = '/' }) => {
  return (
    <div className="d-flex">
      <Link to={destination} className="btn btn-back">
        <BsArrowLeft className="fs-4" />
        Back
      </Link>
    </div>
  );
};

export default BackButton;
