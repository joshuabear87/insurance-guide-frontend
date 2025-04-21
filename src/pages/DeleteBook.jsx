import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const DeleteBook = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleDeleteBook = () => {
    setLoading(true);
    axios
      .delete(`${API_URL}/books/${id}`)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Book deleted successfully!', { variant: 'success' });
        navigate('/');
      })
      .catch((err) => {
        setLoading(false);
        enqueueSnackbar('Error deleting the book.', { variant: 'error' });
        console.log(err);
      });
  };

  return (
    <div
      className="min-vh-100 py-5"
      style={{ backgroundColor: '#EBD8B7' }}
    >
      <div className="container">
        <BackButton />
        <h1 className="text-center mb-4" style={{ color: '#6c4c2b' }}>Delete Book</h1>

        {loading ? (
          <Spinner />
        ) : (
          <div
            className="card border-0 shadow-sm rounded-4 p-5 mx-auto text-center"
            style={{ backgroundColor: '#fefcf6', maxWidth: '600px' }}
          >
            <h4 className="mb-4 text-dark">Are you sure you want to delete this item?</h4>

            <button
              className="btn btn-danger w-100 fw-semibold py-3 rounded-pill"
              onClick={handleDeleteBook}
            >
              Yes, delete it.
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteBook;
