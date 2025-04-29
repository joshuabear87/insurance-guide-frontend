import React, { useEffect, useState } from 'react';
import API from '../axios';
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import ContractStatusBadge from '../components/ContractStatusBadge';

const ShowBook = () => {
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

  return (
    <div className="container-fluid py-5 bg-grey min-vh-100">
      <BackButton />

      {loading ? (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <Spinner />
        </div>
      ) : (
        <div className="d-flex justify-content-center">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-light w-100" style={{ maxWidth: '1000px' }}>

            <div className="text-center mb-4">
              <h2 className="fw-bold text-primary">{book.descriptiveName}</h2>
              <div className="text-muted small">{book.financialClass}</div>
            </div>

            <hr className="divider" />

            <div className="card border-0 shadow-sm rounded-4 p-4 mb-5 bg-white">
              <div className="row">
                <div className="col-md-6 pe-md-5 border-end">
                  <h4 className="text-center mb-4 text-primary">Payer Coding and Basic Information</h4>

                  <div className="row mb-4">
                    {[
                      ['Payer Name', book.payerName],
                      ['Payer Code', book.payerCode],
                      ['Plan Name', book.planName],
                      ['Plan Code', book.planCode],
                    ].map(([label, value], idx) => (
                      <div className="col-6 mb-3" key={idx}>
                        <p><span className="fw-bold">{label}:</span><br />{value || 'N/A'}</p>
                      </div>
                    ))}

                    <div className="col-6 mb-3">
                      <p className="fw-bold mb-1">SAMC Contracted:</p>
                      <ContractStatusBadge status={book.samcContracted} />
                    </div>
                    <div className="col-6 mb-3">
                      <p className="fw-bold mb-1">SAMF Contracted:</p>
                      <ContractStatusBadge status={book.samfContracted} />
                    </div>
                  </div>
                </div>

                <div className="col-md-6 ps-md-5">
                  <h4 className="text-center mb-4 text-primary">Claims, Contact, and Authorization Information</h4>

                  <div className="row mb-3">
                    {[
                      ['IPA Payer ID', book.ipaPayerId],
                      ['Payer ID', book.payerId],
                      ['Facility Address', book.facilityAddress],
                      ['Provider Address', book.providerAddress],
                    ].map(([label, value], idx) => (
                      <div className="col-6 mb-3" key={idx}>
                        <p><span className="fw-bold">{label}:</span><br />{value || 'N/A'}</p>
                      </div>
                    ))}
                  </div>

                  <div className="row mb-3">
                    <div className="col-6">
                      <h6 className="fw-bold text-primary">Portal / Website Links</h6>
                      <ul className="list-unstyled">
                        {book.portalLinks?.length > 0 ? (
                          book.portalLinks.map((link, idx) => (
                            <li key={idx}>
                              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary">
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
                      <h6 className="fw-bold text-primary">Phone Numbers</h6>
                      <ul className="list-unstyled">
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
              </div>
            </div>

            <div className="row g-3 mb-5">
              {book.notes && (
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm rounded-4 p-3 bg-light h-100">
                    <h6 className="fw-bold text-primary mb-2">Eligibility and Coding Notes</h6>
                    <p className="mb-0">{book.notes}</p>
                  </div>
                </div>
              )}
              {book.authorizationNotes && (
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm rounded-4 p-3 bg-light h-100">
                    <h6 className="fw-bold text-primary mb-2">Authorization Notes</h6>
                    <p className="mb-0">{book.authorizationNotes}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="d-flex justify-content-center gap-3 flex-wrap mb-5">
              {book.image && (
                <img
                  src={book.image}
                  alt="Insurance Card Front"
                  className="img-fluid rounded shadow-sm"
                  style={{ maxHeight: '250px', objectFit: 'cover', width: '45%' }}
                />
              )}
              {book.secondaryImage && (
                <img
                  src={book.secondaryImage}
                  alt="Insurance Card Back"
                  className="img-fluid rounded shadow-sm"
                  style={{ maxHeight: '250px', objectFit: 'cover', width: '45%' }}
                />
              )}
            </div>

            <hr className="my-4" />

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

export default ShowBook;
