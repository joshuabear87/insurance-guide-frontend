// 🔵 InsurancePlanModalContent.jsx (with click-to-enlarge image modal)
import React, { useState } from 'react';

const InsurancePlanModalContent = ({ book, onClose }) => {
  const [enlargedImage, setEnlargedImage] = useState(null);

  const formatAddress = (addr) => {
    if (!addr || typeof addr !== 'object') return 'None entered...';
    const { street, street2, city, state, zip } = addr;
    const line1 = [street, street2].filter(Boolean).join(', ');
    const line2 = [city, state, zip].filter(Boolean).join(', ');
    return [line1, line2].filter(Boolean).join(', ') || 'None entered...';
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
        className="rounded-2 shadow-lg bg-white text-dark"
        style={{ maxWidth: '1200px', width: '100%', overflowY: 'auto', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-white py-3 px-4" style={{ backgroundColor: '#005b7f' }}>
          <h2 className="text-center m-0">{book.descriptiveName}</h2>
          <h4 className="text-center fs-6 m-1">{book.financialClass}</h4>
        </div>

        <div className="p-4">
          <div className="bg-light shadow-sm p-4">
            <div className="row">
              <div className="col-md-6 border-end pe-4">
                <h6 className="fw-bold text-blue text-center">Insurance Card Examples</h6>
                <div className="d-flex flex-wrap justify-content-center gap-4">
                  {book.image && (
                    <div className="text-center">
                      <p className="mb-1 fw-bold">Front</p>
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
                      <p className="mb-1 fw-bold">Back</p>
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

              <div className="col-md-6 ps-4">
                <h6 className="fw-bold text-blue">Plan Details</h6>
                {[['Payer Name', book.payerName], ['Payer Code', book.payerCode], ['Plan Name', book.planName], ['Plan Code', book.planCode]].map(
                  ([label, value], i) => (
                    <p key={i}>
                      <strong>{label}:</strong> {value || 'N/A'}
                    </p>
                  )
                )}
                <div>
                  <strong>SAMC Contracted?</strong>{' '}
                </div>
                <div className="mt-1">
                  <strong>SAMF Contracted?</strong>{' '}
                </div>
                <hr className="my-3" />

                <h6 className="fw-bold">Web Portal Links</h6>
                <ul className="list-unstyled mb-2">
                  {book.portalLinks?.length > 0 ? (
                    book.portalLinks.map((link, idx) => (
                      <li key={idx}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          {link.title}
                        </a>
                      </li>
                    ))
                  ) : (
                    <li>N/A</li>
                  )}
                </ul>
                <hr className="my-3" />

                <h6 className="fw-bold">Blue Card Prefixes</h6>
                <p>
                  {book.prefixes?.length > 0
                    ? book.prefixes.map((p, i) => (
                        <span key={i} className="badge bg-secondary me-2">
                          {p?.value}
                        </span>
                      ))
                    : 'N/A'}
                </p>
                <hr className="my-3" />

                <h6 className="fw-bold">Phone Numbers</h6>
                <ul className="list-unstyled mb-2">
                  {book.phoneNumbers?.length > 0 ? (
                    book.phoneNumbers.map((phone, idx) => (
                      <li key={idx}>
                        <strong>{phone.title}:</strong> {phone.number}
                      </li>
                    ))
                  ) : (
                    <li>N/A</li>
                  )}
                </ul>

                <div className="row mt-3">
                  <div className="col-6">
                    <h6 className="fw-bold">Payer ID (Payer)</h6>
                    <p>{book.payerId || 'N/A'}</p>
                  </div>
                  <div className="col-6">
                    <h6 className="fw-bold">Payer ID (IPA)</h6>
                    <p>{book.ipaPayerId || 'N/A'}</p>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <h6 className="fw-bold">Facility Address</h6>
                    <p>{formatAddress(book.facilityAddress)}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold">Professional Address</h6>
                    <p>{formatAddress(book.providerAddress)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-4 gx-4">
              <div className="col-md-6">
                <div className="bg-light p-3 shadow-sm h-100">
                  <h6 className="fw-bold text-blue mb-2">Eligibility and Coding Notes</h6>
                  <p className="mb-0">{book.notes || 'N/A'}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="bg-light p-3 shadow-sm h-100">
                  <h6 className="fw-bold text-blue mb-2">Authorization Notes</h6>
                  <p className="mb-0">{book.authorizationNotes || 'N/A'}</p>
                </div>
              </div>
            </div>

            <hr />
            <div className="row text-center">
              <div className="col-md-6">
                <h6 className="text-muted">Created At</h6>
                <p className="text-dark">
                  {book.createdAt ? new Date(book.createdAt).toLocaleString() : 'N/A'}
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="text-muted">Last Updated</h6>
                <p className="text-dark">
                  {book.updatedAt ? new Date(book.updatedAt).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {enlargedImage && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999 }}
            onClick={() => setEnlargedImage(null)}
          >
            <img
              src={enlargedImage}
              alt="Enlarged"
              className="img-fluid"
              style={{
                maxHeight: '90vh',
                maxWidth: '90vw',
                borderRadius: '8px',
                boxShadow: '0 0 20px rgba(0,0,0,0.5)',
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InsurancePlanModalContent;
