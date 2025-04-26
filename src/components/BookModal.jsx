import React from 'react';
import ModalContent from './ModalContent';

const BookModal = ({ book, onClose }) => {
  return (
    <>
      <div className="position-fixed" onClick={onClose} />
      <div className="d-flex justify-content-center align-items-center" onClick={(e) => e.stopPropagation()}>
        <ModalContent book={book} onClose={onClose} />
      </div>
    </>
  );
};

export default BookModal;
