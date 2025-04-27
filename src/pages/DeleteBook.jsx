import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import API from '../axios'; // ✅ Use your protected API
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const DeleteBook = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

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
    <div className="min-vh-100 py-5" style={{ backgroundColor: '#EBD8B7' }}>
      <div className="container">
        <BackButton />
        <h1 className="text-center mb-4" style={{ color: '#6c4c2b' }}>Delete Insurance Plan</h1>

        {loading ? (
          <Spinner />
        ) : (
          <div
            className="card border-0 shadow-sm rounded-4 p-5 mx-auto text-center"
            style={{ backgroundColor: '#fefcf6', maxWidth: '600px' }}
          >
            <h4 className="mb-4 text-dark">Are you sure you want to delete this insurance plan?</h4>

            <button
              className="btn btn-danger w-100 fw-semibold py-3 rounded-pill"
              onClick={handleDeleteBook}
            >
              Yes, delete it
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteBook;
