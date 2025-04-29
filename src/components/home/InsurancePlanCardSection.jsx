import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';

const InsurancePlanCardSection = ({ books }) => {
  const [selectedBook, setSelectedBook] = useState(null);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedBook(null);
    }
  };

  return (
    <>
      <div className="container py-4">
        <div className="row g-4">
          {books.map((book, index) => (
            <div key={book._id} className="col-12 col-sm-6 col-lg-4">
              <div className="card h-100 border-0 rounded-4 p-3 shadow-sm">
                <div>
                  <h5 className="fw-semibold mb-3">{book.descriptiveName}</h5>
                  
                  <p className="mb-1"><strong>Financial Class:</strong> {book.financialClass}</p>
                  <p className="mb-1"><strong>Payer Code:</strong> {book.payerCode}</p>
                  <p className="mb-1"><strong>Payer Name:</strong> {book.payerName}</p>
                  <p className="mb-1"><strong>Plan Code:</strong> {book.planCode}</p>
                  <p className="mb-1"><strong>Plan Name:</strong> {book.planName}</p>
                  <p className="mb-1"><strong>SAMC Contracted:</strong> {book.samcContracted}</p>
                  <p className="mb-1"><strong>SAMF Contracted:</strong> {book.samfContracted}</p>
                  <p className="mb-2"><strong>Notes:</strong> {book.notes}</p>

                  {book.image && (
                    <div className="text-center mb-3">
                      <img src={book.image} alt="Book" className="img-fluid rounded" />
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-end gap-3 fs-5 mt-3">
                  <button
                    className="btn p-0 border-0 bg-transparent"
                    onClick={() => setSelectedBook(book)}
                  >
                    <AiOutlineEye />
                  </button>
                  <Link to={`/books/details/${book._id}`} className="text-decoration-none">
                    <BsInfoCircle />
                  </Link>
                  <Link to={`/books/edit/${book._id}`} className="text-decoration-none">
                    <AiOutlineEdit />
                  </Link>
                  <Link to={`/books/delete/${book._id}`} className="text-decoration-none">
                    <MdOutlineDelete />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedBook && (
        <div
          className="modal-backdrop d-flex justify-content-center align-items-center"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1050
          }}
          onClick={handleBackdropClick}
        >
          <div
            className="p-4 rounded-4 shadow-lg bg-white text-dark"
            style={{
              maxWidth: '500px',
              width: '90%',
            }}
          >
            <h4 className="fw-bold mb-3">{selectedBook.descriptiveName}</h4>
            <p><strong>Financial Class:</strong> {selectedBook.financialClass}</p>
            <p><strong>Payer Code:</strong> {selectedBook.payerCode}</p>
            <p><strong>Payer Name:</strong> {selectedBook.payerName}</p>
            <p><strong>Plan Code:</strong> {selectedBook.planCode}</p>
            <p><strong>Plan Name:</strong> {selectedBook.planName}</p>
            <p><strong>SAMC Contracted:</strong> {selectedBook.samcContracted}</p>
            <p><strong>SAMF Contracted:</strong> {selectedBook.samfContracted}</p>
            <p><strong>Notes:</strong> {selectedBook.notes}</p>

            {selectedBook.image && (
              <div className="text-center mt-3">
                <img src={selectedBook.image} alt="Book" className="img-fluid rounded" />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default InsurancePlanCardSection;
