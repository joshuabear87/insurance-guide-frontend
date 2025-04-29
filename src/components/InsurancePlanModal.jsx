import React from 'react';
import InsurancePlanModalContent from './InsurancePlanModalContent';

const InsurancePlanModal = ({ book, onClose }) => {
  return (
    <>
      <div className="position-fixed" onClick={onClose} />
      <div className="d-flex justify-content-center align-items-center" onClick={(e) => e.stopPropagation()}>
        <InsurancePlanModalContent book={book} onClose={onClose} />
      </div>
    </>
  );
};

export default InsurancePlanModal;
