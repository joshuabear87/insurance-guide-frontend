import React, { useState } from 'react';
import InsurancePlanModalContent from '../InsurancePlanModalContent';
import { isAdmin } from '../utils/auth';
import EditButton from '../EditButton';
import { formatAddress, formatLabel } from '../../components/utils/helpers';

const BlueCardCardView = ({ rows, visibleColumns, onSelect }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const admin = isAdmin();

  return (
    <>
      <div className="container py-4">
        <div className="row g-4">
          {rows.map((row, i) => (
            <div key={i} className="col-12 col-sm-6 col-lg-4">
              <div
                className="card h-100 bg-blue border-0 shadow-sm p-3 responsive-card position-relative"
                onClick={() => setSelectedBook(row.book)}
                style={{
                  cursor: 'pointer',
                  borderRadius: '0.75rem',
                  color: '#000',
                }}
              >
                {admin && (
                  <EditButton
                    id={row.book._id}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}

                {/* Always show these */}
                <h5 className="text-center fw-bold text-blue mb-1">{row.descriptiveName || '-'}</h5>
                <p className="text-center text-muted text-blue mb-3">{row.financialClass || '-'}</p>
                <p className="text-center text-blue mb-3"><strong>Prefix:</strong> {row.prefix || '-'}</p>

                {/* Section: Plan Details */}
                {[
                  'planName',
                  'planCode',
                  'payerName',
                  'payerCode',
                  'samcContracted',
                  'samfContracted',
                  'payerId',
                  'ipaPayerId',
                ].some((key) => visibleColumns[key] && row[key]) && (
                  <div className="card mb-3 shadow-sm">
                    <div className="card-body">
                      <h6 className="text-center fw-bold border-bottom pb-2 mb-3 text-blue">Plan Details</h6>
                      {[
                        'planName',
                        'planCode',
                        'payerName',
                        'payerCode',
                        'samcContracted',
                        'samfContracted',
                        'payerId',
                        'ipaPayerId',
                      ].map((key) =>
                        visibleColumns[key] && row[key] ? (
                          <p key={key} className="mb-1">
                            <strong>{formatLabel(key)}:</strong> {row[key] || '-'}
                          </p>
                        ) : null
                      )}
                    </div>
                  </div>
                )}

                {/* Section: Addresses */}
                {(visibleColumns.facilityAddress || visibleColumns.providerAddress) && (
                  <div className="card mb-3 shadow-sm">
                    <div className="card-body">
                      <h6 className="text-center fw-bold border-bottom pb-2 mb-3 text-blue">Addresses</h6>
                      {visibleColumns.facilityAddress && (
                        <p className="mb-1">
                          <strong>Facility Address:</strong> {formatAddress(row.facilityAddress)}
                        </p>
                      )}
                      {visibleColumns.providerAddress && (
                        <p className="mb-1">
                          <strong>Provider Address:</strong> {formatAddress(row.providerAddress)}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Section: Communication */}
                {(visibleColumns.phoneNumbers || visibleColumns.portalLinks) && (
                  <div className="card mb-3 shadow-sm">
                    <div className="card-body">
                      <h6 className="text-center fw-bold border-bottom pb-2 mb-3 text-blue">Communication</h6>

                      {visibleColumns.phoneNumbers && (
                        <>
                          <strong>Phone Numbers:</strong>
                          {row.phoneNumbers?.length > 0 ? (
                            <ul className="ms-3 mb-2">
                              {row.phoneNumbers.map((phone, idx) => (
                                <li key={idx}>{phone.title}: {phone.number}</li>
                              ))}
                            </ul>
                          ) : <p className="mb-2">-</p>}
                        </>
                      )}

                      {visibleColumns.portalLinks && (
                        <>
                          <strong>Portal Links:</strong>
                          {row.portalLinks?.length > 0 ? (
                            <ul className="ms-3 mb-0">
                              {row.portalLinks.map((link, idx) => (
                                <li key={idx}>
                                  <a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a>
                                </li>
                              ))}
                            </ul>
                          ) : <p className="mb-0">-</p>}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Section: Notes */}
                {(visibleColumns.authorizationNotes || visibleColumns.notes) && (
                  <div className="card mb-3 shadow-sm">
                    <div className="card-body">
                      <h6 className="text-center fw-bold border-bottom pb-2 mb-3 text-blue">Notes</h6>
                      {visibleColumns.authorizationNotes && row.authorizationNotes && (
                        <p><strong>Authorization Notes:</strong> {row.authorizationNotes}</p>
                      )}
                      {visibleColumns.notes && row.notes && (
                        <p><strong>Other Notes:</strong> {row.notes}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Section: Images */}
                {(visibleColumns.image || visibleColumns.secondaryImage) && (
                  <div className="card shadow-sm">
                    <div className="card-body text-center">
                      <h6 className="text-center fw-bold border-bottom pb-2 mb-3 text-blue">Card Images</h6>
                      {visibleColumns.image && row.image && (
                        <div className="mb-2">
                          <img src={row.image} alt="Front" style={{ maxWidth: '100%', maxHeight: '150px' }} />
                        </div>
                      )}
                      {visibleColumns.secondaryImage && row.secondaryImage && (
                        <div>
                          <img src={row.secondaryImage} alt="Back" style={{ maxWidth: '100%', maxHeight: '150px' }} />
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

export default BlueCardCardView;
