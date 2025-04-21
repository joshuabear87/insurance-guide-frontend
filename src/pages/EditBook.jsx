import React, { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const EditBooks = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishYear, setPublishYear] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/books/${id}`);
        setTitle(res.data.title);
        setAuthor(res.data.author);
        setPublishYear(res.data.publishYear);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching book:', err);
        enqueueSnackbar('Failed to load book details!', { variant: 'error' });
        setLoading(false);
      }
    };

    fetchBook();
  }, [API_URL, id, enqueueSnackbar]);

  const handleEditBook = async () => {
    const data = { title, author, publishYear };
    setLoading(true);
    try {
      await axios.put(`${API_URL}/books/${id}`, data);
      enqueueSnackbar('Book edited successfully!', { variant: 'success' });
      navigate('/');
    } catch (err) {
      console.error('Error editing book:', err);
      enqueueSnackbar('Error editing book!', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-5 bg-parchment min-vh-100">
      <BackButton />
      <h1 className="text-center mb-4" style={{ color: '#6c4c2b' }}>Edit Book</h1>

      {loading && <Spinner />}

      <div className="d-flex justify-content-center">
        <div
          className="card border-0 shadow-sm rounded-4 p-4"
          style={{ backgroundColor: '#fefcf6', maxWidth: '500px', width: '100%' }}
        >
          <div className="mb-3">
            <label className="form-label text-muted">Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-muted">Author</label>
            <input
              type="text"
              className="form-control"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label text-muted">Publish Year</label>
            <input
              type="number"
              className="form-control"
              value={publishYear}
              onChange={(e) => setPublishYear(e.target.value)}
            />
          </div>

          <button
            className="btn btn-outline-dark w-100"
            style={{ backgroundColor: '#e1bba5', color: '#3f2b1c' }}
            onClick={handleEditBook}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBooks;
