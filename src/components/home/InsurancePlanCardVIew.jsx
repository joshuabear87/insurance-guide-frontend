import React, { useState } from 'react';
import { isAdmin } from '../utils/auth';
import columnConfig from '../utils/columnConfig';
import InsurancePlanModalContent from '../InsurancePlanModalContent';
import EditButton from '../EditButton';
import { getNestedValue } from '../utils/helpers';

const InsurancePlanCardView = ({ books, visibleColumns }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const admin = isAdmin();

  return (
    <>
      <div className="container py-4">
        <div className="row g-4">
          {books.map((book, i) => (
            <div key={book._id} className="col-12 col-sm-6 col-lg-4">
              <div
                className="card h-100 bg-light border-0 shadow-lg p-3 responsive-card position-relative"
                onClick={() => setSelectedBook(book)}
                style={{ cursor: 'pointer', borderRadius: '0.75rem', color: '#000' }}
              >
                {admin && (
                  <EditButton
                    id={book._id}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                {columnConfig.map(({ key, label, render }) => {
                  if (!visibleColumns[key]) return null;
                  const value = getNestedValue(book, key);

                  if (key === 'facilityContracts') {
                    return (
                      <div key={key} className="mb-2">
                        <strong>{label}</strong>:
                        <ul className="mb-0 ps-3">
                          {value?.map((contract, idx) => (
                            <li key={idx}>
                              <strong>{contract.facilityName}</strong>: {contract.contractStatus}
                            </li>
                          )) || '-'}
                        </ul>
                      </div>
                    );
                  }

                  return (
                    <div key={key} className="mb-2">
                      <strong>{label}</strong>: {render ? render(value) : value || '-'}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

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
