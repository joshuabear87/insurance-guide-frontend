import React, { useContext } from 'react';
import { FacilityContext } from '../context/FacilityContext';

const Spinner = () => {
  const { facility, facilityTheme } = useContext(FacilityContext);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
      <div className="spinner-border" style={{ color: facilityTheme.primaryColor, width: '5rem', height: '5rem' }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
