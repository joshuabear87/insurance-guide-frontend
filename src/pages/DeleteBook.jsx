import React, { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import API from '../axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const DeleteBook = () => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/books/${id}`);
        setBook(res.data);
      } catch (err) {
        console.error('Error fetching insurance plan:', err);
        enqueueSnackbar('Failed to load insurance plan.', { variant: 'error' });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id, enqueueSnackbar, navigate]);

  const handleDeleteBook = async () => {
    setLoading(true);
    try {
      await API.delete(`/books/${id}`);
      enqueueSnackbar('Insurance plan deleted successfully!', { variant: 'success' });
      navigate('/');
    } catch (err) {
      console.error('Error deleting insurance plan:', err);
      enqueueSnackbar('Error deleting the insurance plan.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-5 bg-light min-vh-100">
      <div className="container">
        <BackButton />

        {loading ? (
          <Spinner />
        ) : (
          <div
            className="card border-0 shadow-sm rounded-4 p-4 mx-auto text-center bg-white"
            style={{ maxWidth: '600px' }}
          >
            <h4 className="mb-4 text-danger">Are you sure you want to delete this insurance plan?</h4>

            <button
              className="btn btn-delete w-100 fw-semibold py-2 rounded-3 mb-4"
              onClick={handleDeleteBook}
            >
              Yes, delete it
            </button>

            {book && (
              <div className="text-start">
                <p><strong>Descriptive Name:</strong> {book.descriptiveName || 'N/A'}</p>
                <p><strong>Financial Class:</strong> {book.financialClass || 'N/A'}</p>
                <p><strong>Payer Name:</strong> {book.payerName || 'N/A'}</p>
                <p><strong>Plan Name:</strong> {book.planName || 'N/A'}</p>
                <p><strong>Plan Code:</strong> {book.planCode || 'N/A'}</p>
                <p><strong>SAMC Contracted:</strong> {book.samcContracted ? 'Yes' : 'No'}</p>
                <p><strong>SAMF Contracted:</strong> {book.samfContracted ? 'Yes' : 'No'}</p>
                <p><strong>Notes:</strong> {book.notes || 'No notes provided.'}</p>

                {book.image && (
                  <div className="text-center mt-3">
                    <img
                      src={book.image}
                      alt="Insurance Card"
                      className="img-fluid rounded shadow-sm"
                      style={{ maxHeight: '250px', objectFit: 'contain' }}
                    />
                  </div>
                )}

                {book.secondaryImage && (
                  <div className="text-center mt-3">
                    <img
                      src={book.secondaryImage}
                      alt="Insurance Card Back"
                      className="img-fluid rounded shadow-sm"
                      style={{ maxHeight: '250px', objectFit: 'contain' }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteBook;
