import React, { useState } from 'react';
import { ensureHttps } from './utils/urlHelpers';

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
        <div className="text-white py-3 px-4" style={{ backgroundColor: '#005b7f' }}>
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
                      <p>{book.payerName || 'N/A'}</p>
                    </div>
                    <div className="col-6">
                      <h6 >Payer Code</h6>
                      <p>{book.payerCode || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <h6 >Plan Name</h6>
                      <p>{book.planName || 'N/A'}</p>
                    </div>
                    <div className="col-6">
                      <h6 >Plan Code</h6>
                      <p>{book.planCode || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <h6 >SAMC Contracted?</h6>
                      <p>{book.samcContracted || 'N/A'}</p>
                    </div>
                    <div className="col-6">
                      <h6 >SAMF Contracted?</h6>
                      <p>{book.samfContracted || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <h6 >Payer ID (Payer)</h6>
                      <p>{book.payerId || 'N/A'}</p>
                    </div>
                    <div className="col-6">
                      <h6 >Payer ID (IPA)</h6>
                      <p>{book.ipaPayerId || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <h6 >Blue Card Prefixes</h6>
                    <p>
                      {book.prefixes?.length > 0
                        ? book.prefixes.map((p, i) => (
                          <span key={i} className="badge bg-secondary me-2">{p?.value}</span>
                        ))
                        : 'N/A'}
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
    <li>N/A</li>
  )}
</ul>
      </div>

      <div className="col-6">
        <h6 className="fw-bold">Phone Numbers</h6>
        <ul className="list-unstyled mb-0 mt-2">
          {book.phoneNumbers?.length > 0 ? (
            book.phoneNumbers.map((phone, idx) => (
              <li key={idx}>
                <p><em>{phone.title}:</em> {phone.number}</p>
              </li>
            ))
          ) : (
            <li>N/A</li>
          )}
        </ul>
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
                      <h6>Facility Address:</h6> <p>{formatAddress(book.facilityAddress)}</p>                      </div>
                    <div className="col-6">

                      <h6>Professional Address:</h6> <p>{formatAddress(book.providerAddress)}</p>
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
                <p className="mb-0">{book.notes || 'N/A'}</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-light p-3 shadow-sm h-100">
                <h5 className="fw-bold text-blue text-center mb-2">Authorization Notes</h5>
                <p className="mb-0">{book.authorizationNotes || 'N/A'}</p>
              </div>
            </div>
          </div>

          <hr />
          {/* Timestamps */}
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

        {/* Image Zoom Modal */}
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
