import React from 'react';
import ModalContent from './ModalContent'; // Import ModalContent component

const BookModal = ({ book, onClose }) => {
  return (
    <>
      {/* Modal Background */}
      <div 
        className="position-fixed"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="d-flex justify-content-center align-items-center"
        onClick={(e) => e.stopPropagation()} 
      >
        <ModalContent book={book} onClose={onClose} />
      </div>
    </>
  );
};

export default BookModal;
