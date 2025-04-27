import React, { useEffect, useState } from 'react';
import API from '../axios'; // ✅ use your custom protected API
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';

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
    <div className="container-fluid py-5 bg-parchment min-vh-100">
      <BackButton />
      <h1 className="text-center mb-4" style={{ color: '#6c4c2b' }}>Insurance Plan Details</h1>

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
            {book.secondaryImage && (
              <div className="mb-4 text-center">
                <img
                  src={book.secondaryImage}
                  alt="Secondary"
                  className="img-fluid rounded-4 shadow-sm"
                  style={{ maxHeight: '300px', objectFit: 'cover' }}
                />
              </div>
            )}

            {/* Fields Section */}
            <div className="mb-3">
              <h6 className="text-muted">Financial Class</h6>
              <p className="text-dark">{book.financialClass || 'N/A'}</p>
            </div>

            <div className="mb-3">
              <h6 className="text-muted">Descriptive Name</h6>
              <p className="text-dark">{book.descriptiveName || 'N/A'}</p>
            </div>

            <div className="mb-3">
              <h6 className="text-muted">Payer Name</h6>
              <p className="text-dark">{book.payerName || 'N/A'}</p>
            </div>

            <div className="mb-3">
              <h6 className="text-muted">Payer Code</h6>
              <p className="text-dark">{book.payerCode || 'N/A'}</p>
            </div>

            <div className="mb-3">
              <h6 className="text-muted">Plan Name</h6>
              <p className="text-dark">{book.planName || 'N/A'}</p>
            </div>

            <div className="mb-3">
              <h6 className="text-muted">Plan Code</h6>
              <p className="text-dark">{book.planCode || 'N/A'}</p>
            </div>

            <div className="mb-3">
              <h6 className="text-muted">SAMC Contracted</h6>
              <p className="text-dark">
                {book.samcContracted === 'Must call to confirm'
                  ? 'Must call to confirm'
                  : book.samcContracted
                  ? 'Yes'
                  : 'No'}
              </p>
            </div>

            <div className="mb-3">
              <h6 className="text-muted">SAMF Contracted</h6>
              <p className="text-dark">
                {book.samfContracted === 'Must call to confirm'
                  ? 'Must call to confirm'
                  : book.samfContracted
                  ? 'Yes'
                  : 'No'}
              </p>
            </div>

            <div className="mb-3">
              <h6 className="text-muted">Notes</h6>
              <p className="text-dark">{book.notes || 'No notes available.'}</p>
            </div>

            {/* Meta info */}
            <div className="mb-3">
              <h6 className="text-muted">Created At</h6>
              <p className="text-dark">
                {book.createdAt ? new Date(book.createdAt).toLocaleString() : 'N/A'}
              </p>
            </div>

            <div>
              <h6 className="text-muted">Last Updated</h6>
              <p className="text-dark">
                {book.updatedAt ? new Date(book.updatedAt).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowBook;
