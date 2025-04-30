import React, { useEffect, useState } from 'react';
import API from '../axios';
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import ContractStatusBadge from '../components/ContractStatusBadge';

const ViewInsurancePlan = () => {
  const [book, setBook] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/books/${id}`);
        setBook(res.data);
      } catch (err) {
        console.error('Error fetching book:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const formatAddress = (addr) => {
    if (!addr || typeof addr !== 'object') return 'N/A';
    const { street, street2, city, state, zip } = addr;
    return [street, street2, `${city}, ${state} ${zip}`].filter(Boolean).join(', ');
  };

  return (
    <div className="container-fluid py-5 bg-grey min-vh-100">
      <BackButton />

      {loading ? (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <Spinner />
        </div>
      ) : (
        <div className="d-flex justify-content-center">
          <div className="card border-0 shadow-sm p-4 w-100" style={{ maxWidth: '1000px' }}>
            {/* Header */}
            <div className="text-white py-3 px-4 mb-4" style={{ backgroundColor: '#005b7f' }}>
              <h2 className="text-center m-0">{book.descriptiveName}</h2>
              <h4 className="text-center fs-6 m-1">{book.financialClass}</h4>
            </div>

            {/* Section: Plan Details */}
            <h4 className="text-center text-blue mb-3">Plan Details</h4>
            <div className="row mb-4 bg-light shadow-sm p-3 m-2">
              {[
                ['Financial Class', book.financialClass],
                ['Descriptive Name', book.descriptiveName],
                ['Payer Name', book.payerName],
                ['Payer Code', book.payerCode],
                ['Plan Name', book.planName],
                ['Plan Code', book.planCode],
                ['Is SAMC Contracted?', <ContractStatusBadge status={book.samcContracted} />],
                ['Is SAMF Contracted?', <ContractStatusBadge status={book.samfContracted} />],
              ].map(([label, value], i) => (
                <div className="col-md-6 mb-2" key={i}>
                  <strong>{label}:</strong> <div>{value || 'N/A'}</div>
                </div>
              ))}
            </div>

            {/* Section: Portals / Phones / Prefixes */}
            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <div className="bg-light p-3 shadow-sm">
                  <h6 className="fw-bold">Web Portal Links</h6>
                  <ul className="list-unstyled mb-0">
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
                </div>
              </div>
              <div className="col-6">
                <div className="bg-light p-3 shadow-sm">
                  <h6 className="fw-bold text-primary">Blue Card Prefixes</h6>
                  <p className="mb-0">
                    {book.prefixes?.length > 0
                      ? book.prefixes.map((p, i) => (
                          <span key={i} className="badge bg-secondary me-2">
                            {p?.value}
                          </span>
                        ))
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="col-md-6 m-2">
                <div className="bg-light p-3 shadow-sm">
                  <h6 className="fw-bold">Phone Numbers</h6>
                  <ul className="list-unstyled mb-0">
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
                </div>
              </div>
            </div>

            {/* Section: Claims Info */}
            <h4 className="text-center text-blue m-2">Claims Information</h4>
            <div className="row mb-4">
              <div className="col-md-6">
                <strong>Payer ID (IPA):</strong> <div>{book.ipaPayerId || 'N/A'}</div>
              </div>
              <div className="col-md-6">
                <strong>Payer ID (Payer):</strong> <div>{book.payerId || 'N/A'}</div>
              </div>
            </div>
            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <div className="bg-light p-3 shadow-sm">
                  <h6 className="fw-bold text-primary mb-2">Claims Address (Facility)</h6>
                  <p className="mb-0">{formatAddress(book.facilityAddress)}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="bg-light p-3 shadow-sm">
                  <h6 className="fw-bold text-primary mb-2">Claims Address (Professional)</h6>
                  <p className="mb-0">{formatAddress(book.providerAddress)}</p>
                </div>
              </div>
            </div>

            {/* Section: Notes */}
            <h4 className="text-center text-blue mb-3">Important Notes</h4>
            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <div className="bg-light p-3 shadow-sm h-100">
                  <h6 className="fw-bold text-primary mb-2">Eligibility and Coding Notes</h6>
                  <p className="mb-0">{book.notes || 'N/A'}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="bg-light p-3 shadow-sm h-100">
                  <h6 className="fw-bold text-primary mb-2">Authorization Notes</h6>
                  <p className="mb-0">{book.authorizationNotes || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Section: Images */}
            <h4 className="text-center text-blue mb-3">Insurance Card Examples</h4>
            <div className="d-flex justify-content-center gap-5 bg-light p-4 shadow-sm flex-wrap mb-4">
              {book.image && (
                <div className="text-center">
                  <p className="mb-1">Front</p>
                  <img
                    src={book.image}
                    alt="Front"
                    className="img-fluid shadow-sm"
                    style={{ maxHeight: '300px', objectFit: 'cover', width: '300px' }}
                  />
                </div>
              )}
              {book.secondaryImage && (
                <div className="text-center">
                  <p className="mb-1">Back</p>
                  <img
                    src={book.secondaryImage}
                    alt="Back"
                    className="img-fluid shadow-sm"
                    style={{ maxHeight: '300px', objectFit: 'cover', width: '300px' }}
                  />
                </div>
              )}
            </div>

            {/* Meta Info */}
            <hr />
            <div className="row text-center">
              <div className="col-md-6">
                <h6 className="text-muted">Created At</h6>
                <p className="text-dark">{book.createdAt ? new Date(book.createdAt).toLocaleString() : 'N/A'}</p>
              </div>
              <div className="col-md-6">
                <h6 className="text-muted">Last Updated</h6>
                <p className="text-dark">{book.updatedAt ? new Date(book.updatedAt).toLocaleString() : 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewInsurancePlan;
