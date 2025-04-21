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
              maxWidth: '500px',
              width: '100%',
            }}
          >
            <div className="mb-3">
              <h6 className="text-muted">ID</h6>
              <p className="text-dark">{book._id}</p>
            </div>

            <div className="mb-3">
              <h6 className="text-muted">Title</h6>
              <p className="text-dark">{book.title}</p>
            </div>

            <div className="mb-3">
              <h6 className="text-muted">Author</h6>
              <p className="text-dark">{book.author}</p>
            </div>

            <div className="mb-3">
              <h6 className="text-muted">Publish Year</h6>
              <span className="badge text-bg-danger-subtle text-dark px-3 py-2 rounded-pill">
                {book.publishYear}
              </span>
            </div>

            <div className="mb-3">
              <h6 className="text-muted">Created At</h6>
              <p className="text-dark">{new Date(book.createdAt).toLocaleString()}</p>
            </div>

            <div>
              <h6 className="text-muted">Last Updated</h6>
              <p className="text-dark">{new Date(book.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowBook;
