import React, { useState, useContext } from 'react';
import { isAdmin } from '../utils/auth';
import InsurancePlanModalContent from '../InsurancePlanModalContent';
import EditButton from '../EditButton';
import { getNestedValue, getContractColor } from '../utils/helpers';
import { FacilityContext } from '../../context/FacilityContext';

const InsurancePlanCardView = ({ books, visibleColumns }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const admin = isAdmin();
  const { facility, facilityTheme } = useContext(FacilityContext);

  const renderSection = (title, children) => (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <h6 className="text-center fw-bold border-bottom pb-2 mb-3" style={{ color: facilityTheme.primaryColor }} >{title}</h6>
        {children}
      </div>
    </div>
  );

  const planDetailsFields = [
    'payerName', 'payerCode',
    'planName', 'planCode',
    'payerId', 'ipaPayerId'
  ];

    const planDetailLabels = {
  payerName: 'Payer Name',
  payerCode: 'Payer Code',
  planName: 'Plan Name',
  planCode: 'Plan Code',
  payerId: 'Payer ID (HB)',
  ipaPayerId: 'Payer ID (PB)',
};

  return (
    <>
      <div className="container py-4">
        <div className="row g-4">
          {books.map((book) => (
            <div key={book._id} className="col-12 col-sm-6 col-lg-4">
              <div
                className="card h-100 bg-white border shadow-sm p-3 rounded position-relative"
                onClick={() => setSelectedBook(book)}
                style={{ cursor: 'pointer' }}
              >
                {/* Admin Edit Button */}
                {admin && (
                  <div className="position-absolute top-0 end-0 p-2">
                    <EditButton id={book._id} onClick={(e) => e.stopPropagation()} />
                  </div>
                )}

                {/* Header: Name + Class */}
                <div className="text-center border-bottom pb-2 mb-3">
                  <h5 className="fw-bold mb-1">{getNestedValue(book, 'descriptiveName') || '-'}</h5>
                  <div className="text-muted small">{getNestedValue(book, 'financialClass') || '-'}</div>
                </div>


                {/* Plan Details */}
{planDetailsFields.some(key => visibleColumns[key]) &&
  renderSection(
    'Plan Details',
    planDetailsFields.map((key) =>
      visibleColumns[key] ? (
        <p key={key} className="mb-1 small">
          <strong>{planDetailLabels[key] || key}:</strong> {book[key] || '-'}
        </p>
      ) : null
    )
  )}


                  
                {/* Facility Contracts */}
                {visibleColumns.facilityContracts &&
                  renderSection(
                    'Contracting',
                    book.facilityContracts?.length > 0 ? (
                      <ul className="list-unstyled mb-2">
                        {book.facilityContracts.map((contract, idx) => (
                          <li key={idx} style={{ color: getContractColor(contract.contractStatus) }}><strong>{contract.facilityName}:</strong> {contract.contractStatus}</li>
                        ))}
                      </ul>
                    ) : <p className="mb-2">-</p>
                  )}

              {/* Prefix Section */}
{visibleColumns.prefixes && book.prefixes?.length > 0 &&
  renderSection(
    'Prefixes',
    <div className="d-flex flex-wrap justify-content-center gap-2">
      {book.prefixes.map((prefix, idx) => (
        <div
          key={idx}
          className="px-2 py-1 border text-light rounded shadow-sm small text-center"
          style={{ backgroundColor: facilityTheme.primaryColor }}
        >
          <strong>{prefix.value}</strong>
        </div>
      ))}
    </div>
  )}


                {/* Addresses */}
                {(visibleColumns.facilityAddress || visibleColumns.providerAddress) &&
                  renderSection(
                    'Addresses',
                    <>
                      {visibleColumns.facilityAddress && book.facilityAddress && (
                        <p className="mb-1 small">
                          <strong>Claims Address (HB):</strong> {Object.values(book.facilityAddress).filter(Boolean).join(', ') || '-'}
                        </p>
                      )}
                      {visibleColumns.providerAddress && book.providerAddress && (
                        <p className="mb-1 small">
                          <strong>Claims Address (PB):</strong> {Object.values(book.providerAddress).filter(Boolean).join(', ') || '-'}
                        </p>
                      )}
                    </>
                  )}

                {/* Communication */}
                {(visibleColumns.phoneNumbers || visibleColumns.portalLinks) &&
                  renderSection(
                    'Communication',
                    <>
                      {visibleColumns.phoneNumbers && (
                        <>
                          <p className='small mb-0'><strong>Phone Numbers</strong></p>
                          {book.phoneNumbers?.length > 0 ? (
                            <ul className="list-unstyled mb-2">
                              {book.phoneNumbers.map((p, idx) => (
                                <li key={idx}>{p.title}: {p.number}</li>
                              ))}
                            </ul>
                          ) : <p className="mb-2">-</p>}
                        </>
                      )}
                      {visibleColumns.portalLinks && (
                        <>
                          <p className='small'><strong>Portal Links:</strong></p>
                          {book.portalLinks?.length > 0 ? (
                            <ul className="list-unstyled mb-0">
                              {book.portalLinks.map((link, idx) => (
                                <li key={idx}>
                                  <a
                                    href={link.url}
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
                    </>
                  )}

                {/* Notes */}
                {(visibleColumns.authorizationNotes || visibleColumns.notes) &&
                  renderSection(
                    'Notes',
                    <>
                      {visibleColumns.authorizationNotes && book.authorizationNotes && (
                        <p className="mb-2 small"><strong>Authorization Notes:</strong> {book.authorizationNotes}</p>
                      )}
                      {visibleColumns.notes && book.notes && (
                        <p className="mb-2 small"><strong>Elig Notes:</strong> {book.notes}</p>
                      )}
                    </>
                  )}

                {/* Images */}
                {(visibleColumns.image || visibleColumns.secondaryImage) &&
                  renderSection(
                    'Card Images',
                    <>
                      {visibleColumns.image && book.image && (
                        <div className="mb-2">
                          <img src={book.image} alt="Front" style={{ maxWidth: '100%', maxHeight: '150px' }} />
                        </div>
                      )}
                      {visibleColumns.secondaryImage && book.secondaryImage && (
                        <div>
                          <img src={book.secondaryImage} alt="Back" style={{ maxWidth: '100%', maxHeight: '150px' }} />
                        </div>
                      )}
                    </>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
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
