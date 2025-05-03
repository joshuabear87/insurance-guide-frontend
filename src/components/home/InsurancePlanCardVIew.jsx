import React, { useState } from 'react';
import InsurancePlanModalContent from '../InsurancePlanModalContent';
import { isAdmin } from '../utils/auth';
import EditButton from '../EditButton';
import { getNestedValue, formatAddress, formatLabel } from '../../components/utils/helpers';

const InsurancePlanCardView = ({ books, visibleColumns }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const admin = isAdmin();

  return (
    <>
      <div className="container py-4">
        <div className="row g-4">
          {books.map((book) => (
            <div key={book._id} className="col-12 col-sm-6 col-lg-4">
              <div
                className="card h-100 border-0 shadow-sm p-3 responsive-card position-relative"
                onClick={() => setSelectedBook(book)}
                style={{ cursor: 'pointer' }}
              >
                {admin && (
                  <EditButton id={book._id} onClick={(e) => e.stopPropagation()} />
                )}

                {Object.entries(visibleColumns).map(([key, isVisible]) => {
                  if (!isVisible || key.includes('.') || key === 'image' || key === 'secondaryImage') return null;

                  if (key === 'facilityAddress' || key === 'providerAddress') {
                    return (
                      <p key={key} className="card-content">
                        <strong>{formatLabel(key)}:</strong>{' '}
                        {formatAddress(book[key])}
                      </p>
                    );
                  }

                  const value = getNestedValue(book, key);

                  if (key === 'descriptiveName') {
                    return (
                      <h5 key={key} className="text-center fw-bold mb-1 card-title">
                        {value || '-'}
                      </h5>
                    );
                  }

                  if (key === 'financialClass') {
                    return (
                      <p key={key} className="text-center text-muted mb-3 card-subtitle">
                        {value || '-'}
                      </p>
                    );
                  }

                  if (key === 'prefixes') {
                    return (
                      <p key={key} className="card-content">
                        <strong>{formatLabel(key)}:</strong>{' '}
                        {value?.length > 0 ? value.map((p) => p.value).join(', ') : '-'}
                      </p>
                    );
                  }

                  if (key === 'portalLinks') {
                    return (
                      <div key={key} className="card-content">
                        <strong>{formatLabel(key)}:</strong>
                        {value?.length > 0 ? (
                          <ul className="ms-3 mb-2">
                            {value.map((link, index) => (
                              <li key={index}>
                                <a href={link.url} target="_blank" rel="noopener noreferrer">
                                  {link.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span> - </span>
                        )}
                      </div>
                    );
                  }

                  if (key === 'phoneNumbers') {
                    return (
                      <div key={key} className="card-content">
                        <strong>{formatLabel(key)}:</strong>
                        {value?.length > 0 ? (
                          <ul className="ms-3 mb-2">
                            {value.map((phone, index) => (
                              <li key={index}>
                                {phone.title}: {phone.number}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span> - </span>
                        )}
                      </div>
                    );
                  }

                  return (
                    <p key={key} className="card-content">
                      <strong>{formatLabel(key)}:</strong> {value || '-'}
                    </p>
                  );
                })}

                {visibleColumns.image && book.image && (
                  <div className="text-center mb-2">
                    <img
                      src={book.image}
                      alt="Front"
                      style={{ maxWidth: '100%', maxHeight: '150px' }}
                    />
                  </div>
                )}
                {visibleColumns.secondaryImage && book.secondaryImage && (
                  <div className="text-center">
                    <img
                      src={book.secondaryImage}
                      alt="Back"
                      style={{ maxWidth: '100%', maxHeight: '150px' }}
                    />
                  </div>
                )}
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
