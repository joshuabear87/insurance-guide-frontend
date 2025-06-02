import React, { useState, useContext } from 'react';
import { ensureHttps } from './utils/urlHelpers';
import { getContractColor } from './utils/helpers';
import { FacilityContext } from '../context/FacilityContext';

const InsurancePlanModalContent = ({ book, onClose }) => {
  const [enlargedImage, setEnlargedImage] = useState(null);
  const { facility, facilityTheme } = useContext(FacilityContext);
  const [zoomed, setZoomed] = useState(false)

  const formatAddress = (addr) => {
    if (!addr || typeof addr !== 'object') return '-';
    const { street, street2, city, state, zip } = addr;
    const line1 = [street, street2].filter(Boolean).join(', ');
    const line2 = [city, state, zip].filter(Boolean).join(', ');
    return [line1, line2].filter(Boolean).join(', ') || '-';
  };


  return (
    <div
      className="modal-backdrop d-flex justify-content-center align-items-center"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1050,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        className="rounded-2 shadow-lg bg-white text-dark position-relative"
        style={{ maxWidth: '1200px', width: '100%', overflowY: 'auto', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="btn btn-close position-absolute"
          style={{ top: '15px', right: '15px', zIndex: 1100 }}
          aria-label="Close"
          onClick={onClose}
        ></button>

        {/* Header */}
        <div className="text-white py-3 px-4" style={{ backgroundColor: facilityTheme.primaryColor }}>
          <h2 className="text-center m-0">{book.descriptiveName}</h2>
          <h4 className="text-center fs-6 m-1">{book.financialClass}</h4>
        </div>

        <div className="p-4 bg-blue">
          <div className="row">
            {/* Images */}
            <div className="col-md-6 border-end pe-4">
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="fw-bold text-blue text-center">Insurance Card Examples</h5>
                  <div className="d-flex flex-wrap justify-content-center gap-4">
                    {book.image && (
                      <div className="text-center">
                        <h6 className="mb-1">Front</h6>
                        <img
                          src={book.image}
                          alt="Front"
                          className="img-fluid shadow-md"
                          style={{ maxHeight: '300px', objectFit: 'cover', width: '100%', cursor: 'zoom-in' }}
                          onClick={() => setEnlargedImage(book.image)}
                        />
                      </div>
                    )}
                    {book.secondaryImage && (
                      <div className="text-center">
                        <h6 className="mb-1">Back</h6>
                        <img
                          src={book.secondaryImage}
                          alt="Back"
                          className="img-fluid shadow-md"
                          style={{ maxHeight: '300px', objectFit: 'cover', width: '100%', cursor: 'zoom-in' }}
                          onClick={() => setEnlargedImage(book.secondaryImage)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="col-md-6 ps-4">
              {/* Plan Details */}
              <div className="card shadow-sm mb-3">
                <div className="card-body">
                  <h5 className="fw-bold text-blue text-center mb-3">Plan Details</h5>
                  <div className="row">
                    <div className="col-6">
                      <h6>Payer Name</h6>
                      <p>{book.payerName || '-'}</p>
                    </div>
                    <div className="col-6">
                      <h6>Payer Code</h6>
                      <p>{book.payerCode || '-'}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <h6>Plan Name</h6>
                      <p>{book.planName || '-'}</p>
                    </div>
                    <div className="col-6">
                      <h6>Plan Code</h6>
                      <p>{book.planCode || '-'}</p>
                    </div>
                  </div>

                  {/* Contracted Facilities Section */}
                  <div className="row">
                    <div className="col-6">
                      <h6>Contracting</h6>
                        <ul className="list-unstyled">
                          {book.facilityContracts.map((contract, index) => {
                            const status = contract.contractStatus?.toLowerCase();
                            let textColorClass = 'text-secondary';
                            if (status === 'contracted') textColorClass = 'text-success';
                            else if (status === 'not contracted') textColorClass = 'text-danger';
                            else if (status === 'must call to confirm') textColorClass = 'text-warning';
                            else if (status === 'see notes') textColorClass = 'text-info';
                            return (
                              <li key={index} className="mb-1" style={{ color: getContractColor(contract.contractStatus) }}>
                                <strong>{contract.facilityName}:</strong> {contract.contractStatus || '-'}
                              </li>
                            );
                          })}
                        </ul>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-6">
                      <h6>Payer ID (HB)</h6>
                      <p>{book.payerId || '-'}</p>
                    </div>
                    <div className="col-6">
                      <h6>Payer ID (PB)</h6>
                      <p>{book.ipaPayerId || '-'}</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <h6>Blue Card Prefixes</h6>
                    <p>
                      {book.prefixes?.length > 0
                        ? book.prefixes.map((p, i) => (
                          <span key={i} className="badge bg-secondary me-2">
                            {p?.value}
                          </span>
                        ))
                        : '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Portal Links & Phone Numbers */}
              <div className="card shadow-sm mb-3">
                <div className="card-body">
                  <h5 className="fw-bold text-blue text-center mb-3">Portals & Phone Numbers</h5>
                  <div className="row">
                    <div className="col-6">
                      <h6 className="fw-bold">Web Portal Links</h6>

                        <ul className="list-unstyled mb-0 mt-2">
                          {book.portalLinks?.length > 0 ? (
                            book.portalLinks.map((link, idx) => (
                              <li key={idx}>
                                <a href={ensureHttps(link.url)} target="_blank" rel="noopener noreferrer">
                                  {link.title}
                                </a>
                              </li>
                            ))
                          ) : (
                            <li>-</li>
                          )}
                        </ul>
                    </div>

                    <div className="col-6">
                      <h6 className="fw-bold">Phone Numbers</h6>
                      <p>

                        <ul className="list-unstyled mb-0 mt-2">
                          {book.phoneNumbers?.length > 0 ? (
                            book.phoneNumbers.map((phone, idx) => (
                              <li key={idx}>
                                <p>
                                  <em>{phone.title}:</em> {phone.number}
                                </p>
                              </li>
                            ))
                          ) : (
                            <li>-</li>
                          )}
                        </ul>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="row">
                    <h5 className="fw-bold text-blue text-center mb-3">Addresses</h5>
                    <div className="col-6">
                      <h6>Claims Address (HB):</h6> <p>{formatAddress(book.facilityAddress)}</p>
                    </div>
                    <div className="col-6">
                      <h6>Claims Address (PB):</h6> <p>{formatAddress(book.providerAddress)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="row mt-4 gx-4">
            <div className="col-md-6">
              <div className="card bg-light p-3 shadow-sm h-100">
                <h5 className="fw-bold text-blue text-center mb-2">Eligibility and Coding Notes</h5>
                <p className="mb-0">{book.notes || '-'}</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-light p-3 shadow-sm h-100">
                <h5 className="fw-bold text-blue text-center mb-2">Authorization Notes</h5>
                <p className="mb-0">{book.authorizationNotes || '-'}</p>
              </div>
            </div>
          </div>

          <hr />
          {/* Timestamps */}
          <div className="row text-center">
            <div className="col-md-6">
              <h6 className="text-muted">Created At</h6>
              <p className="text-dark">
                {book.createdAt ? new Date(book.createdAt).toLocaleString() : '-'}
              </p>
            </div>
            <div className="col-md-6">
              <h6 className="text-muted">Last Updated</h6>
              <p className="text-dark">
                {book.updatedAt ? new Date(book.updatedAt).toLocaleString() : '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Image Zoom Modal */}
        {enlargedImage && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999 }}
            onClick={() => {
              setEnlargedImage(null);
              setZoomed(false); // Reset zoom on close
            }}
          >
            <img
              src={enlargedImage}
              alt="Zoomable"
              className="img-fluid"
              style={{
                maxHeight: zoomed ? 'none' : '90vh',
                maxWidth: zoomed ? 'none' : '90vw',
                transform: zoomed ? 'scale(2)' : 'scale(1)',
                transition: 'transform 0.3s ease-in-out',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                cursor: 'zoom-in',
              }}
              onClick={(e) => {
                e.stopPropagation();
                setZoomed(!zoomed); // Toggle zoom
              }}
            />
          </div>
        )}      </div>
    </div>
  );
};

export default InsurancePlanModalContent;
