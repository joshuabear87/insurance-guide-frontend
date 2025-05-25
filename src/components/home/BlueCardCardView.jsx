import React, { useState, useContext } from 'react';
import InsurancePlanModalContent from '../InsurancePlanModalContent';
import { isAdmin } from '../utils/auth';
import EditButton from '../EditButton';
import { formatAddress, formatLabel, getContractColor } from '../../components/utils/helpers';
import { ensureHttps } from '../utils/urlHelpers';
import { FacilityContext } from '../../context/FacilityContext';

const BlueCardCardView = ({ rows, visibleColumns }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const admin = isAdmin();
  const { facility, facilityTheme } = useContext(FacilityContext);

  // Utility: render a styled section
  const renderSection = (title, children) => (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <h6 className="text-center fw-bold border-bottom pb-2 mb-3" style={{ color: facilityTheme.primaryColor }}>{title}</h6>
        {children}
      </div>
    </div>
  );

  // Field definitions for DRY mapping
  const planDetails = [
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
          {rows.map((row, i) => (
            <div key={i} className="col-12 col-sm-6 col-lg-4">
              <div
                className="card h-100 bg-light border-0 shadow-lg p-3 rounded position-relative"
                onClick={() => setSelectedBook(row.book)}
                style={{ cursor: 'pointer' }}
              >
                {admin && (
                  <div className="position-absolute top-0 end-0 p-2">
                    <EditButton id={row.book._id} onClick={(e) => e.stopPropagation()} />
                  </div>
                )}

                {/* Prefix + subtitle */}
                <div className="text-center border-bottom pb-2 mb-3">
                  <h4 className="fw-bold mb-1" style={{ color: facilityTheme.primaryColor }}>{row.prefix || '-'}</h4>
                  <div className="text-muted small">
                    {row.descriptiveName || '-'} – {row.financialClass || '-'}
                  </div>
                </div>

                {/* Plan Details */}
                {planDetails.some((key) => visibleColumns[key]) &&
                  renderSection(
                    'Plan Details',
                    planDetails.map((key) =>
                      visibleColumns[key] ? (
                        <p key={key} className="mb-1">
                          <strong>{planDetailLabels[key] || key}:</strong> {row[key] || '-'}
                        </p>
                      ) : null
                    )
                  )}

                {/* Facility Contracts */}
                {visibleColumns.facilityContracts &&
                  renderSection(
                    'Contracting',
                    row.facilityContracts?.length > 0 ? (
                      <ul className="list-unstyled mb-2">
                        {row.facilityContracts.map((c, idx) => (
                          <li key={idx} style={{ color: getContractColor(c.contractStatus) }}><strong>{c.facilityName}:</strong> {c.contractStatus}</li>
                        ))}
                      </ul>
                    ) : <p className="mb-2">-</p>
                  )}

                {/* Addresses */}
                {(visibleColumns.facilityAddress || visibleColumns.providerAddress) &&
                  renderSection(
                    'Addresses',
                    <>
                      {visibleColumns.facilityAddress && (
                        <p><strong>Claims Address (HB)</strong> {formatAddress(row.facilityAddress)}</p>
                      )}
                      {visibleColumns.providerAddress && (
                        <p><strong>Claims Address (PB)</strong> {formatAddress(row.providerAddress)}</p>
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
                          <p className='small'><strong>Phone Numbers:</strong></p>
                          {row.phoneNumbers?.length > 0 ? (
                            <ul className="list-unstyled">
                              {row.phoneNumbers.map((p, idx) => (
                                <li key={idx}>{p.title}: {p.number}</li>
                              ))}
                            </ul>
                          ) : <p>-</p>}
                        </>
                      )}
                      {visibleColumns.portalLinks && (
                        <>
                          <p className='small'><strong>Portal Links:</strong></p>
                          {row.portalLinks?.length > 0 ? (
                            <ul className="list-unstyled">
                              {row.portalLinks.map((link, idx) => (
                                <li key={idx} >
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
                          ) : <p>-</p>}
                        </>
                      )}
                    </>
                  )}

                {/* Notes */}
                {(visibleColumns.authorizationNotes || visibleColumns.notes) &&
                  renderSection(
                    'Notes',
                    <>
                      {visibleColumns.authorizationNotes && row.authorizationNotes && (
                        <p><strong>Authorization Notes:</strong> {row.authorizationNotes}</p>
                      )}
                      {visibleColumns.notes && row.notes && (
                        <p><strong>Other Notes:</strong> {row.notes}</p>
                      )}
                    </>
                  )}

                {/* Images */}
                {(visibleColumns.image || visibleColumns.secondaryImage) &&
                  renderSection(
                    'Card Images',
                    <>
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
                    </>
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

export default BlueCardCardView;
