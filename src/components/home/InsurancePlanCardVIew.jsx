import React, { useState } from 'react';
import InsurancePlanModalContent from '../InsurancePlanModalContent';

const getNestedValue = (obj, path) =>
  path.split('.').reduce((acc, key) => acc?.[key], obj);

const InsurancePlanCardView = ({ books }) => {
  const [selectedBook, setSelectedBook] = useState(null);

  return (
    <>
      <div className="container py-4">
        <div className="row g-4">
          {books.map((book) => (
            <div key={book._id} className="col-12 col-sm-6 col-lg-4">
              <div
                className="card h-100 border-0 shadow-sm p-3 responsive-card"
                onClick={() => setSelectedBook(book)}
                style={{ cursor: 'pointer' }}
              >
                {/* Header */}
                <h5 className="text-center fw-bold mb-1">{book.descriptiveName}</h5>
                <p className="text-center text-muted mb-3" style={{ fontSize: '0.85rem' }}>
                  {book.financialClass}
                </p>

                {/* Key Front Details */}
                <p className="mb-1"><strong>Plan Name:</strong> {book.planName}</p>
                <p className="mb-1"><strong>Plan Code:</strong> {book.planCode}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Placeholder */}
      {selectedBook && (
  <InsurancePlanModalContent
    book={selectedBook}
    onClose={() => setSelectedBook(null)}
  />
)}
    </>
  );
};

export default InsurancePlanCardView;
