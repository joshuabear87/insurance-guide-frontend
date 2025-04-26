import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';

const ShowBook = () => {
  const [book, setBook] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/books/${id}`)
      .then((res) => {
        setBook(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [API_URL, id]);

  return (
    <div className="container-fluid py-5 bg-parchment min-vh-100">
      <BackButton />
      <h1 className="text-center mb-4" style={{ color: '#6c4c2b' }}>Show Book</h1>

      {loading ? (
        <Spinner />
      ) : (
        <div className="d-flex justify-content-center">
          <div
            className="card border-0 shadow-sm rounded-4 p-4"
            style={{
              backgroundColor: '#fefcf6',
              maxWidth: '600px',
              width: '100%',
            }}
          >
            {/* Images Section */}
            {book.image && (
              <div className="mb-4 text-center">
                <img
                  src={book.image}
                  alt="Primary"
                  className="img-fluid rounded-4 shadow-sm mb-3"
                  style={{ maxHeight: '300px', objectFit: 'cover' }}
                />
              </div>
            )}
            {book.image2 && (
              <div className="mb-4 text-center">
                <img
                  src={book.image2}
                  alt="Secondary"
                  className="img-fluid rounded-4 shadow-sm"
                  style={{ maxHeight: '300px', objectFit: 'cover' }}
                />
              </div>
            )}

            {/* Fields Section */}
            <div className="mb-3">
              <h6 className="text-muted">Financial Class</h6>
              <p className="text-dark">{book.financialClass}</p>
            </div>

            <div className="mb-3">
              <h6 className="text-muted">Descriptive Name</h6>
              <p className="text-dark">{book.descriptiveName}</p>
            </div>

            <div className="mb-3">
              <h6 className="text-muted">Payer Name</h6>
              <p className="text-dark">{book.payerName}</p>
            </div>

            <div className="mb-3">
              <h6 className="text-muted">Payer Code</h6>
              <p className="text-dark">{book.payerCode}</p>
            </div>

            <div className="mb-3">
              <h6 className="text-muted">Plan Name</h6>
              <p className="text-dark">{book.planName}</p>
            </div>

            <div className="mb-3">
              <h6 className="text-muted">Plan Code</h6>
              <p className="text-dark">{book.planCode}</p>
            </div>

            <div className="mb-3">
              <h6 className="text-muted">SAMC Contracted</h6>
              <p className="text-dark">{book.samcContracted ? 'Yes' : 'No'}</p>
            </div>

            <div className="mb-3">
              <h6 className="text-muted">SAMF Contracted</h6>
              <p className="text-dark">{book.samfContracted ? 'Yes' : 'No'}</p>
            </div>

            <div className="mb-3">
              <h6 className="text-muted">Notes</h6>
              <p className="text-dark">{book.notes || 'No notes available.'}</p>
            </div>

            {/* Meta info */}
            <div className="mb-3">
              <h6 className="text-muted">Created At</h6>
              <p className="text-dark">{book.createdAt ? new Date(book.createdAt).toLocaleString() : 'N/A'}</p>
            </div>

            <div>
              <h6 className="text-muted">Last Updated</h6>
              <p className="text-dark">{book.updatedAt ? new Date(book.updatedAt).toLocaleString() : 'N/A'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowBook;
