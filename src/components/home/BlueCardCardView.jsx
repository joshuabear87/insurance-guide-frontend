import React, { useState } from 'react';
import InsurancePlanModalContent from '../InsurancePlanModalContent';
import { isAdmin } from '../utils/auth';
import EditButton from '../EditButton';
import { formatAddress, formatLabel } from '../../components/utils/helpers';

const BlueCardCardView = ({ rows, visibleColumns, onSelect }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const admin = isAdmin();

  const renderField = (label, value) => (
    visibleColumns[label] && (
      <p>
        <strong>{formatLabel(label)}:</strong> {value || '-'}
      </p>
    )
  );

  return (
    <>
      <div className="container py-4">
        <div className="row g-4">
          {rows.map((row, i) => (
            <div key={i} className="col-12 col-sm-6 col-lg-4">
              <div
                className="card h-100 border-0 shadow-sm p-3 responsive-card"
                onClick={() => onSelect(row.book)}
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                {admin && (
                  <EditButton
                    id={row.book._id}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}

                {renderField('prefix', row.prefix)}
                {renderField('descriptiveName', row.descriptiveName)}
                {renderField('planName', row.planName)}
                {renderField('planCode', row.planCode)}
                {renderField('payerName', row.payerName)}
                {renderField('payerCode', row.payerCode)}
                {renderField('financialClass', row.financialClass)}
                {renderField('samcContracted', row.samcContracted)}
                {renderField('samfContracted', row.samfContracted)}

                {visibleColumns.prefixes && (
                  <p>
                    <strong>{formatLabel('prefixes')}:</strong>{' '}
                    {row.prefixes?.map((p) => p.value).join(', ') || '-'}
                  </p>
                )}

                {visibleColumns.portalLinks && (
                  <div>
                    <strong>{formatLabel('portalLinks')}:</strong>
                    {row.portalLinks?.length ? (
                      <ul className="ms-3">
                        {row.portalLinks.map((link, idx) => (
                          <li key={idx}>
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
                )}

                {visibleColumns.phoneNumbers && (
                  <div>
                    <strong>{formatLabel('phoneNumbers')}:</strong>
                    {row.phoneNumbers?.length ? (
                      <ul className="ms-3">
                        {row.phoneNumbers.map((phone, idx) => (
                          <li key={idx}>{phone.title}: {phone.number}</li>
                        ))}
                      </ul>
                    ) : (
                      <span> - </span>
                    )}
                  </div>
                )}

                {renderField('authorizationNotes', row.authorizationNotes)}
                {renderField('notes', row.notes)}

                {visibleColumns.facilityAddress && (
                  <p>
                    <strong>{formatLabel('facilityAddress')}:</strong>{' '}
                    {formatAddress(row.facilityAddress)}
                  </p>
                )}

                {visibleColumns.providerAddress && (
                  <p>
                    <strong>{formatLabel('providerAddress')}:</strong>{' '}
                    {formatAddress(row.providerAddress)}
                  </p>
                )}

                {renderField('payerId', row.payerId)}
                {renderField('ipaPayerId', row.ipaPayerId)}

                {visibleColumns.image && row.image && (
                  <div className="text-center mb-2">
                    <img src={row.image} alt="Front" style={{ maxWidth: '100%', maxHeight: '150px' }} />
                  </div>
                )}
                {visibleColumns.secondaryImage && row.secondaryImage && (
                  <div className="text-center">
                    <img src={row.secondaryImage} alt="Back" style={{ maxWidth: '100%', maxHeight: '150px' }} />
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
