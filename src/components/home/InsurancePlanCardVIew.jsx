import React, { useState } from 'react';
import InsurancePlanModalContent from '../InsurancePlanModalContent';

const getNestedValue = (obj, path) =>
  path.split('.').reduce((acc, key) => acc?.[key], obj);

const InsurancePlanCardView = ({ books, visibleColumns }) => {
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
                {visibleColumns.descriptiveName && (
                  <h5 className="text-center fw-bold mb-1">{book.descriptiveName}</h5>
                )}
                {visibleColumns.financialClass && (
                  <p className="text-center text-muted mb-3" style={{ fontSize: '0.85rem' }}>
                    {book.financialClass}
                  </p>
                )}

                {/* Core Details */}
                {visibleColumns.planName && <p><strong>Plan Name:</strong> {book.planName}</p>}
                {visibleColumns.planCode && <p><strong>Plan Code:</strong> {book.planCode}</p>}
                {visibleColumns.payerName && <p><strong>Payer Name:</strong> {book.payerName}</p>}
                {visibleColumns.payerCode && <p><strong>Payer Code:</strong> {book.payerCode}</p>}
                {visibleColumns.samcContracted && (
                  <p><strong>SAMC Contracted:</strong> {book.samcContracted}</p>
                )}
                {visibleColumns.samfContracted && (
                  <p><strong>SAMF Contracted:</strong> {book.samfContracted}</p>
                )}
                {visibleColumns.prefixes && (
                  <p><strong>Prefixes:</strong> {book.prefixes?.map(p => p.value).join(', ') || 'N/A'}</p>
                )}
                {visibleColumns.notes && (
                  <p><strong>Notes:</strong> {book.notes || 'N/A'}</p>
                )}
                {visibleColumns.authorizationNotes && (
                  <p><strong>Auth Notes:</strong> {book.authorizationNotes || 'N/A'}</p>
                )}
                {visibleColumns.payerId && <p><strong>Payer ID:</strong> {book.payerId}</p>}
                {visibleColumns.ipaPayerId && <p><strong>IPA Payer ID:</strong> {book.ipaPayerId}</p>}

                {/* Addresses */}
                {visibleColumns['facilityAddress.street'] && (
                  <p><strong>Facility Street:</strong> {book.facilityAddress?.street || 'N/A'}</p>
                )}
                {visibleColumns['facilityAddress.city'] && (
                  <p><strong>Facility City:</strong> {book.facilityAddress?.city || 'N/A'}</p>
                )}
                {visibleColumns['facilityAddress.state'] && (
                  <p><strong>Facility State:</strong> {book.facilityAddress?.state || 'N/A'}</p>
                )}
                {visibleColumns['facilityAddress.zip'] && (
                  <p><strong>Facility ZIP:</strong> {book.facilityAddress?.zip || 'N/A'}</p>
                )}
                {visibleColumns['providerAddress.street'] && (
                  <p><strong>Provider Street:</strong> {book.providerAddress?.street || 'N/A'}</p>
                )}
                {visibleColumns['providerAddress.city'] && (
                  <p><strong>Provider City:</strong> {book.providerAddress?.city || 'N/A'}</p>
                )}
                {visibleColumns['providerAddress.state'] && (
                  <p><strong>Provider State:</strong> {book.providerAddress?.state || 'N/A'}</p>
                )}
                {visibleColumns['providerAddress.zip'] && (
                  <p><strong>Provider ZIP:</strong> {book.providerAddress?.zip || 'N/A'}</p>
                )}

                {/* Images */}
                {visibleColumns.image && book.image && (
                  <div className="text-center mb-2">
                    <img src={book.image} alt="Front" style={{ maxWidth: '100%', maxHeight: '150px' }} />
                  </div>
                )}
                {visibleColumns.secondaryImage && book.secondaryImage && (
                  <div className="text-center">
                    <img src={book.secondaryImage} alt="Back" style={{ maxWidth: '100%', maxHeight: '150px' }} />
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
