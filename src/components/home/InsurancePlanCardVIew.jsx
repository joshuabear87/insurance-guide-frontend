import React, { useState } from 'react';
import InsurancePlanModalContent from '../InsurancePlanModalContent';
import { isAdmin } from '../utils/auth';
import EditButton from '../EditButton';
import { getNestedValue, formatAddress, formatLabel } from '../../components/utils/helpers';
import { ensureHttps } from '../utils/urlHelpers';

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
                className="card bg-blue h-100 border-0 shadow-sm p-3 responsive-card position-relative"
                onClick={() => setSelectedBook(book)}
                style={{ cursor: 'pointer' }}
              >
                {admin && (
                  <EditButton id={book._id} onClick={(e) => e.stopPropagation()} />
                )}

                <h5 className="text-center text-blue fw-bold mb-1">{book.descriptiveName || '-'}</h5>
                <p className="text-center text-blue text-muted mb-3">{book.financialClass || '-'}</p>

                {/* Plan Details */}
                {[ 'payerName', 'payerCode', 'planName', 'planCode', 'samcContracted', 'samfContracted', 'payerId', 'ipaPayerId' ]
                  .some((key) => visibleColumns[key] && book[key]) && (
                  <div className="card mb-3 shadow-sm">
                    <div className="card-body">
                      <h6 className="text-center fw-bold border-bottom pb-2 mb-3 text-blue">Plan Details</h6>
                      {[ 'payerName', 'payerCode', 'planName', 'planCode', 'samcContracted', 'samfContracted', 'payerId', 'ipaPayerId' ]
                        .map((key) => visibleColumns[key] && book[key] && (
                          <p key={key} className="mb-1">
                            <strong>{formatLabel(key)}:</strong> {getNestedValue(book, key) || '-'}
                          </p>
                        ))}
                    </div>
                  </div>
                )}

                {/* Addresses */}
                {(visibleColumns.facilityAddress || visibleColumns.providerAddress) && (
                  <div className="card mb-3 shadow-sm">
                    <div className="card-body">
                      <h6 className="text-center fw-bold border-bottom pb-2 mb-3 text-blue">Addresses</h6>
                      {visibleColumns.facilityAddress && (
                        <p className="mb-1"><strong>Facility Address:</strong> {formatAddress(book.facilityAddress)}</p>
                      )}
                      {visibleColumns.providerAddress && (
                        <p className="mb-1"><strong>Provider Address:</strong> {formatAddress(book.providerAddress)}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Communication */}
                {(visibleColumns.phoneNumbers || visibleColumns.portalLinks) && (
                  <div className="card mb-3 shadow-sm">
                    <div className="card-body">
                      <h6 className="text-center fw-bold border-bottom pb-2 mb-3 text-blue">Communication</h6>
                      {visibleColumns.phoneNumbers && (
                        <>
                          <strong>Phone Numbers:</strong>
                          {book.phoneNumbers?.length > 0 ? (
                            <ul className="ms-3 mb-2">
                              {book.phoneNumbers.map((phone, idx) => (
                                <li key={idx}>{phone.title}: {phone.number}</li>
                              ))}
                            </ul>
                          ) : <p className="mb-2">-</p>}
                        </>
                      )}
                      {visibleColumns.portalLinks && (
                        <>
                          <strong>Portal Links:</strong>
                          {book.portalLinks?.length > 0 ? (
                            <ul className="ms-3 mb-0">
                              {book.portalLinks.map((link, idx) => (
                                <li key={idx}>
                                  <a
                                    href={ensureHttps(link.url)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {link.title}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          ) : <p className="mb-0">-</p>}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Prefixes */}
                {visibleColumns.prefixes && (
                  <div className="card mb-3 shadow-sm">
                    <div className="card-body">
                      <h6 className="text-center fw-bold border-bottom pb-2 mb-3 text-blue">Prefixes</h6>
                      <p className="mb-0">
                        {book.prefixes?.length > 0 ? book.prefixes.map((p) => p.value).join(', ') : '-'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {(visibleColumns.authorizationNotes || visibleColumns.notes) && (book.authorizationNotes || book.notes) && (
                  <div className="card mb-3 shadow-sm">
                    <div className="card-body">
                      <h6 className="text-center fw-bold border-bottom pb-2 mb-3 text-blue">Notes</h6>
                      {visibleColumns.authorizationNotes && book.authorizationNotes && (
                        <p><strong>Authorization Notes:</strong> {book.authorizationNotes}</p>
                      )}
                      {visibleColumns.notes && book.notes && (
                        <p><strong>Other Notes:</strong> {book.notes}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Images */}
                {(visibleColumns.image || visibleColumns.secondaryImage) && (
                  <div className="card shadow-sm">
                    <div className="card-body text-center">
                      <h6 className="text-center fw-bold border-bottom pb-2 mb-3 text-blue">Card Images</h6>
                      {visibleColumns.image && book.image && (
                        <div className="mb-2">
                          <img src={book.image} alt="Front of card" style={{ maxWidth: '100%', maxHeight: '150px' }} />
                        </div>
                      )}
                      {visibleColumns.secondaryImage && book.secondaryImage && (
                        <div>
                          <img src={book.secondaryImage} alt="Back of card" style={{ maxWidth: '100%', maxHeight: '150px' }} />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedBook && (
        <InsurancePlanModalContent book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </>
  );
};

export default InsurancePlanCardView;
